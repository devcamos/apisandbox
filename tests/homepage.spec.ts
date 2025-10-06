import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'API Integration Training' })).toBeVisible();
    await expect(page.getByText('Master the art of API integrations from fundamentals to principal-level architecture')).toBeVisible();
  });

  test('should have working Start Learning button', async ({ page }) => {
    const startButton = page.getByRole('link', { name: 'Start Learning' });
    await expect(startButton).toBeVisible();
    await expect(startButton).toHaveAttribute('href', '/start');
  });

  test('should have working View Dashboard button', async ({ page }) => {
    const dashboardButton = page.getByRole('link', { name: 'View Dashboard' });
    await expect(dashboardButton).toBeVisible();
    await expect(dashboardButton).toHaveAttribute('href', '/observability');
  });

  test('should display features section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Why Choose Our Training?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Interactive Demos' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Comprehensive Learning' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Real-time Metrics' })).toBeVisible();
  });

  test('should display stats section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: "What You'll Master" })).toBeVisible();
    await expect(page.getByText('5')).toBeVisible(); // API Types
    await expect(page.getByText('10+')).toBeVisible(); // Resilience Patterns
    await expect(page.getByText('4')).toBeVisible(); // Learning Phases
    await expect(page.getByText('100%')).toBeVisible(); // Hands-on
  });

  test('should have final CTA section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ready to Start?' })).toBeVisible();
    const finalCTA = page.getByRole('link', { name: 'Start Your Journey' });
    await expect(finalCTA).toBeVisible();
    await expect(finalCTA).toHaveAttribute('href', '/start');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main elements are still visible
    await expect(page.getByRole('heading', { name: 'API Integration Training' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start Learning' })).toBeVisible();
  });
});
