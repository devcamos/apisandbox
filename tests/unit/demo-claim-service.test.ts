import { beforeEach, describe, expect, it, vi } from "vitest"
import { AppError } from "@/lib/http/errors"

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    update: vi.fn(),
  },
  userProfile: {
    upsert: vi.fn(),
  },
}))

const hashPassword = vi.hoisted(() => vi.fn())
const validatePasswordStrength = vi.hoisted(() => vi.fn())
const mapUserToAuthResponse = vi.hoisted(() => vi.fn())

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))
vi.mock("@/lib/auth", () => ({
  hashPassword,
  validatePasswordStrength,
}))
vi.mock("@/lib/services/auth/auth-response-mapper", () => ({
  mapUserToAuthResponse,
}))

import { claimDemoAccount } from "@/lib/services/auth/demo-claim-service"

describe("claimDemoAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    validatePasswordStrength.mockReturnValue({ isValid: true, errors: [] })
    hashPassword.mockResolvedValue("hashed")
  })

  it("rejects non-demo sessions", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: "u1",
      email: "real@example.com",
      isActive: true,
      profile: null,
    })

    await expect(
      claimDemoAccount({
        userId: "u1",
        email: "keep@example.com",
        password: "ValidPass1!",
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it("converts a demo user in place and returns auth + plan", async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce({
        id: "demo-1",
        email: "demo.abc@apisandbox.demo",
        isActive: true,
        name: "Demo Visitor",
        profile: { firstName: "Demo", lastName: "Visitor" },
      })
      .mockResolvedValueOnce(null) // email uniqueness

    prismaMock.user.update.mockResolvedValue({})
    prismaMock.userProfile.upsert.mockResolvedValue({})
    const hydrated = {
      id: "demo-1",
      email: "keep@example.com",
      name: "Alex",
      image: null,
      subscriptionTier: "FREE",
      profile: {
        firstName: "Alex",
        lastName: null,
        avatarUrl: null,
        roleLabel: null,
        identityStatement: null,
      },
    }
    prismaMock.user.findUniqueOrThrow.mockResolvedValue(hydrated)
    mapUserToAuthResponse.mockReturnValue({
      token: "jwt",
      expiresIn: 3600,
      user: { id: "demo-1", email: "keep@example.com", isDemo: false, subscriptionTier: "FREE" },
    })

    const result = await claimDemoAccount({
      userId: "demo-1",
      email: "keep@example.com",
      password: "ValidPass1!",
      name: "Alex",
      plan: "pro",
    })

    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "demo-1" },
        data: expect.objectContaining({
          email: "keep@example.com",
          passwordHash: "hashed",
          subscriptionTier: "FREE",
        }),
      }),
    )
    expect(result.plan).toBe("pro")
    expect(result.token).toBe("jwt")
    expect(result.user.isDemo).toBe(false)
  })
})
