import { test, expect } from "@playwright/test"

test.describe("Navigation — phases not in header", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard")
  })

  test("does not show Phase links in top nav bar", async ({ page }) => {
    const nav = page.getByRole("navigation")
    await expect(nav.getByRole("link", { name: /^Phase \d+$/ })).toHaveCount(0)
  })
})
