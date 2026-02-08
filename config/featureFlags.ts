/**
 * Client-side feature flags (NEXT_PUBLIC_* only).
 * When app is live, set NEXT_PUBLIC_SIGNUP_REQUIRED=true to require sign-in for premium.
 */

/** When false/unset: premium content is unlocked so navigation works without sign-in (staging/preview). When true: premium requires sign-up/sign-in (live). */
export const signupRequiredForPremium =
  process.env.NEXT_PUBLIC_SIGNUP_REQUIRED === "true"
