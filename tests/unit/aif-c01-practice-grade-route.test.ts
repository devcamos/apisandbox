import { describe, expect, it } from "vitest"
import { POST } from "@/app/api/learning/aif-c01-practice/grade/route"
import { AIF_C01_QUESTION_BANK } from "@/lib/learning/aif-c01-question-bank"

describe("POST /api/learning/aif-c01-practice/grade", () => {
  it("grades a valid practice payload", async () => {
    const questions = AIF_C01_QUESTION_BANK.slice(0, 2)
    const response = await POST(
      new Request("http://localhost/api/learning/aif-c01-practice/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIds: questions.map((question) => question.id),
          answers: Object.fromEntries(
            questions.map((question) => [question.id, [...question.correctOptionIds]]),
          ),
        }),
      }),
    )

    expect(response.status).toBe(200)
    const payload = await response.json()
    expect(payload.data.correctCount).toBe(2)
    expect(payload.data.details[0].options[0].explanation).toBeTruthy()
  })

  it("rejects malformed bodies and unknown ids", async () => {
    const bad = await POST(
      new Request("http://localhost/api/learning/aif-c01-practice/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIds: [], answers: {} }),
      }),
    )
    expect(bad.status).toBe(400)

    const missing = await POST(
      new Request("http://localhost/api/learning/aif-c01-practice/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIds: ["does-not-exist"],
          answers: { "does-not-exist": ["A"] },
        }),
      }),
    )
    expect(missing.status).toBe(404)
  })
})
