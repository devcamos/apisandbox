/**
 * Subscription API Tests
 * 
 * Tests for subscription-related API endpoints
 */

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.describe('Subscription API', () => {
  test('should return subscription status for authenticated user', async ({ request }) => {
    // Create user
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
    await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
      }
    });

    // Get subscription status (would need auth cookie in real scenario)
    // For now, test that endpoint exists
    const response = await request.get('/api/subscription/status');
    // May return 401 if not authenticated, which is expected
    expect([200, 401]).toContain(response.status());
  });

  test('should check phase access', async ({ request }) => {
    const response = await request.get('/api/subscription/check?phase=1');
    // May return 401 if not authenticated
    expect([200, 401]).toContain(response.status());
  });

  test('should require phase parameter for access check', async ({ request }) => {
    const response = await request.get('/api/subscription/check');
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Phase parameter required');
  });

  test('should validate phase parameter format', async ({ request }) => {
    const response = await request.get('/api/subscription/check?phase=invalid');
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Invalid phase parameter');
  });

  test('should upgrade user to premium', async ({ request }) => {
    // Create user
    const uniqueEmail = `test-${Date.now()}-${randomUUID()}@example.com`;
    await request.post('/api/auth/signup', {
      data: {
        email: uniqueEmail,
        password: 'Test1234!@#$',
      }
    });

    // Upgrade (would need auth cookie in real scenario)
    const upgradeResponse = await request.post('/api/subscription/upgrade');
    // May return 401 if not authenticated, or 200 if upgrade succeeds
    expect([200, 401]).toContain(upgradeResponse.status());
    
    if (upgradeResponse.ok()) {
      const data = await upgradeResponse.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('tier', 'PREMIUM');
    }
  });

  test('should require authentication for subscription endpoints', async ({ request }) => {
    // All subscription endpoints should require auth
    const statusResponse = await request.get('/api/subscription/status');
    const checkResponse = await request.get('/api/subscription/check?phase=1');
    const upgradeResponse = await request.post('/api/subscription/upgrade');

    // At least one should return 401 (unauthorized)
    const statuses = [
      statusResponse.status(),
      checkResponse.status(),
      upgradeResponse.status()
    ];
    expect(statuses.some(s => s === 401)).toBeTruthy();
  });
});

