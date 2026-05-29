import { afterEach, describe, expect, it, vi } from "vitest"

describe("saas config", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("blocks instant upgrade when Stripe checkout is enabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_STRIPE_CHECKOUT", "true")
    vi.stubEnv("NODE_ENV", "development")
    const { isInstantPremiumUpgradeAllowed } = await import("@/lib/saas/config")
    expect(isInstantPremiumUpgradeAllowed()).toBe(false)
  })

  it("blocks instant upgrade in production even without Stripe", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_STRIPE_CHECKOUT", "false")
    vi.stubEnv("NODE_ENV", "production")
    const { isInstantPremiumUpgradeAllowed } = await import("@/lib/saas/config")
    expect(isInstantPremiumUpgradeAllowed()).toBe(false)
  })

  it("allows instant upgrade only in local demo mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_STRIPE_CHECKOUT", "false")
    vi.stubEnv("NODE_ENV", "development")
    const { isInstantPremiumUpgradeAllowed } = await import("@/lib/saas/config")
    expect(isInstantPremiumUpgradeAllowed()).toBe(true)
  })

  it("blocks demo login in production by default", async () => {
    vi.stubEnv("NEXT_PUBLIC_FF_DEMO_LOGIN", "true")
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("ALLOW_DEMO_LOGIN_IN_PRODUCTION", "")
    const { isDemoLoginAllowedInCurrentEnvironment } = await import("@/lib/saas/config")
    expect(isDemoLoginAllowedInCurrentEnvironment()).toBe(false)
  })

  it("requires assistant auth in production", async () => {
    vi.stubEnv("NODE_ENV", "production")
    const { isAssistantAuthRequired } = await import("@/lib/saas/config")
    expect(isAssistantAuthRequired()).toBe(true)
  })
})
