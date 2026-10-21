import { randomUUID } from "node:crypto"
import { expect, test } from "@playwright/test"
import Stripe from "stripe"
import { injectAuthToken } from "./helpers/premium-helpers"

// This suite exercises real Preview endpoints and real Stripe TEST sessions.
// It never submits card details or completes a payment. The completion event
// below is signed test evidence, not evidence of a paid Stripe transaction.
// Auth responses and webhook signatures must not enter retained artifacts.
test.use({ trace: "off", screenshot: "off", video: "off" })
test.describe.configure({ retries: 0 })

function previewBillingConfig(baseURL: string | undefined) {
  if (process.env.DEPLOYMENT_ENVIRONMENT !== "preview") {
    throw new Error("Preview billing E2E requires DEPLOYMENT_ENVIRONMENT=preview")
  }
  const target = new URL(baseURL ?? "")
  if (
    target.protocol !== "https:" ||
    !target.hostname.endsWith(".vercel.app") ||
    target.hostname === "apisandbox-coral.vercel.app" ||
    target.username || target.password || target.pathname !== "/" || target.search || target.hash
  ) {
    throw new Error("Preview billing E2E requires an HTTPS Vercel Preview origin")
  }
  const secretKey = process.env.PREVIEW_STRIPE_TEST_SECRET_KEY?.trim()
  const webhookSecret = process.env.PREVIEW_STRIPE_TEST_WEBHOOK_SECRET?.trim()
  if (!secretKey?.startsWith("sk_test_") || !webhookSecret?.startsWith("whsec_")) {
    throw new Error("Preview billing E2E requires its dedicated Stripe TEST and webhook CI secrets")
  }
  return { origin: target.origin, secretKey, webhookSecret }
}

// Stripe SDK calls run in Node, outside browser/request tracing. Replace SDK
// exceptions with operation-only messages rather than serializing API details.
async function stripeOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch {
    throw new Error(`Stripe TEST ${name} failed`)
  }
}

