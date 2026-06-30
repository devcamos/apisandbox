import { afterEach, describe, expect, it, vi } from "vitest"

const JWT = "test-auth-secret-at-least-32-characters-long"

function stubProductionSaasEnv(overrides: Record<string, string> = {}) {
  vi.stubEnv("NODE_ENV", "production")
  vi.stubEnv("DATABASE_URL", "postgresql://localhost:5432/test")
  vi.stubEnv("AUTH_SECRET", JWT)
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.com")
  vi.stubEnv("NEXT_PUBLIC_FF_PREMIUM_PAYWALL", "true")
  vi.stubEnv("NEXT_PUBLIC_FF_STRIPE_CHECKOUT", "true")
  vi.stubEnv("NEXT_PUBLIC_FF_BILLING_PORTAL", "true")
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_x")
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_x")
  vi.stubEnv("STRIPE_PRICE_ID", "price_x")
  vi.stubEnv("NEXT_PUBLIC_FF_RATE_LIMITING", "true")
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example")
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token")
  vi.stubEnv("NEXT_PUBLIC_FF_DEMO_LOGIN", "false")
  vi.stubEnv("OPENAI_API_KEY", "sk-openai")
  for (const [key, value] of Object.entries(overrides)) {
    vi.stubEnv(key, value)
  }
}

