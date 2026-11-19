import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { AppError } from "@/lib/http/errors"

const { requireAuthenticatedUser, assertPhaseAccessForUser, applyRateLimit, parse } = vi.hoisted(() => ({
  requireAuthenticatedUser: vi.fn(),
  assertPhaseAccessForUser: vi.fn(),
  applyRateLimit: vi.fn(),
  parse: vi.fn(),
}))

vi.mock("@/lib/auth/jwt-auth-middleware", () => ({ requireAuthenticatedUser }))
vi.mock("@/lib/auth/demo-guards", () => ({ assertPhaseAccessForUser }))
vi.mock("@/lib/http/apply-rate-limit", () => ({ applyRateLimit }))
vi.mock("openai", () => ({
  default: class {
    responses = { parse }
  },
}))

import { POST } from "@/app/api/learning/capability-explanations/route"

const draft = "Training estimates parameters and inference uses the frozen approved artifact."

function send(unitId = "training-vs-inference", explanation = draft) {
  return POST(new NextRequest("http://localhost/api/learning/capability-explanations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ unitId, draft: explanation }),
  }))
}

describe("capability rubric endpoint", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv("OPENAI_API_KEY", "mock-rubric-key")
    requireAuthenticatedUser.mockResolvedValue({ id: "learner", email: "learner@example.com" })
    assertPhaseAccessForUser.mockResolvedValue(undefined)
    applyRateLimit.mockResolvedValue({ blocked: null })
    parse.mockResolvedValue({ output_parsed: { results: [
      { status: "missing", feedback: "Which examples are held out?" },
      { status: "covered", feedback: "You kept the inference artifact frozen." },
      { status: "partial", feedback: "How would you roll back the version?" },
    ] } })
  })

  afterEach(() => vi.unstubAllEnvs())

  it("uses the server rubric, returns targeted links, and omits assessment answers", async () => {
    const response = await send()
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.data).toMatchObject([
      { criterion: "Data split", status: "missing", href: "#stage-learn-mechanism" },
      { criterion: "Parameter boundary", status: "covered" },
      { criterion: "Version and rollback", status: "partial", href: "#stage-learn-trade-offs" },
    ])
    expect(parse.mock.calls[0][0]).toMatchObject({ store: false })
    const input = JSON.parse(parse.mock.calls[0][0].input)
    expect(input.draft).toBe(draft)
    expect(input).not.toHaveProperty("questions")
    expect(input.criteria).toEqual(["Data split", "Parameter boundary", "Version and rollback"])
  })

  it("grades a domain reflection against its own criteria", async () => {
    const response = await send("foundation-model-applications")
    expect(response.status).toBe(200)
    expect((await response.json()).data[0]).toMatchObject({
      criterion: "Explain how retrieval supplies current evidence at inference",
      href: expect.stringContaining("/capabilities/rag#stage-learn-mechanism"),
    })
  })

  it("blocks unauthorized and rate-limited requests before calling the provider", async () => {
    requireAuthenticatedUser.mockRejectedValueOnce(new AppError("Sign in", 401, "auth_failure"))
    expect((await send()).status).toBe(401)
    applyRateLimit.mockResolvedValueOnce({ blocked: new Response(null, { status: 429 }) })
    expect((await send()).status).toBe(429)
    expect(parse).not.toHaveBeenCalled()
  })

  it("rejects invalid drafts and incomplete provider feedback", async () => {
    expect((await send("training-vs-inference", "short")).status).toBe(400)
    expect((await send("unknown-unit")).status).toBe(404)
    parse.mockResolvedValueOnce({ output_parsed: { results: [] } })
    expect((await send()).status).toBe(502)
  })
})
