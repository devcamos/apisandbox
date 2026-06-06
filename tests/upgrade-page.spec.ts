/**
 * Upgrade Page Tests
 */

import { test, expect } from "@playwright/test"
import { randomUUID } from "node:crypto"

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
    await expect(page.getByText(/£5/)).toBeVisible()
  })

  test("should show feature comparison", async ({ page }) => {
    await page.goto("/upgrade")

    await expect(page.getByText(/phase 0: how the internet works/i)).toBeVisible()
    await expect(page.getByText(/phase 1: integration mindset/i)).toBeVisible()
    await expect(page.getByText(/all learning phases/i)).toBeVisible()
  })

  test("should show upgrade button", async ({ page }) => {
    await page.goto("/upgrade")
    const upgradeButton = page.getByRole("button", { name: /upgrade.*£5/i })
    await expect(upgradeButton).toBeVisible()
  })

  test("should prompt login for unauthenticated users", async ({ page }) => {
    await page.goto("/upgrade")
    await expect(page.getByRole("button", { name: /sign in to upgrade/i })).toBeVisible()
  })

  test("should allow authenticated users to start upgrade", async ({ page, request }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`
    await request.post("/api/auth/signup", {
      data: {
        email: uniqueEmail,
        password: "Test1234!@#$",
      },
    })

    await page.goto("/login")
    await page.getByLabel(/email address/i).fill(uniqueEmail)
    await page.getByLabel(/^password$/i).fill("Test1234!@#$")
    await page.getByRole("button", { name: /sign in/i }).click()
    await page.waitForURL(/\/dashboard/)

    await page.goto("/upgrade")
    const upgradeButton = page.getByRole("button", { name: /upgrade.*£5/i })
    await expect(upgradeButton).toBeEnabled()
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
    await expect(backLink).toHaveAttribute("href", "/phase-1")
  })
})
