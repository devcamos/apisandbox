const MAX_RELATIVE_PATH_LEN = 512
const MAX_ABSOLUTE_URL_LEN = 4096

/**
 * Same-origin relative path only (e.g. post-login / post-logout callback).
 * Blocks protocol-relative and absolute URLs that enable open redirects.
 */
export function isSafeRelativeCallbackPath(pathname: string): boolean {
  if (pathname.length === 0 || pathname.length > MAX_RELATIVE_PATH_LEN) return false
  if (!pathname.startsWith("/")) return false
  if (pathname.startsWith("//") || pathname.includes("://") || pathname.includes("\\")) return false
  return true
}

export function getSafeClientRelativeRedirect(url: string | undefined, fallback = "/"): string {
  const candidate = (url ?? "").trim()
  if (isSafeRelativeCallbackPath(candidate)) return candidate
  return fallback
}

/**
 * Stripe Checkout session URLs are HTTPS and hosted under stripe.com.
 */
export function isAllowedStripeCheckoutRedirectUrl(url: string): boolean {
  const trimmed = url?.trim() ?? ""
  if (!trimmed || trimmed.length > MAX_ABSOLUTE_URL_LEN) return false
  try {
    const u = new URL(trimmed)
    if (u.protocol !== "https:") return false
    const host = u.hostname.toLowerCase()
    return host === "checkout.stripe.com"
  } catch {
    return false
  }
}

/** Stripe-hosted Customer Portal session URLs use the billing.stripe.com host. */
export function isAllowedStripeBillingPortalRedirectUrl(url: string): boolean {
  const trimmed = url?.trim() ?? ""
  if (!trimmed || trimmed.length > MAX_ABSOLUTE_URL_LEN) return false
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === "https:" && parsed.hostname.toLowerCase() === "billing.stripe.com"
  } catch {
    return false
  }
}
