import { test, expect } from '@playwright/test';

test.describe('Phase 2: Third-Party Integrations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/phase-2');
  });

  test('should display phase goal', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Phase Goal/i })).toBeVisible();
    await expect(page.getByText(/safely integrate with external APIs/i)).toBeVisible();
  });

  test('should display Where Backend Meets Frontend section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Where Backend Meets Frontend/i })).toBeVisible();
    await expect(page.getByText(/React \+ Java/i)).toBeVisible();
    await expect(page.getByText(/API contract/i)).toBeVisible();
  });

  test('should display API Contract visual representation', async ({ page }) => {
    await expect(page.getByText(/The API Contract/i)).toBeVisible();
    await expect(page.getByText(/React Frontend/i)).toBeVisible();
    await expect(page.getByText(/Java Backend/i)).toBeVisible();
  });

  test('should display complete user fetching example', async ({ page }) => {
    await expect(page.getByText(/Complete Example: Fetching a User/i)).toBeVisible();
    await expect(page.getByText(/React Frontend/i)).toBeVisible();
    await expect(page.getByText(/Java Backend/i)).toBeVisible();
  });

  test('should display JSON contract structure', async ({ page }) => {
    await expect(page.getByText(/The JSON Contract Structure/i)).toBeVisible();
    await expect(page.getByText(/Request \(React → Java\)/i)).toBeVisible();
    await expect(page.getByText(/Response \(Java → React\)/i)).toBeVisible();
  });

  test('should display OAuth2 examples with Java', async ({ page }) => {
    await expect(page.getByText(/OAuth2 Flow/i)).toBeVisible();
    await expect(page.getByText(/Java Spring Boot/i)).toBeVisible();
    await expect(page.getByText(/@RestController/i)).toBeVisible();
  });

  test('should display JWT Validation examples with Java', async ({ page }) => {
    await expect(page.getByText(/JWT Validation/i)).toBeVisible();
    await expect(page.getByText(/JwtService/i)).toBeVisible();
  });

  test('should display Resilience Patterns', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Resilience Patterns/i })).toBeVisible();
    await expect(page.getByText(/Retries & Exponential Backoff/i)).toBeVisible();
    await expect(page.getByText(/Circuit Breaker/i)).toBeVisible();
  });

  test('should display Java Resilience4j examples', async ({ page }) => {
    await expect(page.getByText(/Resilience4j/i)).toBeVisible();
    await expect(page.getByText(/@Retry/i)).toBeVisible();
    await expect(page.getByText(/@CircuitBreaker/i)).toBeVisible();
  });
});


