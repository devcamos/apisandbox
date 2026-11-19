import { spawnSync } from "node:child_process"

function run(args) {
  const result = spawnSync("npx", args, { stdio: "inherit", env: process.env })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run(["playwright", "test", "tests/prod-deployment-auth.spec.ts", "--project=prod-deployment"])
// The existing deployed-URL workflow checks out the exact deployment SHA and
// invokes test:prod. Run the first-party checkout journey for Preview.
if (process.env.DEPLOYMENT_ENVIRONMENT === "preview") {
  run(["playwright", "test", "tests/preview-checkout-handoff.spec.ts", "--config=playwright.preview-billing.config.ts"])
}
