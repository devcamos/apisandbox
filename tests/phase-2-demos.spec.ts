import { test, expect } from '@playwright/test';

test.describe('Phase 2 Demos', () => {
  test('should access OAuth2 demo page', async ({ page }) => {
    await page.goto('/phase-2/demos/oauth2');
    await expect(page.getByText(/OAuth|OAuth2/i)).toBeVisible();
  });

  test('should access circuit breaker demo page', async ({ page }) => {
    await page.goto('/phase-2/demos/circuit-breaker');
    await expect(page.getByText(/Circuit|Breaker/i)).toBeVisible();
  });

  test('should access retry demo page', async ({ page }) => {
    await page.goto('/phase-2/demos/retry');
    await expect(page.getByText(/Retry|Backoff/i)).toBeVisible();
  });
});


