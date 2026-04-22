import { expect, test } from "@playwright/test";

async function openSearch(page: import("@playwright/test").Page) {
  const isMobile = page.viewportSize()?.width ? page.viewportSize()!.width < 768 : false;

  if (isMobile) {
    await page.getByRole("button", { name: /menu|close/i }).click();
  }

  const searchInput = page.getByLabel("Search pages").first();
  await expect(searchInput).toBeVisible();
  return searchInput;
}

test.describe("Page search", () => {
  test("should let public visitors navigate with search", async ({ page }) => {
    await page.goto("/");

    const searchInput = await openSearch(page);
    await searchInput.fill("oauth");

    await expect(page.getByRole("button", { name: /oauth2 demo/i })).toBeVisible();
    await page.getByRole("button", { name: /oauth2 demo/i }).click();

    await expect(page).toHaveURL("/phase-2/demos/oauth2");
    await expect(page.getByRole("heading", { name: "OAuth2 Demo" })).toBeVisible();
  });

  test("should surface recent searches and avoid stale missing-page results", async ({ page }) => {
    await page.goto("/");

    const searchInput = await openSearch(page);
    await searchInput.fill("postgres");
    await page.getByRole("button", { name: /postgresql \+ prisma/i }).click();

    await expect(page).toHaveURL("/phase-2/databases/postgresql");

    await page.goto("/");

    const searchAgain = await openSearch(page);
    await searchAgain.click();
    await expect(page.getByText("Recent")).toBeVisible();
    await expect(page.getByRole("button", { name: "PostgreSQL + Prisma" })).toBeVisible();

    await searchAgain.fill("mongodb");
    await expect(page.getByText('No results found for "mongodb"')).toBeVisible();
  });
});
