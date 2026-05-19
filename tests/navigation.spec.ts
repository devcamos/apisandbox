import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate from homepage to start page', async ({ page }) => {
    await page.goto('/');
    
    const startButton = page.getByRole('link', { name: 'Preview the learning path' });
    await startButton.click();
    
    await expect(page).toHaveURL('/start');
    await expect(page.getByRole('heading', { name: 'Choose Your Learning Path' })).toBeVisible();
  });

  test('should navigate from start page to phase 1', async ({ page }) => {
    await page.goto('/start');
    
    const phase1Link = page.getByRole('link', { name: /Phase 1.*Integration Mindset/ });
    await phase1Link.click();
    
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate from start page to observability dashboard', async ({ page }) => {
    await page.goto('/start');
    
    const dashboardLink = page.getByRole('link', { name: 'View Dashboard' }).first();
    await dashboardLink.click();
    
    await expect(page).toHaveURL(/\/login/);
  });

  test('should not expose a direct dashboard link from the homepage', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('a[href="/observability"]')).toHaveCount(0);
  });

  test('should have working breadcrumb navigation', async ({ page }) => {
    await page.goto('/phase-1');
    
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate back to home via breadcrumb', async ({ page }) => {
    await page.goto('/phase-1');
    await expect(page).toHaveURL(/\/login/);
  });
});
