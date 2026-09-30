/**
 * Upgrade Page Tests
 */

import { test, expect } from "@playwright/test"
import { randomUUID } from "node:crypto"
import {
  injectAuthToken,
  registerUser,
} from "./helpers/premium-helpers"

test.describe("Upgrade Page", () => {
  test("should display upgrade page", async ({ page }) => {
    await page.goto("/upgrade")
    await expect(page.getByRole("heading", { name: /unlock full access/i })).toBeVisible()
  })

  test("should show pricing comparison", async ({ page }) => {
    await page.goto("/upgrade")

    await expect(page.getByRole("heading", { name: /^free$/i })).toBeVisible()
    await expect(page.getByText(/£0/)).toBeVisible()

    await expect(page.getByRole("heading", { name: /^premium$/i })).toBeVisible()
    await expect(page.getByTestId("premium-price").first()).toBeVisible()
  })

  test("should show feature comparison", async ({ page }) => {
    await page.goto("/upgrade")

    await expect(page.getByText(/API Foundations: Program to Integration/i)).toBeVisible()
    await expect(page.getByText(/all learning phases/i)).toBeVisible()
  })

  test("should show upgrade button", async ({ page }) => {
    await page.goto("/upgrade")
    await expect(page.getByTestId("upgrade-start-checkout")).toBeVisible()
  })

  test("should prompt login for unauthenticated users", async ({ page }) => {
    await page.goto("/upgrade")
    await expect(page.getByRole("button", { name: /sign in to upgrade/i })).toBeVisible()
  })

  test("should allow authenticated users to start upgrade", async ({ page, request }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`
    const { token } = await registerUser(request, uniqueEmail)
    await injectAuthToken(page, token)

    await page.goto("/upgrade")
    const upgradeButton = page.getByTestId("upgrade-start-checkout")
    await expect(upgradeButton).toBeEnabled()
    await expect(upgradeButton).toContainText(/upgrade/i)
  })

  test("should show trust indicators", async ({ page }) => {
    await page.goto("/upgrade")

    await expect(page.getByText(/7-day refund guarantee/i)).toBeVisible()
    await expect(page.getByText(/cancel anytime/i)).toBeVisible()
  })

  test("should link back to free content", async ({ page }) => {
    await page.goto("/upgrade")

    const backLink = page.getByRole("link", { name: /back to free content/i })
    await expect(backLink).toBeVisible()
    await expect(backLink).toHaveAttribute("href", "/learn/api-foundations")
  })
})
