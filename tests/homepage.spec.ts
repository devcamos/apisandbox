import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the hero and primary entry CTAs", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "API Integration Training" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Master API Integrations" })).toBeVisible();

    const exploreHero = page.getByRole("link", { name: /^Explore Free$/ }).first();
    await expect(exploreHero).toHaveAttribute("href", "/signup");

    await expect(page.getByRole("main").getByRole("link", { name: "Sign In" })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  test("explains how API Sandbox works before signup", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "How API Sandbox works" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Learn the critical concept" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "See where it appears" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Go deeper when needed" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Apply it in context" })).toBeVisible();

    await expect(page.getByText("Example path: from concept to production instinct")).toBeVisible();
    await expect(page.getByText("OAuth callback", { exact: true })).toBeVisible();
    await expect(page.getByText("Production-safe implementation")).toBeVisible();

    await expect(page.getByRole("link", { name: "Preview the learning path" })).toHaveAttribute(
      "href",
      "/start",
    );
  });

  test("shows core marketing sections and final CTA", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Why Choose Our Training?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What You'll Master" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Preview Your Learning Path" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Simple Pricing" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ready to Explore?" })).toBeVisible();

    const finalCta = page.getByRole("link", { name: /^Explore Free$/ }).last();
    await expect(finalCta).toHaveAttribute("href", "/signup");
  });

  test("renders the explainer section on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "How API Sandbox works" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Learn the critical concept" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Preview the learning path" })).toBeVisible();
  });
});
