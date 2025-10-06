import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage should match visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled', // Disable animations for consistent screenshots
    });
  });

  test('start page should match visual baseline', async ({ page }) => {
    await page.goto('/start');
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('start-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('phase 1 page should match visual baseline', async ({ page }) => {
    await page.goto('/phase-1');
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('phase-1-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('observability dashboard should match visual baseline', async ({ page }) => {
    await page.goto('/observability');
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('observability-dashboard.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('mobile homepage should match visual baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('mobile start page should match visual baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/start');
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('start-page-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
