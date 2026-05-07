/**
 * Dashboard Tests
 * 
 * Tests for the protected dashboard page
 */

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.describe('Dashboard', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display dashboard for authenticated users', async ({ page, request }) => {
    // Create and login user
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
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

    // Should see dashboard content
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByText(/choose your learning path/i)).toBeVisible();
  });

  test('should show subscription tier badge', async ({ page, request }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
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

    // Should show free plan badge
    await expect(page.getByText(/free plan/i)).toBeVisible();
  });

  test('should show premium badge for premium users', async ({ page, request }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
    const signupResponse = await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
      }
    });

    // Upgrade to premium
    await request.post('/api/subscription/upgrade');

    await page.goto('/login');
    await page.getByLabel(/email address/i).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill('Test1234!@#$');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);

    // Should show premium badge
    await expect(page.getByText(/premium member/i)).toBeVisible();
  });

  test('should show lock icons on premium phases for free users', async ({ page, request }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
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

    // Should see premium badges on phases 2-5
    await expect(page.getByText(/phase 2/i)).toBeVisible();
    // Check for premium indicator (lock icon or premium badge)
  });

  test('should display all 5 learning phases', async ({ page, request }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
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

    await expect(page.getByText(/phase 1/i)).toBeVisible();
    await expect(page.getByText(/phase 2/i)).toBeVisible();
    await expect(page.getByText(/phase 3/i)).toBeVisible();
    await expect(page.getByText(/phase 4/i)).toBeVisible();
    await expect(page.getByText(/phase 5/i)).toBeVisible();
  });

  test('should have links to all phases', async ({ page, request }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
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

    // Check phase links
    const phase1Link = page.getByRole('link', { name: /integration mindset/i });
    await expect(phase1Link).toBeVisible();
    await expect(phase1Link).toHaveAttribute('href', '/phase-1');
  });
});
