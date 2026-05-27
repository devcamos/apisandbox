/**
 * Prisma Client Singleton
 *
 * MENTOR NOTE: Mono-Environment Framework
 * - Works with PostgreSQL in all environments (local, dev, prod)
 * - Local: Docker PostgreSQL or local installation
 * - Production: Vercel Postgres / Neon (pooled via POSTGRES_PRISMA_URL)
 * - Same code everywhere — only DATABASE_URL changes!
 *
 * MENTOR NOTE: Vercel + Neon
 * - Use engineType "binary" in schema (not "client" / driver-adapter mode)
 * - Normalize pooled URLs with ?pgbouncer=true for Prisma on PgBouncer
 * - Do not pass datasources override — it can mismatch the generated engine
 */

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function normalizePooledDatabaseUrl(url: string) {
  try {
    const parsed = new URL(url)
    const isPooler = parsed.hostname.includes("pooler")

    if (isPooler) {
      if (!parsed.searchParams.has("pgbouncer")) {
        parsed.searchParams.set("pgbouncer", "true")
      }
      if (!parsed.searchParams.has("connection_limit")) {
        parsed.searchParams.set("connection_limit", "1")
      }
    }

    return parsed.toString()
  } catch {
    return url
  }
}

function resolveDatabaseUrl() {
  const raw =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL

  if (!raw) return undefined

  // Prisma Accelerate / Data Proxy URLs are not used by this app.
  if (raw.startsWith("prisma://") || raw.startsWith("prisma+postgres://")) {
    return undefined
  }

  return normalizePooledDatabaseUrl(raw)
}

function createPrismaClient() {
  const databaseUrl = resolveDatabaseUrl()
  if (databaseUrl) {
    process.env.DATABASE_URL = databaseUrl
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
