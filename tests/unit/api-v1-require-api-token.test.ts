import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const authenticateApiTokenMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/services/api-token-service", () => ({
  authenticateApiToken: authenticateApiTokenMock,
}))

import { requireApiToken, V1AuthError } from "@/lib/api/v1/require-api-token"

function bearerRequest(token?: string) {
  const headers = new Headers()
  if (token) headers.set("authorization", `Bearer ${token}`)
  return new NextRequest("http://localhost/api/v1/me", { headers })
}

describe("requireApiToken", () => {
  beforeEach(() => {
    authenticateApiTokenMock.mockReset()
  })

  it("rejects a missing bearer token", async () => {
    await expect(requireApiToken(bearerRequest())).rejects.toMatchObject({
      name: "V1AuthError",
      status: 401,
      code: "missing_token",
    })
  })

  it("rejects session JWTs that are not personal API tokens", async () => {
    await expect(requireApiToken(bearerRequest("eyJhbGciOiJIUzI1NiJ9.payload.sig"))).rejects.toMatchObject({
      code: "invalid_token",
      status: 401,
    })
    expect(authenticateApiTokenMock).not.toHaveBeenCalled()
  })

  it("rejects invalid or revoked tokens from the token service", async () => {
    const { AppError } = await import("@/lib/http/errors")
    authenticateApiTokenMock.mockRejectedValue(new AppError("Invalid API token", 401, "auth_failure"))

    await expect(requireApiToken(bearerRequest("apisb_deadbeef"))).rejects.toMatchObject({
      code: "invalid_token",
      status: 401,
    })
  })

  it("rejects a valid token that lacks the required scope", async () => {
    authenticateApiTokenMock.mockResolvedValue({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["profile:read"],
      subscriptionTier: "FREE",
      expiresAt: null,
    })

    await expect(requireApiToken(bearerRequest("apisb_validtoken"), "progress:write")).rejects.toMatchObject({
      code: "insufficient_scope",
      status: 403,
    })
  })

  it("returns the principal when the token and scope are valid", async () => {
    authenticateApiTokenMock.mockResolvedValue({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["profile:read", "progress:read"],
      subscriptionTier: "PREMIUM",
      expiresAt: "2027-01-01T00:00:00.000Z",
    })

    const principal = await requireApiToken(bearerRequest("apisb_validtoken"), "progress:read")
    expect(principal).toEqual({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["profile:read", "progress:read"],
      subscriptionTier: "PREMIUM",
      expiresAt: "2027-01-01T00:00:00.000Z",
    })
  })

  it("exposes V1AuthError fields for handlers", () => {
    const error = new V1AuthError(403, "insufficient_scope", "missing scope")
    expect(error).toBeInstanceOf(Error)
    expect(error.status).toBe(403)
    expect(error.code).toBe("insufficient_scope")
  })
})
