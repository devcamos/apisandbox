import { describe, it, expect, vi, beforeEach } from "vitest"

describe("Feature Flags", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("returns false when env var is not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_PREMIUM_PAYWALL", "")
    const { isFeatureEnabled } = await import("@/config/featureFlags")
    expect(isFeatureEnabled("PREMIUM_PAYWALL")).toBe(false)
  })

  it("returns true when env var is set to 'true'", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_PREMIUM_PAYWALL", "true")
    const { isFeatureEnabled } = await import("@/config/featureFlags")
    expect(isFeatureEnabled("PREMIUM_PAYWALL")).toBe(true)
  })

  it("returns false for non-true values", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_PREMIUM_PAYWALL", "yes")
    const { isFeatureEnabled } = await import("@/config/featureFlags")
    expect(isFeatureEnabled("PREMIUM_PAYWALL")).toBe(false)
  })

  it("signupRequiredForPremium maps to PREMIUM_PAYWALL flag", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_PREMIUM_PAYWALL", "true")
    const { signupRequiredForPremium } = await import("@/config/featureFlags")
    expect(signupRequiredForPremium).toBe(true)
  })

  it("getAllFlags returns all flag configs", async () => {
    const { getAllFlags } = await import("@/config/featureFlags")
    const flags = getAllFlags()
    expect(flags).toHaveProperty("PREMIUM_PAYWALL")
    expect(flags).toHaveProperty("STRIPE_CHECKOUT")
    expect(flags).toHaveProperty("EMAIL_VERIFICATION")
    expect(flags).toHaveProperty("RATE_LIMITING")
    expect(flags).toHaveProperty("ANALYTICS")
    expect(flags.PREMIUM_PAYWALL).toHaveProperty("description")
    expect(flags.PREMIUM_PAYWALL).toHaveProperty("enabled")
  })

  it("isFeatureEnabled returns false for an unknown flag key at runtime", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_PREMIUM_PAYWALL", "true")
    const { isFeatureEnabled } = await import("@/config/featureFlags")
    expect((isFeatureEnabled as (f: string) => boolean)("NOT_A_FLAG")).toBe(false)
  })
})
