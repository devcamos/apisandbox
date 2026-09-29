import { describe, expect, it } from "vitest"
import {
  normalizePooledDatabaseUrl,
  shouldLimitPrismaConnections,
} from "@/lib/prisma-url"

describe("normalizePooledDatabaseUrl", () => {
  it("adds pgbouncer + connection_limit=1 for pooler hosts", () => {
    const out = normalizePooledDatabaseUrl(
      "postgresql://user:pass@db.pooler.supabase.com:5432/postgres",
      {},
    )
    const url = new URL(out)
    expect(url.searchParams.get("pgbouncer")).toBe("true")
    expect(url.searchParams.get("connection_limit")).toBe("1")
  })

  it("adds connection_limit=1 on Vercel even for non-pooler hosts", () => {
    const out = normalizePooledDatabaseUrl(
      "postgresql://user:pass@db.example.com:5432/postgres",
      { VERCEL: "1" },
    )
    expect(new URL(out).searchParams.get("connection_limit")).toBe("1")
  })

  it("does not force connection_limit for local non-Vercel URLs", () => {
    const out = normalizePooledDatabaseUrl(
      "postgresql://postgres:postgres@127.0.0.1:5435/apisandbox",
      {},
    )
    expect(new URL(out).searchParams.has("connection_limit")).toBe(false)
  })

  it("preserves an explicit connection_limit", () => {
    const out = normalizePooledDatabaseUrl(
      "postgresql://user:pass@db.pooler.supabase.com:5432/postgres?connection_limit=3",
      { VERCEL: "1" },
    )
    expect(new URL(out).searchParams.get("connection_limit")).toBe("3")
  })
})

describe("shouldLimitPrismaConnections", () => {
  it("is true on Vercel or pooler hostnames", () => {
    expect(shouldLimitPrismaConnections("localhost", { VERCEL: "1" })).toBe(true)
    expect(shouldLimitPrismaConnections("aws-0-eu.pooler.supabase.com", {})).toBe(true)
    expect(shouldLimitPrismaConnections("127.0.0.1", {})).toBe(false)
  })
})
