import { spawnSync } from "node:child_process"
import { join } from "node:path"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { publishPlaywrightRunSummary } from "./playwright-run-summary.mjs"

function run(title, args) {
  const reportDir = process.env.GITHUB_STEP_SUMMARY ? mkdtempSync(join(tmpdir(), "apisandbox-playwright-")) : null
  const reportPath = reportDir ? join(reportDir, "results.json") : null
  try {
    const result = spawnSync("npx", reportPath ? [...args, "--reporter=html,list,json"] : args, {
      stdio: "inherit",
      env: reportPath ? { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: reportPath } : process.env,
    })
    if (result.error) throw result.error
    return result.status ?? 1
  } finally {
    if (reportPath) {
      publishPlaywrightRunSummary(title, reportPath)
      rmSync(reportDir, { recursive: true, force: true })
    }
  }
}

const authExit = run("API Sandbox deployed authentication", [
  "playwright", "test", "tests/prod-deployment-auth.spec.ts", "--project=prod-deployment",
])
// The deployed-URL workflow checks out the exact deployment SHA and invokes test:prod.
process.exitCode = authExit || (process.env.DEPLOYMENT_ENVIRONMENT === "preview"
  ? run("API Sandbox Preview checkout handoff", [
      "playwright", "test", "tests/preview-checkout-handoff.spec.ts", "--config=playwright.preview-billing.config.ts",
    ])
  : 0)
