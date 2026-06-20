// ─────────────────────────────────────────────────────────────────────────────
// src/routes/portfolio.ts — Portfolio CRUD + Deploy routes
//
// Routes:
//   GET    /api/portfolio          → Get all portfolios for the logged-in user
//   GET    /api/portfolio/:id      → Get a specific portfolio by ID
//   POST   /api/portfolio          → Create a new portfolio (draft)
//   PUT    /api/portfolio/:id      → Update portfolio fields
//   POST   /api/portfolio/:id/deploy  → Toggle deployed=true (go live)
//   DELETE /api/portfolio/:id      → Delete a portfolio
//
// All routes are protected by requireAuth middleware (mounted in index.ts).
//
// Validation approach:
//   We use Zod for request body validation. Zod schemas serve as both runtime
//   validators AND TypeScript type generators — one source of truth.
//   Invalid input returns 400 with field-level error messages.
//
// pageName rules (enforced here):
//   • Lowercase only (we coerce on write)
//   • Alphanumeric + hyphens only (URL-safe)
//   • 2-50 characters
//   • No leading/trailing hyphens
//   This becomes the public URL: /page/<pageName>
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'

export const portfolioRouter = Router()

// ── Validation schemas ──────────────────────────────────────────────────────

const pageNameSchema = z
  .string()
  .min(2, 'Page name must be at least 2 characters')
  .max(50, 'Page name must be at most 50 characters')
  // Coerce to lowercase and replace spaces with hyphens before validation
  .transform((val) => val.toLowerCase().trim().replace(/\s+/g, '-'))
  .refine(
    (val) => /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(val) || /^[a-z0-9]$/.test(val),
    'Page name may only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen'
  )

const createPortfolioSchema = z.object({
  pageName:   pageNameSchema,
  name:       z.string().min(1, 'Name is required').max(100),
  header:     z.string().min(1, 'Header is required').max(200),
  subheader:  z.string().min(1, 'Subheader is required').max(500),
})

// For updates, all fields are optional — PATCH semantics
const updatePortfolioSchema = createPortfolioSchema.partial()

// ── Helper: assert portfolio belongs to requesting user ──────────────────────
// This prevents Insecure Direct Object Reference (IDOR) attacks where user A
// could modify/delete user B's portfolio by guessing the ID.
async function assertOwnership(portfolioId: string, userId: string) {
  const portfolio = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
  })
  if (!portfolio) return null
  if (portfolio.userId !== userId) return null
  return portfolio
}

// ── GET /api/portfolio ───────────────────────────────────────────────────────
// Returns all portfolios owned by the current user.
// The dashboard uses this to hydrate the form on load.
portfolioRouter.get('/', async (req, res) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
    })
    res.json(portfolios)
  } catch (err) {
    console.error('[GET /portfolio]', err)
    res.status(500).json({ error: 'Failed to fetch portfolios.' })
  }
})

// ── GET /api/portfolio/:id ───────────────────────────────────────────────────
portfolioRouter.get('/:id', async (req, res) => {
  try {
    const portfolio = await assertOwnership(req.params.id, req.user!.id)
    if (!portfolio) {
      res.status(404).json({ error: 'Portfolio not found.' })
      return
    }
    res.json(portfolio)
  } catch (err) {
    console.error('[GET /portfolio/:id]', err)
    res.status(500).json({ error: 'Failed to fetch portfolio.' })
  }
})

// ── POST /api/portfolio ──────────────────────────────────────────────────────
// Creates a new portfolio in draft state (deployed=false).
// The client calls this when the user hits "Save Draft" for the first time.
portfolioRouter.post('/', async (req, res) => {
  const parsed = createPortfolioSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed.', details: parsed.error.flatten() })
    return
  }

  const { pageName, name, header, subheader } = parsed.data

  try {
    // Check if pageName is already taken by any user.
    // We use findUnique for O(1) lookup via the UNIQUE index.
    const existing = await prisma.portfolio.findUnique({ where: { pageName } })
    if (existing) {
      res.status(409).json({ error: `The slug "${pageName}" is already taken. Choose a different page name.` })
      return
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        pageName,
        name,
        header,
        subheader,
        deployed: false, // always starts as draft
        userId: req.user!.id,
      },
    })

    res.status(201).json(portfolio)
  } catch (err) {
    console.error('[POST /portfolio]', err)
    res.status(500).json({ error: 'Failed to create portfolio.' })
  }
})

// ── PUT /api/portfolio/:id ───────────────────────────────────────────────────
// Updates portfolio fields. Supports partial updates (any subset of fields).
// If pageName changes, we re-check uniqueness to prevent collisions.
portfolioRouter.put('/:id', async (req, res) => {
  const parsed = updatePortfolioSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed.', details: parsed.error.flatten() })
    return
  }

  try {
    const existing = await assertOwnership(req.params.id, req.user!.id)
    if (!existing) {
      res.status(404).json({ error: 'Portfolio not found.' })
      return
    }

    // If pageName is changing, verify the new slug isn't taken
    if (parsed.data.pageName && parsed.data.pageName !== existing.pageName) {
      const conflict = await prisma.portfolio.findUnique({
        where: { pageName: parsed.data.pageName },
      })
      if (conflict) {
        res.status(409).json({ error: `The slug "${parsed.data.pageName}" is already taken.` })
        return
      }
    }

    const updated = await prisma.portfolio.update({
      where: { id: req.params.id },
      data: parsed.data,
    })

    res.json(updated)
  } catch (err) {
    console.error('[PUT /portfolio/:id]', err)
    res.status(500).json({ error: 'Failed to update portfolio.' })
  }
})

// ── POST /api/portfolio/:id/deploy ───────────────────────────────────────────
// Sets deployed=true, making the portfolio publicly accessible at
// /page/<pageName>. This is a separate action from "save" because it has
// different UX implications (confirmation prompt, different button, etc.)
//
// Why not just put deployed=true in PUT?
//   Separating "deploy" from "save" mirrors real-world deploy workflows
//   (like Vercel's "Deploy" vs "Save"). It's also easier to add pre-deploy
//   checks (field validation, rate limiting, etc.) to a dedicated endpoint.
portfolioRouter.post('/:id/deploy', async (req, res) => {
  try {
    const existing = await assertOwnership(req.params.id, req.user!.id)
    if (!existing) {
      res.status(404).json({ error: 'Portfolio not found.' })
      return
    }

    // Validate all required fields are filled before going live
    if (!existing.pageName || !existing.name || !existing.header || !existing.subheader) {
      res.status(400).json({
        error: 'Cannot deploy an incomplete portfolio. Please fill in all fields first.',
      })
      return
    }

    const deployed = await prisma.portfolio.update({
      where: { id: req.params.id },
      data: { deployed: true },
    })

    res.json({
      ...deployed,
      publicUrl: `/page/${deployed.pageName}`,
    })
  } catch (err) {
    console.error('[POST /portfolio/:id/deploy]', err)
    res.status(500).json({ error: 'Failed to deploy portfolio.' })
  }
})

// ── DELETE /api/portfolio/:id ────────────────────────────────────────────────
portfolioRouter.delete('/:id', async (req, res) => {
  try {
    const existing = await assertOwnership(req.params.id, req.user!.id)
    if (!existing) {
      res.status(404).json({ error: 'Portfolio not found.' })
      return
    }

    await prisma.portfolio.delete({ where: { id: req.params.id } })
    res.json({ message: 'Portfolio deleted successfully.' })
  } catch (err) {
    console.error('[DELETE /portfolio/:id]', err)
    res.status(500).json({ error: 'Failed to delete portfolio.' })
  }
})
