import { test, expect } from '@playwright/test';

test.describe('Cloud Services: AWS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cloud/aws/services');
  });

  test('should display AWS services page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /AWS Services/i })).toBeVisible();
  });

  test('should display Java + AWS Implementation Examples section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Java \+ AWS Implementation Examples/i })).toBeVisible();
  });

  test('should display AWS Lambda with Java example', async ({ page }) => {
    await expect(page.getByText(/AWS Lambda with Java/i)).toBeVisible();
    await expect(page.getByText(/RequestHandler/i)).toBeVisible();
    await expect(page.getByText(/APIGatewayProxyRequestEvent/i)).toBeVisible();
  });

  test('should display Docker + AWS ECS Deployment', async ({ page }) => {
    await expect(page.getByText(/Docker \+ AWS ECS Deployment/i)).toBeVisible();
    await expect(page.getByText(/Dockerfile/i)).toBeVisible();
    await expect(page.getByText(/ECS Task Definition/i)).toBeVisible();
  });

  test('should display API Gateway + Java Spring Boot', async ({ page }) => {
    await expect(page.getByText(/API Gateway \+ Java Spring Boot/i)).toBeVisible();
    await expect(page.getByText(/@RestController/i)).toBeVisible();
  });

  test('should display React Frontend + AWS S3 + CloudFront', async ({ page }) => {
    await expect(page.getByText(/React Frontend \+ AWS S3 \+ CloudFront/i)).toBeVisible();
    await expect(page.getByText(/React App Configuration/i)).toBeVisible();
    await expect(page.getByText(/AWS Deployment/i)).toBeVisible();
  });
});


