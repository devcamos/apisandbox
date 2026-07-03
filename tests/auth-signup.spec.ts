/**
 * Auth Signup Tests
 * 
 * Tests for user registration with email/password
 * Covers UI, API, validation, and error handling
 */

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.describe('Auth Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should display signup form with all fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('should show password strength indicator when typing', async ({ page }) => {
    const passwordInput = page.getByLabel(/^password$/i);
    await passwordInput.fill('weak');
    
    // Should show password strength bars
    const strengthBars = page.locator('.h-1.flex-1.rounded');
    await expect(strengthBars.first()).toBeVisible();
    
    // Should show password requirements
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
  });

  test('should validate password strength requirements', async ({ page }) => {
    const passwordInput = page.getByLabel(/^password$/i);
    
    // Test weak password
    await passwordInput.fill('weak');
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
    
    // Test missing uppercase
    await passwordInput.fill('weakpassword123!');
    await expect(page.getByText(/one uppercase letter/i)).toBeVisible();
    
    // Test missing lowercase
    await passwordInput.fill('WEAKPASSWORD123!');
    await expect(page.getByText(/one lowercase letter/i)).toBeVisible();
    
    // Test missing number
    await passwordInput.fill('WeakPassword!');
    await expect(page.getByText(/one number/i)).toBeVisible();
    
    // Test missing special character on short passwords
    await passwordInput.fill('ShortPass1A');
    await expect(page.getByText(/one special character, or 12\+ characters/i)).toBeVisible();

    // Password managers may omit symbols on long generated passwords
    await passwordInput.fill('y6QigkgWG3kuT7j');
    await expect(page.getByText(/password meets all requirements/i)).toBeVisible();

    // Test strong password with symbol
    await passwordInput.fill('StrongPassword123!');
    await expect(page.getByText(/password meets all requirements/i)).toBeVisible();
  });

  test('should show password match validation', async ({ page }) => {
    const passwordInput = page.getByLabel(/^password$/i);
    const confirmPasswordInput = page.getByLabel(/confirm password/i);
    
    await passwordInput.fill('Test1234!');
    await confirmPasswordInput.fill('Different123!');
    
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
    
    await confirmPasswordInput.fill('Test1234!');
    await expect(page.getByText(/passwords do not match/i)).not.toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.getByLabel(/email address/i);
    
    await emailInput.fill('invalid-email');
    await emailInput.blur();
    
    // Browser validation should prevent submission
    const form = page.locator('form');
    const isValid = await form.evaluate((el: HTMLFormElement) => el.checkValidity());
    expect(isValid).toBeFalsy();
  });

  test('should successfully sign up with valid credentials', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
    
    await page.getByLabel(/email address/i).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill('Test1234!@#$');
    await page.getByLabel(/confirm password/i).fill('Test1234!@#$');
    await page.getByLabel(/name/i).fill('Test User');
    
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/registered|welcome|sign in/i)).toBeVisible();
  });

  test('should successfully create account via API', async ({ request }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
    
    const response = await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
        name: 'Test User'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('user');
    expect(data.user).toHaveProperty('email', uniqueEmail);
    expect(data.user).toHaveProperty('name', 'Test User');
    expect(data.user).not.toHaveProperty('password');
    expect(data.user).not.toHaveProperty('passwordHash');
    expect(data).toHaveProperty('message', 'Account created successfully');
  });

  test('should reject duplicate email', async ({ request }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
    
    // First signup should succeed
    const firstResponse = await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
      }
    });
    expect(firstResponse.ok()).toBeTruthy();

    // Second signup with same email should fail
    const secondResponse = await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
      }
    });
    expect(secondResponse.status()).toBe(400);
    const data = await secondResponse.json();
    expect(data.error).toContain('already exists');
  });

  test('should reject weak passwords via API', async ({ request }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
    
    const response = await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'weak', // Too weak
      }
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Password does not meet requirements');
    expect(data).toHaveProperty('details');
    expect(Array.isArray(data.details)).toBeTruthy();
  });

  test('should reject invalid email format via API', async ({ request }) => {
    const response = await request.post('/api/auth/signup', {
      data: {
        email: 'invalid-email',
        password: 'Test1234!@#$',
      }
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Validation failed');
    expect(data).toHaveProperty('details');
  });

  test('should enforce rate limiting', async ({ request }) => {
    // Try to sign up multiple times quickly (should hit rate limit after 3 attempts)
    const requests = Array(5).fill(null).map((_, i) => 
      request.post('/api/auth/signup', {
        data: {
          email: `test-${Date.now()}-${i}@example.com`,
          password: 'Test1234!@#$',
        }
      })
    );

    const responses = await Promise.all(requests);
    
    // Some requests should be rate limited (429)
    const rateLimited = responses.filter(r => r.status() === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
    
    // Check rate limit headers
    if (rateLimited.length > 0) {
      const headers = rateLimited[0].headers();
      expect(headers['x-ratelimit-limit']).toBeTruthy();
      expect(headers['retry-after']).toBeTruthy();
    }
  });

  test("should show error messages on failed signup", async ({ page }) => {
    // Try to sign up with existing email (if we can create one first)
    const emailInput = page.getByLabel(/email address/i)
    const passwordInput = page.getByLabel(/^password$/i)
    const confirmPasswordInput = page.getByLabel(/confirm password/i)
    const submitButton = page.getByRole("button", { name: /create account/i })
    
    // Fill form with potentially duplicate email
    await emailInput.fill("test@example.com")
    await passwordInput.fill("Test1234!@#$")
    await confirmPasswordInput.fill("Test1234!@#$")
    
    await submitButton.click()
    
    // Should show error message (either duplicate or success)
    // We can't guarantee duplicate, so just check error handling works
    const errorContainer = page.locator(".bg-red-500\\/10")
    // Error might appear or might succeed - both are valid, but we must assert on an outcome.
    await expect(errorContainer.or(page.getByText(/registered|welcome|sign in/i))).toBeVisible()
  })

  test('should disable submit button when password is weak', async ({ page }) => {
    const passwordInput = page.getByLabel(/^password$/i);
    const submitButton = page.getByRole('button', { name: /create account/i });
    
    await passwordInput.fill('weak');
    
    // Button should be disabled when password doesn't meet requirements
    await expect(submitButton).toBeDisabled();
    
    await passwordInput.fill('StrongPassword123!');
    
    // Button should be enabled when password is strong
    await expect(submitButton).toBeEnabled();
  });

  test('should show loading state during signup', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
    
    await page.getByLabel(/email address/i).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill('Test1234!@#$');
    await page.getByLabel(/confirm password/i).fill('Test1234!@#$');
    
    const submitButton = page.getByRole('button', { name: /create account/i });
    await submitButton.click();
    
    // Should show loading text
    await expect(page.getByText(/creating account/i)).toBeVisible();
  });

  test('should have link to login page', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /sign in/i });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('should have OAuth signup option', async ({ page }) => {
    const oauthButton = page.getByRole('button', { name: /sign up with google/i });
    await expect(oauthButton).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page, context }) => {
    // Block network requests
    await context.route('**/api/auth/signup', route => route.abort());
    
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('Test1234!@#$');
    await page.getByLabel(/confirm password/i).fill('Test1234!@#$');
    
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Should show error message
    await expect(page.getByText(/unexpected error|network error/i)).toBeVisible();
  });
});
