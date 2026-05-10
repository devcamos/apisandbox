import { test, expect } from '@playwright/test';

test.describe('Java Docs Page', () => {
  test('should show curated "What to Master" links and ObjectMapper under-the-hood link', async ({ page }) => {
    await page.goto('/docs/java');

    await expect(page.getByRole('heading', { name: 'What to Master (Java)' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Read: RFC 9110 (HTTP Semantics)' })).toHaveAttribute(
      'href',
      'https://www.rfc-editor.org/rfc/rfc9110',
    );
    await expect(page.getByRole('link', { name: 'Read: Resilience4j docs' })).toHaveAttribute(
      'href',
      'https://resilience4j.readme.io/',
    );
    await expect(page.getByRole('link', { name: 'Read: OWASP Authentication Cheat Sheet' })).toHaveAttribute(
      'href',
      'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
    );
    await expect(page.getByRole('link', { name: 'Read: PostgreSQL transactions' })).toHaveAttribute(
      'href',
      'https://www.postgresql.org/docs/current/tutorial-transactions.html',
    );
    await expect(page.getByRole('link', { name: 'Read: OpenTelemetry observability primer' })).toHaveAttribute(
      'href',
      'https://opentelemetry.io/docs/concepts/observability-primer/',
    );
    await expect(page.getByRole('link', { name: 'Read: Testcontainers' })).toHaveAttribute(
      'href',
      'https://www.testcontainers.org/',
    );

    // Mapping table: JSON row should link to ObjectMapper implementation.
    await expect(page.getByRole('link', { name: 'ObjectMapper' }).first()).toHaveAttribute(
      'href',
      'https://github.com/FasterXML/jackson-databind/blob/master/src/main/java/com/fasterxml/jackson/databind/ObjectMapper.java',
    );
  });
});

