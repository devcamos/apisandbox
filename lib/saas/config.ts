import { isFeatureEnabled } from "@/config/featureFlags"
import { isJwtSecretConfigured, jwtSecretSource } from "@/lib/auth/jwt-secret"

export type SaasCheckStatus = "ok" | "warn" | "fail"

export interface SaasReadinessCheck {
  id: string
  label: string
  status: SaasCheckStatus
  detail: string
}

function envSet(key: string): boolean {
  const v = process.env[key]
  return typeof v === "string" && v.trim().length > 0
}

/** True when running a production Node deployment (Vercel prod). */
export function isProductionDeploy(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production"
}

/** Instant POST /api/subscription/upgrade — dev/demo only, never when Stripe checkout is live. */
export function isInstantPremiumUpgradeAllowed(): boolean {
  if (isFeatureEnabled("STRIPE_CHECKOUT")) return false
  if (isProductionDeploy()) return false
  return true
}

/** Demo login must stay off in production unless explicitly overridden. */
export function isDemoLoginAllowedInCurrentEnvironment(): boolean {
  if (!isFeatureEnabled("DEMO_LOGIN")) return false
  if (!isProductionDeploy()) return true
  return process.env.ALLOW_DEMO_LOGIN_IN_PRODUCTION === "true"
}

export function isAssistantAuthRequired(): boolean {
  return isProductionDeploy() || process.env.ASSISTANT_REQUIRE_AUTH === "true"
}

export function evaluateSaasReadiness(): SaasReadinessCheck[] {
  const checks: SaasReadinessCheck[] = []

  checks.push({
    id: "database",
    label: "Database",
    status: envSet("DATABASE_URL") ? "ok" : "fail",
    detail: envSet("DATABASE_URL") ? "DATABASE_URL is set" : "DATABASE_URL is required",
  })

  const jwtOk = isJwtSecretConfigured()
  checks.push({
    id: "auth",
    label: "Auth / JWT secret",
    status: jwtOk ? "ok" : "fail",
    detail: jwtOk
      ? `JWT signing uses ${jwtSecretSource() ?? "env"}`
      : "Set AUTH_JWT_SECRET or AUTH_SECRET (32+ chars) on Preview and Production",
  })

  checks.push({
    id: "app_url",
    label: "Public app URL",
    status: envSet("NEXT_PUBLIC_APP_URL") ? "ok" : "fail",
    detail: envSet("NEXT_PUBLIC_APP_URL")
      ? `NEXT_PUBLIC_APP_URL=${process.env.NEXT_PUBLIC_APP_URL}`
      : "NEXT_PUBLIC_APP_URL required for checkout redirects",
  })

  const stripeCheckout = isFeatureEnabled("STRIPE_CHECKOUT")
  const stripeConfigured =
    envSet("STRIPE_SECRET_KEY") && envSet("STRIPE_WEBHOOK_SECRET") && envSet("STRIPE_PRICE_ID")

  checks.push({
    id: "stripe",
    label: "Stripe billing",
    status: stripeCheckout ? (stripeConfigured ? "ok" : "fail") : "warn",
    detail: stripeCheckout
      ? stripeConfigured
        ? "Stripe checkout enabled and keys configured"
        : "STRIPE_CHECKOUT is on but STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, or STRIPE_PRICE_ID missing"
      : "Stripe checkout disabled (demo instant-upgrade allowed in non-prod)",
  })

  checks.push({
    id: "paywall",
    label: "Premium paywall",
    status: isFeatureEnabled("PREMIUM_PAYWALL") ? "ok" : "warn",
    detail: isFeatureEnabled("PREMIUM_PAYWALL")
      ? "PREMIUM_PAYWALL enabled"
      : "All content unlocked without subscription (not recommended for SaaS prod)",
  })

  const rateLimiting = isFeatureEnabled("RATE_LIMITING")
  const redisConfigured =
    envSet("UPSTASH_REDIS_REST_URL") && envSet("UPSTASH_REDIS_REST_TOKEN")

  checks.push({
    id: "rate_limit",
    label: "Rate limiting",
    status: rateLimiting ? (redisConfigured ? "ok" : "fail") : "warn",
    detail: rateLimiting
      ? redisConfigured
        ? "Rate limiting enabled with Upstash Redis"
        : "RATE_LIMITING on but Upstash env vars missing"
      : "Rate limiting disabled",
  })

  checks.push({
    id: "demo_login",
    label: "Demo login",
    status: isDemoLoginAllowedInCurrentEnvironment() ? "warn" : "ok",
    detail: isDemoLoginAllowedInCurrentEnvironment()
      ? "Demo login is enabled (disable for public SaaS prod)"
      : "Demo login disabled or blocked in production",
  })

  checks.push({
    id: "instant_upgrade",
    label: "Instant premium upgrade API",
    status: isInstantPremiumUpgradeAllowed() ? "warn" : "ok",
    detail: isInstantPremiumUpgradeAllowed()
      ? "POST /api/subscription/upgrade grants premium without payment (dev only)"
      : "Instant upgrade blocked — use Stripe checkout + webhooks",
  })

  const aiKey = envSet("OPENAI_API_KEY") || envSet("GEMINI_API_KEY")
  checks.push({
    id: "assistant",
    label: "Learning assistant",
    status: aiKey ? "ok" : "warn",
    detail: aiKey
      ? `Assistant provider configured; auth required in prod: ${isAssistantAuthRequired()}`
      : "No OPENAI_API_KEY or GEMINI_API_KEY — assistant will error",
  })

  return checks
}

export function saasReadinessSummary(checks: SaasReadinessCheck[]): {
  ready: boolean
  failures: number
  warnings: number
} {
  const failures = checks.filter((c) => c.status === "fail").length
  const warnings = checks.filter((c) => c.status === "warn").length
  return { ready: failures === 0, failures, warnings }
}
