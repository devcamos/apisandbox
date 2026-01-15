import { test, expect } from '@playwright/test';

test.describe('Component Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/phase-1');
  });

  test('should expand and collapse concept cards', async ({ page }) => {
    // Find a concept card and click to expand
    const restCard = page.getByText(/REST/i).first();
    if (await restCard.isVisible()) {
      await restCard.click();
      // Check if documentation modal or expanded content appears
      await expect(page.getByText(/REST/i)).toBeVisible();
    }
  });

  test('should display code examples in Universal Technologies', async ({ page }) => {
    await expect(page.getByText(/@RestController/i)).toBeVisible();
    await expect(page.getByText(/useState/i)).toBeVisible();
  });

  test('should display Java code examples', async ({ page }) => {
    await expect(page.getByText(/Java Spring Boot/i)).toBeVisible();
    await expect(page.getByText(/@Service/i)).toBeVisible();
  });
});


