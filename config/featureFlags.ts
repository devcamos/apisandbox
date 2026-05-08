type FeatureFlag =
  | "PREMIUM_PAYWALL"
  | "STRIPE_CHECKOUT"
  | "EMAIL_VERIFICATION"
  | "RATE_LIMITING"
  | "ANALYTICS"
  | "DEMO_LOGIN"

interface FlagConfig {
  enabled: boolean
  description: string
}

const flags: Record<FeatureFlag, FlagConfig> = {
  PREMIUM_PAYWALL: {
    enabled: process.env.NEXT_PUBLIC_FF_PREMIUM_PAYWALL === "true",
    description:
      "Require sign-in and active subscription for premium phases (2–6). When off, all content is accessible without auth.",
  },
  STRIPE_CHECKOUT: {
    enabled: process.env.NEXT_PUBLIC_FF_STRIPE_CHECKOUT === "true",
    description:
      "Enable real Stripe Checkout flow. When off, the upgrade endpoint grants premium instantly (demo mode).",
  },
  EMAIL_VERIFICATION: {
    enabled: process.env.NEXT_PUBLIC_FF_EMAIL_VERIFICATION === "true",
    description:
      "Require email verification after signup before granting full access.",
  },
  RATE_LIMITING: {
    enabled: process.env.NEXT_PUBLIC_FF_RATE_LIMITING === "true",
    description:
      "Enable Upstash Redis rate limiting on API routes and middleware.",
  },
  ANALYTICS: {
    enabled: process.env.NEXT_PUBLIC_FF_ANALYTICS === "true",
    description: "Enable Vercel Analytics and event tracking.",
  },
  DEMO_LOGIN: {
    enabled: process.env.NEXT_PUBLIC_FF_DEMO_LOGIN === "true",
    description:
      "Show Try demo entry points and POST /api/auth/demo. Server needs DEMO_USER_EMAIL + DEMO_USER_PASSWORD and a PREMIUM demo user (scripts/ensure-demo-user.js).",
  },
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return flags[flag]?.enabled ?? false
}

export function getAllFlags(): Record<FeatureFlag, FlagConfig> {
  return flags
}

/**
 * Backwards-compatible export.
 * Existing code imports `signupRequiredForPremium` — this maps to the new flag.
 */
export const signupRequiredForPremium = isFeatureEnabled("PREMIUM_PAYWALL")
