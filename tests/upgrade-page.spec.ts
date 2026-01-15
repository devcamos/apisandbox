/**
 * Upgrade Page Tests
 * 
 * Tests for the subscription upgrade/pricing page
 */

import { test, expect } from '@playwright/test';

test.describe('Upgrade Page', () => {
  test('should display upgrade page', async ({ page }) => {
    await page.goto('/upgrade');
    await expect(page.getByRole('heading', { name: /upgrade to premium/i })).toBeVisible();
  });

  test('should show pricing comparison', async ({ page }) => {
    await page.goto('/upgrade');
    
    // Should show Free tier
    await expect(page.getByText(/free/i)).toBeVisible();
    await expect(page.getByText(/\$0/i)).toBeVisible();
    
    // Should show Premium tier
    await expect(page.getByText(/premium/i)).toBeVisible();
    await expect(page.getByText(/\$29/i)).toBeVisible();
  });

  test('should show feature comparison', async ({ page }) => {
    await page.goto('/upgrade');
    
    // Free tier features
    await expect(page.getByText(/phase 1.*integration mindset/i)).toBeVisible();
    
    // Premium tier features
    await expect(page.getByText(/all 4 learning phases/i)).toBeVisible();
    await expect(page.getByText(/aws cloud migration/i)).toBeVisible();
    await expect(page.getByText(/advanced observability/i)).toBeVisible();
  });

  test('should show upgrade button', async ({ page }) => {
    await page.goto('/upgrade');
    const upgradeButton = page.getByRole('button', { name: /upgrade now|get started/i });
    await expect(upgradeButton).toBeVisible();
  });

  test('should prompt login for unauthenticated users', async ({ page }) => {
    await page.goto('/upgrade');
    
    // Should show sign in prompt if not logged in
    const upgradeButton = page.getByRole('button', { name: /sign in to upgrade|upgrade now/i });
    await expect(upgradeButton).toBeVisible();
  });

  test('should allow authenticated users to upgrade', async ({ page, request }) => {
    const uniqueEmail = `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
    await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
      }
    });

    await page.goto('/login');
    await page.getByLabel(/email address/i).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill('Test1234!@#$');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);

    await page.goto('/upgrade');
    const upgradeButton = page.getByRole('button', { name: /upgrade now/i });
    await expect(upgradeButton).toBeEnabled();
    
    // Click upgrade (will redirect to dashboard)
    await upgradeButton.click();
    await page.waitForURL(/\/dashboard/);
  });

  test('should show trust indicators', async ({ page }) => {
    await page.goto('/upgrade');
    
    await expect(page.getByText(/30-day money-back guarantee/i)).toBeVisible();
    await expect(page.getByText(/cancel anytime/i)).toBeVisible();
  });

  test('should have back to dashboard link', async ({ page }) => {
    await page.goto('/upgrade');
    
    const backLink = page.getByRole('link', { name: /back to dashboard/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/dashboard');
  });
});


