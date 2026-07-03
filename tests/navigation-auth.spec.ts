/**
 * Navigation with Authentication Tests
 * 
 * Tests for navigation component behavior with auth
 */

import { test, expect, type APIRequestContext } from '@playwright/test';
import { randomUUID } from 'node:crypto';

async function createAuthenticatedSession(request: APIRequestContext) {
  const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
  const response = await request.post('/api/auth/register', {
    data: {
      email: uniqueEmail,
      password: 'Test1234!@#$',
      firstName: 'Nav',
      lastName: 'User',
    }
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  return {
    email: uniqueEmail,
    displayName: 'Nav User',
    token: body.data.token as string,
  };
}

async function applySession(page: import("@playwright/test").Page, token: string) {
  await page.context().addCookies([
    {
      name: 'auth_token',
      value: token,
      url: 'http://localhost:4000',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
  await page.addInitScript((sessionToken) => {
    window.localStorage.setItem('auth_jwt', sessionToken);
  }, token);
}

test.describe('Navigation with Authentication', () => {
  test('should show login/signup buttons when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should see sign in and sign up buttons
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: /^Sign In$/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /^Sign Up$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Explore$/i })).not.toBeVisible();
  });

  test('should show user info and sign out when authenticated', async ({ page, request }) => {
    const session = await createAuthenticatedSession(request);
    await applySession(page, session.token);
    await page.goto('/dashboard');

    const nav = page.getByRole('navigation');
    // Should see user email/name and sign out button
    await expect(nav.getByText(session.displayName)).toBeVisible();
    await nav.getByRole('button', { name: new RegExp(session.displayName) }).click();
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
  });

  test('should show protected navigation items when authenticated', async ({ page, request }) => {
    const session = await createAuthenticatedSession(request);
    await applySession(page, session.token);
    await page.goto('/dashboard');

    const nav = page.getByRole('navigation');
    // Should see dashboard link
    await expect(nav.getByRole('link', { name: /^Dashboard$/i })).toBeVisible();
    await expect(nav.getByRole('button', { name: /^Explore$/i })).toBeVisible();
  });

  test('should restore an active session from the auth cookie when local storage is empty', async ({ page, request }) => {
    const session = await createAuthenticatedSession(request);
    await page.context().addCookies([
      {
        name: 'auth_token',
        value: session.token,
        url: 'http://localhost:4000',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);

    await page.goto('/dashboard');

    const nav = page.getByRole('navigation');
    await expect(nav.getByText(session.displayName)).toBeVisible();
    await expect(nav.getByRole('button', { name: /^Explore$/i })).toBeVisible();
    await expect.poll(async () => page.evaluate(() => window.localStorage.getItem('auth_jwt'))).toBeTruthy();
  });

  test('should hide protected items when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should not see dashboard link
    await expect(page.getByRole('link', { name: /dashboard/i })).not.toBeVisible();
  });

  test('should sign out and redirect to home', async ({ page, request }) => {
    const session = await createAuthenticatedSession(request);
    await applySession(page, session.token);
    await page.goto('/dashboard');

    const nav = page.getByRole('navigation');
    // Click sign out
    await nav.getByRole('button', { name: new RegExp(session.displayName) }).click();
    await page.getByRole('button', { name: /sign out/i }).click();
    
    // Should redirect to home
    await expect(page).toHaveURL('/');
  });
});
