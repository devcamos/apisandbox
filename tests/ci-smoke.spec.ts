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

  test("phase-5 route redirects to login when signed out", async ({ page }) => {
    await page.goto("/phase-5");
    await expect(page).toHaveURL(/\/login/);
  });

  test("architecture docs route redirects to login when signed out", async ({
    page,
  }) => {
    await page.goto("/docs/architecture");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page loads", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.ok()).toBeTruthy();
    await expect(
      page.getByText(/Sign in to continue your API integration journey/i),
    ).toBeVisible();
  });
});
