import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("is publicly accessible and shows the guided selector", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Explore your learning path" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pick your starting point" })).toBeVisible();
    await expect(page.getByRole("button", { name: /new to apis/i })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("link", { name: "Go to Phase 1" })).toHaveAttribute("href", "/phase-1");
  });

  test("updates recommendations when a learner profile is selected", async ({ page }) => {
    await page.getByRole("button", { name: /comfortable with rest/i }).click();

    await expect(page.getByRole("button", { name: /comfortable with rest/i })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("link", { name: "Go to Phase 2" })).toHaveAttribute("href", "/phase-2");
    await expect(page.getByText("Recommended", { exact: true })).toBeVisible();
  });

  test("persists the selected learner profile across reloads", async ({ page }) => {
    await page.getByRole("button", { name: /planning architecture/i }).click();
    await page.reload();

    await expect(page.getByRole("button", { name: /planning architecture/i })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("link", { name: "Go to Phase 4" })).toHaveAttribute("href", "/phase-4");
  });
});
