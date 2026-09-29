import { describe, expect, it, vi } from "vitest"

import {
  decideMigrateDeploy,
  ensureDirectUrlEnv,
  runMigrateIfNeeded,
} from "../../scripts/migrate-on-production.mjs"

describe("ensureDirectUrlEnv", () => {
  it("copies DATABASE_URL into DIRECT_URL when DIRECT_URL is unset", () => {
    const env = ensureDirectUrlEnv({
      DATABASE_URL: "postgresql://pooler/db",
    } as Record<string, string | undefined>)
    expect(env.DIRECT_URL).toBe("postgresql://pooler/db")
    expect(env.DATABASE_URL).toBe("postgresql://pooler/db")
  })

  it("does not overwrite an existing DIRECT_URL", () => {
    const env = ensureDirectUrlEnv({
      DATABASE_URL: "postgresql://pooler/db",
      DIRECT_URL: "postgresql://direct/db",
    } as Record<string, string | undefined>)
    expect(env.DIRECT_URL).toBe("postgresql://direct/db")
  })

  it("leaves DIRECT_URL unset when DATABASE_URL is also missing", () => {
    const env = ensureDirectUrlEnv({
      VERCEL_ENV: "production",
    } as Record<string, string | undefined>)
    expect(env.DIRECT_URL).toBeUndefined()
  })
})

describe("decideMigrateDeploy", () => {
  it("runs migrations when VERCEL_ENV is production", () => {
    const decision = decideMigrateDeploy({
      VERCEL: "1",
      VERCEL_ENV: "production",
    } as Record<string, string | undefined>)
    expect(decision.run).toBe(true)
    expect(decision.reason).toContain("VERCEL_ENV=production")
  })

  it("skips migrations for Preview", () => {
    const decision = decideMigrateDeploy({
      VERCEL: "1",
      VERCEL_ENV: "preview",
    } as Record<string, string | undefined>)
    expect(decision.run).toBe(false)
    expect(decision.reason).toContain("preview")
    expect(decision.reason.toLowerCase()).toContain("skip")
  })

  it("skips migrations for Vercel Development", () => {
    const decision = decideMigrateDeploy({
      VERCEL: "1",
      VERCEL_ENV: "development",
    } as Record<string, string | undefined>)
    expect(decision.run).toBe(false)
    expect(decision.reason).toContain("development")
  })

  it("fail-safe migrates on Vercel when VERCEL_ENV is unset", () => {
    const decision = decideMigrateDeploy({
      VERCEL: "1",
    } as Record<string, string | undefined>)
    expect(decision.run).toBe(true)
    expect(decision.reason.toLowerCase()).toContain("fail-safe")
  })

  it("fail-safe migrates on Vercel when VERCEL_ENV is unrecognized", () => {
    const decision = decideMigrateDeploy({
      VERCEL: "1",
      VERCEL_ENV: "staging",
    } as Record<string, string | undefined>)
    expect(decision.run).toBe(true)
    expect(decision.reason.toLowerCase()).toContain("fail-safe")
  })

  it("skips when not on Vercel and not production", () => {
    const decision = decideMigrateDeploy({
      NODE_ENV: "test",
    } as Record<string, string | undefined>)
    expect(decision.run).toBe(false)
    expect(decision.reason).toContain("Not on Vercel")
  })

  it("treats VERCEL_ENV case-insensitively", () => {
    expect(
      decideMigrateDeploy({
        VERCEL: "1",
        VERCEL_ENV: "Preview",
      } as Record<string, string | undefined>).run,
    ).toBe(false)
    expect(
      decideMigrateDeploy({
        VERCEL: "1",
        VERCEL_ENV: "PRODUCTION",
      } as Record<string, string | undefined>).run,
    ).toBe(true)
  })
})

describe("runMigrateIfNeeded", () => {
  it("logs and invokes migrate when decision.run is true", () => {
    const log = vi.fn()
    const migrate = vi.fn(() => 0)
    const code = runMigrateIfNeeded(
      { run: true, reason: "VERCEL_ENV=production — running prisma migrate deploy" },
      { log, migrate },
    )
    expect(code).toBe(0)
    expect(migrate).toHaveBeenCalledOnce()
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("Running migrations"),
    )
  })

  it("logs skip and does not invoke migrate when decision.run is false", () => {
    const log = vi.fn()
    const migrate = vi.fn(() => 0)
    const code = runMigrateIfNeeded(
      {
        run: false,
        reason: "VERCEL_ENV=preview — skipping prisma migrate deploy",
      },
      { log, migrate },
    )
    expect(code).toBe(0)
    expect(migrate).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("Skipping migrations"),
    )
  })

  it("propagates a non-zero migrate exit code", () => {
    const code = runMigrateIfNeeded(
      { run: true, reason: "production" },
      { log: () => {}, migrate: () => 42 },
    )
    expect(code).toBe(42)
  })
})
