import { test, expect } from "@playwright/test";

/**
 * Minimal checks for GitHub Actions (fast, stable gate).
 * Run the full suite locally: npm run test:ci or npm run test
 */
test.describe("CI smoke", () => {
  test("home page loads", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok()).toBeTruthy();
    await expect(
      page.getByRole("heading", { name: /API Integration Training/i }),
    ).toBeVisible();
  });

  test("phase-5 route responds", async ({ page }) => {
    const response = await page.goto("/phase-5");
    expect(response?.ok()).toBeTruthy();
  });
});
