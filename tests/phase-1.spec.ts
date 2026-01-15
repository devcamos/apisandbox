import { test, expect } from '@playwright/test';

test.describe('Phase 1: Integration Mindset', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/phase-1');
  });

  test('should display phase goal section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Phase Goal/i })).toBeVisible();
    await expect(page.getByText(/evaluate when to use API calls/i)).toBeVisible();
  });

  test('should display Pareto Principle summary', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Pareto Principle/i })).toBeVisible();
    await expect(page.getByText(/20% That Matters/i)).toBeVisible();
  });

  test('should display Universal Technologies section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Universal Technologies/i })).toBeVisible();
    await expect(page.getByText(/HTTP - Universal Protocol/i)).toBeVisible();
    await expect(page.getByText(/JSON - Universal Data Format/i)).toBeVisible();
  });

  test('should display HTTP + JSON together section', async ({ page }) => {
    await expect(page.getByText(/HTTP \+ JSON = Universal API Communication/i)).toBeVisible();
  });

  test('should display JSON Communicator subsection', async ({ page }) => {
    await expect(page.getByText(/JSON Communicator/i)).toBeVisible();
    await expect(page.getByText(/universal data interchange format/i)).toBeVisible();
  });

  test('should display Java + React example in Universal Technologies', async ({ page }) => {
    await expect(page.getByText(/Java Backend \+ React Frontend/i)).toBeVisible();
    await expect(page.getByText(/@RestController/i)).toBeVisible();
    await expect(page.getByText(/useState/i)).toBeVisible();
  });

  test('should display API Categories section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /API Categories/i })).toBeVisible();
    await expect(page.getByText(/REST/i)).toBeVisible();
    await expect(page.getByText(/GraphQL/i)).toBeVisible();
    await expect(page.getByText(/gRPC/i)).toBeVisible();
  });

  test('should navigate to categories page', async ({ page }) => {
    const categoriesLink = page.getByRole('link', { name: /REST/i }).first();
    if (await categoriesLink.isVisible()) {
      await categoriesLink.click();
      await expect(page).toHaveURL(/phase-1\/categories/);
    }
  });
});


