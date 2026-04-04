/**
 * Dashboard Tests
 *
 * Tests for the public dashboard page and learning explorer
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should be publicly accessible for unauthenticated visitors', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /explore your learning path/i })).toBeVisible();
  });

  test('should display dashboard explorer content for visitors', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText(/choose your learning path/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /find the next lesson that fits your level/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^beginner$/i })).toBeVisible();
  });

  test('should show free plan badge to unauthenticated visitors', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText(/free plan/i)).toBeVisible();
  });

  test('should filter the explorer by search query', async ({ page }) => {
    await page.goto('/dashboard');

    const search = page.getByLabel(/search the learning explorer/i);
    await search.fill('distributed tracing');

    await expect(page.getByRole('link', { name: /inter-service communication/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /integration mindset/i })).toHaveCount(0);
    await expect(page.getByText(/showing 1 of 7 sections/i)).toBeVisible();
  });

  test('should filter the explorer by level and reset filters', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('button', { name: /^cloud$/i }).click();
    await expect(page.getByRole('link', { name: /aws cloud migration/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /integration mindset/i })).toHaveCount(0);

    const search = page.getByLabel(/search the learning explorer/i);
    await search.fill('nonexistent topic');
    await expect(page.getByRole('heading', { name: /no sections match that search yet/i })).toBeVisible();

    await page.getByRole('button', { name: /reset filters/i }).click();
    await expect(search).toHaveValue('');
    await expect(page.getByRole('link', { name: /integration mindset/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /aws cloud migration/i })).toBeVisible();
  });
});
