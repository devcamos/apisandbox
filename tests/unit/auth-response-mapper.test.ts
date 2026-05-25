import { afterEach, beforeEach, describe, expect, it } from "vitest"
import {
  issueAuthTokenForUser,
  mapUserToAuthResponse,
  mapUserToAuthUser,
} from "@/lib/services/auth/auth-response-mapper"

const baseUser = {
  id: "user-1",
  email: "user@example.com",
  name: "Test User",
  image: null,
  subscriptionTier: "FREE" as const,
  profile: {
    firstName: "Test",
    lastName: "User",
    avatarUrl: null,
    roleLabel: null,
    identityStatement: null,
  },
}

describe("auth-response-mapper", () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = "unit-test-auth-secret-min-32-characters"
  })

  afterEach(() => {
    delete process.env.AUTH_SECRET
  })

  it("includes subscriptionTier on auth user", () => {
    const authUser = mapUserToAuthUser(baseUser)
    expect(authUser.subscriptionTier).toBe("FREE")
  })

  it("preserves premium subscriptionTier in auth response", () => {
    const response = mapUserToAuthResponse({
      ...baseUser,
      subscriptionTier: "PREMIUM",
    })

    expect(response.user.subscriptionTier).toBe("PREMIUM")
    expect(response.token).toBeTruthy()
    expect(response.expiresIn).toBeGreaterThan(0)
  })

  it("issues tokens for mapped auth users", () => {
    const authUser = mapUserToAuthUser(baseUser)
    const issued = issueAuthTokenForUser(authUser)

    expect(issued.token.split(".")).toHaveLength(3)
    expect(issued.expiresIn).toBeGreaterThan(0)
  })
})
