/**
 * Subscription Gate Component Tests
 * 
 * Tests for access control based on subscription tier
 */

import { test, expect } from '@playwright/test';

test.describe('Subscription Gate', () => {
  test('should show upgrade prompt for free users on Phase 2', async ({ page, request }) => {
    // Create a free user and login
    const uniqueEmail = `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
    await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
      }
    });

    // Login
    await page.goto('/login');
    await page.getByLabel(/email address/i).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill('Test1234!@#$');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);

    // Try to access Phase 2
    await page.goto('/phase-2');
    
    // Should show upgrade prompt
    await expect(page.getByText(/phase 2.*requires premium/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /upgrade to premium/i })).toBeVisible();
  });

  test('should show upgrade prompt for free users on Phase 3', async ({ page, request }) => {
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

    await page.goto('/phase-3');
    await expect(page.getByText(/phase 3.*requires premium/i)).toBeVisible();
  });

  test('should show upgrade prompt for free users on Phase 4', async ({ page, request }) => {
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

    await page.goto('/phase-4');
    await expect(page.getByText(/phase 4.*requires premium/i)).toBeVisible();
  });

  test('should show upgrade prompt for free users on Cloud section', async ({ page, request }) => {
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

    await page.goto('/cloud/aws/services');
    await expect(page.getByText(/aws cloud services.*requires premium/i)).toBeVisible();
  });

  test('should allow free users to access Phase 1', async ({ page, request }) => {
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

    await page.goto('/phase-1');
    // Should see Phase 1 content, not upgrade prompt
    await expect(page.getByText(/integration mindset/i)).toBeVisible();
    await expect(page.getByText(/requires premium/i)).not.toBeVisible();
  });

  test('should allow premium users to access all phases', async ({ page, request }) => {
    // Create user
    const uniqueEmail = `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
    const signupResponse = await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
      }
    });
    const { user } = await signupResponse.json();

    // Upgrade to premium
    await request.post('/api/subscription/upgrade', {
      headers: {
        'Cookie': (await signupResponse.headers())['set-cookie'] || '',
      }
    });

    // Login
    await page.goto('/login');
    await page.getByLabel(/email address/i).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill('Test1234!@#$');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);

    // Should be able to access all phases
    await page.goto('/phase-2');
    await expect(page.getByText(/third-party integrations/i)).toBeVisible();
    await expect(page.getByText(/requires premium/i)).not.toBeVisible();

    await page.goto('/phase-3');
    await expect(page.getByText(/inter-service communication/i)).toBeVisible();

    await page.goto('/phase-4');
    await expect(page.getByText(/principal-level architecture/i)).toBeVisible();
  });
});


