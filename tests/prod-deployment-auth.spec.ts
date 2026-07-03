import { test, expect } from "@playwright/test"
import { randomUUID } from "node:crypto"
import { dismissCookieBanner } from "./helpers/smoke-helpers"

const prodBaseUrl = process.env.PLAYWRIGHT_PROD_URL?.replace(/\/$/, "")

// Opt-in production smoke: skipped in CI unless PLAYWRIGHT_PROD_URL targets live Vercel.
test.describe("Production deployment auth", () => {
  test.skip(!prodBaseUrl, "Set PLAYWRIGHT_PROD_URL to run against Vercel production")

  test.use({ baseURL: prodBaseUrl })

  test("register, login, and open dashboard on production", async ({ page, request }) => {
    const email = `prod-e2e-${Date.now()}-${randomUUID()}@example.com`
    const password = "Test1234!@#$"

    const register = await request.post("/api/auth/register", {
      data: { email, password, firstName: "Prod", lastName: "E2E" },
    })
    expect(register.ok()).toBeTruthy()

    await page.goto("/login", { waitUntil: "domcontentloaded" })
    await dismissCookieBanner(page)

    await page.locator("#email").fill(email)
    await page.locator("#password").fill(password)
    await page.getByRole("button", { name: /^Sign In$/i }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 })
    await expect(page.getByText(/choose your learning path/i)).toBeVisible()
  })
})
