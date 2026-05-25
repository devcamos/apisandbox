/**
 * Prisma Client Singleton
 * 
 * MENTOR NOTE: Mono-Environment Framework
 * - Works with PostgreSQL in all environments (local, dev, prod)
 * - Local: Docker PostgreSQL or local installation
 * - Production: Vercel Postgres (connection pooling via POSTGRES_PRISMA_URL)
 * - Same code everywhere - only DATABASE_URL changes!
 * 
 * MENTOR NOTE: Best Practices
 * - Prevents multiple Prisma Client instances in development (hot reload)
 * - Ensures single connection pool in production
 * - Type-safe database access
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function resolveDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    undefined
  )
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolveDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

