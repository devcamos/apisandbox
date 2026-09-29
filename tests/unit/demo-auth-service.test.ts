import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  user: {
    deleteMany: vi.fn(),
    findUniqueOrThrow: vi.fn(),
  },
  userProfile: {
    update: vi.fn(),
  },
}))

const createUserWithInitialData = vi.hoisted(() => vi.fn())
const mapUserToAuthResponse = vi.hoisted(() => vi.fn())

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))
vi.mock("@/lib/services/auth/user-bootstrap-service", () => ({
  createUserWithInitialData,
}))
vi.mock("@/lib/services/auth/auth-response-mapper", () => ({
  mapUserToAuthResponse,
}))
vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

import {
  cleanupExpiredDemoUsers,
  createEphemeralDemoSession,
} from "@/lib/services/auth/demo-auth-service"

describe("demo-auth-service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    prismaMock.user.deleteMany.mockResolvedValue({ count: 0 })
    prismaMock.userProfile.update.mockResolvedValue({})
  })

  it("cleanupExpiredDemoUsers deletes only ephemeral demos past TTL", async () => {
    prismaMock.user.deleteMany.mockResolvedValue({ count: 2 })
    const count = await cleanupExpiredDemoUsers(new Date("2026-01-02T00:00:00.000Z"))
    expect(count).toBe(2)
    expect(prismaMock.user.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { email: { startsWith: "demo." } },
            { email: { endsWith: "@apisandbox.demo" } },
          ]),
        }),
      }),
    )
  })

  it("createEphemeralDemoSession provisions a FREE demo user and returns auth", async () => {
    const created = {
      id: "demo-user-1",
      email: "demo.deadbeef@apisandbox.demo",
    }
    createUserWithInitialData.mockResolvedValue(created)
    const hydrated = {
      ...created,
      name: "Demo Visitor",
      image: null,
      subscriptionTier: "FREE",
      profile: {
        firstName: "Demo",
        lastName: "Visitor",
        avatarUrl: null,
        roleLabel: "Phase 1 demo",
        identityStatement: "Ephemeral demo session",
      },
    }
    prismaMock.user.findUniqueOrThrow.mockResolvedValue(hydrated)
    mapUserToAuthResponse.mockReturnValue({
      token: "jwt",
      expiresIn: 3600,
      user: { id: created.id, email: created.email, isDemo: true, subscriptionTier: "FREE" },
    })

    const response = await createEphemeralDemoSession()

    expect(createUserWithInitialData).toHaveBeenCalledWith(
      expect.objectContaining({
        passwordHash: null,
        firstName: "Demo",
        lastName: "Visitor",
        email: expect.stringMatching(/^demo\.[a-f0-9]+@apisandbox\.demo$/),
      }),
    )
    expect(prismaMock.userProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "demo-user-1" },
        data: expect.objectContaining({ roleLabel: "Phase 1 demo" }),
      }),
    )
    expect(response.user.isDemo).toBe(true)
    expect(response.token).toBe("jwt")
  })
})
