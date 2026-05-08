import { isFeatureEnabled } from "@/config/featureFlags"

const DEFAULT_DEMO_EMAIL = "demo@apisandbox.demo"

/**
 * Server-only: demo credentials for POST /api/auth/demo.
 */
export function getDemoUserEmail(): string {
  return (process.env.DEMO_USER_EMAIL || DEFAULT_DEMO_EMAIL).trim().toLowerCase()
}

export function getDemoUserPassword(): string | null {
  const p = process.env.DEMO_USER_PASSWORD
  return p && p.trim().length > 0 ? p : null
}

/** True when the demo login API should accept requests. */
export function isDemoLoginRouteEnabled(): boolean {
  return isFeatureEnabled("DEMO_LOGIN") && Boolean(getDemoUserPassword())
}

/**
 * Client: same email as server (public); used only to show “demo session” banner.
 * Set NEXT_PUBLIC_DEMO_USER_EMAIL to match DEMO_USER_EMAIL in each environment.
 */
export function getPublicDemoUserEmail(): string {
  return (process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || DEFAULT_DEMO_EMAIL).trim().toLowerCase()
}

export function isDemoSessionEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return email.trim().toLowerCase() === getPublicDemoUserEmail()
}
