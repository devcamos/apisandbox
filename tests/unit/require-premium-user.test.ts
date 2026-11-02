import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const findUnique = vi.hoisted(() => vi.fn())
vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique } } }))
vi.mock("@/lib/services/auth/token-service", () => ({ verifyJwtToken: () => ({ sub: "u1" }) }))

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
  beforeEach(() => findUnique.mockReset())

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
})
