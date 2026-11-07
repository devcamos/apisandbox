import { beforeEach, describe, expect, it, vi } from "vitest"

const userSession = vi.hoisted(() => ({
  create: vi.fn(),
  findFirst: vi.fn(),
  findMany: vi.fn(),
  updateMany: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({ prisma: { userSession } }))

import {
  createUserSession,
  findActiveUserSession,
  getUserSessionContext,
  listUserSessions,
  revokeAllUserSessions,
  revokeUserSession,
} from "@/lib/services/auth/user-session-service"

describe("user-session-service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    userSession.updateMany.mockResolvedValue({ count: 1 })
  })

  it("extracts bounded request metadata", () => {
    const request = new Request("http://localhost", {
      headers: {
        "user-agent": "Browser",
        "x-forwarded-for": "203.0.113.4, 10.0.0.1",
      },
    })

    expect(getUserSessionContext(request as never)).toEqual({
      userAgent: "Browser",
      ipAddress: "203.0.113.4",
    })
  })

  it("creates an expiring device session", async () => {
    const expiresAt = new Date("2026-12-01T00:00:00.000Z")
    userSession.create.mockResolvedValue({ id: "session-1", expiresAt })

    const result = await createUserSession("user-1", {
      userAgent: "Browser",
      ipAddress: "203.0.113.4",
    })

    expect(userSession.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        userId: "user-1",
        deviceName: "Web browser",
        userAgent: "Browser",
        ipAddress: "203.0.113.4",
      }),
    }))
    expect(result.id).toBe("session-1")
  })

  it("touches an active session when its last use is stale", async () => {
    userSession.findFirst.mockResolvedValue({
      id: "session-1",
      expiresAt: new Date(Date.now() + 60_000),
      lastUsedAt: new Date(Date.now() - 10 * 60_000),
    })

    await expect(findActiveUserSession("user-1", "session-1")).resolves.toMatchObject({
      id: "session-1",
    })
    expect(userSession.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "session-1", revokedAt: null },
    }))
  })

  it("scopes list and revocation operations to the user", async () => {
    userSession.findMany.mockResolvedValue([])

    await listUserSessions("user-1")
    await revokeUserSession("user-1", "session-1")
    await revokeAllUserSessions("user-1", "session-2")

    expect(userSession.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ userId: "user-1" }),
    }))
    expect(userSession.updateMany).toHaveBeenNthCalledWith(1, expect.objectContaining({
      where: { id: "session-1", userId: "user-1", revokedAt: null },
    }))
    expect(userSession.updateMany).toHaveBeenNthCalledWith(2, expect.objectContaining({
      where: expect.objectContaining({
        userId: "user-1",
        id: { not: "session-2" },
      }),
    }))
  })
})
