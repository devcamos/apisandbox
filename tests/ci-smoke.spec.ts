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

  test("architecture docs page loads (Mermaid + SVG sanitize path)", async ({
    page,
  }) => {
    const response = await page.goto("/docs/architecture");
    expect(response?.ok()).toBeTruthy();
    await expect(
      page.getByRole("heading", { name: "System Architecture", level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Deployment Architecture" })).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.ok()).toBeTruthy();
    await expect(
      page.getByText(/Sign in to continue your API integration journey/i),
    ).toBeVisible();
  });
});
