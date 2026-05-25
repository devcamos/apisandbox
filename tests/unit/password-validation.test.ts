import { describe, expect, it } from "vitest"
import {
  getPasswordRequirements,
  meetsSpecialCharacterRequirement,
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
    expect(result.errors).toContain(
      "Password must contain a special character, or be at least 12 characters with uppercase, lowercase, and a number",
    )
  })

  it("returns specific errors for each unmet requirement", () => {
    expect(validatePasswordStrength("short").errors).toEqual([
      "Password must be at least 8 characters",
      "Password must contain at least one uppercase letter",
      "Password must contain at least one number",
      "Password must contain a special character, or be at least 12 characters with uppercase, lowercase, and a number",
    ])

    expect(validatePasswordStrength("weakpass1!").errors).toContain(
      "Password must contain at least one uppercase letter",
    )
    expect(validatePasswordStrength("WEAKPASS1!").errors).toContain(
      "Password must contain at least one lowercase letter",
    )
    expect(validatePasswordStrength("WeakPassword!").errors).toContain(
      "Password must contain at least one number",
    )
  })
})

describe("getPasswordRequirements", () => {
  it("marks password-manager style passwords as meeting the special rule", () => {
    const requirements = getPasswordRequirements("y6QigkgWG3kuT7j")
    expect(requirements.find((item) => item.id === "special")?.met).toBe(true)
  })

  it("marks passwords with symbols as meeting the special rule", () => {
    expect(meetsSpecialCharacterRequirement("Test1234!")).toBe(true)
    expect(getPasswordRequirements("Test1234!").find((item) => item.id === "special")?.met).toBe(
      true,
    )
  })

  it("reports each checklist item independently", () => {
    const requirements = getPasswordRequirements("Test1234!")
    expect(requirements.map((item) => [item.id, item.met])).toEqual([
      ["length", true],
      ["upper", true],
      ["lower", true],
      ["digit", true],
      ["special", true],
    ])
  })
})
