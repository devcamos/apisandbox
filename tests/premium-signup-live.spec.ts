import { expect, test } from "@playwright/test"
import {
  injectAuthToken,
  randomPremiumEmail,
  registerUser,
} from "./helpers/premium-helpers"

/**
 * Opt-in live Preview Checkout (ignored unless STRIPE_E2E_LIVE=1 — see playwright.config.ts).
 *   STRIPE_E2E_LIVE=1 PLAYWRIGHT_BASE_URL=https://<preview> \
 *     npx playwright test tests/premium-signup-live.spec.ts --project=chromium
 */
test.describe("Premium signup live Preview", () => {
  test("opens real Stripe Checkout for a FREE Preview user", async ({ page, request }) => {
    const email = randomPremiumEmail("live")
    const { token } = await registerUser(request, email)
    await injectAuthToken(page, token)
    await page.goto("/upgrade?checkout=1", { waitUntil: "domcontentloaded" })
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 60_000 })
    await expect(page).toHaveURL(/checkout\.stripe\.com/)
  })
})
