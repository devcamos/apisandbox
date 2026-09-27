import { isDemoLoginAllowedInCurrentEnvironment } from "@/lib/saas/config"

/** Reserved host for shared/legacy and ephemeral demo accounts. */
export const DEMO_EMAIL_HOST = "apisandbox.demo"

const DEFAULT_DEMO_EMAIL = `demo@${DEMO_EMAIL_HOST}`

/** Ephemeral demo emails: demo.<id>@apisandbox.demo */
const EPHEMERAL_DEMO_EMAIL_RE = new RegExp(
  `^demo\\.[a-z0-9_-]+@${DEMO_EMAIL_HOST.replace(".", "\\.")}$`,
  "i",
)

/**
 * Server-only: legacy shared demo email (kept for env/docs compatibility).
 * New demo sessions use ephemeral addresses under {@link DEMO_EMAIL_HOST}.
 */
export function getDemoUserEmail(): string {
  return (process.env.DEMO_USER_EMAIL || DEFAULT_DEMO_EMAIL).trim().toLowerCase()
}

/**
 * @deprecated Password-backed shared demo login is no longer used.
 * Kept so existing env files do not break; {@link isDemoLoginRouteEnabled} ignores it.
 */
export function getDemoUserPassword(): string | null {
  const p = process.env.DEMO_USER_PASSWORD
  return p && p.trim().length > 0 ? p : null
}

/** True when the demo login API should accept requests. */
export function isDemoLoginRouteEnabled(): boolean {
  return isDemoLoginAllowedInCurrentEnvironment()
}

/**
 * Legacy / optional public email for client-side comparisons when the server
 * does not pass a canonical value. Prefer {@link isDemoUserEmail}.
 */
export function getPublicDemoUserEmail(): string {
  return (process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || DEFAULT_DEMO_EMAIL).trim().toLowerCase()
}

/** Normalize for comparison (login and DB store lowercased emails). */
export function normalizeDemoEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Hours before ephemeral demo users are eligible for cleanup (default 24). */
export function getDemoUserTtlHours(): number {
  const raw = process.env.DEMO_USER_TTL_HOURS
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN
  if (Number.isFinite(parsed) && parsed > 0 && parsed <= 24 * 30) {
    return parsed
  }
  return 24
}

/**
 * True for ephemeral demo visitors (`demo.<id>@apisandbox.demo`) and the
 * optional legacy shared demo email from env.
 */
export function isDemoUserEmail(email: string | undefined | null): boolean {
  if (!email) return false
  const normalized = normalizeDemoEmail(email)
  if (EPHEMERAL_DEMO_EMAIL_RE.test(normalized)) return true
  if (normalized === normalizeDemoEmail(getDemoUserEmail())) return true
  if (normalized === normalizeDemoEmail(getPublicDemoUserEmail())) return true
  return false
}

/**
 * @deprecated Prefer {@link isDemoUserEmail}. Retained for call sites that pass
 * an optional canonical shared-demo email from the server.
 */
export function isDemoSessionEmail(
  email: string | undefined | null,
  canonicalDemoEmail?: string,
): boolean {
  if (!email) return false
  if (canonicalDemoEmail) {
    return normalizeDemoEmail(email) === normalizeDemoEmail(canonicalDemoEmail)
  }
  return isDemoUserEmail(email)
}

export function buildEphemeralDemoEmail(uniqueId: string): string {
  const safe = uniqueId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")
  if (!safe) {
    throw new Error("Ephemeral demo email id must be non-empty")
  }
  return `demo.${safe}@${DEMO_EMAIL_HOST}`
}
