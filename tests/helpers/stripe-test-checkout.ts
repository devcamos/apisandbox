const stripeCheckoutOrigin = "https://checkout.stripe.com"
const testSessionId = /^cs_test_[A-Za-z0-9_]+$/
const checkoutSessionSegment = /^cs_(?:test|live)_[A-Za-z0-9_]+$/

export interface StripeTestCheckout {
  sessionId: string
  url: URL
}

function isStripeCheckout(url: URL) {
  return url.origin === stripeCheckoutOrigin && !url.username && !url.password
}

function sessionSegments(url: URL) {
  return url.pathname.split("/").filter((segment) => checkoutSessionSegment.test(segment))
}

export function readStripeTestCheckout(body: unknown): StripeTestCheckout {
  const error = "Refusing card entry: the checkout response must identify a Stripe TEST session"
  if (!body || typeof body !== "object") throw new Error(error)

  const { sessionId, livemode, url } = body as { sessionId?: unknown; livemode?: unknown; url?: unknown }
  if (livemode !== false || typeof sessionId !== "string" || !testSessionId.test(sessionId) || typeof url !== "string") {
    throw new Error(error)
  }

  const issuedUrl = URL.canParse(url) ? new URL(url) : null
  if (!issuedUrl || !isStripeCheckout(issuedUrl) || sessionSegments(issuedUrl).some((id) => id !== sessionId)) {
    throw new Error(error)
  }

  return { sessionId, url: issuedUrl }
}

export function isSameStripeTestCheckout(url: URL, checkout: StripeTestCheckout) {
  if (!isStripeCheckout(url)) return false
  const ids = sessionSegments(url)
  return ids.length ? ids.every((id) => id === checkout.sessionId) : url.href === checkout.url.href
}
