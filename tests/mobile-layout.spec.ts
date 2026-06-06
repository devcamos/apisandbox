/**
 * Mobile layout regression tests (375px).
 *
 * Not part of `npm run verify:ci` (desktop chromium only). Run locally:
 *   npx playwright test tests/mobile-layout.spec.ts --project="Mobile Chrome"
 */
import { test, expect, type Page } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 375, height: 667 };

async function assertNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth + 1;
  });
  expect(hasOverflow, "page should not scroll horizontally").toBe(false);
}

async function dismissCookieConsent(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("cookie-consent", "accepted");
  });
}

test.describe("Mobile layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await dismissCookieConsent(page);
  });

  test("mobile navigation opens and closes", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.locator('button[aria-controls="mobile-navigation-menu"]');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-label", "Open navigation menu");

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(menuButton).toHaveAttribute("aria-label", "Close navigation menu");
    await expect(page.getByRole("link", { name: "Sign In" }).first()).toBeVisible();

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  test("core marketing pages avoid horizontal overflow", async ({ page }) => {
    for (const path of ["/", "/start", "/upgrade"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await assertNoHorizontalOverflow(page);
    }
  });

  test("signed-in dashboard and phase preview fit mobile width", async ({ page, request }) => {
    const uniqueEmail = `mobile-${Date.now()}@example.com`;
    await request.post("/api/auth/signup", {
      data: { email: uniqueEmail, password: "Test1234!@#$" },
    });

    await page.goto("/login");
    await page.getByLabel(/email address/i).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill("Test1234!@#$");
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await page.waitForURL(/\/dashboard/);

    await assertNoHorizontalOverflow(page);

    await page.goto("/phase-2");
    await expect(page.getByText(/premium preview/i)).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
});
