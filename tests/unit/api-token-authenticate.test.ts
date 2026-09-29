import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  apiToken: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))

import {
  API_TOKEN_LAST_USED_THROTTLE_MS,
  authenticateApiToken,
} from "@/lib/services/api-token-service"
import { generateApiToken, hashApiToken } from "@/lib/api-tokens/token-policy"
import { AppError } from "@/lib/http/errors"

describe("authenticateApiToken", () => {
  const raw = generateApiToken()

  beforeEach(() => {
    prismaMock.apiToken.findUnique.mockReset()
    prismaMock.apiToken.update.mockReset()
  })

  function tokenRecord(overrides: Record<string, unknown> = {}) {
    return {
      id: "tok_1",
      userId: "user_1",
      scopes: ["profile:read"],
      revokedAt: null,
      expiresAt: null,
      lastUsedAt: null,
      user: {
        id: "user_1",
        email: "learner@example.com",
        isActive: true,
        subscriptionTier: "FREE",
      },
      ...overrides,
    }
  }

  it("accepts a valid token and updates lastUsedAt when stale", async () => {
    prismaMock.apiToken.findUnique.mockResolvedValue(tokenRecord())
    prismaMock.apiToken.update.mockResolvedValue({})

    const result = await authenticateApiToken(raw)

    expect(prismaMock.apiToken.findUnique).toHaveBeenCalledWith({
      where: { tokenHash: hashApiToken(raw) },
      include: expect.any(Object),
    })
    expect(prismaMock.apiToken.update).toHaveBeenCalled()
    expect(result).toMatchObject({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["profile:read"],
      expiresAt: null,
    })
  })

  it("skips lastUsedAt writes inside the throttle window", async () => {
    prismaMock.apiToken.findUnique.mockResolvedValue(
      tokenRecord({ lastUsedAt: new Date(Date.now() - 1_000) }),
    )

    await authenticateApiToken(raw)
    expect(prismaMock.apiToken.update).not.toHaveBeenCalled()
  })

  it("updates lastUsedAt after the throttle window", async () => {
    prismaMock.apiToken.findUnique.mockResolvedValue(
      tokenRecord({
        lastUsedAt: new Date(Date.now() - API_TOKEN_LAST_USED_THROTTLE_MS - 1),
      }),
    )
    prismaMock.apiToken.update.mockResolvedValue({})

    await authenticateApiToken(raw)
    expect(prismaMock.apiToken.update).toHaveBeenCalled()
  })

  it("rejects revoked tokens", async () => {
    prismaMock.apiToken.findUnique.mockResolvedValue(
      tokenRecord({ revokedAt: new Date() }),
    )

    await expect(authenticateApiToken(raw)).rejects.toBeInstanceOf(AppError)
    await expect(authenticateApiToken(raw)).rejects.toMatchObject({ status: 401 })
  })

  it("rejects tokens without the required scope", async () => {
    prismaMock.apiToken.findUnique.mockResolvedValue(tokenRecord())

    await expect(authenticateApiToken(raw, "progress:write")).rejects.toMatchObject({
      status: 403,
    })
  })

  it("rejects inactive users", async () => {
    prismaMock.apiToken.findUnique.mockResolvedValue(
      tokenRecord({ user: { id: "user_1", email: "x@y.z", isActive: false, subscriptionTier: "FREE" } }),
    )
    await expect(authenticateApiToken(raw)).rejects.toMatchObject({ status: 401 })
  })

  it("rejects expired tokens", async () => {
    prismaMock.apiToken.findUnique.mockResolvedValue(
      tokenRecord({ expiresAt: new Date("2020-01-01T00:00:00.000Z") }),
    )
    await expect(authenticateApiToken(raw)).rejects.toMatchObject({ status: 401 })
  })
})
