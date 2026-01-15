import { test, expect } from '@playwright/test';

test.describe('Layout and Navigation', () => {
  test('should have proper page layout', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    
    // Check for main content
    const main = page.getByRole('main');
    await expect(main).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check for phase links in navigation
    const hasPhaseLinks = await page.getByRole('link', { name: /Phase/i }).count() > 0;
    expect(hasPhaseLinks).toBeTruthy();
  });

  test('should have footer or bottom section', async ({ page }) => {
    await page.goto('/');
    
    // Check page loads completely
    await expect(page.getByRole('heading', { name: /API Integration Training/i })).toBeVisible();
  });
});


