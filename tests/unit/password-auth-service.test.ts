import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  user: { findUnique: vi.fn(), update: vi.fn() },
}))
const verifyPassword = vi.hoisted(() => vi.fn())

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))
vi.mock("@/lib/auth", () => ({ verifyPassword }))

import { validatePasswordLogin } from "@/lib/services/auth/password-auth-service"
import { AppError } from "@/lib/http/errors"

type Row = {
  id: string
  email: string
  isActive: boolean
  passwordHash: string | null
  loginAttempts: number
  lockedUntil: Date | null
  profile: null
}

let row: Row

function fresh(): Row {
  return {
    id: "u1",
    email: "user@example.com",
    isActive: true,
    passwordHash: "hash",
    loginAttempts: 0,
    lockedUntil: null,
    profile: null,
  }
}

async function attempt(password: string) {
  try {
    const user = await validatePasswordLogin("User@Example.com", password)
    return { ok: true as const, user }
  } catch (err) {
    return { ok: false as const, err: err as AppError }
  }
}

describe("validatePasswordLogin lockout", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    row = fresh()
    prismaMock.user.findUnique.mockImplementation(async () => (row ? { ...row } : null))
    prismaMock.user.update.mockImplementation(async ({ data }: { data: Partial<Row> }) => {
      row = { ...row, ...data }
      return row
    })
    verifyPassword.mockImplementation(async (pw: string) => pw === "correct")
  })

  it("valid email/password signs in", async () => {
    const r = await attempt("correct")
    expect(r.ok).toBe(true)
  })

  it("unknown email returns generic invalid credentials (no lock bookkeeping)", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null)
    const r = await attempt("whatever")
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.err.status).toBe(401)
      expect(r.err.message).toBe("Invalid email or password")
    }
    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })

  it("allows 5 wrong attempts, then the 6th is locked with a duration message", async () => {
    for (let i = 1; i <= 5; i++) {
      const r = await attempt("wrong")
      expect(r.ok).toBe(false)
      if (!r.ok) {
        expect(r.err.status).toBe(401)
        expect(r.err.message).toBe("Invalid email or password")
      }
      expect(row.loginAttempts).toBe(i)
    }
    expect(row.lockedUntil).not.toBeNull()

    // 6th attempt - even with the right password - is refused while locked
    const sixth = await attempt("correct")
    expect(sixth.ok).toBe(false)
    if (!sixth.ok) {
      expect(sixth.err.status).toBe(423)
      expect(sixth.err.message).toBe(
        "Account locked after 5 failed sign-in attempts. Try again in 30 minutes.",
      )
      expect(sixth.err.details).toMatchObject({ code: "ACCOUNT_LOCKED", minutesRemaining: 30 })
    }
  })

  it("a correct login after fewer than 5 failures resets the counter", async () => {
    for (let i = 0; i < 4; i++) await attempt("wrong")
    expect(row.loginAttempts).toBe(4)
    const ok = await attempt("correct")
    expect(ok.ok).toBe(true)
    expect(row.loginAttempts).toBe(0)
    expect(row.lockedUntil).toBeNull()
    // and the user gets a full 5 attempts again
    for (let i = 0; i < 4; i++) await attempt("wrong")
    expect(row.lockedUntil).toBeNull()
  })

  it("after the lock expires the user gets a fresh 5 attempts", async () => {
    row.loginAttempts = 5
    row.lockedUntil = new Date(Date.now() - 1000)
    const r = await attempt("wrong")
    expect(r.ok).toBe(false)
    expect(row.loginAttempts).toBe(1)
    expect(row.lockedUntil).toBeNull()
  })

  it("Google-only account gets the Google hint, not invalid credentials", async () => {
    row.passwordHash = null
    const r = await attempt("anything")
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.err.message).toContain("Google sign-in")
  })
})
