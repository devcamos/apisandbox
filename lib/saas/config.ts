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

function databaseCheck(): SaasReadinessCheck {
  const configured = envSet("DATABASE_URL")
  return {
    id: "database",
    label: "Database",
    status: configured ? "ok" : "fail",
    detail: configured ? "DATABASE_URL is set" : "DATABASE_URL is required",
  }
}

function authCheck(): SaasReadinessCheck {
  const jwtOk = isJwtSecretConfigured()
  return {
    id: "auth",
    label: "Auth / JWT secret",
    status: jwtOk ? "ok" : "fail",
    detail: jwtOk
      ? `JWT signing uses ${jwtSecretSource() ?? "env"}`
      : "Set AUTH_JWT_SECRET or AUTH_SECRET (32+ chars) on Preview and Production",
  }
}

function appUrlCheck(): SaasReadinessCheck {
  const configured = envSet("NEXT_PUBLIC_APP_URL")
  return {
    id: "app_url",
    label: "Public app URL",
    status: configured ? "ok" : "fail",
    detail: configured
      ? `NEXT_PUBLIC_APP_URL=${process.env.NEXT_PUBLIC_APP_URL}`
      : "NEXT_PUBLIC_APP_URL required for checkout redirects",
  }
}

function stripeCheck(): SaasReadinessCheck {
  const stripeCheckout = isFeatureEnabled("STRIPE_CHECKOUT")
  const stripeConfigured =
    envSet("STRIPE_SECRET_KEY") && envSet("STRIPE_WEBHOOK_SECRET") && envSet("STRIPE_PRICE_ID")

  if (!stripeCheckout) {
    return {
      id: "stripe",
      label: "Stripe billing",
      status: "warn",
      detail: "Stripe checkout disabled (demo instant-upgrade allowed in non-prod)",
    }
  }

  if (stripeConfigured) {
    return {
      id: "stripe",
      label: "Stripe billing",
      status: "ok",
      detail: "Stripe checkout enabled and keys configured",
    }
  }

  return {
    id: "stripe",
    label: "Stripe billing",
    status: "fail",
    detail:
      "STRIPE_CHECKOUT is on but STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, or STRIPE_PRICE_ID missing",
  }
}

function paywallCheck(): SaasReadinessCheck {
  const enabled = isFeatureEnabled("PREMIUM_PAYWALL")
  return {
    id: "paywall",
    label: "Premium paywall",
    status: enabled ? "ok" : "warn",
    detail: enabled
      ? "PREMIUM_PAYWALL enabled"
      : "All content unlocked without subscription (not recommended for SaaS prod)",
  }
}

function rateLimitCheck(): SaasReadinessCheck {
  const rateLimiting = isFeatureEnabled("RATE_LIMITING")
  const redisConfigured =
    envSet("UPSTASH_REDIS_REST_URL") && envSet("UPSTASH_REDIS_REST_TOKEN")

  if (!rateLimiting) {
    return {
      id: "rate_limit",
      label: "Rate limiting",
      status: "warn",
      detail: "Rate limiting disabled",
    }
  }

  if (redisConfigured) {
    return {
      id: "rate_limit",
      label: "Rate limiting",
      status: "ok",
      detail: "Rate limiting enabled with Upstash Redis",
    }
  }

  return {
    id: "rate_limit",
    label: "Rate limiting",
    status: "fail",
    detail: "RATE_LIMITING on but Upstash env vars missing",
  }
}

function demoLoginCheck(): SaasReadinessCheck {
  const enabled = isDemoLoginAllowedInCurrentEnvironment()
  return {
    id: "demo_login",
    label: "Demo login",
    status: enabled ? "warn" : "ok",
    detail: enabled
      ? "Demo login is enabled (disable for public SaaS prod)"
      : "Demo login disabled or blocked in production",
  }
}

function instantUpgradeCheck(): SaasReadinessCheck {
  const allowed = isInstantPremiumUpgradeAllowed()
  return {
    id: "instant_upgrade",
    label: "Instant premium upgrade API",
    status: allowed ? "warn" : "ok",
    detail: allowed
      ? "POST /api/subscription/upgrade grants premium without payment (dev only)"
      : "Instant upgrade blocked — use Stripe checkout + webhooks",
  }
}

function assistantCheck(): SaasReadinessCheck {
  const aiKey = envSet("OPENAI_API_KEY") || envSet("GEMINI_API_KEY")
  return {
    id: "assistant",
    label: "Learning assistant",
    status: aiKey ? "ok" : "warn",
    detail: aiKey
      ? `Assistant provider configured; auth required in prod: ${isAssistantAuthRequired()}`
      : "No OPENAI_API_KEY or GEMINI_API_KEY — assistant will error",
  }
}

export function evaluateSaasReadiness(): SaasReadinessCheck[] {
  return [
    databaseCheck(),
    authCheck(),
    appUrlCheck(),
    stripeCheck(),
    paywallCheck(),
    rateLimitCheck(),
    demoLoginCheck(),
    instantUpgradeCheck(),
    assistantCheck(),
  ]
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
