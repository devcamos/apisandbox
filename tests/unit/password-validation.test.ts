import { describe, expect, it } from "vitest"
import {
  getPasswordRequirements,
  validatePasswordStrength,
} from "@/lib/password-validation"

describe("validatePasswordStrength", () => {
  it("accepts passwords with a special character", () => {
    const result = validatePasswordStrength("Test1234!")
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("accepts long password-manager style passwords without symbols", () => {
    const result = validatePasswordStrength("y6QigkgWG3kuT7j")
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("rejects short alphanumeric passwords without symbols", () => {
    const result = validatePasswordStrength("ShortPass1A")
    expect(result.isValid).toBe(false)
    expect(result.errors.some((error) => error.includes("special character"))).toBe(true)
  })

  it("rejects passwords missing mixed case or digits", () => {
    expect(validatePasswordStrength("weakpass1!").isValid).toBe(false)
    expect(validatePasswordStrength("WEAKPASS1!").isValid).toBe(false)
    expect(validatePasswordStrength("WeakPassword!").isValid).toBe(false)
  })
})

describe("getPasswordRequirements", () => {
  it("marks password-manager style passwords as meeting the special rule", () => {
    const requirements = getPasswordRequirements("y6QigkgWG3kuT7j")
    expect(requirements.find((item) => item.id === "special")?.met).toBe(true)
  })
})
