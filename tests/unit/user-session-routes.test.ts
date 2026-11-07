import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const requireAuthenticatedSession = vi.hoisted(() => vi.fn())
const listUserSessions = vi.hoisted(() => vi.fn())
const revokeAllUserSessions = vi.hoisted(() => vi.fn())
const revokeUserSession = vi.hoisted(() => vi.fn())

vi.mock("@/lib/auth/jwt-auth-middleware", () => ({ requireAuthenticatedSession }))
vi.mock("@/lib/services/auth/user-session-service", () => ({
  listUserSessions,
  revokeAllUserSessions,
  revokeUserSession,
  createUserSession: vi.fn(),
  findActiveUserSession: vi.fn(),
  getUserSessionContext: vi.fn(),
}))

import { GET, DELETE as DELETE_ALL } from "@/app/api/auth/sessions/route"
import { DELETE as DELETE_ONE } from "@/app/api/auth/sessions/[sessionId]/route"

const request = () => new NextRequest("http://localhost/api/auth/sessions")

describe("user session routes", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthenticatedSession.mockResolvedValue({
      user: { id: "user-1", email: "user@example.com" },
      sessionId: "current",
    })
  })

  it("lists only the authenticated user's devices and marks the current one", async () => {
    listUserSessions.mockResolvedValue([
      {
        id: "current",
        deviceName: "Mac",
        userAgent: "Browser",
        ipAddress: "203.0.113.4",
        lastUsedAt: new Date("2026-10-31T00:00:00.000Z"),
        expiresAt: new Date("2026-11-30T00:00:00.000Z"),
        createdAt: new Date("2026-10-01T00:00:00.000Z"),
      },
    ])

    const response = await GET(request())
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data.sessions[0]).toMatchObject({
      id: "current",
      current: true,
      ipAddress: "203.0.•••.•••",
    })
  })

  it("revokes all other devices while preserving the current session", async () => {
    revokeAllUserSessions.mockResolvedValue(2)

    const response = await DELETE_ALL(request())
    expect(response.status).toBe(200)
    expect(revokeAllUserSessions).toHaveBeenCalledWith("user-1", "current")
    await expect(response.json()).resolves.toMatchObject({
      data: { revoked: 2, currentSessionPreserved: true },
    })
  })

  it("clears the cookie when the current device is revoked", async () => {
    revokeUserSession.mockResolvedValue(true)

    const response = await DELETE_ONE(request(), {
      params: Promise.resolve({ sessionId: "current" }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get("set-cookie") ?? "").toContain("auth_token=")
    await expect(response.json()).resolves.toMatchObject({
      data: { revoked: true, current: true },
    })
  })
})
