import { afterEach, describe, expect, it } from "vitest"
import { issueJwtToken, verifyJwtToken } from "@/lib/services/auth/token-service"

const originalAuthJwtSecret = process.env.AUTH_JWT_SECRET
const originalAuthSecret = process.env.AUTH_SECRET
const originalNextAuthSecret = process.env.NEXTAUTH_SECRET

describe("token-service", () => {
  afterEach(() => {
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
})

function restoreEnv() {
  assignEnv("AUTH_JWT_SECRET", originalAuthJwtSecret)
  assignEnv("AUTH_SECRET", originalAuthSecret)
  assignEnv("NEXTAUTH_SECRET", originalNextAuthSecret)
}

function assignEnv(key: "AUTH_JWT_SECRET" | "AUTH_SECRET" | "NEXTAUTH_SECRET", value: string | undefined) {
  if (typeof value === "undefined") {
    delete process.env[key]
    return
  }
  process.env[key] = value
}
