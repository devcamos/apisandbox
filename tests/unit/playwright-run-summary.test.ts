import { expect, it } from "vitest"
import { formatPlaywrightRunSummary } from "../../scripts/playwright-run-summary.mjs"

it("lists per-project pass, fail, flaky and skipped results", () => {
  const summary = formatPlaywrightRunSummary("E2E smoke", {
    stats: { expected: 1, unexpected: 1, flaky: 1, skipped: 1 },
    suites: [{
      title: "Checkout",
      suites: [{
        title: "Return paths",
        specs: [
          { title: "Success | confirmation", tests: [{ projectName: "Chromium", status: "expected" }] },
          { title: "Cancelled checkout", tests: [{ projectName: "Chromium", status: "unexpected" }] },
          { title: "Successful retry", tests: [{ projectName: "Mobile Safari", status: "flaky" }] },
          { title: "Excluded scenario", tests: [{ projectName: "Mobile Safari", status: "skipped" }] },
        ],
      }],
    }],
  })

  expect(summary).toContain("Passed: 1 · Failed: 1 · Flaky: 1 · Skipped: 1")
  expect(summary).toContain("| Checkout › Return paths › Success \\| confirmation | Chromium | ✅ Passed |")
  expect(summary).toContain("| Chromium | ❌ Failed |")
  expect(summary).toContain("| Mobile Safari | 🟠 Flaky |")
  expect(summary).toContain("| Mobile Safari | ⏭️ Skipped |")
})

it("makes missing Playwright results explicit", () => {
  expect(formatPlaywrightRunSummary("Hosted E2E", undefined)).toContain("No individual test results were recorded")
})
