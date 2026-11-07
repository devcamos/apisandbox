import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import { AppError } from "@/lib/http/errors"

const registerWithPassword = vi.hoisted(() => vi.fn())
const createUserSession = vi.hoisted(() => vi.fn())
const revokeUserSession = vi.hoisted(() => vi.fn())
const verifyJwtToken = vi.hoisted(() => vi.fn())

vi.mock("@/lib/services/auth/auth-service", () => ({ registerWithPassword }))
vi.mock("@/lib/services/auth/token-service", () => ({ verifyJwtToken }))
vi.mock("@/lib/services/auth/auth-response-mapper", () => ({
  issueAuthTokenForUser: () => ({ token: "session-bound-token", expiresIn: 3600 }),
}))
vi.mock("@/lib/services/auth/user-session-service", () => ({
  createUserSession,
  revokeUserSession,
  findActiveUserSession: vi.fn(),
  getUserSessionContext: () => ({ userAgent: null, ipAddress: null }),
}))
vi.mock("@/lib/http/apply-rate-limit", () => ({
  applyRateLimit: async () => ({ blocked: null, result: {} }),
  attachRateLimitHeaders: (response: Response) => response,
}))
vi.mock("@/lib/rate-limit", () => ({ signupLimiter: {} }))

import { POST as signup } from "@/app/api/auth/signup/route"
import { POST as logout } from "@/app/api/auth/logout/route"
import { authSessionResponse } from "@/lib/http/auth-route-helpers"
import type { AuthUser } from "@/lib/auth/types"

function logoutRequest(token?: string) {
  return new NextRequest("http://localhost/api/auth/logout", {
    method: "POST",
    headers: token ? { authorization: `Bearer ${token}` } : {},
  })
}

describe("session auth compatibility and failure handling", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    createUserSession.mockResolvedValue({ id: "session-1" })
    verifyJwtToken.mockReturnValue({ sub: "user-1", sid: "session-1" })
    revokeUserSession.mockResolvedValue(true)
  })

  it("keeps signup fields at the top level and returns the session-bound cookie and token", async () => {
    const user = { id: "user-1", email: "user@example.com" }
    registerWithPassword.mockResolvedValue({ user, token: "old-token", expiresIn: 60 })
    const response = await signup(new NextRequest("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email: user.email, password: "test-password", name: "Test User" }),
    }))

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({
      user,
      token: "session-bound-token",
      expiresIn: 3600,
      message: "Account created successfully",
    })
    expect(createUserSession).toHaveBeenCalledWith("user-1", { userAgent: null, ipAddress: null })
    expect(response.headers.get("set-cookie")).toContain("auth_token=session-bound-token")
  })

  it("revokes the authenticated session before reporting logout success", async () => {
    const response = await logout(logoutRequest("valid"))
    expect(revokeUserSession).toHaveBeenCalledWith("user-1", "session-1")
    expect(await response.json()).toEqual({ success: true, data: { loggedOut: true } })
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0")
  })

  it("preserves the standard response envelope for other auth consumers", async () => {
    const user: AuthUser = {
      id: "user-1", email: "user@example.com", firstName: null, lastName: null,
      avatarUrl: null, roleLabel: null, identityStatement: null, subscriptionTier: "FREE", isDemo: false,
    }
    const response = await authSessionResponse({ user, token: "original", expiresIn: 60 }, 200, logoutRequest())
    expect(await response.json()).toEqual({
      success: true,
      data: { user, token: "session-bound-token", expiresIn: 3600 },
    })
  })

  it("reports revocation persistence failures and preserves the cookie for retry", async () => {
    revokeUserSession.mockRejectedValue(new AppError("Database unavailable", 503, "configuration_error"))
    const response = await logout(logoutRequest("valid"))
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({ success: false })
    expect(response.headers.get("set-cookie")).toBeNull()
  })

  it("allows idempotent logout when no token is present", async () => {
    const response = await logout(logoutRequest())
    expect(response.status).toBe(200)
    expect(revokeUserSession).not.toHaveBeenCalled()
  })

  it("allows idempotent logout when the token is invalid", async () => {
    verifyJwtToken.mockImplementation(() => { throw new AppError("Invalid token", 401, "auth_failure") })
    const response = await logout(logoutRequest("invalid"))
    expect(response.status).toBe(200)
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0")
    expect(revokeUserSession).not.toHaveBeenCalled()
  })

  it("surfaces token verification configuration failures", async () => {
    verifyJwtToken.mockImplementation(() => { throw new AppError("Missing secret", 503, "configuration_error") })
    const response = await logout(logoutRequest("valid"))
    expect(response.status).toBe(503)
    expect(revokeUserSession).not.toHaveBeenCalled()
  })

  it("allows logout for legacy tokens without a persisted session", async () => {
    verifyJwtToken.mockReturnValue({ sub: "user-1" })
    const response = await logout(logoutRequest("legacy"))
    expect(response.status).toBe(200)
    expect(revokeUserSession).not.toHaveBeenCalled()
  })

  it("allows idempotent logout for malformed token JSON", async () => {
    verifyJwtToken.mockImplementation(() => { throw new SyntaxError("Invalid JSON") })
    const response = await logout(logoutRequest("malformed"))
    expect(response.status).toBe(200)
    expect(revokeUserSession).not.toHaveBeenCalled()
  })
})
