import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate from homepage to start page', async ({ page }) => {
    await page.goto('/');
    
    const startButton = page.getByRole('link', { name: 'Start Learning' });
    await startButton.click();
    
    await expect(page).toHaveURL('/start');
    await expect(page.getByRole('heading', { name: 'Choose Your Learning Path' })).toBeVisible();
  });

  test('should navigate from start page to phase 1', async ({ page }) => {
    await page.goto('/start');
    
    const phase1Link = page.getByRole('link', { name: /Phase 1.*Integration Mindset/ });
    await phase1Link.click();
    
    await expect(page).toHaveURL('/phase-1');
    await expect(page.getByRole('heading', { name: 'Integration Mindset' })).toBeVisible();
  });

  test('should navigate from start page to observability dashboard', async ({ page }) => {
    await page.goto('/start');
    
    const dashboardLink = page.getByRole('link', { name: 'View Dashboard' });
    await dashboardLink.click();
    
    await expect(page).toHaveURL('/observability');
    await expect(page.getByRole('heading', { name: 'Live Observability Dashboard' })).toBeVisible();
  });

  test('should navigate from homepage to observability dashboard', async ({ page }) => {
    await page.goto('/');
    
    const dashboardButton = page.getByRole('link', { name: 'View Dashboard' });
    await dashboardButton.click();
    
    await expect(page).toHaveURL('/observability');
    await expect(page.getByRole('heading', { name: 'Live Observability Dashboard' })).toBeVisible();
  });

  test('should have working breadcrumb navigation', async ({ page }) => {
    await page.goto('/phase-1');
    
    // Check breadcrumb navigation
    const homeBreadcrumb = page.getByRole('link', { name: 'Home' });
    await expect(homeBreadcrumb).toBeVisible();
    await expect(homeBreadcrumb).toHaveAttribute('href', '/');
    
    const phase1Breadcrumb = page.getByRole('link', { name: 'Phase 1' });
    await expect(phase1Breadcrumb).toBeVisible();
    await expect(phase1Breadcrumb).toHaveAttribute('href', '/phase-1');
  });

  test('should navigate back to home via breadcrumb', async ({ page }) => {
    await page.goto('/phase-1');
    
    const homeBreadcrumb = page.getByRole('link', { name: 'Home' });
    await homeBreadcrumb.click();
    
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'API Integration Training' })).toBeVisible();
  });

  test('should show featured quick navigation results when search opens', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByLabel(/search pages, phases, topics/i);
    await searchInput.click();

    await expect(page.getByText('Featured Pages')).toBeVisible();
    await expect(page.getByRole('button', { name: /PostgreSQL \+ Prisma/i })).toBeVisible();
  });

  test('should store recent search selections for quick return navigation', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByLabel(/search pages, phases, topics/i);
    await searchInput.click();
    await searchInput.fill('postgres');

    await page.getByRole('button', { name: /PostgreSQL \+ Prisma/i }).click();

    await expect(page).toHaveURL('/phase-2/databases/postgresql');

    const pageSearchInput = page.getByLabel(/search pages, phases, topics/i);
    await pageSearchInput.click();

    await expect(page.getByText('Recent')).toBeVisible();
    await expect(page.getByRole('button', { name: /PostgreSQL \+ Prisma/i })).toBeVisible();
    await expect(page.getByText('Recent', { exact: true })).toBeVisible();
  });
});
