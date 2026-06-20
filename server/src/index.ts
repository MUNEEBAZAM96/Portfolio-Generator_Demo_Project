// ─────────────────────────────────────────────────────────────────────────────
// src/index.ts — Express application entry point
//
// Architecture overview:
//
//   Browser → CORS → Express → Routes
//                                ├── /api/auth/**      (BetterAuth handler)
//                                ├── /api/public/**    (unauthenticated)
//                                ├── /api/portfolio/** (requireAuth → CRUD)
//                                └── /api/ai/**        (requireAuth → LLM)
//
// Middleware order matters:
//   1. CORS  — must be first so preflight OPTIONS requests are handled
//   2. JSON body parser — before any routes that read req.body
//   3. Routes — after body parsing
//   4. Error handler — must be LAST (4-arg Express middleware)
//
// Port: defaults to 4000 so it doesn't conflict with Vite's 5173.
// ─────────────────────────────────────────────────────────────────────────────
import 'dotenv/config'
import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.js'
import { requireAuth } from './middleware/requireAuth.js'
import { portfolioRouter } from './routes/portfolio.js'
import { publicRouter } from './routes/public.js'
import { aiRouter } from './routes/ai.js'

const app = express()
const PORT = process.env.PORT ?? 4000

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow requests from the React dev server (Vite) and any production domain.
// credentials: true is required for cookies to be sent cross-origin.
// Without this, the BetterAuth session cookie won't be included in requests.
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,    // ← critical for cookie-based auth
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })) // Reject bodies > 10kb to prevent DoS
app.use(express.urlencoded({ extended: true }))

// ── Health check ──────────────────────────────────────────────────────────────
// Used by Docker health checks, load balancers, and uptime monitors.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── BetterAuth handler ────────────────────────────────────────────────────────
// BetterAuth exposes a single handler that intercepts all /api/auth/** routes.
// toNodeHandler() adapts BetterAuth's web-standard handler to Express's
// (req, res) interface. BetterAuth handles:
//   POST /api/auth/sign-up/email    → register
//   POST /api/auth/sign-in/email    → login (creates session cookie)
//   POST /api/auth/sign-out         → logout (destroys session)
//   GET  /api/auth/get-session      → returns current session
app.all('/api/auth/*splat', toNodeHandler(auth))

// ── Public routes (no auth required) ──────────────────────────────────────────
// The /page/:pageName route — only shows deployed portfolios.
app.use('/api/public', publicRouter)

// ── Protected routes (auth required) ──────────────────────────────────────────
// requireAuth middleware validates the session cookie before any of these
// handlers run. If the session is invalid, it short-circuits with 401.
app.use('/api/portfolio', requireAuth, portfolioRouter)
app.use('/api/ai',        requireAuth, aiRouter)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found', message: 'This endpoint does not exist.' })
})

// ── Global error handler ──────────────────────────────────────────────────────
// Express identifies error handlers by their 4-argument signature.
// This catches any unhandled errors thrown inside async route handlers.
// In production, you'd log to a service like Sentry here.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled error]', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong.',
  })
})

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ┌────────────────────────────────────────────┐
  │  🚀 Server running on http://localhost:${PORT}  │
  │                                            │
  │  Routes:                                   │
  │    Auth:      /api/auth/**                 │
  │    Public:    /api/public/page/:pageName   │
  │    Portfolio: /api/portfolio               │
  │    AI:        /api/ai/generate             │
  │    Health:    /health                      │
  └────────────────────────────────────────────┘
  `)
})

export default app
