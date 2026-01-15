import { test, expect } from '@playwright/test';

test.describe('Observability Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/observability');
  });

  test('should display observability dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Observability|Dashboard/i })).toBeVisible();
  });

  test('should display metrics section', async ({ page }) => {
    // Check for metrics or dashboard content
    const hasMetrics = await page.getByText(/Metrics|Dashboard|Docker/i).first().isVisible().catch(() => false);
    expect(hasMetrics).toBeTruthy();
  });
});


