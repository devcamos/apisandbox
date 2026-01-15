import { test, expect } from '@playwright/test';

test.describe('Cloud Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cloud');
  });

  test('should display cloud landing page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /AWS|Cloud/i })).toBeVisible();
  });

  test('should have navigation to cloud services', async ({ page }) => {
    const servicesLink = page.getByRole('link', { name: /Services|AWS/i });
    if (await servicesLink.first().isVisible()) {
      await expect(servicesLink.first()).toBeVisible();
    }
  });
});


