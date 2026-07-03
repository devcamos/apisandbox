import { existsSync } from "node:fs";
import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ??
  (process.env.CI ? "http://127.0.0.1:4000" : "http://localhost:4000");

const useProdServer =
  process.env.CI_E2E_USE_PROD_SERVER === "1" && existsSync(".next/BUILD_ID");

const useStandaloneServer =
  useProdServer && existsSync(".next/standalone/server.js");

const ciWebServerCommand = useStandaloneServer
  ? "node .next/standalone/server.js"
  : useProdServer
    ? "npx next start -H 127.0.0.1 -p 4000"
    : "npx next dev -H 127.0.0.1 -p 4000 --webpack";

const ciWorkers = process.env.PLAYWRIGHT_WORKERS
  ? Number.parseInt(process.env.PLAYWRIGHT_WORKERS, 10)
  : 1;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Smoke runs can override workers via PLAYWRIGHT_WORKERS (default 1 on CI). */
  workers: process.env.CI ? ciWorkers : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list']
  ],
  
  /* Coverage threshold - fail if below 80% */
  expect: {
    /* Maximum time expect() should wait for the condition to be met. */
    timeout: process.env.CI ? 15_000 : 5000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },

    /* Staging: run against already-running staging (e.g. Docker). Add with: STAGING_TEST=1 npm run test:staging */
    ...(process.env.STAGING_TEST
      ? [
          {
            name: 'staging',
            use: {
              baseURL: process.env.STAGING_URL || 'http://localhost:4000',
            },
          },
        ]
      : []),
    ...(process.env.PLAYWRIGHT_PROD_URL
      ? [
          {
            name: 'prod-deployment',
            testMatch: '**/prod-deployment-auth.spec.ts',
            use: {
              baseURL: process.env.PLAYWRIGHT_PROD_URL.replace(/\/$/, ''),
            },
          },
        ]
      : []),
  ],

  /* Run your local dev server before starting the tests (skip when running staging tests) */
  webServer: process.env.STAGING_TEST
    ? undefined
    : {
        // CI: reuse lint-and-build output via `next start` when CI_E2E_USE_PROD_SERVER=1.
        command: process.env.CI ? ciWebServerCommand : "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: process.env.CI ? (useProdServer ? 60 * 1000 : 180 * 1000) : 120 * 1000,
        env: {
          NODE_ENV: "test",
          ...(useStandaloneServer
            ? { HOSTNAME: "127.0.0.1", PORT: "4000" }
            : {}),
        },
      },
});
