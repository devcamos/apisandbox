import { appendFileSync, readFileSync } from "node:fs"

const outcomes = {
  expected: "✅ Passed",
  unexpected: "❌ Failed",
  flaky: "🟠 Flaky",
  skipped: "⏭️ Skipped",
}

function cell(text) {
  return String(text).replace(/\s+/g, " ").replace(/[\\`*_{}\[\]<>|@]/g, "\\$&").trim()
}

function collectResults(suites, parents = []) {
  return (suites ?? []).flatMap((suite) => {
    const titles = suite.title ? [...parents, suite.title] : parents
    return [
      ...(suite.specs ?? []).flatMap((spec) => (spec.tests ?? []).map((test) => ({
        title: [...titles, spec.title].filter(Boolean).join(" › "),
        project: test.projectName || "—",
        result: Object.hasOwn(outcomes, test.status) ? outcomes[test.status] : "— Not reported",
      }))),
      ...collectResults(suite.suites, titles),
    ]
  })
}

export function formatPlaywrightRunSummary(title, report) {
  const rows = collectResults(report?.suites)
  const heading = `## ${cell(title)}\n\n`
  if (!rows.length) return heading + "No individual test results were recorded. Check the run log.\n\n"

  const stats = report.stats ?? {}
  return heading + [
    `Passed: ${stats.expected ?? 0} · Failed: ${stats.unexpected ?? 0} · Flaky: ${stats.flaky ?? 0} · Skipped: ${stats.skipped ?? 0}`,
    `Total: ${rows.length} · Duration: ${Math.round((stats.duration ?? 0) / 1000)}s`,
    "",
    "| Test | Browser or project | Result |",
    "| --- | --- | --- |",
    ...rows.map((row) => `| ${cell(row.title)} | ${cell(row.project)} | ${row.result} |`),
    "",
    "",
  ].join("\n")
}

export function publishPlaywrightRunSummary(title, reportPath) {
  const destination = process.env.GITHUB_STEP_SUMMARY
  if (!destination) return
  let report
  try {
    report = JSON.parse(readFileSync(reportPath, "utf8"))
  } catch {
    // Playwright may exit before the reporter runs, for example on configuration errors.
  }
  appendFileSync(destination, formatPlaywrightRunSummary(title, report))
}
