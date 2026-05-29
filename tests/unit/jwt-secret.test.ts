import { afterEach, describe, expect, it, vi } from "vitest"

describe("jwt-secret", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("treats whitespace-only AUTH_JWT_SECRET as unset and falls back to AUTH_SECRET", async () => {
    vi.stubEnv("AUTH_JWT_SECRET", "   ")
    vi.stubEnv("AUTH_SECRET", "preview-auth-secret-at-least-32-chars")
    const { resolveJwtSecret, jwtSecretSource } = await import("@/lib/auth/jwt-secret")
    expect(resolveJwtSecret()).toBe("preview-auth-secret-at-least-32-chars")
    expect(jwtSecretSource()).toBe("AUTH_SECRET")
  })

  it("reports not configured when all secrets are empty", async () => {
    vi.stubEnv("AUTH_JWT_SECRET", "")
    vi.stubEnv("AUTH_SECRET", "")
    vi.stubEnv("NEXTAUTH_SECRET", "")
    const { isJwtSecretConfigured } = await import("@/lib/auth/jwt-secret")
    expect(isJwtSecretConfigured()).toBe(false)
  })
})
