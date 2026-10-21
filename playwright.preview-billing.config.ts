import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.PLAYWRIGHT_PROD_URL || process.env.PLAYWRIGHT_BASE_URL
if (!baseURL || process.env.DEPLOYMENT_ENVIRONMENT !== "preview") {
  throw new Error("Set a deployed Preview URL and DEPLOYMENT_ENVIRONMENT=preview")
}
const origin = new URL(baseURL)
if (origin.protocol !== "https:" || !origin.hostname.endsWith(".vercel.app") || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) {
  throw new Error("Billing E2E requires a bare HTTPS Vercel Preview origin")
}

export default defineConfig({
  testDir: "./tests",
  testMatch: process.env.PREVIEW_BILLING_SIGNED_DIAGNOSTIC === "1"
    ? "**/preview-billing.spec.ts"
    : "**/preview-premium-upgrade.spec.ts",
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: origin.origin,
    trace: "off",
    screenshot: "off",
    video: "off",
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? { "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
      : undefined,
    proxy: process.env.PREVIEW_E2E_PROXY ? { server: process.env.PREVIEW_E2E_PROXY } : undefined,
  },
})
