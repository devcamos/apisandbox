import { describe, expect, it, vi } from "vitest"

import {
  decideMigrateDeploy,
  runMigrateIfNeeded,
} from "../../scripts/migrate-on-production.mjs"

describe("decideMigrateDeploy", () => {
  it("runs migrations when VERCEL_ENV is production", () => {
    const decision = decideMigrateDeploy({
      VERCEL: "1",
      VERCEL_ENV: "production",
    })
    expect(decision.run).toBe(true)
    expect(decision.reason).toContain("VERCEL_ENV=production")
  })

  it("skips migrations for Preview", () => {
    const decision = decideMigrateDeploy({
      VERCEL: "1",
      VERCEL_ENV: "preview",
    })
    expect(decision.run).toBe(false)
    expect(decision.reason).toContain("preview")
    expect(decision.reason.toLowerCase()).toContain("skip")
  })

  it("skips migrations for Vercel Development", () => {
    const decision = decideMigrateDeploy({
      VERCEL: "1",
      VERCEL_ENV: "development",
    })
    expect(decision.run).toBe(false)
    expect(decision.reason).toContain("development")
  })

  it("fail-safe migrates on Vercel when VERCEL_ENV is unset", () => {
    const decision = decideMigrateDeploy({ VERCEL: "1" })
    expect(decision.run).toBe(true)
    expect(decision.reason.toLowerCase()).toContain("fail-safe")
  })

  it("fail-safe migrates on Vercel when VERCEL_ENV is unrecognized", () => {
    const decision = decideMigrateDeploy({
      VERCEL: "1",
      VERCEL_ENV: "staging",
    })
    expect(decision.run).toBe(true)
    expect(decision.reason.toLowerCase()).toContain("fail-safe")
  })

  it("skips when not on Vercel and not production", () => {
    const decision = decideMigrateDeploy({ NODE_ENV: "test" })
    expect(decision.run).toBe(false)
    expect(decision.reason).toContain("Not on Vercel")
  })

  it("treats VERCEL_ENV case-insensitively", () => {
    expect(decideMigrateDeploy({ VERCEL: "1", VERCEL_ENV: "Preview" }).run).toBe(
      false,
    )
    expect(
      decideMigrateDeploy({ VERCEL: "1", VERCEL_ENV: "PRODUCTION" }).run,
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