test("Preview checkout creates a real test session and signed webhook grants PREMIUM", async ({
  page,
  request,
  baseURL,
}) => {
  test.setTimeout(120_000)
  const { origin, secretKey, webhookSecret } = previewBillingConfig(baseURL)
  const stripe = new Stripe(secretKey, { maxNetworkRetries: 1, timeout: 20_000 })
  const readiness = await request.get("/api/health/saas")
  expect(readiness.status(), "Preview SaaS readiness must pass before billing writes").toBe(200)
  expect((await readiness.json())?.data?.environment, "The deployed app must identify as Preview").toBe("preview")
  const registration = await request.post("/api/auth/register", {
    data: {
      email: `preview-billing-${randomUUID()}@example.com`,
      password: `Preview-${randomUUID()}aA1!`,
      firstName: "Preview",
      lastName: "Billing E2E",
    },
  })
  expect(registration.status(), "Preview registration must succeed").toBe(201)
  const registrationBody = await registration.json()
  const token = registrationBody?.data?.token
  const userId = registrationBody?.data?.user?.id
  expect(typeof token, "Registration must issue an auth token").toBe("string")
  expect(typeof userId, "Registration must identify the new user").toBe("string")
  expect(registrationBody?.data?.user?.subscriptionTier).toBe("FREE")

  const subscriptionId = `sub_preview_e2e_${randomUUID().replaceAll("-", "")}`
  let webhookAttempted = false
  const postSignedEvent = async (type: string, object: Record<string, unknown>, eventId?: string) => {
    const payload = JSON.stringify({
      id: eventId ?? `evt_preview_e2e_${randomUUID().replaceAll("-", "")}`,
      object: "event",
      type,
      livemode: false,
      created: Math.floor(Date.now() / 1000),
      data: { object },
    })
    const signature = stripe.webhooks.generateTestHeaderString({ payload, secret: webhookSecret })
    return request.post("/api/webhooks/stripe", {
      headers: { "content-type": "application/json", "stripe-signature": signature },
      data: payload,
    })
  }
  let session: Stripe.Checkout.Session | undefined
  try {
    await injectAuthToken(page, token, origin)
    // Deployment bypass headers belong to Vercel only. The browser genuinely
    // visits Stripe; forward external requests without our deployment credential.
    await page.route("**/*", async (route) => {
      if (new URL(route.request().url()).origin === origin) {
        await route.continue()
        return
      }
      const headers = await route.request().allHeaders()
      delete headers["x-vercel-protection-bypass"]
      delete headers["x-vercel-set-bypass-cookie"]
      await route.continue({ headers })
    })
    const checkoutResponsePromise = page.waitForResponse((response) =>
      response.url() === `${origin}/api/checkout` && response.request().method() === "POST",
    )
    await page.goto("/upgrade?checkout=1", { waitUntil: "domcontentloaded" })
    const checkoutResponse = await checkoutResponsePromise
    // A disabled flag/missing billing configuration returns 503 and fails here.
    expect(checkoutResponse.status(), "Real Preview checkout must be enabled and configured").toBe(200)
    await page.waitForURL((url) => url.origin === "https://checkout.stripe.com", { timeout: 30_000 })
    const checkoutUrl = new URL(page.url())
    expect(checkoutUrl.origin).toBe("https://checkout.stripe.com")
    const sessionId = /^\/c\/pay\/(cs_test_[A-Za-z0-9_]+)/.exec(checkoutUrl.pathname)?.[1]
    expect(typeof sessionId, "Checkout must return a Stripe TEST session URL").toBe("string")
    session = await stripeOperation("retrieve Checkout session", () =>
      stripe.checkout.sessions.retrieve(sessionId!, { expand: ["line_items.data.price"] }),
    )
    expect(session.livemode, "Live Stripe sessions are forbidden").toBe(false)
    expect(session.mode).toBe("subscription")
    expect(session.status).toBe("open")
    expect(session.client_reference_id).toBe(userId)
    expect(session.metadata?.userId).toBe(userId)
    const checkoutCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id
    expect(typeof checkoutCustomerId, "Checkout must reference a Stripe customer").toBe("string")
    const checkoutCustomer = await stripeOperation("retrieve Checkout customer", () =>
      stripe.customers.retrieve(checkoutCustomerId!),
    )
    expect(checkoutCustomer.deleted, "Checkout customer must be active").not.toBe(true)
    if (checkoutCustomer.deleted) throw new Error("Checkout customer was deleted")
    expect(checkoutCustomer.livemode).toBe(false)
    expect(checkoutCustomer.metadata.userId).toBe(userId)
    expect(session.success_url).toBe(`${origin}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`)
    expect(session.cancel_url).toBe(`${origin}/upgrade`)
    const price = session.line_items?.data[0]?.price
    expect(price?.livemode, "Checkout Price must also be test mode").toBe(false)
    expect(price?.recurring?.interval).toBe("month")
    await page.waitForURL((url) => url.origin === "https://checkout.stripe.com", { timeout: 30_000 })

    const before = await request.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
    expect(before.status()).toBe(200)
    expect((await before.json())?.data?.user?.subscriptionTier).toBe("FREE")

    // Do not pretend a payment happened in Stripe. Exercise the deployed
    // signature/dispatch/provisioning boundary with a clearly synthetic event.
    const eventId = `evt_preview_e2e_${randomUUID().replaceAll("-", "")}`
    const completedSession = {
      id: session.id,
      object: "checkout.session",
      livemode: false,
      mode: "subscription",
      payment_status: "paid",
      client_reference_id: userId,
      metadata: { userId },
      customer: session.customer,
      subscription: subscriptionId,
    }
    webhookAttempted = true
    const delivered = await postSignedEvent("checkout.session.completed", completedSession, eventId)
    expect(delivered.status(), "Preview must accept the signed TEST event").toBe(200)
    expect((await delivered.json()).received).toBe(true)
    await expect.poll(async () => {
      const me = await request.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      return me.ok() ? (await me.json())?.data?.user?.subscriptionTier : "unavailable"
    }, { timeout: 15_000 }).toBe("PREMIUM")
    const replay = await postSignedEvent("checkout.session.completed", completedSession, eventId)
    expect(replay.status()).toBe(200)
    expect((await replay.json()).duplicate).toBe(true)
    await page.goto("/upgrade/success", { waitUntil: "domcontentloaded" })
    await expect(page.getByRole("heading", { name: "Welcome to Premium!" })).toBeVisible()
  } finally {
    // Cleanup only the TEST resources obtained from this newly registered user.
    // An unverified/live session must never cause Stripe writes here.
    if (session?.livemode === false) {
      const cleanupErrors: string[] = []
      if (webhookAttempted) {
        try {
          const deleted = await postSignedEvent("customer.subscription.deleted", {
            id: subscriptionId,
            object: "subscription",
            livemode: false,
            customer: session.customer,
            metadata: { userId },
          })
          expect(deleted.status(), "Synthetic subscription cleanup must succeed").toBe(200)
          const me = await request.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
          expect(me.status()).toBe(200)
          expect((await me.json())?.data?.user?.subscriptionTier).toBe("FREE")
        } catch {
          cleanupErrors.push("restore Preview learner to FREE")
        }
      }
      try {
        await stripeOperation("expire unpaid Checkout session", () => stripe.checkout.sessions.expire(session!.id))
      } catch {
        cleanupErrors.push("expire unpaid Checkout session")
      }
      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id
      if (customerId) {
        try {
          const customer = await stripeOperation("verify test customer", () => stripe.customers.retrieve(customerId))
          if (!customer.deleted && customer.livemode === false && customer.metadata.userId === userId) {
            await stripeOperation("delete test customer", () => stripe.customers.del(customerId))
          } else if (!customer.deleted) {
            cleanupErrors.push("verify test customer ownership")
          }
        } catch {
          cleanupErrors.push("delete test customer")
        }
      }
      expect(cleanupErrors, "All Preview TEST cleanup steps must complete").toEqual([])
    }
  }
})
