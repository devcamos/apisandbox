import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";
import {
  blockSmokeThirdPartyRequests,
  dismissCookieBanner,
} from "./helpers/smoke-helpers";

/**
 * Minimal checks for GitHub Actions (fast, stable gate).
 * Run the full suite locally: npm run test:ci or npm run test
 */
test.describe("CI smoke", () => {
  test.describe.configure({ mode: "parallel" });

  test.beforeEach(async ({ page }) => {
    await blockSmokeThirdPartyRequests(page);
  });

  test("home page loads", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await expect(
      page.getByRole("heading", { name: /API Integration Training/i }),
    ).toBeVisible();
  });

  test("phase-5 route redirects to login when signed out", async ({ page }) => {
    await page.goto("/phase-5", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login/);
  });

  test("architecture docs route redirects to login when signed out", async ({
    page,
  }) => {
    await page.goto("/docs/architecture", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page loads", async ({ page }) => {
    const response = await page.goto("/login", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await expect(
      page.getByText(/Sign in to continue your API integration journey/i),
    ).toBeVisible();
    await expect(page.getByTestId("auth-methods-intro")).toContainText(/choose a sign-in method/i);
    await expect(page.getByTestId("google-auth-section")).toContainText(/google or gmail/i);
    await expect(
      page.getByText(/or sign in with email and password/i),
    ).toBeVisible();
  });

  test("signup page presents Google and local account creation", async ({ page }) => {
    const response = await page.goto("/signup", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByTestId("auth-methods-intro")).toContainText(
      /create one account, use either method/i,
    );
    await expect(page.getByTestId("google-auth-section")).toContainText(/google or gmail/i);
    await expect(
      page.getByText(/or create an account with email and password/i),
    ).toBeVisible();
  });

  test("password login works end to end", async ({ page, request }) => {
    const uniqueEmail = `smoke-${Date.now()}-${randomUUID()}@example.com`;
    const password = "Test1234!@#$";

    const registerResponse = await request.post("/api/auth/register", {
      data: {
        email: uniqueEmail,
        password,
        firstName: "Smoke",
        lastName: "User",
      },
    });

    expect(registerResponse.ok()).toBeTruthy();

    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);

    await page.locator("#email").fill(uniqueEmail);
    await page.locator("#password").fill(password);
    await expect(page.getByRole("button", { name: /^Sign In$/i })).toBeEnabled();
    await page.getByRole("button", { name: /^Sign In$/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByText(/choose your learning path/i)).toBeVisible();
  });
});
