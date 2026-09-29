import { beforeEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@prisma/client"
import { AppError } from "@/lib/http/errors"

const create = vi.hoisted(() => vi.fn())
const profileCreate = vi.hoisted(() => vi.fn())
const userDelete = vi.hoisted(() => vi.fn())
const findUniqueOrThrow = vi.hoisted(() => vi.fn())

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      create,
      delete: userDelete,
      findUniqueOrThrow,
    },
    userProfile: {
      create: profileCreate,
    },
  },
}))

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}))

import {
  createUserWithInitialData,
  isDatabaseCapacityError,
} from "@/lib/services/auth/user-bootstrap-service"

describe("isDatabaseCapacityError", () => {
  it("detects Supabase session pool exhaustion", () => {
    expect(
      isDatabaseCapacityError(
        new Error("FATAL: (EMAXCONNSESSION) max clients reached in session mode"),
      ),
    ).toBe(true)
    expect(isDatabaseCapacityError(new Error("unrelated"))).toBe(false)
  })
})

describe("createUserWithInitialData", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("creates user + profile for a normal email/password signup", async () => {
    create.mockResolvedValue({ id: "u1", email: "new@example.com" })
    profileCreate.mockResolvedValue({ id: "p1", userId: "u1" })
    findUniqueOrThrow.mockResolvedValue({
      id: "u1",
      email: "new@example.com",
      profile: { firstName: "New", lastName: "User" },
    })

    const user = await createUserWithInitialData({
      email: "new@example.com",
      passwordHash: "hash",
      firstName: "New",
      lastName: "User",
    })

    expect(user.id).toBe("u1")
    expect(create).toHaveBeenCalled()
    expect(profileCreate).toHaveBeenCalled()
  })

  it("maps EMAXCONNSESSION to a recoverable DATABASE_BUSY error (not generic bootstrap)", async () => {
    create.mockRejectedValue(
      Object.assign(
        Object.create(Prisma.PrismaClientInitializationError.prototype),
        {
          name: "PrismaClientInitializationError",
          message:
            "Error querying the database: FATAL: (EMAXCONNSESSION) max clients reached in session mode - max clients are limited to pool_size: 15",
          clientVersion: "6.19.3",
        },
      ),
    )

    await expect(
      createUserWithInitialData({
        email: "busy@example.com",
        passwordHash: "hash",
        firstName: "Busy",
        lastName: "User",
      }),
    ).rejects.toMatchObject({
      message: expect.stringContaining("database is busy"),
      status: 503,
      details: { code: "DATABASE_BUSY" },
    })
  })

  it("maps duplicate email to validation_error", async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint", {
        code: "P2002",
        clientVersion: "test",
      }),
    )

    await expect(
      createUserWithInitialData({
        email: "dup@example.com",
        passwordHash: "hash",
        firstName: "Dup",
        lastName: "User",
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
