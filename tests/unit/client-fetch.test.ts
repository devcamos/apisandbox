import { describe, expect, test, beforeEach } from "vitest"
import { AUTH_JWT_STORAGE_KEY, authApiRequestInit } from "@/lib/auth/client-fetch"

describe("authApiRequestInit", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test("includes credentials and Bearer token when jwt is in localStorage", () => {
    localStorage.setItem(AUTH_JWT_STORAGE_KEY, "test-jwt-token")

    const init = authApiRequestInit({ method: "POST" })

    expect(init.credentials).toBe("include")
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer test-jwt-token")
  })

  test("does not overwrite an existing Authorization header", () => {
    localStorage.setItem(AUTH_JWT_STORAGE_KEY, "stored-token")

    const init = authApiRequestInit({
      headers: { Authorization: "Bearer explicit-token" },
    })

    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer explicit-token")
  })

  test("works without a stored token (cookie-only sessions)", () => {
    const init = authApiRequestInit()

    expect(init.credentials).toBe("include")
    expect(new Headers(init.headers).get("Authorization")).toBeNull()
  })
})
