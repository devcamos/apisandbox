import { test, expect } from '@playwright/test';

test.describe('API Routes', () => {
  test('should return AWS services list', async ({ request }) => {
    const response = await request.get('/api/aws/services');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  test('should return AWS services with correct structure', async ({ request }) => {
    const response = await request.get('/api/aws/services');
    const services = await response.json();
    
    if (services.length > 0) {
      const service = services[0];
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('category');
    }
  });

  test('should return migration strategies', async ({ request }) => {
    const response = await request.get('/api/aws/migration/strategies');
    expect(response.ok()).toBeTruthy();
  });

  test('should return cost estimate endpoint', async ({ request }) => {
    const response = await request.post('/api/aws/cost-estimate', {
      data: {
        services: ['ec2', 's3'],
        usage: { ec2: { instances: 2 }, s3: { storage: 100 } }
      }
    });
    expect(response.ok()).toBeTruthy();
  });
});