function checkById<T extends { id: string }>(checks: T[], id: string): T {
  const found = checks.find((c) => c.id === id)
  if (!found) throw new Error(`missing check: ${id}`)
  return found
}

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

  it("isProductionDeploy is true when VERCEL_ENV is production", async () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("VERCEL_ENV", "production")
    const { isProductionDeploy } = await import("@/lib/saas/config")
    expect(isProductionDeploy()).toBe(true)
  })

  describe("evaluateSaasReadiness", () => {
    it("reports ok on all required checks when production SaaS env is complete", async () => {
      stubProductionSaasEnv()
      const { evaluateSaasReadiness, saasReadinessSummary } = await import("@/lib/saas/config")
      const checks = evaluateSaasReadiness()
      const summary = saasReadinessSummary(checks)

      expect(summary.ready).toBe(true)
      expect(summary.failures).toBe(0)
      expect(checkById(checks, "database").status).toBe("ok")
      expect(checkById(checks, "auth").status).toBe("ok")
      expect(checkById(checks, "app_url").status).toBe("ok")
      expect(checkById(checks, "stripe").status).toBe("ok")
      expect(checkById(checks, "billing_portal").status).toBe("ok")
      expect(checkById(checks, "rate_limit").status).toBe("ok")
      expect(checkById(checks, "demo_login").status).toBe("ok")
      expect(checkById(checks, "instant_upgrade").status).toBe("ok")
      expect(checkById(checks, "assistant").status).toBe("ok")
    })

    it("fails database when DATABASE_URL is missing or blank", async () => {
      stubProductionSaasEnv({ DATABASE_URL: "   " })
      const { evaluateSaasReadiness, saasReadinessSummary } = await import("@/lib/saas/config")
      const checks = evaluateSaasReadiness()

      expect(checkById(checks, "database").status).toBe("fail")
      expect(saasReadinessSummary(checks).ready).toBe(false)
    })

    it("fails auth when no JWT secret is configured", async () => {
      stubProductionSaasEnv({ AUTH_SECRET: "", AUTH_JWT_SECRET: "", NEXTAUTH_SECRET: "" })
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")
      const checks = evaluateSaasReadiness()

      expect(checkById(checks, "auth").status).toBe("fail")
    })

    it("fails stripe when checkout is enabled without Stripe keys", async () => {
      stubProductionSaasEnv({
        STRIPE_SECRET_KEY: "",
        STRIPE_WEBHOOK_SECRET: "",
        STRIPE_PRICE_ID: "",
      })
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")
      const checks = evaluateSaasReadiness()

      expect(checkById(checks, "stripe").status).toBe("fail")
      expect(checkById(checks, "stripe").detail).toContain("STRIPE_CHECKOUT is on")
    })

    it("warns when Stripe checkout is on but billing portal flag is off", async () => {
      stubProductionSaasEnv({ NEXT_PUBLIC_FF_BILLING_PORTAL: "" })
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")
      const checks = evaluateSaasReadiness()

      expect(checkById(checks, "billing_portal").status).toBe("warn")
      expect(checkById(checks, "billing_portal").detail).toContain("BILLING_PORTAL")
    })

    it("fails production readiness when Stripe uses a test key", async () => {
      stubProductionSaasEnv({ STRIPE_SECRET_KEY: "sk_test_x" })
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")

      const stripe = checkById(evaluateSaasReadiness(), "stripe")
      expect(stripe.status).toBe("fail")
      expect(stripe.detail).toContain("live secret key")
    })

    it("fails production readiness when the public URL is not HTTPS", async () => {
      stubProductionSaasEnv({ NEXT_PUBLIC_APP_URL: "http://app.example.com" })
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")

      expect(checkById(evaluateSaasReadiness(), "app_url").status).toBe("fail")
    })

    it("allows an HTTP loopback URL only for local CI smoke tests", async () => {
      stubProductionSaasEnv({
        CI: "true",
        VERCEL_ENV: "preview",
        NEXT_PUBLIC_APP_URL: "http://127.0.0.1:4000",
      })
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")

      expect(checkById(evaluateSaasReadiness(), "app_url").status).toBe("ok")
    })

    it("does not allow the CI exemption on Vercel production", async () => {
      stubProductionSaasEnv({
        CI: "true",
        VERCEL_ENV: "production",
        NEXT_PUBLIC_APP_URL: "http://127.0.0.1:4000",
      })
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")

      expect(checkById(evaluateSaasReadiness(), "app_url").status).toBe("fail")
    })

    it("warns when Stripe checkout is disabled in development", async () => {
      vi.stubEnv("NODE_ENV", "development")
      vi.stubEnv("DATABASE_URL", "postgresql://localhost/test")
      vi.stubEnv("AUTH_SECRET", JWT)
      vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:4000")
      vi.stubEnv("NEXT_PUBLIC_FF_STRIPE_CHECKOUT", "false")
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")
      const checks = evaluateSaasReadiness()

      expect(checkById(checks, "stripe").status).toBe("warn")
      expect(checkById(checks, "instant_upgrade").status).toBe("warn")
    })

    it("fails rate limiting when enabled without Upstash credentials", async () => {
      stubProductionSaasEnv({
        UPSTASH_REDIS_REST_URL: "",
        UPSTASH_REDIS_REST_TOKEN: "",
      })
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")
      const checks = evaluateSaasReadiness()

      expect(checkById(checks, "rate_limit").status).toBe("fail")
    })

    it("warns on demo login in development when demo flag is on", async () => {
      vi.stubEnv("NODE_ENV", "development")
      vi.stubEnv("DATABASE_URL", "postgresql://localhost/test")
      vi.stubEnv("AUTH_SECRET", JWT)
      vi.stubEnv("NEXT_PUBLIC_FF_DEMO_LOGIN", "true")
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")
      const checks = evaluateSaasReadiness()

      expect(checkById(checks, "demo_login").status).toBe("warn")
    })

    it("warns when assistant has no AI provider key", async () => {
      stubProductionSaasEnv({ OPENAI_API_KEY: "", GEMINI_API_KEY: "" })
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")
      const checks = evaluateSaasReadiness()

      expect(checkById(checks, "assistant").status).toBe("warn")
      expect(checkById(checks, "assistant").detail).toContain("No OPENAI_API_KEY")
    })

    it("uses GEMINI_API_KEY for assistant ok status", async () => {
      stubProductionSaasEnv({ OPENAI_API_KEY: "", GEMINI_API_KEY: "gemini-key" })
      const { evaluateSaasReadiness } = await import("@/lib/saas/config")
      const checks = evaluateSaasReadiness()

      expect(checkById(checks, "assistant").status).toBe("ok")
    })
  })

  describe("saasReadinessSummary", () => {
    it("is not ready when any check fails", async () => {
      const { saasReadinessSummary } = await import("@/lib/saas/config")
      const checks = [
        { id: "a", label: "A", status: "ok" as const, detail: "" },
        { id: "b", label: "B", status: "fail" as const, detail: "" },
      ]

      expect(saasReadinessSummary(checks)).toEqual({
        ready: false,
        failures: 1,
        warnings: 0,
      })
    })

    it("stays ready with warnings only", async () => {
      const { saasReadinessSummary } = await import("@/lib/saas/config")
      const checks = [
        { id: "a", label: "A", status: "ok" as const, detail: "" },
        { id: "b", label: "B", status: "warn" as const, detail: "" },
      ]

      expect(saasReadinessSummary(checks)).toEqual({
        ready: true,
        failures: 0,
        warnings: 1,
      })
    })
  })
})
