import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import { AppError } from "@/lib/http/errors"
import type { AuthUser } from "@/lib/auth/types"

const { findActiveUserSession, createUserSession, verifyJwtToken, getAuthenticatedUserFromToken } = vi.hoisted(() => ({
  findActiveUserSession: vi.fn(), createUserSession: vi.fn(),
  verifyJwtToken: vi.fn(), getAuthenticatedUserFromToken: vi.fn(),
}))
vi.mock("@/lib/services/auth/auth-service", () => ({ getAuthenticatedUserFromToken }))
vi.mock("@/lib/services/auth/token-service", () => ({ verifyJwtToken }))
vi.mock("@/lib/services/auth/auth-response-mapper", () => ({
  issueAuthTokenForUser: (_user: AuthUser, sid?: string) => ({ token: sid ? `token-${sid}` : "legacy-token", expiresIn: 3600 }),
}))
vi.mock("@/lib/services/auth/user-session-service", () => ({
  findActiveUserSession, createUserSession,
  getUserSessionContext: () => ({ userAgent: null, ipAddress: null }),
}))

import { GET } from "@/app/api/auth/me/route"
import { authSessionResponse } from "@/lib/http/auth-route-helpers"

const user: AuthUser = {
  id: "user-1", email: "user@example.com", firstName: null, lastName: null,
  avatarUrl: null, roleLabel: null, identityStatement: null, subscriptionTier: "FREE", isDemo: false,
}
const request = () => new NextRequest("http://localhost/api/auth/me", { headers: { authorization: "Bearer original" } })

describe("session refresh never replaces a revoked session", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    verifyJwtToken.mockReturnValue({ sub: user.id, sid: "original-session" })
    findActiveUserSession.mockResolvedValue({ id: "original-session" })
    createUserSession.mockResolvedValue({ id: "replacement-session" })
    // Model the initial service validation separately from the response-time lookup.
    getAuthenticatedUserFromToken.mockImplementation(async () => {
      const payload = verifyJwtToken("original")
      if (payload.sid) await findActiveUserSession(user.id, payload.sid)
      return user
    })
  })

  it("rejects revocation between initial authentication and refresh without creating a session or cookie", async () => {
    findActiveUserSession.mockResolvedValueOnce({ id: "original-session" }).mockResolvedValueOnce(null)
    const response = await GET(request())
    expect(response.status).toBe(401)
    expect(await response.json()).toMatchObject({ success: false, error: { category: "auth_failure" } })
    expect(findActiveUserSession).toHaveBeenCalledTimes(2)
    expect(createUserSession).not.toHaveBeenCalled()
    expect(response.headers.get("set-cookie")).toBeNull()
  })

  it("propagates a refresh lookup outage without issuing a replacement session", async () => {
    findActiveUserSession.mockResolvedValueOnce({ id: "original-session" })
      .mockRejectedValueOnce(new AppError("Database unavailable", 503, "configuration_error"))
    const response = await GET(request())
    expect(response.status).toBe(503)
    expect(createUserSession).not.toHaveBeenCalled()
    expect(response.headers.get("set-cookie")).toBeNull()
  })

  it("refreshes the same active session with the standard envelope", async () => {
    const response = await GET(request())
    expect(await response.json()).toEqual({ success: true, data: { user, token: "token-original-session", expiresIn: 3600 } })
    expect(createUserSession).not.toHaveBeenCalled()
    expect(response.headers.get("set-cookie")).toContain("auth_token=token-original-session")
  })

  it("rejects token verification failure during refresh without falling back to a new session", async () => {
    verifyJwtToken.mockReturnValueOnce({ sub: user.id, sid: "original-session" })
      .mockImplementationOnce(() => { throw new AppError("Token expired", 401, "auth_failure") })
    const response = await GET(request())
    expect(response.status).toBe(401)
    expect(createUserSession).not.toHaveBeenCalled()
    expect(response.headers.get("set-cookie")).toBeNull()
  })

  it("upgrades a valid legacy token without a sid", async () => {
    verifyJwtToken.mockReturnValue({ sub: user.id })
    const response = await GET(request())
    expect(response.status).toBe(200)
    expect(createUserSession).toHaveBeenCalledTimes(1)
    expect(await response.json()).toMatchObject({ data: { token: "token-replacement-session" } })
  })

  it("allows credential-authenticated login to create a new session despite a revoked old cookie", async () => {
    findActiveUserSession.mockResolvedValue(null)
    const response = await authSessionResponse({ user, token: "login-token", expiresIn: 60 }, 200, request())
    expect(response.status).toBe(200)
    expect(createUserSession).toHaveBeenCalledTimes(1)
  })
})
