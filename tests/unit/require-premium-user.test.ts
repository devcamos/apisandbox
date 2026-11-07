import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const findUnique = vi.hoisted(() => vi.fn())
const findActiveUserSession = vi.hoisted(() => vi.fn())
const verifyJwtToken = vi.hoisted(() => vi.fn())
vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique } } }))
vi.mock("@/lib/services/auth/token-service", () => ({ verifyJwtToken }))
vi.mock("@/lib/services/auth/user-session-service", () => ({ findActiveUserSession }))

import { requirePremiumUser } from "@/lib/auth/jwt-auth-middleware"

const req = () => new NextRequest("http://localhost/api/assistant", { headers: { authorization: "Bearer t" } })

function mockUser(tier: string, expiresAt: Date | null) {
  findUnique.mockImplementation(async (args?: { select?: Record<string, boolean> }) =>
    args?.select?.subscriptionTier
      ? { subscriptionTier: tier, subscriptionExpiresAt: expiresAt }
      : { id: "u1", email: "a@b.com", isActive: true },
  )
}

describe("requirePremiumUser", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    verifyJwtToken.mockReturnValue({ sub: "u1" })
  })

  it("allows active premium", async () => {
    mockUser("PREMIUM", new Date(Date.now() + 60_000))
    await expect(requirePremiumUser(req())).resolves.toMatchObject({ id: "u1" })
  })

  it("allows premium with no expiry", async () => {
    mockUser("PREMIUM", null)
    await expect(requirePremiumUser(req())).resolves.toMatchObject({ id: "u1" })
  })

  it("rejects lapsed premium (expiry in the past)", async () => {
    mockUser("PREMIUM", new Date(Date.now() - 60_000))
    await expect(requirePremiumUser(req())).rejects.toMatchObject({ status: 403 })
  })

  it("rejects free users", async () => {
    mockUser("FREE", null)
    await expect(requirePremiumUser(req())).rejects.toMatchObject({ status: 403 })
  })

  it("rejects a revoked device even when the user has active premium", async () => {
    mockUser("PREMIUM", new Date(Date.now() + 60_000))
    verifyJwtToken.mockReturnValue({ sub: "u1", sid: "revoked-device" })
    findActiveUserSession.mockResolvedValue(null)

    await expect(requirePremiumUser(req())).rejects.toMatchObject({ status: 401 })
    expect(findActiveUserSession).toHaveBeenCalledWith("u1", "revoked-device")
  })

  it("rejects lapsed premium even when the device session is active", async () => {
    mockUser("PREMIUM", new Date(Date.now() - 60_000))
    verifyJwtToken.mockReturnValue({ sub: "u1", sid: "active-device" })
    findActiveUserSession.mockResolvedValue({ id: "active-device" })

    await expect(requirePremiumUser(req())).rejects.toMatchObject({ status: 403 })
    expect(findActiveUserSession).toHaveBeenCalledWith("u1", "active-device")
  })
})
