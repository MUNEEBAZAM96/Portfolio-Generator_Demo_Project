// ─────────────────────────────────────────────────────────────────────────────
// src/middleware/requireAuth.ts — Session-based authentication middleware
//
// This is the gatekeeper for all protected routes (/api/portfolio/**).
//
// How it works:
//   1. BetterAuth sets an HttpOnly cookie on login. The browser sends it
//      automatically on every subsequent request — no JS token handling needed.
//   2. We call auth.api.getSession(), which reads the cookie, looks up the
//      session row in PostgreSQL, and returns the user + session objects.
//   3. If valid → we attach `req.user` and call next().
//   4. If invalid/expired/missing → 401 Unauthorized immediately.
//
// Why HttpOnly cookies over JWT in Authorization header?
//   • HttpOnly cookies are XSS-immune — JS can't read them.
//   • JWT in localStorage is vulnerable to XSS attacks.
//   • Server-side sessions can be invalidated instantly (logout works for real).
//   • BetterAuth handles CSRF protection on mutating requests.
// ─────────────────────────────────────────────────────────────────────────────
import type { Request, Response, NextFunction } from 'express'
import { auth, type AuthUser } from '../lib/auth.js'

// Augment Express's Request type so downstream handlers get full type-safety
// on req.user without casting.
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Convert Express headers to the Web API Headers format BetterAuth expects.
    // BetterAuth is framework-agnostic — it works with any header shape.
    const headers = new Headers()
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value)
    })

    const session = await auth.api.getSession({ headers })

    if (!session?.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource.',
      })
      return
    }

    // Attach user to request for use in route handlers
    req.user = session.user
    next()
  } catch (err) {
    console.error('[requireAuth] Session validation error:', err)
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid session.' })
  }
}
