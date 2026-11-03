import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import { AppError } from "@/lib/http/errors"

const requireAuthenticatedUser = vi.hoisted(() => vi.fn())
const assertPhaseAccessForUser = vi.hoisted(() => vi.fn())
const applyRateLimit = vi.hoisted(() => vi.fn())

vi.mock("@/lib/auth/jwt-auth-middleware", () => ({ requireAuthenticatedUser }))
vi.mock("@/lib/auth/demo-guards", () => ({ assertPhaseAccessForUser }))
vi.mock("@/lib/http/apply-rate-limit", () => ({ applyRateLimit }))

import { GET as services } from "@/app/api/aws/services/route"
import { GET as strategies } from "@/app/api/aws/migration/strategies/route"
import { GET as templates } from "@/app/api/aws/architecture/templates/route"
import { POST as analyze } from "@/app/api/aws/migration/analyze/route"
import { POST as costEstimate } from "@/app/api/aws/cost-estimate/route"

const user = { id: "user-9", email: "learner@example.com" }
const base = "http://localhost/api/aws"

const routes: Array<[string, (r: NextRequest) => Promise<Response>, () => NextRequest]> = [
  ["services", services, () => new NextRequest(`${base}/services`)],
  ["migration/strategies", strategies, () => new NextRequest(`${base}/migration/strategies`)],
  ["architecture/templates", templates, () => new NextRequest(`${base}/architecture/templates`)],
  [
    "migration/analyze",
    analyze,
    () =>
      new NextRequest(`${base}/migration/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentArchitecture: "monolith", trafficGB: 10, computeHours: 100 }),
      }),
  ],
  [
    "cost-estimate",
    costEstimate,
    () =>
      new NextRequest(`${base}/cost-estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trafficGB: 100, computeHours: 720, strategy: "refactor" }),
      }),
  ],
]

describe("AWS Cloud tool routes", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthenticatedUser.mockResolvedValue(user)
    assertPhaseAccessForUser.mockResolvedValue(undefined)
    applyRateLimit.mockResolvedValue({ blocked: null, result: { allowed: true, remaining: 1, resetAt: 0 } })
  })

  it.each(routes)("%s requires a session (401)", async (_name, handler, req) => {
    requireAuthenticatedUser.mockRejectedValue(new AppError("Missing auth token", 401, "auth_failure"))
    expect((await handler(req())).status).toBe(401)
  })

  it.each(routes)("%s requires Cloud access (403)", async (_name, handler, req) => {
    assertPhaseAccessForUser.mockRejectedValue(new AppError("Upgrade required", 403, "auth_failure"))
    expect((await handler(req())).status).toBe(403)
    expect(assertPhaseAccessForUser).toHaveBeenCalledWith(user, "cloud")
  })

  it.each(routes)("%s is rate-limited per user (429)", async (_name, handler, req) => {
    applyRateLimit.mockResolvedValue({ blocked: new Response(null, { status: 429 }) })
    expect((await handler(req())).status).toBe(429)
    expect(applyRateLimit.mock.calls[0][2]).toBe("aws-tools:user-9")
  })

  it.each(routes)("%s responds for a premium user", async (_name, handler, req) => {
    const res = await handler(req())
    expect(res.status).toBeLessThan(500)
    expect(res.status).not.toBe(401)
    expect(res.status).not.toBe(403)
  })
})
