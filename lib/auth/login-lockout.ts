/**
 * Per-account password lockout policy (shared by /api/auth/login and the
 * NextAuth credentials provider).
 *
 * Policy: an account may fail password sign-in {@link MAX_FAILED_LOGIN_ATTEMPTS}
 * (5) times. Those 5 attempts are all evaluated normally. The 5th failure starts
 * a {@link LOCKOUT_MINUTES}-minute lock, so the 6th attempt (and any attempt
 * during the lock, even with the right password) is refused with a message that
 * says how long the lock lasts. A successful sign-in resets the counter, and an
 * expired lock starts a fresh 5-attempt window instead of re-locking on the
 * next single mistake.
 */
export const MAX_FAILED_LOGIN_ATTEMPTS = 5
export const LOCKOUT_MINUTES = 30

export interface LockoutState {
  loginAttempts: number | null
  lockedUntil: Date | null
}

export function isAccountLocked(state: LockoutState, now: Date = new Date()): boolean {
  return Boolean(state.lockedUntil && state.lockedUntil.getTime() > now.getTime())
}

export function lockMinutesRemaining(state: LockoutState, now: Date = new Date()): number {
  if (!state.lockedUntil) return 0
  const ms = state.lockedUntil.getTime() - now.getTime()
  return ms > 0 ? Math.ceil(ms / 60_000) : 0
}

/** Failed attempts that still count (a lapsed lock resets the window). */
export function effectiveFailedAttempts(state: LockoutState, now: Date = new Date()): number {
  if (state.lockedUntil && state.lockedUntil.getTime() <= now.getTime()) return 0
  return state.loginAttempts ?? 0
}

export interface FailedAttemptUpdate {
  loginAttempts: number
  lockedUntil: Date | null
  /** Attempts left before the account locks (0 means this failure locked it). */
  attemptsRemaining: number
  lockedNow: boolean
}

export function registerFailedAttempt(state: LockoutState, now: Date = new Date()): FailedAttemptUpdate {
  const loginAttempts = effectiveFailedAttempts(state, now) + 1
  const lockedNow = loginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS
  return {
    loginAttempts,
    lockedUntil: lockedNow ? new Date(now.getTime() + LOCKOUT_MINUTES * 60_000) : null,
    attemptsRemaining: Math.max(0, MAX_FAILED_LOGIN_ATTEMPTS - loginAttempts),
    lockedNow,
  }
}

export function accountLockedMessage(minutes: number): string {
  const unit = minutes === 1 ? "minute" : "minutes"
  return `Account locked after ${MAX_FAILED_LOGIN_ATTEMPTS} failed sign-in attempts. Try again in ${minutes} ${unit}.`
}
