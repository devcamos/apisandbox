/**
 * Auth Login Tests
 * 
 * Tests for user login with email/password
 */

import { test, expect } from '@playwright/test';

test.describe('Auth Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should have link to signup page', async ({ page }) => {
    const signupLink = page.getByRole('link', { name: /sign up/i });
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute('href', '/signup');
  });

  test('should have forgot password link', async ({ page }) => {
    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    await expect(forgotPasswordLink).toBeVisible();
  });

  test('should have OAuth login option', async ({ page }) => {
    const oauthButton = page.getByRole('button', { name: /sign in with google/i });
    await expect(oauthButton).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('nonexistent@example.com');
    await page.getByLabel(/^password$/i).fill('WrongPassword123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('should redirect to dashboard on successful login', async ({ page, request }) => {
    // First create a test user
    const uniqueEmail = `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
    await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
      }
    });

    // Then login
    await page.getByLabel(/email address/i).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill('Test1234!@#$');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});


