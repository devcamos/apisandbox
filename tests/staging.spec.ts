/**
 * Staging smoke tests
 *
 * Run against a live staging app (e.g. Docker staging stack).
 * 1. Start staging: npm run staging:up
 * 2. Install browsers if needed: npx playwright install
 * 3. Run: npm run test:staging
 */

import { test, expect } from '@playwright/test';

test.describe('Staging', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'API Integration Training' })
    ).toBeVisible();
  });

  test('dashboard is reachable (no redirect to login)', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('login page loads and has sign-in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /welcome back|sign in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('login page has Google OAuth option', async ({ page }) => {
    await page.goto('/login');
    const googleButton = page.getByRole('button', { name: /sign in with google/i });
    await expect(googleButton).toBeVisible();
  });

  test('start page loads', async ({ page }) => {
    await page.goto('/start');
    await expect(page).toHaveURL(/\/start/);
  });
});
