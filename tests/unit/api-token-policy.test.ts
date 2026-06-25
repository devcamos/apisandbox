import { describe, expect, it } from "vitest"
import {
  API_TOKEN_PREFIX,
  generateApiToken,
  getTokenPrefix,
  hashApiToken,
  hasApiTokenScope,
  isApiTokenExpired,
  parseApiTokenScopes,
  redactApiTokenRecord,
  validateApiTokenInput,
} from "@/lib/api-tokens/token-policy"

describe("api token policy", () => {
  it("generates high entropy product tokens and only stores hashes", () => {
    const token = generateApiToken()
    const hash = hashApiToken(token)

    expect(token.startsWith(`${API_TOKEN_PREFIX}_`)).toBe(true)
    expect(token.length).toBeGreaterThan(40)
    expect(hash).toHaveLength(64)
    expect(hash).not.toContain(token)
    expect(getTokenPrefix(token)).toBe(token.slice(0, 16))
  })

  it("accepts known scopes and rejects unknown scopes", () => {
    expect(parseApiTokenScopes(["profile:read", "profile:read", "unknown"])).toEqual([
      "profile:read",
    ])
    expect(hasApiTokenScope(["profile:read"], "profile:read")).toBe(true)
    expect(hasApiTokenScope(["profile:read"], "progress:write")).toBe(false)
  })

  it("validates token names, scopes, and future expiry", () => {
    expect(validateApiTokenInput({
      name: "  CRM   sync  ",
      scopes: ["profile:read"],
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    })).toMatchObject({
      ok: true,
      value: {
        name: "CRM sync",
        scopes: ["profile:read"],
      },
    })

    expect(validateApiTokenInput({ name: "", scopes: ["profile:read"] })).toMatchObject({
      ok: false,
      reason: "Token name is required",
    })
    expect(validateApiTokenInput({ name: "CRM", scopes: ["admin"] })).toMatchObject({
      ok: false,
      reason: "Select one or more valid token scopes",
    })
    expect(validateApiTokenInput({
      name: "CRM",
      scopes: ["profile:read"],
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
    })).toMatchObject({
      ok: false,
      reason: "Expiry must be a future date",
    })
  })

  it("detects expiry and redacts records for the client", () => {
    const now = new Date("2026-06-23T10:00:00.000Z")
    expect(isApiTokenExpired("2026-06-23T09:59:00.000Z", now)).toBe(true)
    expect(isApiTokenExpired("2026-06-23T10:01:00.000Z", now)).toBe(false)
    expect(isApiTokenExpired(null, now)).toBe(false)

    expect(redactApiTokenRecord({
      id: "token_1",
      name: "CRM",
      tokenPrefix: "apisb_abc",
      scopes: ["profile:read", "admin"],
      expiresAt: null,
      lastUsedAt: now,
      revokedAt: null,
      createdAt: now,
    })).toEqual({
      id: "token_1",
      name: "CRM",
      tokenPrefix: "apisb_abc",
      scopes: ["profile:read"],
      expiresAt: null,
      lastUsedAt: "2026-06-23T10:00:00.000Z",
      revokedAt: null,
      createdAt: "2026-06-23T10:00:00.000Z",
    })
  })
})
