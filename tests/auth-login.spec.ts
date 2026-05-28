/**
 * Auth Login Tests
 * 
 * Tests for user login with email/password
 */

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { dismissCookieBanner } from './helpers/smoke-helpers';

test.describe('Auth Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
  });

  test('should have link to signup page', async ({ page }) => {
    const signupLink = page.getByRole('main').getByRole('link', { name: 'Sign up', exact: true });
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
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    await expect(page.getByText(/invalid login credentials|incorrect password/i)).toBeVisible();
  });

  test('should redirect to dashboard on successful login', async ({ page, request }) => {
    // First create a test user
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
    const register = await request.post('/api/auth/register', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
      }
    });
    expect(register.ok()).toBeTruthy();

    // Then login
    await page.getByLabel(/email address/i).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill('Test1234!@#$');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    // Should redirect to dashboard (full navigation after auth cookie is set)
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    await expect(page.getByText(/choose your learning path/i)).toBeVisible();
  });
});

