import { test, expect } from "@playwright/test"
import { randomUUID } from "node:crypto"
import { dismissCookieBanner } from "./helpers/smoke-helpers"

/**
 * Opt-in production smoke — only runs when PLAYWRIGHT_PROD_URL is set.
 * Playwright project `prod-deployment` in playwright.config.ts gates this file.
 */
test.describe("Production deployment auth", () => {
  test("register, login, and open dashboard on production", async ({ page, request }) => {
    const email = `prod-e2e-${Date.now()}-${randomUUID()}@example.com`
    const password = "Test1234!@#$"

    const register = await request.post("/api/auth/register", {
      data: { email, password, firstName: "Prod", lastName: "E2E" },
    })
    if (!register.ok()) {
      const body = await register.text()
      const schemaDriftHint =
        register.status() === 503 && /configuration_error|temporarily unavailable/i.test(body)
          ? " Preview schema may be behind (e.g. missing UserSession). Apply pending migrations to the isolated Preview DB only: CONFIRM_PREVIEW_MIGRATE=YES npm run db:migrate:preview (never Production)."
          : ""
      throw new Error(
        `POST /api/auth/register failed: HTTP ${register.status()} ${body.slice(0, 500)}.${schemaDriftHint}`,
      )
    }

    await page.goto("/login", { waitUntil: "domcontentloaded" })
    await dismissCookieBanner(page)

    await page.locator("#email").fill(email)
    await page.locator("#password").fill(password)
    await page.getByRole("button", { name: /^Sign In$/i }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 })
    await expect(page.getByText(/choose your learning path/i)).toBeVisible()
  })
})
