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

  it("enforces the paywall on Vercel Production even when the flag is off", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_PREMIUM_PAYWALL", "")
    vi.stubEnv("VERCEL_ENV", "production")
    const { isFeatureEnabled } = await import("@/config/featureFlags")
    expect(isFeatureEnabled("PREMIUM_PAYWALL")).toBe(true)
    vi.unstubAllEnvs()
  })

  it("enforces the paywall in the browser bundle on Vercel Production", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_PREMIUM_PAYWALL", "false")
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "production")
    const { isFeatureEnabled, isVercelProductionTarget } = await import("@/config/featureFlags")
    expect(isVercelProductionTarget()).toBe(true)
    expect(isFeatureEnabled("PREMIUM_PAYWALL")).toBe(true)
    vi.unstubAllEnvs()
  })

  it("does not force the paywall on Vercel Preview", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_PREMIUM_PAYWALL", "")
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "preview")
    const { isFeatureEnabled } = await import("@/config/featureFlags")
    expect(isFeatureEnabled("PREMIUM_PAYWALL")).toBe(false)
    vi.unstubAllEnvs()
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
    expect(flags).toHaveProperty("BILLING_PORTAL")
    expect(flags).toHaveProperty("EMAIL_VERIFICATION")
    expect(flags).toHaveProperty("RATE_LIMITING")
    expect(flags).toHaveProperty("ANALYTICS")
    expect(flags).toHaveProperty("DEMO_LOGIN")
    expect(flags.PREMIUM_PAYWALL).toHaveProperty("description")
    expect(flags.PREMIUM_PAYWALL).toHaveProperty("enabled")
  })

  it("featureFlagEnvKey returns the env var name", async () => {
    const { featureFlagEnvKey } = await import("@/config/featureFlags")
    expect(featureFlagEnvKey("BILLING_PORTAL")).toBe("NEXT_PUBLIC_FF_BILLING_PORTAL")
  })

  it("isBillingPortalEnabled requires both STRIPE_CHECKOUT and BILLING_PORTAL", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_STRIPE_CHECKOUT", "true")
    vi.stubEnv("NEXT_PUBLIC_FF_BILLING_PORTAL", "")
    const { isBillingPortalEnabled } = await import("@/config/featureFlags")
    expect(isBillingPortalEnabled()).toBe(false)

    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_FF_STRIPE_CHECKOUT", "true")
    vi.stubEnv("NEXT_PUBLIC_FF_BILLING_PORTAL", "true")
    const mod = await import("@/config/featureFlags")
    expect(mod.isBillingPortalEnabled()).toBe(true)
  })

  it("isFeatureEnabled returns false for an unknown flag key at runtime", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_PREMIUM_PAYWALL", "true")
    const { isFeatureEnabled } = await import("@/config/featureFlags")
    expect((isFeatureEnabled as (f: string) => boolean)("NOT_A_FLAG")).toBe(false)
  })
})
