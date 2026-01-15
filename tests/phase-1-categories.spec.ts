import { test, expect } from '@playwright/test';

test.describe('Phase 1 Categories Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/phase-1/categories');
  });

  test('should display API categories', async ({ page }) => {
    await expect(page.getByText(/REST|GraphQL|gRPC/i)).toBeVisible();
  });

  test('should have interactive category demos', async ({ page }) => {
    // Check for interactive elements
    const hasInteractiveElements = await page.getByRole('button').count() > 0;
    expect(hasInteractiveElements).toBeTruthy();
  });
});


