import { test, expect } from '@playwright/test';

test.describe('Phase 3: Inter-Service Communication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/phase-3');
  });

  test('should display phase goal', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Phase Goal/i })).toBeVisible();
    await expect(page.getByText(/service-to-service communication/i)).toBeVisible();
  });

  test('should display gRPC section with Java examples', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /gRPC & Protocol Buffers/i })).toBeVisible();
    await expect(page.getByText(/Java gRPC Implementation/i)).toBeVisible();
    await expect(page.getByText(/UserServiceImpl/i)).toBeVisible();
  });

  test('should display Java gRPC server and client examples', async ({ page }) => {
    await expect(page.getByText(/Java gRPC Server/i)).toBeVisible();
    await expect(page.getByText(/Java gRPC Client/i)).toBeVisible();
    await expect(page.getByText(/@GrpcService/i)).toBeVisible();
  });

  test('should display Kafka section with Java examples', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Event-Driven Architecture with Kafka/i })).toBeVisible();
    await expect(page.getByText(/Java Spring Boot/i)).toBeVisible();
    await expect(page.getByText(/@KafkaListener/i)).toBeVisible();
  });

  test('should display Docker containerization examples', async ({ page }) => {
    await expect(page.getByText(/Docker Containerization/i)).toBeVisible();
    await expect(page.getByText(/Dockerfile for Java Spring Boot/i)).toBeVisible();
    await expect(page.getByText(/Docker Compose for Microservices/i)).toBeVisible();
  });

  test('should display Dockerfile example', async ({ page }) => {
    await expect(page.getByText(/FROM maven/i)).toBeVisible();
    await expect(page.getByText(/eclipse-temurin/i)).toBeVisible();
  });

  test('should display Docker Compose example', async ({ page }) => {
    await expect(page.getByText(/docker-compose/i)).toBeVisible();
    await expect(page.getByText(/java-api/i)).toBeVisible();
  });
});


