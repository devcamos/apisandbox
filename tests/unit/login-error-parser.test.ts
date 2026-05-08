import { describe, expect, it } from "vitest"
import { parseLoginErrorMessage } from "@/lib/login-error-parser"

describe("parseLoginErrorMessage", () => {
  it("parses ACCOUNT_LOCKED prefix (with minutes)", () => {
    const info = parseLoginErrorMessage("ACCOUNT_LOCKED:15")
    expect(info.type).toBe("account")
    expect(info.message).toBe("Account temporarily locked")
    expect(info.recoverable).toBe(true)
    expect(info.suggestion).toContain("15 minutes")
  })

  it("parses ACCOUNT_LOCKED prefix (default minutes)", () => {
    const info = parseLoginErrorMessage("ACCOUNT_LOCKED")
    expect(info.suggestion).toContain("30 minutes")
  })

  it("parses PASSWORD_INCORRECT prefix (attempts remaining)", () => {
    const info = parseLoginErrorMessage("PASSWORD_INCORRECT:2")
    expect(info.type).toBe("authentication")
    expect(info.message).toBe("Incorrect password")
    expect(info.suggestion).toContain("2 attempts remaining")
  })

  it("parses PASSWORD_INCORRECT prefix (default attempts remaining)", () => {
    const info = parseLoginErrorMessage("PASSWORD_INCORRECT")
    // With no attempts remaining info, the parser intentionally omits the hint.
    expect(info.suggestion).toContain('use "Forgot password"')
  })

  it("parses CREDENTIALS_INVALID", () => {
    const info = parseLoginErrorMessage("CREDENTIALS_INVALID")
    expect(info.type).toBe("authentication")
    expect(info.message).toBe("Invalid login credentials")
  })

  it("parses deactivated accounts", () => {
    const info = parseLoginErrorMessage("User has been deactivated")
    expect(info.type).toBe("account")
    expect(info.message).toBe("Account deactivated")
    expect(info.recoverable).toBe(false)
  })

  it("parses OAuth/Google hint", () => {
    const info = parseLoginErrorMessage("OAuth account detected")
    expect(info.type).toBe("authentication")
    expect(info.message).toBe("Account created with Google")
  })

  it("parses legacy invalid credentials with attempts remaining", () => {
    const info = parseLoginErrorMessage("Invalid email or password. 2 attempts remaining.")
    expect(info.type).toBe("authentication")
    expect(info.message).toBe("Invalid login credentials")
    expect(info.suggestion).toContain("2 attempts remaining")
  })

  it("parses legacy lockout with minutes", () => {
    const info = parseLoginErrorMessage("Your account is locked for 10 minutes.")
    expect(info.type).toBe("account")
    expect(info.message).toBe("Account temporarily locked")
    expect(info.suggestion).toContain("10 minutes")
  })

  it("parses required field validation", () => {
    const info = parseLoginErrorMessage("Email is required")
    expect(info.type).toBe("validation")
    expect(info.recoverable).toBe(true)
  })

  it("parses network errors", () => {
    const info = parseLoginErrorMessage("network timeout")
    expect(info.type).toBe("network")
    expect(info.message).toContain("Network error")
  })

  it("falls back to unknown", () => {
    const info = parseLoginErrorMessage("")
    expect(info.type).toBe("unknown")
    expect(info.message).toBe("An unexpected error occurred")
    expect(info.recoverable).toBe(true)
  })
})
