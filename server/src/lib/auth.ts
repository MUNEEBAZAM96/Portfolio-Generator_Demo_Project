// ─────────────────────────────────────────────────────────────────────────────
// src/lib/auth.ts — BetterAuth configuration
//
// BetterAuth is the single source of truth for:
//   • User creation (signup)
//   • Session creation/destruction (login/logout)
//   • Cookie management (HttpOnly, Secure, SameSite)
//   • CSRF protection (built-in)
//
// How it works with Express:
//   BetterAuth exposes a `handler` function. We mount it at /api/auth/** via
//   a thin Express route. BetterAuth parses the path suffix to decide what to
//   do — e.g. /api/auth/sign-up/email triggers email/password registration.
//
// Session validation in our routes:
//   We call `auth.api.getSession({ headers })` from any protected route.
//   This reads the session cookie, looks up the session in the DB, and returns
//   the User object — or null if the session is invalid/expired.
//   This is more secure than JWT because session invalidation is instant
//   (delete the row) rather than waiting for a token to expire.
// ─────────────────────────────────────────────────────────────────────────────
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma.js'

export const auth = betterAuth({
  // Point BetterAuth at our Prisma client. The prismaAdapter reads/writes
  // the user, session, account, and verification tables we declared in schema.
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // Email/password provider — the simplest auth flow.
  // BetterAuth handles hashing (argon2 by default), salting, and timing-safe
  // comparison. We never touch raw passwords.
  emailAndPassword: {
    enabled: true,
    // Minimum password length enforced at the library level.
    // Additional validation (complexity) can be added here.
    minPasswordLength: 8,
  },

  // Session configuration
  session: {
    // Sessions expire after 7 days of inactivity.
    // BetterAuth slides the expiry on each request (rolling sessions).
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    updateAge: 60 * 60 * 24,     // Refresh cookie if > 1 day old
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache session lookup for 5 min to reduce DB hits
    },
  },

  // Trust the CLIENT_URL origin for CORS + cookie SameSite policy.
  // In production this would be your actual domain.
  trustedOrigins: [process.env.CLIENT_URL ?? 'http://localhost:5173'],
})

// Export the inferred type so other files can type session objects without
// importing BetterAuth directly — keeps coupling loose.
export type Session = typeof auth.$Infer.Session
export type AuthUser = typeof auth.$Infer.Session.user
