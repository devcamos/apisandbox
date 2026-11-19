import { expect, test } from "@playwright/test"
import { E2E_STRIPE_CHECKOUT_URL, fetchMeTier, injectAuthToken, randomPremiumEmail, registerUser } from "./helpers/premium-helpers"

for (const outcome of ["success", "cancel"] as const) {
  test(`Preview handles a simulated checkout ${outcome}`, async ({ page, request, baseURL }) => {
    const origin = new URL(baseURL!).origin
    const { token } = await registerUser(request, randomPremiumEmail("preview-checkout"))
    await injectAuthToken(page, token, origin)

    const sessionId = new URL(E2E_STRIPE_CHECKOUT_URL).pathname.split("/").at(-1)
    const returnUrl = new URL(outcome === "success" ? "/upgrade/success" : "/upgrade", origin)
    if (outcome === "success" && sessionId) returnUrl.searchParams.set("session_id", sessionId)

    let checkoutRequests = 0
    await page.route(`${origin}/api/checkout`, async (route) => {
      expect(route.request().method()).toBe("POST")
      const cookie = await route.request().headerValue("cookie")
      expect(/(?:^|;\s*)auth_token=/.test(cookie ?? ""), "Checkout uses the learner session").toBe(true)
      checkoutRequests++
      await route.fulfill({ json: { url: E2E_STRIPE_CHECKOUT_URL, sessionId, livemode: false } })
    })
    // Catch the external navigation in the browser. No Stripe request or payment is made.
    await page.route("https://checkout.stripe.com/**", async (route) => {
      expect(route.request().url()).toBe(E2E_STRIPE_CHECKOUT_URL)
      await route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><title>Checkout fixture</title><a href="${returnUrl.href}">Return to API Sandbox</a>`,
      })
    })

    await page.goto("/upgrade?checkout=1")
    await expect(page.getByRole("link", { name: "Return to API Sandbox" })).toBeVisible()
    expect(checkoutRequests).toBe(1)

    const statusUrl = `${origin}/api/subscription/status`
    const statusResponse = outcome === "success"
      ? page.waitForResponse((response) => response.url() === statusUrl)
      : null
    await page.getByRole("link", { name: "Return to API Sandbox" }).click()

    if (statusResponse) {
      const response = await statusResponse
      expect(response.status()).toBe(200)
      expect((await response.json()).tier).toBe("FREE")
      await expect(page).toHaveURL(returnUrl.href)
      await expect(page.getByRole("heading", { name: /activating premium/i })).toBeVisible()
      // Simulate the UI observing a webhook-driven change after first seeing the real FREE tier.
      await page.route(statusUrl, (route) => route.fulfill({ json: { tier: "PREMIUM", isExpired: false } }))
      await expect(page.getByRole("heading", { name: /welcome to premium/i })).toBeVisible()
    } else {
      await expect(page).toHaveURL(returnUrl.href)
      await expect(page.getByTestId("upgrade-start-checkout")).toBeVisible()
    }

    // Visiting either return URL or mocking the UI state must not grant account access.
    const me = await fetchMeTier(request, token)
    expect(me.status).toBe(200)
    expect(me.tier).toBe("FREE")
  })
}
