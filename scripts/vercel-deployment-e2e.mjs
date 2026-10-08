import path from "node:path"
import process from "node:process"
import { pathToFileURL } from "node:url"

const rawBaseUrl = process.env.BASE_URL || process.argv[2]

/**
 * Headers for Vercel Deployment Protection automation bypass.
 *
 * Node `fetch` has no cookie jar. Sending `x-vercel-set-bypass-cookie` makes
 * Vercel 307 to the same URL with Set-Cookie, which loops until the redirect
 * limit. Use `setCookie: false` for fetch-based health checks.
 *
 * Playwright browser/API contexts do maintain cookies, so `setCookie: true`
 * is appropriate for `extraHTTPHeaders` there.
 *
 * @param {string | undefined} bypassSecret
 * @param {{ setCookie?: boolean }} [options]
 * @returns {Record<string, string> | undefined}
 */
export function vercelAutomationBypassHeaders(bypassSecret, { setCookie = false } = {}) {
  if (!bypassSecret || !String(bypassSecret).trim()) return undefined
  const headers = {
    "x-vercel-protection-bypass": bypassSecret,
  }
  if (setCookie) {
    headers["x-vercel-set-bypass-cookie"] = "true"
  }
  return headers
}

export async function waitForHealthy(pathname, { baseUrl, headers, fetchImpl = fetch, attempts = 12, delayMs = 5_000 } = {}) {
  if (!baseUrl) throw new Error("baseUrl is required")
  const url = new URL(pathname, baseUrl)
  let lastError

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, { headers, redirect: "follow" })
      const body = await response.text()
      if (!response.ok) {
        throw new Error(`${pathname} returned HTTP ${response.status}: ${body.slice(0, 300)}`)
      }
      return body
    } catch (error) {
      lastError = error
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }

  throw lastError
}

export async function verifyDeployedDatabaseAndAuth({
  rawBaseUrl = process.env.BASE_URL,
  bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
  fetchImpl = fetch,
} = {}) {
  if (!rawBaseUrl) {
    throw new Error("BASE_URL is required")
  }

  const baseUrl = new URL(rawBaseUrl)
  if (baseUrl.protocol !== "https:" && baseUrl.hostname !== "localhost") {
    throw new Error("BASE_URL must use HTTPS")
  }

  // Fetch health checks: protection-bypass header only (no set-bypass-cookie).
  const headers = vercelAutomationBypassHeaders(bypassSecret, { setCookie: false })

  await Promise.all([
    waitForHealthy("/api/health/db", { baseUrl, headers, fetchImpl }),
    waitForHealthy("/api/health/auth", { baseUrl, headers, fetchImpl }),
  ])

  return baseUrl
}

async function main() {
  const baseUrl = await verifyDeployedDatabaseAndAuth({ rawBaseUrl })
  console.log(`Vercel database and auth health checks passed: ${baseUrl}`)
}

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
if (isEntryPoint) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
