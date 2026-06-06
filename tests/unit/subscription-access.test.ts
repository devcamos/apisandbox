import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
  },
}))

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))

import { checkPhaseAccess, getTierFeatures } from "@/lib/subscription"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("checkPhaseAccess", () => {
  it("grants FREE users access to phases 0 and 1 only", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      subscriptionTier: "FREE",
      subscriptionExpiresAt: null,
    })

    const p0 = await checkPhaseAccess("u1", 0)
    const p1 = await checkPhaseAccess("u1", 1)
    expect(p0.hasAccess).toBe(true)
    expect(p1.hasAccess).toBe(true)

    const p2 = await checkPhaseAccess("u1", 2)
    const p7 = await checkPhaseAccess("u1", 7)
    const p8 = await checkPhaseAccess("u1", 8)
    expect(p2.hasAccess).toBe(false)
    expect(p2.upgradeRequired).toBe(true)
    expect(p7.hasAccess).toBe(false)
    expect(p8.hasAccess).toBe(false)
  })

  it("grants PREMIUM users access to gated phases", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      subscriptionTier: "PREMIUM",
      subscriptionExpiresAt: null,
    })

    const p2 = await checkPhaseAccess("u1", 2)
    const cloud = await checkPhaseAccess("u1", "cloud")
    expect(p2.hasAccess).toBe(true)
    expect(cloud.hasAccess).toBe(true)
  })

  it("treats expired PREMIUM as FREE for phase 2", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      subscriptionTier: "PREMIUM",
      subscriptionExpiresAt: new Date(Date.now() - 86_400_000),
    })

    const p2 = await checkPhaseAccess("u1", 2)
    expect(p2.hasAccess).toBe(false)
    expect(p2.tier).toBe("FREE")
  })
})

describe("getTierFeatures", () => {
  it("FREE tier includes observability and phases 0-1", () => {
    const features = getTierFeatures("FREE")
    expect(features.phases).toEqual([0, 1])
    expect(features.observability).toBe(true)
    expect(features.cloud).toBe(false)
  })

  it("PREMIUM tier includes phases through 9", () => {
    const features = getTierFeatures("PREMIUM")
    expect(features.phases).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(features.cloud).toBe(true)
  })
})
