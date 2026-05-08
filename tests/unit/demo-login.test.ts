import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("demo-login", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("isDemoSessionEmail matches public demo email", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_USER_EMAIL", "demo@example.com")
    const { isDemoSessionEmail } = await import("@/lib/demo-login")
    expect(isDemoSessionEmail("demo@example.com")).toBe(true)
    expect(isDemoSessionEmail("other@example.com")).toBe(false)
  })
})
