import { describe, expect, it } from "vitest"
import { composeDisplayName, splitFullName } from "@/lib/user-name"

describe("splitFullName", () => {
  it("returns null parts for null/empty input", () => {
    expect(splitFullName(null)).toEqual({ firstName: null, lastName: null })
    expect(splitFullName("")).toEqual({ firstName: null, lastName: null })
    expect(splitFullName("   ")).toEqual({ firstName: null, lastName: null })
  })

  it("splits a single name", () => {
    expect(splitFullName("Ada")).toEqual({ firstName: "Ada", lastName: null })
  })

  it("splits multi-part names (first + rest)", () => {
    expect(splitFullName("Ada Lovelace")).toEqual({ firstName: "Ada", lastName: "Lovelace" })
    expect(splitFullName("  Alan   Mathison   Turing ")).toEqual({
      firstName: "Alan",
      lastName: "Mathison Turing",
    })
  })
})

describe("composeDisplayName", () => {
  it("returns null when there is no content", () => {
    expect(composeDisplayName(null, null)).toBeNull()
    expect(composeDisplayName(undefined, undefined)).toBeNull()
    expect(composeDisplayName("", "")).toBeNull()
  })

  it("builds a display name from available parts", () => {
    expect(composeDisplayName("Ada", null)).toBe("Ada")
    expect(composeDisplayName(null, "Lovelace")).toBe("Lovelace")
    expect(composeDisplayName("Ada", "Lovelace")).toBe("Ada Lovelace")
  })
})

