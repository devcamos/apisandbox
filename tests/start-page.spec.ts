import { test, expect } from '@playwright/test';

test.describe('Start Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/start');
  });

  test('should display the main title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'API Integration Training' })).toBeVisible();
    await expect(page.getByText('Master the art of API integrations from fundamentals to principal-level architecture')).toBeVisible();
  });

  test('should have working Start Learning button that scrolls to phases', async ({ page }) => {
    const startButton = page.getByRole('link', { name: 'Start Learning' });
    await expect(startButton).toBeVisible();
    await expect(startButton).toHaveAttribute('href', '#phases');
    
    // Click and verify it scrolls to phases section
    await startButton.click();
    await expect(page.getByRole('heading', { name: 'Choose Your Learning Path' })).toBeInViewport();
  });

  test('should explain what phases are', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Choose Your Learning Path' })).toBeVisible();
    
    // Check that we explain what phases are
    await expect(page.getByText('4 progressive phases')).toBeVisible();
    await expect(page.getByText('from API basics to advanced architecture patterns')).toBeVisible();
    
    // Check skill level indicators
    await expect(page.getByText('Phase 1 • Beginner')).toBeVisible();
    await expect(page.getByText('Phase 2 • Intermediate')).toBeVisible();
    await expect(page.getByText('Phase 3 • Advanced')).toBeVisible();
    await expect(page.getByText('Phase 4 • Expert')).toBeVisible();
  });

  test('should display all 4 phase cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Choose Your Learning Path' })).toBeVisible();
    
    // Check all phase cards are present
    await expect(page.getByText('Phase 1')).toBeVisible();
    await expect(page.getByText('Phase 2')).toBeVisible();
    await expect(page.getByText('Phase 3')).toBeVisible();
    await expect(page.getByText('Phase 4')).toBeVisible();
    
    // Check phase titles
    await expect(page.getByText('Integration Mindset')).toBeVisible();
    await expect(page.getByText('Third-Party Integrations')).toBeVisible();
    await expect(page.getByText('Inter-Service Communication')).toBeVisible();
    await expect(page.getByText('Principal-Level Architecture')).toBeVisible();
  });

  test('should have working phase links', async ({ page }) => {
    // Test Phase 1 link
    const phase1Link = page.getByRole('link', { name: /Phase 1.*Integration Mindset/ });
    await expect(phase1Link).toBeVisible();
    await expect(phase1Link).toHaveAttribute('href', '/phase-1');
    
    // Test Phase 2 link
    const phase2Link = page.getByRole('link', { name: /Phase 2.*Third-Party Integrations/ });
    await expect(phase2Link).toBeVisible();
    await expect(phase2Link).toHaveAttribute('href', '/phase-2');
  });

  test('should display learning journey section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Learning Journey' })).toBeVisible();
    
    // Check journey steps
    await expect(page.getByText('Learn Concepts')).toBeVisible();
    await expect(page.getByText('Build Projects')).toBeVisible();
    await expect(page.getByText('Test & Debug')).toBeVisible();
    await expect(page.getByText('Architect')).toBeVisible();
  });

  test('should display quick start guide', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quick Start Guide' })).toBeVisible();
    
    // Check quick start cards
    await expect(page.getByText('Read the Docs')).toBeVisible();
    await expect(page.getByText('Try Interactive Demos')).toBeVisible();
    await expect(page.getByText('Monitor Progress')).toBeVisible();
  });

  test('should have working quick start links', async ({ page }) => {
    // Test Read More link
    const readMoreLink = page.getByRole('link', { name: 'Read More' });
    await expect(readMoreLink).toBeVisible();
    await expect(readMoreLink).toHaveAttribute('href', '/phase-1');
    
    // Test Try Demos link
    const tryDemosLink = page.getByRole('link', { name: 'Try Demos' });
    await expect(tryDemosLink).toBeVisible();
    await expect(tryDemosLink).toHaveAttribute('href', '/phase-1/categories');
    
    // Test View Dashboard link
    const viewDashboardLink = page.getByRole('link', { name: 'View Dashboard' });
    await expect(viewDashboardLink).toBeVisible();
    await expect(viewDashboardLink).toHaveAttribute('href', '/observability');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main elements are still visible
    await expect(page.getByRole('heading', { name: 'API Integration Training' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Choose Your Learning Path' })).toBeVisible();
    
    // Check that phase cards stack properly
    await expect(page.getByText('Phase 1')).toBeVisible();
    await expect(page.getByText('Phase 2')).toBeVisible();
  });
});