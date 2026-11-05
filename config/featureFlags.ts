export type FeatureFlag =
  | "PREMIUM_PAYWALL"
  | "STRIPE_CHECKOUT"
  | "BILLING_PORTAL"
  | "EMAIL_VERIFICATION"
  | "RATE_LIMITING"
  | "ANALYTICS"
  | "DEMO_LOGIN"

export interface FlagConfig {
  enabled: boolean
  description: string
}

/** Env var name for each flag (for docs, Vercel setup, and tests). */
export const FEATURE_FLAG_ENV_KEYS: Record<FeatureFlag, string> = {
  PREMIUM_PAYWALL: "NEXT_PUBLIC_FF_PREMIUM_PAYWALL",
  STRIPE_CHECKOUT: "NEXT_PUBLIC_FF_STRIPE_CHECKOUT",
  BILLING_PORTAL: "NEXT_PUBLIC_FF_BILLING_PORTAL",
  EMAIL_VERIFICATION: "NEXT_PUBLIC_FF_EMAIL_VERIFICATION",
  RATE_LIMITING: "NEXT_PUBLIC_FF_RATE_LIMITING",
  ANALYTICS: "NEXT_PUBLIC_FF_ANALYTICS",
  DEMO_LOGIN: "NEXT_PUBLIC_FF_DEMO_LOGIN",
}

function envFlagEnabled(envKey: string): boolean {
  return process.env[envKey] === "true"
}

/**
 * True on the Vercel Production target. `NEXT_PUBLIC_VERCEL_ENV` is exposed to the
 * browser bundle by Vercel; `VERCEL_ENV` covers server-only code paths.
 */
export function isVercelProductionTarget(): boolean {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
  )
}

/**
 * The premium paywall is always enforced on Vercel Production, even if
 * `NEXT_PUBLIC_FF_PREMIUM_PAYWALL` is missing or false (see docs/FEATURE_FLAGS.md).
 */
function premiumPaywallEnabled(): boolean {
  return envFlagEnabled(FEATURE_FLAG_ENV_KEYS.PREMIUM_PAYWALL) || isVercelProductionTarget()
}

const flags: Record<FeatureFlag, FlagConfig> = {
  PREMIUM_PAYWALL: {
    enabled: premiumPaywallEnabled(),
    description:
      "Require sign-in and active subscription for premium phases (2–9, Cloud, AI). Always on in Vercel Production; when off elsewhere, all content is accessible without auth.",
  },
  STRIPE_CHECKOUT: {
    enabled: envFlagEnabled(FEATURE_FLAG_ENV_KEYS.STRIPE_CHECKOUT),
    description:
      "Enable real Stripe Checkout flow. When off, the upgrade endpoint grants premium instantly (demo mode).",
  },
  BILLING_PORTAL: {
    enabled: envFlagEnabled(FEATURE_FLAG_ENV_KEYS.BILLING_PORTAL),
    description:
      "Stripe Customer Portal (manage/cancel subscription). Requires STRIPE_CHECKOUT, Stripe keys, and portal enabled in Stripe Dashboard.",
  },
  EMAIL_VERIFICATION: {
    enabled: envFlagEnabled(FEATURE_FLAG_ENV_KEYS.EMAIL_VERIFICATION),
    description:
      "Require email verification after signup before granting full access.",
  },
  RATE_LIMITING: {
    enabled: envFlagEnabled(FEATURE_FLAG_ENV_KEYS.RATE_LIMITING),
    description:
      "Enable Upstash Redis rate limiting on API routes and middleware.",
  },
  ANALYTICS: {
    enabled: envFlagEnabled(FEATURE_FLAG_ENV_KEYS.ANALYTICS),
    description: "Enable Vercel Analytics and event tracking.",
  },
  DEMO_LOGIN: {
    enabled: envFlagEnabled(FEATURE_FLAG_ENV_KEYS.DEMO_LOGIN),
    description:
      "Show Enter Demo Account entry points and POST /api/auth/demo. Creates an ephemeral FREE user with Phase 1 access only (no shared password seed). Rate-limited; expired demos are cleaned up on login.",
  },
}

export function featureFlagEnvKey(flag: FeatureFlag): string {
  return FEATURE_FLAG_ENV_KEYS[flag]
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return flags[flag]?.enabled ?? false
}

/** Billing portal requires checkout + portal flag (see docs/FEATURE_FLAGS.md). */
export function isBillingPortalEnabled(): boolean {
  return isFeatureEnabled("STRIPE_CHECKOUT") && isFeatureEnabled("BILLING_PORTAL")
}

export function getAllFlags(): Record<FeatureFlag, FlagConfig> {
  return flags
}

/**
 * Backwards-compatible export.
 * Existing code imports `signupRequiredForPremium` — this maps to the new flag.
 */
export const signupRequiredForPremium = isFeatureEnabled("PREMIUM_PAYWALL")
