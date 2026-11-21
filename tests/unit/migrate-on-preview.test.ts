import { describe, expect, it, vi } from "vitest"

import {
  decidePreviewMigrateDeploy,
  evaluatePreviewHostname,
  hostnameFromDatabaseUrl,
  hostMatchesSuffix,
  parseHostList,
  previewHostPolicy,
  runPreviewMigrateIfAllowed,
} from "../../scripts/migrate-on-preview.mjs"

describe("parseHostList", () => {
  it("splits and lowercases comma-separated hosts", () => {
    expect(parseHostList(" Supabase.co, EXAMPLE.com ")).toEqual([
      "supabase.co",
      "example.com",
    ])
  })

  it("returns empty for blank input", () => {
    expect(parseHostList(undefined)).toEqual([])
    expect(parseHostList("  ")).toEqual([])
  })
})

describe("hostnameFromDatabaseUrl", () => {
  it("parses postgres URLs without logging credentials", () => {
    expect(
      hostnameFromDatabaseUrl(
        "postgresql://user:secret@db.abc.supabase.co:5432/postgres",
      ),
    ).toBe("db.abc.supabase.co")
  })

  it("returns null for invalid input", () => {
    expect(hostnameFromDatabaseUrl(undefined)).toBeNull()
    expect(hostnameFromDatabaseUrl("not-a-url")).toBeNull()
  })
})

describe("hostMatchesSuffix", () => {
  it("matches exact and subdomain suffixes", () => {
    expect(hostMatchesSuffix("db.abc.supabase.co", ["supabase.co"])).toBe(true)
    expect(hostMatchesSuffix("supabase.co", ["supabase.co"])).toBe(true)
    expect(hostMatchesSuffix("db.neon.tech", ["supabase.co"])).toBe(false)
    expect(hostMatchesSuffix("notsupabase.co", ["supabase.co"])).toBe(false)
  })
})

describe("previewHostPolicy", () => {
  it("defaults allow Supabase and deny Neon", () => {
    const policy = previewHostPolicy({})
    expect(policy.allow).toEqual(["supabase.co", "supabase.com"])
    expect(policy.deny).toEqual(["neon.tech"])
    expect(policy.allowLocal).toBe(false)
  })

  it("honors overrides", () => {
    const policy = previewHostPolicy({
      PREVIEW_DB_HOST_ALLOWLIST: "example.test",
      PREVIEW_DB_HOST_DENYLIST: "bad.test",
      ALLOW_LOCAL_PREVIEW_MIGRATE: "1",
    })
    expect(policy.allow).toEqual(["example.test"])
    expect(policy.deny).toEqual(["bad.test"])
    expect(policy.allowLocal).toBe(true)
  })
})

describe("evaluatePreviewHostname", () => {
  const policy = previewHostPolicy({})

  it("allows Supabase hosts", () => {
    expect(evaluatePreviewHostname("aws-0-eu.pooler.supabase.com", policy).ok).toBe(
      true,
    )
  })

  it("denies Neon hosts", () => {
    const result = evaluatePreviewHostname("ep-foo.us-east-1.aws.neon.tech", policy)
    expect(result.ok).toBe(false)
    expect(result.reason.toLowerCase()).toContain("deny")
  })

  it("denies localhost unless explicitly allowed", () => {
    expect(evaluatePreviewHostname("localhost", policy).ok).toBe(false)
    expect(
      evaluatePreviewHostname("127.0.0.1", {
        ...policy,
        allowLocal: true,
      }).ok,
    ).toBe(true)
  })
})

describe("decidePreviewMigrateDeploy", () => {
  const previewUrl = "postgresql://u:p@db.preview.supabase.co:5432/postgres"

  it("refuses without CONFIRM_PREVIEW_MIGRATE=YES", () => {
    const decision = decidePreviewMigrateDeploy({
      DATABASE_URL: previewUrl,
      CONFIRM_PREVIEW_MIGRATE: "yes",
    })
    expect(decision.run).toBe(false)
    expect(decision.reason).toContain("CONFIRM_PREVIEW_MIGRATE")
  })

  it("refuses production environment markers", () => {
    expect(
      decidePreviewMigrateDeploy({
        CONFIRM_PREVIEW_MIGRATE: "YES",
        DATABASE_URL: previewUrl,
        VERCEL_ENV: "production",
      }).run,
    ).toBe(false)
    expect(
      decidePreviewMigrateDeploy({
        CONFIRM_PREVIEW_MIGRATE: "YES",
        DATABASE_URL: previewUrl,
        ENVIRONMENT: "production",
      }).run,
    ).toBe(false)
  })

  it("refuses Neon / Production-like hosts even with confirm", () => {
    const decision = decidePreviewMigrateDeploy({
      CONFIRM_PREVIEW_MIGRATE: "YES",
      DATABASE_URL: "postgresql://u:p@ep-x.us-east-1.aws.neon.tech/neondb",
    })
    expect(decision.run).toBe(false)
    expect(decision.reason.toLowerCase()).toContain("deny")
  })

  it("approves Supabase Preview hosts with confirm", () => {
    const decision = decidePreviewMigrateDeploy({
      CONFIRM_PREVIEW_MIGRATE: "YES",
      DATABASE_URL: previewUrl,
      DIRECT_URL: "postgresql://u:p@db.preview.supabase.co:5432/postgres",
      VERCEL_ENV: "preview",
    })
    expect(decision.run).toBe(true)
    expect(decision.hostnames).toContain("db.preview.supabase.co")
  })

  it("refuses when DIRECT_URL host is denied", () => {
    const decision = decidePreviewMigrateDeploy({
      CONFIRM_PREVIEW_MIGRATE: "YES",
      DATABASE_URL: previewUrl,
      DIRECT_URL: "postgresql://u:p@ep-x.us-east-1.aws.neon.tech/neondb",
    })
    expect(decision.run).toBe(false)
    expect(decision.reason).toContain("DIRECT_URL")
  })
})

describe("runPreviewMigrateIfAllowed", () => {
  it("does not migrate when refused", () => {
    const migrate = vi.fn(() => 0)
    const log = vi.fn()
    const code = runPreviewMigrateIfAllowed(
      { run: false, reason: "nope", hostnames: [] },
      { migrate, log },
    )
    expect(code).toBe(1)
    expect(migrate).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith(expect.stringContaining("Refusing"))
  })

  it("migrates when approved and propagates exit code", () => {
    const migrate = vi.fn(() => 7)
    const log = vi.fn()
    const code = runPreviewMigrateIfAllowed(
      {
        run: true,
        reason: "ok",
        hostnames: ["db.preview.supabase.co"],
      },
      { migrate, log },
    )
    expect(code).toBe(7)
    expect(migrate).toHaveBeenCalledOnce()
    expect(log).toHaveBeenCalledWith(expect.stringContaining("Running prisma migrate deploy"))
  })
})
