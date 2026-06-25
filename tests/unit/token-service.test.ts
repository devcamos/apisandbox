import { afterEach, describe, expect, it, vi } from "vitest"
import {
  getJwtIdleExpirySeconds,
  issueJwtToken,
  verifyJwtToken,
} from "@/lib/services/auth/token-service"

const originalAuthJwtSecret = process.env.AUTH_JWT_SECRET
const originalAuthSecret = process.env.AUTH_SECRET
const originalNextAuthSecret = process.env.NEXTAUTH_SECRET
const originalIdleExpiry = process.env.AUTH_IDLE_EXPIRES_IN_SECONDS

describe("token-service", () => {
  afterEach(() => {
    vi.useRealTimers()
    restoreEnv()
  })

  it("falls back to AUTH_SECRET when AUTH_JWT_SECRET is unset", () => {
    delete process.env.AUTH_JWT_SECRET
    process.env.AUTH_SECRET = "auth-secret-fallback"
    delete process.env.NEXTAUTH_SECRET

    const issued = issueJwtToken({ sub: "user_1", email: "test@example.com" })
    const payload = verifyJwtToken(issued.token)

    expect(payload).toEqual({
      sub: "user_1",
      email: "test@example.com",
    })
  })

  it("falls back to NEXTAUTH_SECRET when AUTH_JWT_SECRET and AUTH_SECRET are unset", () => {
    delete process.env.AUTH_JWT_SECRET
    delete process.env.AUTH_SECRET
    process.env.NEXTAUTH_SECRET = "nextauth-secret-fallback"

    const issued = issueJwtToken({ sub: "user_2", email: "qa@example.com" })
    const payload = verifyJwtToken(issued.token)

    expect(payload).toEqual({
      sub: "user_2",
      email: "qa@example.com",
    })
  })

  it("defaults browser sessions to a 30 minute inactivity window", () => {
    delete process.env.AUTH_IDLE_EXPIRES_IN_SECONDS

    expect(getJwtIdleExpirySeconds()).toBe(60 * 30)
  })

  it("rejects tokens after the inactivity window", () => {
    process.env.AUTH_JWT_SECRET = "idle-window-secret"
    process.env.AUTH_IDLE_EXPIRES_IN_SECONDS = "30"
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-23T10:00:00.000Z"))

    const issued = issueJwtToken({ sub: "user_3", email: "idle@example.com" })

    vi.setSystemTime(new Date("2026-06-23T10:00:31.000Z"))

    expect(() => verifyJwtToken(issued.token)).toThrow("Session has expired due to inactivity")
  })
})

function restoreEnv() {
  assignEnv("AUTH_JWT_SECRET", originalAuthJwtSecret)
  assignEnv("AUTH_SECRET", originalAuthSecret)
  assignEnv("NEXTAUTH_SECRET", originalNextAuthSecret)
  assignEnv("AUTH_IDLE_EXPIRES_IN_SECONDS", originalIdleExpiry)
}

function assignEnv(
  key: "AUTH_JWT_SECRET" | "AUTH_SECRET" | "NEXTAUTH_SECRET" | "AUTH_IDLE_EXPIRES_IN_SECONDS",
  value: string | undefined,
) {
  if (typeof value === "undefined") {
    delete process.env[key]
    return
  }
  process.env[key] = value
}
