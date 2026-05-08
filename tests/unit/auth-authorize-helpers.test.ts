import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}))

const verifyPasswordMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))
vi.mock("@/lib/auth", () => ({ verifyPassword: verifyPasswordMock }))

import { authorizeWithEmailPassword, authorizeWithGoogleIdToken } from "@/lib/auth-authorize-helpers"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("authorizeWithGoogleIdToken", () => {
  it("throws when Google payload has no email", async () => {
    const ticket = { getPayload: () => ({}) }
    const client = { verifyIdToken: vi.fn().mockResolvedValue(ticket) }

    await expect(
      authorizeWithGoogleIdToken("token", client as any, "client-id"),
    ).rejects.toThrow("Google did not provide an email")
  })

  it("creates a user when none exists", async () => {
    const ticket = {
      getPayload: () => ({ email: "new@example.com", name: "New User", picture: "pic" }),
    }
    const client = { verifyIdToken: vi.fn().mockResolvedValue(ticket) }

    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue({
      id: "u1",
      email: "new@example.com",
      name: "New User",
      image: "pic",
    })

    const result = await authorizeWithGoogleIdToken("token", client as any, "client-id")
    expect(prismaMock.user.create).toHaveBeenCalled()
    expect(result).toEqual({
      id: "u1",
      email: "new@example.com",
      name: "New User",
      image: "pic",
    })
  })

  it("updates an existing user with missing image", async () => {
    const ticket = {
      getPayload: () => ({ email: "existing@example.com", name: "Existing", picture: "pic2" }),
    }
    const client = { verifyIdToken: vi.fn().mockResolvedValue(ticket) }

    prismaMock.user.findUnique.mockResolvedValue({
      id: "u2",
      email: "existing@example.com",
      name: null,
      image: null,
    })
    prismaMock.user.update.mockResolvedValue({
      id: "u2",
      email: "existing@example.com",
      name: "Existing",
      image: "pic2",
    })

    const result = await authorizeWithGoogleIdToken("token", client as any, "client-id")
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "u2" },
        data: expect.objectContaining({ image: "pic2", name: "Existing" }),
      }),
    )
    expect(result.image).toBe("pic2")
  })
})

describe("authorizeWithEmailPassword", () => {
  it("throws CREDENTIALS_INVALID when user not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    await expect(authorizeWithEmailPassword("x@example.com", "pw")).rejects.toThrow(
      "CREDENTIALS_INVALID",
    )
  })

  it("throws ACCOUNT_LOCKED:<minutes> when lockedUntil is in the future", async () => {
    const lockedUntil = new Date(Date.now() + 5 * 60 * 1000)
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u3",
      email: "x@example.com",
      name: null,
      image: null,
      passwordHash: "hash",
      isActive: true,
      loginAttempts: 0,
      lockedUntil,
    })

    await expect(authorizeWithEmailPassword("x@example.com", "pw")).rejects.toThrow(
      /^ACCOUNT_LOCKED:/,
    )
  })

  it("increments attempts and throws PASSWORD_INCORRECT when password is wrong", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u4",
      email: "x@example.com",
      name: "X",
      image: null,
      passwordHash: "hash",
      isActive: true,
      loginAttempts: 0,
      lockedUntil: null,
    })
    verifyPasswordMock.mockResolvedValue(false)

    await expect(authorizeWithEmailPassword("x@example.com", "pw")).rejects.toThrow(
      "PASSWORD_INCORRECT:4",
    )
    expect(prismaMock.user.update).toHaveBeenCalled()
  })

  it("locks account and throws ACCOUNT_LOCKED when attempts reach 5", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u5",
      email: "x@example.com",
      name: "X",
      image: null,
      passwordHash: "hash",
      isActive: true,
      loginAttempts: 4,
      lockedUntil: null,
    })
    verifyPasswordMock.mockResolvedValue(false)

    await expect(authorizeWithEmailPassword("x@example.com", "pw")).rejects.toThrow("ACCOUNT_LOCKED")
  })

  it("resets attempts and returns user when password is correct", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u6",
      email: "x@example.com",
      name: "X",
      image: "img",
      passwordHash: "hash",
      isActive: true,
      loginAttempts: 3,
      lockedUntil: new Date(Date.now() - 60_000),
    })
    verifyPasswordMock.mockResolvedValue(true)
    prismaMock.user.update.mockResolvedValue({})

    const result = await authorizeWithEmailPassword("x@example.com", "pw")
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "u6" },
      data: { loginAttempts: 0, lockedUntil: null },
    })
    expect(result).toEqual({
      id: "u6",
      email: "x@example.com",
      name: "X",
      image: "img",
    })
  })
})
