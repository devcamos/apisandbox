import { describe, it, expect, vi, beforeEach } from "vitest"

describe("stripe-client", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("getStripeClient returns null when STRIPE_SECRET_KEY is unset", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "")
    const { getStripeClient } = await import("@/lib/stripe-client")
    expect(getStripeClient()).toBeNull()
  })

  it("requireStripeClient throws when STRIPE_SECRET_KEY is unset", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "")
    const { requireStripeClient } = await import("@/lib/stripe-client")
    expect(() => requireStripeClient()).toThrow("STRIPE_SECRET_KEY is not configured")
  })
})
