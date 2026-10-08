import { describe, expect, it } from "vitest"
import { vercelAutomationBypassHeaders } from "../../scripts/vercel-deployment-e2e.mjs"

describe("vercelAutomationBypassHeaders", () => {
  it("returns undefined when the secret is missing", () => {
    expect(vercelAutomationBypassHeaders(undefined)).toBeUndefined()
    expect(vercelAutomationBypassHeaders("")).toBeUndefined()
    expect(vercelAutomationBypassHeaders("   ")).toBeUndefined()
  })

  it("omits set-bypass-cookie for Node fetch health checks by default", () => {
    expect(vercelAutomationBypassHeaders("secret-value")).toEqual({
      "x-vercel-protection-bypass": "secret-value",
    })
    expect(vercelAutomationBypassHeaders("secret-value", { setCookie: false })).toEqual({
      "x-vercel-protection-bypass": "secret-value",
    })
  })

  it("includes set-bypass-cookie only when explicitly requested for browser contexts", () => {
    expect(vercelAutomationBypassHeaders("secret-value", { setCookie: true })).toEqual({
      "x-vercel-protection-bypass": "secret-value",
      "x-vercel-set-bypass-cookie": "true",
    })
  })
})
