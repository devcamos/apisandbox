import { describe, it, expect, vi, beforeEach } from "vitest"

describe("stripe-client", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it.each(["sk_live_placeholder", "rk_live_placeholder"])("rejects live Stripe keys on Preview: %s", async (key) => {
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("STRIPE_SECRET_KEY", key)
    const { getStripeClient, requireStripeClient } = await import("@/lib/stripe-client")
    expect(() => getStripeClient()).toThrow("Preview billing must use a Stripe test-mode key")
    expect(() => requireStripeClient()).toThrow("Preview billing must use a Stripe test-mode key")
  })

  it("allows Preview test-mode keys with production Node builds", async () => {
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_placeholder")
    const { getStripeClient } = await import("@/lib/stripe-client")
    expect(getStripeClient()).not.toBeNull()
  })

  it("preserves Production live-key configuration", async () => {
    vi.stubEnv("VERCEL_ENV", "production")
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_placeholder")
    const { getStripeClient } = await import("@/lib/stripe-client")
    expect(getStripeClient()).not.toBeNull()
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

  it("getStripeClient returns a client when STRIPE_SECRET_KEY is set", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_placeholder")
    const { getStripeClient } = await import("@/lib/stripe-client")
    expect(getStripeClient()).not.toBeNull()
  })

  it("requireStripeClient returns the client when STRIPE_SECRET_KEY is set", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_placeholder")
    const { requireStripeClient } = await import("@/lib/stripe-client")
    expect(requireStripeClient()).not.toBeNull()
  })
})
