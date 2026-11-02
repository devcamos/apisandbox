import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import { AppError } from "@/lib/http/errors"
import { AIF_C01_QUESTION_BANK } from "@/lib/learning/aif-c01-question-bank"

const requireAuthenticatedUser = vi.hoisted(() => vi.fn())
const assertPhaseAccessForUser = vi.hoisted(() => vi.fn())
const applyRateLimit = vi.hoisted(() => vi.fn())

vi.mock("@/lib/auth/jwt-auth-middleware", () => ({ requireAuthenticatedUser }))
vi.mock("@/lib/auth/demo-guards", () => ({ assertPhaseAccessForUser }))
vi.mock("@/lib/http/apply-rate-limit", () => ({ applyRateLimit }))

import { POST } from "@/app/api/learning/aif-c01-practice/grade/route"

const URL = "http://localhost/api/learning/aif-c01-practice/grade"
const user = { id: "user-1", email: "learner@example.com" }

function post(body: unknown) {
  return POST(
    new NextRequest(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  )
}

function validBody(count = 2) {
  const questions = AIF_C01_QUESTION_BANK.slice(0, count)
  return {
    questionIds: questions.map((q) => q.id),
    answers: Object.fromEntries(questions.map((q) => [q.id, [...q.correctOptionIds]])),
  }
}

describe("POST /api/learning/aif-c01-practice/grade", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthenticatedUser.mockResolvedValue(user)
    assertPhaseAccessForUser.mockResolvedValue(undefined)
    applyRateLimit.mockResolvedValue({ blocked: null, result: { allowed: true, remaining: 9, resetAt: 0 } })
  })

  it("returns 401 without a session", async () => {
    requireAuthenticatedUser.mockRejectedValue(new AppError("Missing auth token", 401, "auth_failure"))
    const res = await post(validBody())
    expect(res.status).toBe(401)
    expect(assertPhaseAccessForUser).not.toHaveBeenCalled()
  })

  it("returns 403 for users without Cloud access", async () => {
    assertPhaseAccessForUser.mockRejectedValue(new AppError("Upgrade required", 403, "auth_failure"))
    const res = await post(validBody())
    expect(res.status).toBe(403)
    expect(assertPhaseAccessForUser).toHaveBeenCalledWith(user, "cloud")
  })

  it("rate-limits per user", async () => {
    applyRateLimit.mockResolvedValue({ blocked: new Response(null, { status: 429 }) })
    const res = await post(validBody())
    expect(res.status).toBe(429)
    expect(applyRateLimit.mock.calls[0][2]).toBe("aif-practice:user-1")
  })

  it("grades a valid practice payload for a premium user", async () => {
    const res = await post(validBody())
    expect(res.status).toBe(200)
    const payload = await res.json()
    expect(payload.data.correctCount).toBe(2)
    expect(payload.data.details[0].options[0].explanation).toBeTruthy()
  })

  it("rejects malformed bodies and unknown ids", async () => {
    expect((await post("{not json")).status).toBe(400)
    expect((await post({ questionIds: [], answers: {} })).status).toBe(400)
    expect((await post({ questionIds: ["x"], answers: [] })).status).toBe(400)
    expect((await post({ questionIds: ["missing-id"], answers: { "missing-id": ["a"] } })).status).toBe(404)
    const tooMany = Array.from({ length: 41 }, (_, i) => `q-${i}`)
    expect((await post({ questionIds: tooMany, answers: {} })).status).toBe(400)
  })
})
