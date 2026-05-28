import { describe, expect, it } from "vitest"
import { validateEmailFormat } from "@/lib/validation/email"

describe("validateEmailFormat", () => {
  it("requires a value", () => {
    expect(validateEmailFormat("")).toBe("Email is required")
  })

  it("rejects invalid format", () => {
    expect(validateEmailFormat("not-an-email")).toBe("Please enter a valid email address")
    expect(validateEmailFormat("a@b")).toBe("Please enter a valid email address")
    expect(validateEmailFormat("@example.com")).toBe("Please enter a valid email address")
  })

  it("accepts valid email", () => {
    expect(validateEmailFormat("user@example.com")).toBe("")
  })
})
