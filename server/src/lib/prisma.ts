// ─────────────────────────────────────────────────────────────────────────────
// src/lib/prisma.ts — Singleton Prisma client
//
// Why singleton? Prisma opens a connection pool to PostgreSQL. In development
// with hot-reload (tsx --watch), Node re-evaluates modules on each reload.
// Without the singleton pattern, every reload would leak a new connection pool
// until Postgres hits its max_connections limit (~100 by default).
//
// The global trick: `global.__prisma` survives module re-evaluation in dev.
// In production there's no hot-reload, so new PrismaClient() is called once.
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '../../generated/prisma/index.js'

const globalForPrisma = global as unknown as { __prisma?: PrismaClient }

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma
}
