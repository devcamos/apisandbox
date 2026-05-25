import type { Page } from "@playwright/test";

/** Block third-party scripts that smoke tests do not exercise (GSI, analytics). */
export async function blockSmokeThirdPartyRequests(page: Page) {
  await page.route("https://accounts.google.com/**", (route) => route.abort());
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
}

export async function dismissCookieBanner(page: Page) {
  await page
    .getByRole("button", { name: /essential only|accept all/i })
    .click({ timeout: 2000 })
    .catch(() => {});
}
