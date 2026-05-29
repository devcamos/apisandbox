import { NextResponse } from "next/server"
import { evaluateSaasReadiness, saasReadinessSummary } from "@/lib/saas/config"

/**
 * SaaS readiness probe — use after deploy to verify billing, auth, and guardrails.
 * Does not expose secret values.
 */
export async function GET() {
  const checks = evaluateSaasReadiness()
  const summary = saasReadinessSummary(checks)

  return NextResponse.json(
    {
      data: {
        ...summary,
        checks,
        environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
      },
    },
    { status: summary.ready ? 200 : 503 },
  )
}
