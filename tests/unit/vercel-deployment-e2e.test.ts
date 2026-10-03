import { describe, expect, it, vi } from "vitest"
import {
  vercelAutomationBypassHeaders,
  waitForHealthy,
  verifyDeployedDatabaseAndAuth,
} from "../../scripts/vercel-deployment-e2e.mjs"

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
  })

  it("includes set-bypass-cookie only when explicitly requested for browser contexts", () => {
    expect(vercelAutomationBypassHeaders("secret-value", { setCookie: true })).toEqual({
      "x-vercel-protection-bypass": "secret-value",
      "x-vercel-set-bypass-cookie": "true",
    })
  })
})

describe("waitForHealthy", () => {
  it("does not send set-bypass-cookie headers through fetch", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => '{"ok":true}',
    }))

    const headers = vercelAutomationBypassHeaders("secret", { setCookie: false })
    await waitForHealthy("/api/health/db", {
      baseUrl: "https://example.vercel.app",
      headers,
      fetchImpl,
      attempts: 1,
    })

    expect(fetchImpl).toHaveBeenCalledOnce()
    const [, init] = fetchImpl.mock.calls[0]
    expect(init.headers).toEqual({
      "x-vercel-protection-bypass": "secret",
    })
    expect(init.headers["x-vercel-set-bypass-cookie"]).toBeUndefined()
  })
})

describe("verifyDeployedDatabaseAndAuth", () => {
  it("uses header-only bypass for both health endpoints", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => '{"ok":true}',
    }))

    await verifyDeployedDatabaseAndAuth({
      rawBaseUrl: "https://example.vercel.app",
      bypassSecret: "secret",
      fetchImpl,
    })

    expect(fetchImpl).toHaveBeenCalledTimes(2)
    for (const [, init] of fetchImpl.mock.calls) {
      expect(init.headers).toEqual({
        "x-vercel-protection-bypass": "secret",
      })
      expect(Object.keys(init.headers)).not.toContain("x-vercel-set-bypass-cookie")
    }
  })
})
