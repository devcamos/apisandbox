import { test, expect } from '@playwright/test';

test.describe('Phase 4: Principal-Level Architecture', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/phase-4');
  });

  test('should display phase goal', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Phase Goal/i })).toBeVisible();
    await expect(page.getByText(/enterprise-scale integration/i)).toBeVisible();
  });

  test('should display Contract Testing section with Java', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Contract Testing with Pact/i })).toBeVisible();
    await expect(page.getByText(/Java Contract Testing with Pact/i)).toBeVisible();
  });

  test('should display Java Pact consumer and provider examples', async ({ page }) => {
    await expect(page.getByText(/Java Consumer \(JUnit\)/i)).toBeVisible();
    await expect(page.getByText(/Java Provider Verification/i)).toBeVisible();
    await expect(page.getByText(/PactConsumerTestExt/i)).toBeVisible();
  });

  test('should display API Versioning Strategies', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /API Versioning Strategies/i })).toBeVisible();
    await expect(page.getByText(/URL Versioning/i)).toBeVisible();
    await expect(page.getByText(/Header Versioning/i)).toBeVisible();
  });

  test('should display Java Spring Boot API Versioning examples', async ({ page }) => {
    await expect(page.getByText(/Java Spring Boot API Versioning/i)).toBeVisible();
    await expect(page.getByText(/UserControllerV1/i)).toBeVisible();
    await expect(page.getByText(/UserControllerV2/i)).toBeVisible();
  });
});


