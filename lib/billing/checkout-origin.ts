import { createHash } from "node:crypto"

interface BillingEnvironment {
  VERCEL_ENV?: string
  VERCEL_BRANCH_URL?: string
  VERCEL_URL?: string
  NEXT_PUBLIC_APP_URL?: string
  NODE_ENV?: string
  CI?: string
}

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"])

function previewOrigin(host: string | undefined): string | null {
  const value = host?.trim()
  if (!value || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.vercel\.app$/i.test(value)) return null
  return `https://${value.toLowerCase()}`
}

/** A request origin may select only an exact match from server-configured Preview origins. */
export function resolveBillingOrigin(env: BillingEnvironment = process.env, requestedOrigin?: string): string {
  if (env.VERCEL_ENV === "preview") {
    const branchOrigin = previewOrigin(env.VERCEL_BRANCH_URL)
    const deploymentOrigin = previewOrigin(env.VERCEL_URL)
    const preferredOrigin = branchOrigin ?? deploymentOrigin
    if (!preferredOrigin) throw new Error("Preview billing requires a valid Vercel deployment URL")
    if (requestedOrigin === branchOrigin || requestedOrigin === deploymentOrigin) {
      return requestedOrigin
    }
    return preferredOrigin
  }

  const configured = env.NEXT_PUBLIC_APP_URL?.trim()
  if (!configured) throw new Error("Application URL is not configured")
  let url: URL
  try {
    url = new URL(configured)
  } catch {
    throw new Error("Application URL is invalid")
  }
  const isLoopback = LOOPBACK_HOSTS.has(url.hostname)
  const isProduction = env.VERCEL_ENV
    ? env.VERCEL_ENV === "production"
    : env.NODE_ENV === "production"
  const allowHttp = !isProduction || (isLoopback && env.CI === "true" && env.VERCEL_ENV !== "production")
  if (
    url.username || url.password || url.pathname !== "/" || url.search || url.hash ||
    (url.protocol !== "https:" && !(url.protocol === "http:" && allowHttp)) ||
    (isProduction && isLoopback && !allowHttp)
  ) {
    throw new Error("Application URL must be a trusted HTTP(S) origin")
  }
  return url.origin
}

/** A shared Stripe test account must not reuse another branch's redirect session. */
export function checkoutIdempotencyKey(userId: string, priceId: string, origin: string, now = Date.now()): string {
  const originKey = createHash("sha256").update(origin).digest("hex").slice(0, 16)
  return `checkout:${userId}:${priceId}:${originKey}:${Math.floor(now / 300_000)}`
}
