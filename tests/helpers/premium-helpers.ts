import { randomUUID } from "node:crypto"
import type { APIRequestContext, Page } from "@playwright/test"
import Stripe from "stripe"
import { AUTH_JWT_STORAGE_KEY } from "../../lib/auth/client-fetch"

export const E2E_STRIPE_CHECKOUT_URL =
  "https://checkout.stripe.com/c/pay/cs_test_e2e_premium_signup"

/** Must match the STRIPE_WEBHOOK_SECRET set for CI / verify:ci e2e. */
export const E2E_STRIPE_WEBHOOK_SECRET =
  process.env.STRIPE_WEBHOOK_SECRET?.trim() || "whsec_e2e_premium_signup_test_secret_32b"

export function randomPremiumEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}@example.com`
}

export async function registerUser(
  request: APIRequestContext,
  email: string,
  password = "Test1234!@#$",
) {
  const response = await request.post("/api/auth/register", {
    data: {
      email,
      password,
      firstName: "Premium",
      lastName: "E2E",
    },
  })
  const body = await response.json()
  if (!response.ok() || !body?.data?.token) {
    throw new Error(`register failed: ${response.status()} ${JSON.stringify(body)}`)
  }
  return {
    token: body.data.token as string,
    userId: body.data.user.id as string,
    email: body.data.user.email as string,
    password,
  }
}

export async function injectAuthToken(page: Page, token: string) {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value)
    },
    [AUTH_JWT_STORAGE_KEY, token] as const,
  )
}

/** Stub POST /api/checkout so CI never needs a live Stripe network call. */
export async function stubCheckoutRedirect(page: Page, url = E2E_STRIPE_CHECKOUT_URL) {
  await page.route("https://checkout.stripe.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><title>Stripe Checkout (e2e stub)</title><h1>Checkout stub</h1>",
    })
  })
  await page.route("**/api/checkout", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue()
      return
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url }),
    })
  })
}

export async function postCheckoutCompletedWebhook(
  request: APIRequestContext,
  options: { userId: string; secret?: string; sessionId?: string },
) {
  const secret = options.secret ?? E2E_STRIPE_WEBHOOK_SECRET
  const sessionId = options.sessionId ?? `cs_test_${randomUUID().replaceAll("-", "")}`
  const event = {
    id: `evt_test_${randomUUID().replaceAll("-", "")}`,
    object: "event",
    api_version: "2025-04-30.basil",
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 0,
    request: { id: null, idempotency_key: null },
    type: "checkout.session.completed",
    data: {
      object: {
        id: sessionId,
        object: "checkout.session",
        payment_status: "paid",
        mode: "subscription",
        client_reference_id: options.userId,
        metadata: { userId: options.userId },
        subscription: `sub_test_${randomUUID().replaceAll("-", "").slice(0, 14)}`,
        customer: `cus_test_${randomUUID().replaceAll("-", "").slice(0, 14)}`,
      },
    },
  }
  const payload = JSON.stringify(event)
  const stripe = new Stripe("sk_test_e2e_signature_only")
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret,
  })
  const response = await request.post("/api/webhooks/stripe", {
    headers: {
      "content-type": "application/json",
      "stripe-signature": signature,
    },
    data: payload,
  })
  return { response, sessionId, eventId: event.id as string }
}

export async function fetchMeTier(request: APIRequestContext, token: string) {
  const response = await request.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
  const body = await response.json()
  return {
    status: response.status(),
    tier: body?.data?.user?.subscriptionTier as string | undefined,
  }
}
