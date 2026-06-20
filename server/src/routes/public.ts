// ─────────────────────────────────────────────────────────────────────────────
// src/routes/public.ts — Unauthenticated public page endpoint
//
// GET /api/public/page/:pageName
//   → Returns portfolio data if deployed=true, 404 if not deployed or missing.
//
// This is the ONLY endpoint that doesn't require authentication.
// It powers the /page/<pageName> route on the frontend.
//
// Security consideration:
//   We explicitly filter WHERE deployed = true. Even if someone guesses a
//   draft pageName, they get a 404 — the portfolio content isn't exposed.
//   This prevents enumeration of unpublished portfolios.
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

export const publicRouter = Router()

// ── GET /api/public/page/:pageName ───────────────────────────────────────────
publicRouter.get('/page/:pageName', async (req, res) => {
  const { pageName } = req.params

  try {
    // We query by both pageName AND deployed=true in one shot.
    // PostgreSQL uses the UNIQUE index on pageName for O(log n) lookup,
    // then checks the deployed column — very fast even with millions of rows.
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        pageName: pageName.toLowerCase(),
        deployed: true,
      },
      // Only return the fields the public page needs. Never return userId,
      // internal IDs, or audit timestamps to untrusted callers.
      select: {
        pageName:   true,
        name:       true,
        header:     true,
        subheader:  true,
      },
    })

    if (!portfolio) {
      // Return 404 for both "doesn't exist" and "not deployed" cases.
      // Same response prevents leaking which slugs exist as drafts.
      res.status(404).json({
        error: 'Not found',
        message: `No published portfolio found at /page/${pageName}`,
      })
      return
    }

    res.json(portfolio)
  } catch (err) {
    console.error('[GET /public/page/:pageName]', err)
    res.status(500).json({ error: 'Failed to load portfolio.' })
  }
})
