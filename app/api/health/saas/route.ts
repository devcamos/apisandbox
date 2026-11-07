import { NextResponse } from "next/server"
import {
  evaluateSaasReadiness,
  saasDeploymentIdentity,
  saasReadinessSummary,
} from "@/lib/saas/config"

/**
 * SaaS readiness probe — use after deploy to verify billing, auth, and guardrails.
 * Does not expose secret values. Includes non-secret Vercel deploy identity so
 * Preview billing E2E can detect a stale shared webhook alias before TEST payments.
 */
export async function GET() {
  const checks = evaluateSaasReadiness()
  const summary = saasReadinessSummary(checks)

  return NextResponse.json(
    {
      data: {
        ...summary,
        checks,
        deployment: saasDeploymentIdentity(),
        environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
      },
    },
    { status: summary.ready ? 200 : 503 },
  )
}
