const rawBaseUrl = process.env.BASE_URL || process.argv[2]

if (!rawBaseUrl) {
  throw new Error('BASE_URL is required')
}

const baseUrl = new URL(rawBaseUrl)
if (baseUrl.protocol !== 'https:' && baseUrl.hostname !== 'localhost') {
  throw new Error('BASE_URL must use HTTPS')
}

const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
const headers = bypassSecret
  ? {
      'x-vercel-protection-bypass': bypassSecret,
      'x-vercel-set-bypass-cookie': 'true',
    }
  : undefined

async function waitForHealthy(pathname) {
  const url = new URL(pathname, baseUrl)
  let lastError

  for (let attempt = 1; attempt <= 12; attempt += 1) {
    try {
      const response = await fetch(url, { headers, redirect: 'follow' })
      const body = await response.text()
      if (!response.ok) {
        throw new Error(`${pathname} returned HTTP ${response.status}: ${body.slice(0, 300)}`)
      }
      return body
    } catch (error) {
      lastError = error
      if (attempt < 12) {
        await new Promise((resolve) => setTimeout(resolve, 5_000))
      }
    }
  }

  throw lastError
}

await Promise.all([
  waitForHealthy('/api/health/db'),
  waitForHealthy('/api/health/auth'),
])

console.log(`Vercel database and auth health checks passed: ${baseUrl}`)
