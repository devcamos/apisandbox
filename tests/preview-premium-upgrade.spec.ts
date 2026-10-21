import { randomUUID } from "node:crypto"
import { expect, request as playwrightRequest, test, type Locator, type Page } from "@playwright/test"
import { injectAuthToken } from "./helpers/premium-helpers"

// Real hosted Stripe TEST-mode payment, including Stripe's own webhook delivery.
// Never runs against a live Checkout session. No Stripe API/signing secrets are
// needed by this suite; the deployed Preview owns billing credentials.
test.use({ trace: "off", screenshot: "off", video: "off" })
test.describe.configure({ retries: 0 })

async function visibleCheckoutField(page: Page, selector: string): Promise<Locator | null> {
  for (const frame of page.frames()) {
    const candidates = frame.locator(selector)
    for (let index = 0; index < await candidates.count(); index++) {
      const candidate = candidates.nth(index)
      if (await candidate.isVisible()) return candidate
    }
  }
  return null
}

async function requiredCheckoutField(page: Page, selector: string, description: string) {
  let field: Locator | null = null
  await expect.poll(async () => {
    field = await visibleCheckoutField(page, selector)
    return field !== null
  }, { timeout: 30_000, message: `Hosted TEST checkout must expose ${description}` }).toBe(true)
  return field!
}

function assertTestCheckoutUrl(url: URL) {
  if (
    url.origin !== "https://checkout.stripe.com" ||
    !/^\/c\/pay\/cs_test_[A-Za-z0-9_]+/.test(url.pathname)
  ) {
    throw new Error("Refusing card entry: hosted Checkout must use a cs_test_ session")
  }
}

test("FREE Preview user completes hosted TEST payment and receives PREMIUM from Stripe webhook", async ({
  page,
  request,
  baseURL,
}) => {
  test.setTimeout(180_000)
  if (process.env.DEPLOYMENT_ENVIRONMENT !== "preview") {
    throw new Error("Hosted billing E2E requires DEPLOYMENT_ENVIRONMENT=preview")
  }
  const origin = new URL(baseURL ?? "").origin
  const target = new URL(origin)
  if (target.protocol !== "https:" || !target.hostname.endsWith(".vercel.app") || target.hostname === "apisandbox-coral.vercel.app") {
    throw new Error("Hosted billing E2E requires a Vercel Preview origin")
  }
  const health = await request.get("/api/health/saas")
  expect(health.status(), "Preview readiness must pass before test writes").toBe(200)
  expect((await health.json())?.data?.environment).toBe("preview")

  // Stripe cannot send Vercel automation headers. Check the shared ingress
  // without bypass credentials before creating a learner or TEST payment.
  const ingress = new URL(process.env.PREVIEW_STRIPE_WEBHOOK_URL ??
    "https://apisandbox-billing-preview.vercel.app/api/webhooks/stripe")
  expect(ingress.protocol).toBe("https:")
  expect(ingress.hostname.endsWith(".vercel.app")).toBe(true)
  expect(ingress.pathname).toBe("/api/webhooks/stripe")
  expect(ingress.search + ingress.hash + ingress.username + ingress.password).toBe("")
  const publicRequest = await playwrightRequest.newContext({
    proxy: process.env.PREVIEW_E2E_PROXY ? { server: process.env.PREVIEW_E2E_PROXY } : undefined,
  })
  try {
    const webhookProbe = await publicRequest.get(ingress.toString(), { maxRedirects: 0 })
    expect(webhookProbe.status(), "Stripe TEST webhook ingress must be reachable without Vercel sign-in").toBe(405)
  } finally {
    await publicRequest.dispose()
  }

  const email = `preview-paid-${randomUUID()}@example.com`
  const registration = await request.post("/api/auth/register", {
    data: {
      email,
      password: `Preview-${randomUUID()}aA1!`,
      firstName: "Preview",
      lastName: "Stripe Test",
    },
  })
  expect(registration.status(), "Disposable test learner registration must succeed").toBe(201)
  const body = await registration.json()
  expect(body?.data?.user?.subscriptionTier).toBe("FREE")
  const token = body?.data?.token
  expect(typeof token).toBe("string")
  await injectAuthToken(page, token, origin)

  // Context-wide Vercel protection headers must never be sent to Stripe.
  // Continue real network requests; do not stub application or Stripe APIs.
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

  // Upgrade redirects with window.location as soon as /api/checkout resolves, so the
  // response body can vanish before response.json(). Status is still available; the
  // TEST-mode session URL is asserted from the Stripe page (and again before card entry).
  const checkoutResponsePromise = page.waitForResponse((response) =>
    response.url() === `${origin}/api/checkout` && response.request().method() === "POST",
  )
  await page.goto("/upgrade?checkout=1", { waitUntil: "domcontentloaded" })
  const checkoutResponse = await checkoutResponsePromise
  expect(checkoutResponse.status(), "Real Preview checkout must be enabled").toBe(200)
  await page.waitForURL((url) => url.origin === "https://checkout.stripe.com", { timeout: 30_000 })
  assertTestCheckoutUrl(new URL(page.url()))

  const cardNumber = await requiredCheckoutField(page,
    'input[name="cardNumber"], input[autocomplete="cc-number"], input[placeholder="1234 1234 1234 1234"]', "card number")
  // The guard is repeated immediately before entering test card details.
  assertTestCheckoutUrl(new URL(page.url()))
  await cardNumber.fill("4242424242424242")
  await (await requiredCheckoutField(page,
    'input[name="cardExpiry"], input[autocomplete="cc-exp"], input[placeholder="MM / YY"]', "expiry")).fill("12/35")
  await (await requiredCheckoutField(page,
    'input[name="cardCvc"], input[autocomplete="cc-csc"], input[placeholder="CVC"]', "security code")).fill("123")

  const name = await visibleCheckoutField(page, 'input[name="billingName"], input[autocomplete="cc-name"]')
  if (name) await name.fill("Preview Stripe Test")
  const country = await visibleCheckoutField(page, 'select[name="billingCountry"], select[autocomplete="country"]')
  if (country) await country.selectOption("GB")
  const addressFields = [
    ['input[name="billingAddressLine1"], input[autocomplete="address-line1"]', "10 Downing Street"],
    ['input[name="billingLocality"], input[autocomplete="address-level2"]', "London"],
    ['input[name="billingPostalCode"], input[autocomplete="postal-code"]', "SW1A 1AA"],
  ] as const
  for (const [selector, value] of addressFields) {
    const input = await visibleCheckoutField(page, selector)
    if (input) await input.fill(value)
  }

  // Read/verify current URL before submitting. The well-known 4242 card is only
  // ever submitted to a cs_test_ hosted session; no real charge is made.
  assertTestCheckoutUrl(new URL(page.url()))
  const submit = page.getByRole("button", { name: /^(subscribe|pay|start subscription|start trial)(\b|$)/i })
  await expect(submit).toBeEnabled()
  await submit.click()
  await page.waitForURL((url) => url.origin === origin && url.pathname === "/upgrade/success", { timeout: 90_000 })
  expect(new URL(page.url()).searchParams.get("session_id")).toMatch(/^cs_test_/)

  // Nothing signs or synthesizes a webhook here: Stripe must deliver the real
  // test payment event to the app's configured Preview webhook ingress.
  await expect.poll(async () => {
    const me = await request.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
    return me.ok() ? (await me.json())?.data?.user?.subscriptionTier : "unavailable"
  }, { timeout: 60_000, message: "Stripe TEST webhook must upgrade this learner to PREMIUM" }).toBe("PREMIUM")
})
