import { describe, expect, it } from "vitest"
import {
  LOCKOUT_MINUTES,
  MAX_FAILED_LOGIN_ATTEMPTS,
  accountLockedMessage,
  effectiveFailedAttempts,
  isAccountLocked,
  lockMinutesRemaining,
  registerFailedAttempt,
} from "@/lib/auth/login-lockout"

const now = new Date("2026-09-27T12:00:00.000Z")

describe("login lockout policy", () => {
  it("allows 5 failed attempts; only the 5th starts the lock", () => {
    let state = { loginAttempts: 0, lockedUntil: null as Date | null }
    for (let i = 1; i <= MAX_FAILED_LOGIN_ATTEMPTS; i++) {
      expect(isAccountLocked(state, now)).toBe(false)
      const update = registerFailedAttempt(state, now)
      expect(update.loginAttempts).toBe(i)
      expect(update.lockedNow).toBe(i === 5)
      state = { loginAttempts: update.loginAttempts, lockedUntil: update.lockedUntil }
    }
    // 6th attempt is locked
    expect(isAccountLocked(state, now)).toBe(true)
    expect(lockMinutesRemaining(state, now)).toBe(LOCKOUT_MINUTES)
  })

  it("does not lock before the 5th failure", () => {
    const u = registerFailedAttempt({ loginAttempts: 3, lockedUntil: null }, now)
    expect(u.lockedUntil).toBeNull()
    expect(u.attemptsRemaining).toBe(1)
  })

  it("resets the window once a lock has expired", () => {
    const expired = { loginAttempts: 5, lockedUntil: new Date(now.getTime() - 1000) }
    expect(isAccountLocked(expired, now)).toBe(false)
    expect(effectiveFailedAttempts(expired, now)).toBe(0)
    const u = registerFailedAttempt(expired, now)
    expect(u.loginAttempts).toBe(1)
    expect(u.lockedUntil).toBeNull()
  })

  it("lock message states the duration", () => {
    expect(accountLockedMessage(30)).toBe(
      "Account locked after 5 failed sign-in attempts. Try again in 30 minutes.",
    )
    expect(accountLockedMessage(1)).toContain("1 minute.")
  })
})
