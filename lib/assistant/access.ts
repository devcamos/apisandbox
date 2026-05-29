import type { AuthSubscriptionTier } from "@/lib/auth/types"

type SessionStatus = "loading" | "authenticated" | "unauthenticated"

const AUTH_MARKETING_PATHS = ["/login", "/signup", "/forgot-password"] as const

export function isAuthMarketingPath(pathname: string) {
  return AUTH_MARKETING_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

/** Learning Assistant requires a signed-in Premium user (not on public auth pages). */
export function canAccessLearningAssistant({
  status,
  subscriptionTier,
  pathname,
}: {
  status: SessionStatus
  subscriptionTier?: AuthSubscriptionTier
  pathname: string
}) {
  if (status !== "authenticated") return false
  if (subscriptionTier !== "PREMIUM") return false
  if (isAuthMarketingPath(pathname)) return false
  return true
}
