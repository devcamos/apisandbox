import { test, expect } from '@playwright/test';

test.describe('Universal Technologies Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/phase-1');
  });

  test('should display all universal technology cards', async ({ page }) => {
    await expect(page.getByText(/HTTP - Universal Protocol/i)).toBeVisible();
    await expect(page.getByText(/JSON - Universal Data Format/i)).toBeVisible();
  });

  test('should display other universal technologies', async ({ page }) => {
    await expect(page.getByText(/REST|OAuth2|JWT|OpenAPI|Docker/i)).toBeVisible();
  });

  test('should display JSON Communicator details', async ({ page }) => {
    await expect(page.getByText(/JSON Communicator/i)).toBeVisible();
    await expect(page.getByText(/Microservices Communication/i)).toBeVisible();
  });

  test('should display JSON Schema examples', async ({ page }) => {
    await expect(page.getByText(/JSON Schema/i)).toBeVisible();
  });
});


