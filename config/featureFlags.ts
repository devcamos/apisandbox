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

const flags: Record<FeatureFlag, FlagConfig> = {
  PREMIUM_PAYWALL: {
    enabled: envFlagEnabled(FEATURE_FLAG_ENV_KEYS.PREMIUM_PAYWALL),
    description:
      "Require sign-in and active subscription for premium phases (2–6). When off, all content is accessible without auth.",
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
      "Show Try demo entry points and POST /api/auth/demo. Server needs DEMO_USER_EMAIL + DEMO_USER_PASSWORD and a PREMIUM demo user (scripts/ensure-demo-user.js). Banner email comes from DEMO_USER_EMAIL.",
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
