#!/usr/bin/env node
/**
 * Write public/openapi/v1.json from the Zod-backed OpenAPI builder.
 * Usage: node scripts/generate-openapi-v1.mjs
 */
const { spawnSync } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")
const os = require("node:os")

const root = path.join(__dirname, "..")
const tmpScript = path.join(os.tmpdir(), `apisandbox-openapi-v1-${process.pid}.mts`)

fs.writeFileSync(
  tmpScript,
  `
import fs from "node:fs"
import path from "node:path"
import { buildV1OpenApiDocument } from "@/lib/api/v1/openapi"
const out = path.resolve("public/openapi/v1.json")
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, JSON.stringify(buildV1OpenApiDocument(), null, 2) + "\\n")
console.log("Wrote", out)
`,
)

const result = spawnSync(
  "npx",
  ["vite-node", "--config", "vitest.config.ts", tmpScript],
  { cwd: root, encoding: "utf8", env: process.env },
)

try {
  fs.unlinkSync(tmpScript)
} catch {
  // ignore
}

if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr) process.stderr.write(result.stderr)
process.exit(result.status ?? 1)
