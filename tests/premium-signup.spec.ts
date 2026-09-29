import { expect, test } from "@playwright/test"
import { blockSmokeThirdPartyRequests, dismissCookieBanner } from "./helpers/smoke-helpers"
import {
  E2E_STRIPE_CHECKOUT_URL,
  E2E_STRIPE_WEBHOOK_SECRET,
  fetchMeTier,
  injectAuthToken,
  postCheckoutCompletedWebhook,
  randomPremiumEmail,
  registerUser,
  stubCheckoutRedirect,
} from "./helpers/premium-helpers"

/**
 * Premium signup journey (deterministic — stubs Checkout, signs a test webhook).
 * Included in CI e2e-smoke alongside ci-smoke.spec.ts.
 */
test.describe("Premium signup journey", () => {
  test.describe.configure({ mode: "parallel" })

  test.beforeEach(async ({ page }) => {
    await blockSmokeThirdPartyRequests(page)
  })

  test("signed-out visitor from home creates an account and reaches checkout", async ({
    page,
  }) => {
    await stubCheckoutRedirect(page)
    const email = randomPremiumEmail("home-out")
    const password = "Test1234!@#$"

    await page.goto("/", { waitUntil: "domcontentloaded" })
    await dismissCookieBanner(page)
    await page.getByRole("heading", { name: "Simple Pricing" }).scrollIntoViewIfNeeded()
    await page.getByTestId("home-explore-premium").click()
    await expect(page).toHaveURL(/\/signup\?plan=pro/)

    await page.getByLabel(/email address/i).fill(email)
    await page.getByLabel(/^password$/i).fill(password)
    await page.getByLabel(/confirm password/i).fill(password)
    await page.getByRole("button", { name: /create account/i }).click()

    await page.waitForURL(/checkout\.stripe\.com|\/upgrade/, { timeout: 30_000 })
    // Auto-checkout from /upgrade?checkout=1 should navigate to stubbed Checkout URL.
    await expect(page).toHaveURL(/checkout\.stripe\.com/)
  })

  test("signed-in FREE user from home goes to checkout", async ({ page, request }) => {
    const email = randomPremiumEmail("home-free")
    const { token } = await registerUser(request, email)
    await injectAuthToken(page, token)
    await stubCheckoutRedirect(page)

    await page.goto("/", { waitUntil: "domcontentloaded" })
    await dismissCookieBanner(page)
    await expect(page.getByRole("heading", { name: "Simple Pricing" })).toBeVisible()
    await page.getByTestId("home-explore-premium").click()
    // Auto-checkout can navigate to Stripe before /upgrade is observable.
    await page.waitForURL(/checkout\.stripe\.com|\/upgrade\?checkout=1/, { timeout: 30_000 })
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 })
    await expect(page).toHaveURL(E2E_STRIPE_CHECKOUT_URL)
  })

  test("successful payment webhook provisions PREMIUM and success page loads", async ({
    page,
    request,
  }) => {
    const email = randomPremiumEmail("paid")
    const { token, userId } = await registerUser(request, email)

    const { response } = await postCheckoutCompletedWebhook(request, {
      userId,
      secret: E2E_STRIPE_WEBHOOK_SECRET,
    })
    expect(response.status(), await response.text()).toBe(200)

    const me = await fetchMeTier(request, token)
    expect(me.status).toBe(200)
    expect(me.tier).toBe("PREMIUM")

    await injectAuthToken(page, token)
    await page.goto("/upgrade/success", { waitUntil: "domcontentloaded" })
    await dismissCookieBanner(page)
    await expect(page.getByRole("heading", { name: /welcome to premium/i })).toBeVisible({
      timeout: 30_000,
    })
  })

  test("already-PREMIUM user sees premium state, not the upgrade button", async ({
    page,
    request,
  }) => {
    const email = randomPremiumEmail("already")
    const { token, userId } = await registerUser(request, email)
    const { response } = await postCheckoutCompletedWebhook(request, {
      userId,
      secret: E2E_STRIPE_WEBHOOK_SECRET,
    })
    expect(response.status()).toBe(200)

    await injectAuthToken(page, token)
    await page.goto("/upgrade", { waitUntil: "domcontentloaded" })
    await dismissCookieBanner(page)

    await expect(page.getByTestId("upgrade-already-premium")).toBeVisible()
    await expect(page.getByTestId("upgrade-start-checkout")).toHaveCount(0)
    await expect(page.getByRole("heading", { name: /you have premium/i })).toBeVisible()
  })

  test("cancelled checkout returns cleanly and the user stays FREE", async ({
    page,
    request,
  }) => {
    const email = randomPremiumEmail("cancel")
    const { token } = await registerUser(request, email)
    await injectAuthToken(page, token)
    await stubCheckoutRedirect(page)

    await page.goto("/upgrade?checkout=1", { waitUntil: "domcontentloaded" })
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 })

    // User cancels Checkout → back to /upgrade (cancel_url).
    await page.goto("/upgrade", { waitUntil: "domcontentloaded" })
    await dismissCookieBanner(page)
    await expect(page.getByTestId("upgrade-start-checkout")).toBeVisible()
    await expect(page.getByTestId("upgrade-already-premium")).toHaveCount(0)

    const me = await fetchMeTier(request, token)
    expect(me.tier).toBe("FREE")
  })
})
