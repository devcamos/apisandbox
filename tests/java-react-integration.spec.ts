import { test, expect } from '@playwright/test';

test.describe('Java + React Integration Examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/phase-2');
  });

  test('should display React + Java meeting point section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Where Backend Meets Frontend/i })).toBeVisible();
    await expect(page.getByText(/React \+ Java/i)).toBeVisible();
  });

  test('should display API contract visual', async ({ page }) => {
    await expect(page.getByText(/The API Contract/i)).toBeVisible();
    await expect(page.getByText(/React Frontend/i)).toBeVisible();
    await expect(page.getByText(/Java Backend/i)).toBeVisible();
  });

  test('should display complete user fetching example', async ({ page }) => {
    await expect(page.getByText(/Complete Example: Fetching a User/i)).toBeVisible();
  });

  test('should display key takeaways', async ({ page }) => {
    await expect(page.getByText(/Key Takeaways/i)).toBeVisible();
    await expect(page.getByText(/Contract First/i)).toBeVisible();
  });
});


