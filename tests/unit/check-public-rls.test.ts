import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { afterEach, describe, expect, it, vi } from "vitest"

import {
  HARDENING_MIGRATION_SQL,
  checkHardeningMigrationStatic,
  findHardeningMigrationGaps,
  listPublicTablesWithoutRls,
  main,
  resolveCheckMode,
  resolveHardeningMigrationPath,
} from "../../scripts/check-public-rls.mjs"

const REAL_SQL = fs.readFileSync(resolveHardeningMigrationPath(), "utf8")

describe("findHardeningMigrationGaps", () => {
  it("accepts the committed hardening migration", () => {
    expect(findHardeningMigrationGaps(REAL_SQL)).toEqual([])
  })

  it("reports each missing hardening requirement", () => {
    const gaps = findHardeningMigrationGaps("-- empty")
    expect(gaps.length).toBeGreaterThanOrEqual(6)
    expect(gaps.some((gap) => gap.includes("ENABLE ROW LEVEL SECURITY"))).toBe(
      true
    )
    expect(gaps.some((gap) => gap.includes("REVOKE from anon"))).toBe(true)
  })
})

describe("checkHardeningMigrationStatic", () => {
  const tempDirs: string[] = []

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  it("passes against the repo migration", () => {
    const result = checkHardeningMigrationStatic()
    expect(result.ok).toBe(true)
    expect(result.path).toContain(HARDENING_MIGRATION_SQL)
  })

  it("fails when the migration file is missing", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "rls-check-"))
    tempDirs.push(root)
    const result = checkHardeningMigrationStatic(root)
    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/Missing hardening migration/)
  })
})

describe("resolveCheckMode", () => {
  it("defaults to static", () => {
    expect(resolveCheckMode([])).toBe("static")
  })

  it("selects database via flag or env", () => {
    expect(resolveCheckMode(["--database"])).toBe("database")
    expect(resolveCheckMode([], { CHECK_PUBLIC_RLS_DATABASE: "1" })).toBe(
      "database"
    )
  })
})

describe("listPublicTablesWithoutRls", () => {
  it("maps query rows to table names", async () => {
    const client = {
      query: vi.fn().mockResolvedValue({
        rows: [{ tablename: "User" }, { tablename: "Account" }],
      }),
    }
    await expect(listPublicTablesWithoutRls(client as never)).resolves.toEqual([
      "User",
      "Account",
    ])
  })
})

describe("main", () => {
  it("exits 0 for static mode when migration is complete", async () => {
    const logs: string[] = []
    const code = await main([], {}, { log: (msg) => logs.push(msg) })
    expect(code).toBe(0)
    expect(logs.join("\n")).toContain("Static OK")
  })

  it("exits 1 in database mode without a connection string", async () => {
    const errors: string[] = []
    const code = await main(["--database"], {}, { err: (msg) => errors.push(msg) })
    expect(code).toBe(1)
    expect(errors.join("\n")).toMatch(/DATABASE_URL or DIRECT_URL/)
  })

  it("exits 1 when database check reports unprotected tables", async () => {
    const errors: string[] = []
    const code = await main(
      ["--database"],
      { DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/db" },
      {
        err: (msg) => errors.push(msg),
        checkDb: async () => ({
          ok: false,
          unprotected: ["User"],
        }),
      }
    )
    expect(code).toBe(1)
    expect(errors.join("\n")).toContain("User")
  })

  it("exits 0 when database check passes", async () => {
    const logs: string[] = []
    const code = await main(
      ["--database"],
      { DIRECT_URL: "postgresql://postgres:postgres@127.0.0.1:5432/db" },
      {
        log: (msg) => logs.push(msg),
        checkDb: async () => ({ ok: true, unprotected: [] }),
      }
    )
    expect(code).toBe(0)
    expect(logs.join("\n")).toContain("Database OK")
  })
})
