import { test, expect } from '@playwright/test';

test.describe('Cloud Migration Pages', () => {
  test('should access AWS migration page', async ({ page }) => {
    await page.goto('/cloud/aws/migration');
    await expect(page.getByText(/Migration|AWS/i)).toBeVisible();
  });

  test('should access migration strategies page', async ({ page }) => {
    await page.goto('/cloud/aws/strategies');
    await expect(page.getByText(/Migration|Strategy/i)).toBeVisible();
  });
});


