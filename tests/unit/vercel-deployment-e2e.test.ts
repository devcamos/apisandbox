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
    const calls: Array<RequestInit | undefined> = []
    const fetchImpl = (async (_input: URL | RequestInfo, init?: RequestInit) => {
      calls.push(init)
      return {
        ok: true,
        status: 200,
        text: async () => '{"ok":true}',
      }
    }) as unknown as typeof fetch

    const headers = vercelAutomationBypassHeaders("secret", { setCookie: false })
    await waitForHealthy("/api/health/db", {
      baseUrl: "https://example.vercel.app",
      headers,
      fetchImpl,
      attempts: 1,
    })

    expect(calls).toHaveLength(1)
    expect(calls[0]?.headers).toEqual({
      "x-vercel-protection-bypass": "secret",
    })
    expect(
      calls[0]?.headers && typeof calls[0].headers === "object"
        ? (calls[0].headers as Record<string, string>)["x-vercel-set-bypass-cookie"]
        : undefined,
    ).toBeUndefined()
  })
})

describe("verifyDeployedDatabaseAndAuth", () => {
  it("uses header-only bypass for both health endpoints", async () => {
    const calls: Array<RequestInit | undefined> = []
    const fetchImpl = (async (_input: URL | RequestInfo, init?: RequestInit) => {
      calls.push(init)
      return {
        ok: true,
        status: 200,
        text: async () => '{"ok":true}',
      }
    }) as unknown as typeof fetch

    await verifyDeployedDatabaseAndAuth({
      rawBaseUrl: "https://example.vercel.app",
      bypassSecret: "secret",
      fetchImpl,
    })

    expect(calls).toHaveLength(2)
    for (const init of calls) {
      expect(init?.headers).toEqual({
        "x-vercel-protection-bypass": "secret",
      })
      expect(
        init?.headers && typeof init.headers === "object"
          ? Object.keys(init.headers as Record<string, string>)
          : [],
      ).not.toContain("x-vercel-set-bypass-cookie")
    }
  })
})
