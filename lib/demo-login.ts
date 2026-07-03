import { isDemoLoginAllowedInCurrentEnvironment } from "@/lib/saas/config"

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
  return (
    isDemoLoginAllowedInCurrentEnvironment() && Boolean(getDemoUserPassword())
  )
}

/**
 * Legacy / optional: only used when `isDemoSessionEmail` is called without a canonical email.
 * Prefer passing `getDemoUserEmail()` from the server (e.g. root layout → `DemoSessionBanner`)
 * so the banner always matches `DEMO_USER_EMAIL` without a second public env var.
 */
export function getPublicDemoUserEmail(): string {
  return (process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || DEFAULT_DEMO_EMAIL).trim().toLowerCase()
}

/** Normalize for comparison (login and DB store lowercased emails). */
export function normalizeDemoEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * @param canonicalDemoEmail — from server `getDemoUserEmail()` when available; otherwise falls back to `getPublicDemoUserEmail()`.
 */
export function isDemoSessionEmail(
  email: string | undefined | null,
  canonicalDemoEmail?: string,
): boolean {
  if (!email) return false
  const expected = normalizeDemoEmail(canonicalDemoEmail ?? getPublicDemoUserEmail())
  return normalizeDemoEmail(email) === expected
}
