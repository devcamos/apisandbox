/**
 * Navigation with Authentication Tests
 * 
 * Tests for navigation component behavior with auth
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation with Authentication', () => {
  test('should show login/signup buttons when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should see sign in and sign up buttons
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
  });

  test('should show user info and sign out when authenticated', async ({ page, request }) => {
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

    // Should see user email/name and sign out button
    await expect(page.getByText(uniqueEmail)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
  });

  test('should show protected navigation items when authenticated', async ({ page, request }) => {
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

    // Should see dashboard link
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
  });

  test('should hide protected items when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should not see dashboard link
    await expect(page.getByRole('link', { name: /dashboard/i })).not.toBeVisible();
  });

  test('should sign out and redirect to home', async ({ page, request }) => {
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

    // Click sign out
    await page.getByRole('button', { name: /sign out/i }).click();
    
    // Should redirect to home
    await expect(page).toHaveURL('/');
  });
});


