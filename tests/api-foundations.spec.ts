import { expect, test, type APIRequestContext } from "@playwright/test"
import { randomUUID } from "node:crypto"

const courseId = "api-foundations-v1"
const unitId = "programs-and-state"

async function createAuthenticatedSession(request: APIRequestContext) {
  const response = await request.post("/api/auth/register", {
    data: {
      email: `foundations-${Date.now()}-${randomUUID()}@example.com`,
      password: "Test1234!@#$",
      firstName: "Foundation",
      lastName: "Learner",
    },
  })
  expect(response.ok()).toBeTruthy()
  const body = await response.json()
  return body.data.token as string
}

test.describe("First-principles API foundations", () => {
  test("shows linkable units and reveals a request trace", async ({ page }) => {
    await page.goto(`/learn/api-foundations/${unitId}`)

    await expect(page.getByRole("article").getByRole("heading", { name: /programs, state, and async work/i })).toBeVisible()
    await expect(page.getByText(/one evolving system/i)).toBeVisible()
    await page.getByText("Wait for the lookup to settle", { exact: true }).click()
    await expect(page.getByText(/request trace/i)).toBeVisible()
    await expect(page.getByText(/result settles/i)).toBeVisible()
    await expect(page.getByRole("link", { name: /machines, processes, and ports/i }).last()).toBeVisible()
  })

  test("requires authentication for assessment APIs and keeps the best result", async ({ request }) => {
    const endpoint = `/api/learning/assessments/${courseId}/${unitId}`
    const unauthorized = await request.get(endpoint)
    expect(unauthorized.status()).toBe(401)

    const token = await createAuthenticatedSession(request)
    const headers = { Authorization: `Bearer ${token}` }
    const missingAnswers = await request.post(endpoint, { headers, data: { answers: {} } })
    expect(missingAnswers.status()).toBe(400)

    const firstAttempt = await request.post(endpoint, {
      headers,
      data: {
        answers: {
          "async-result": "A completed response",
          "async-failure": "await prevents all failures",
        },
      },
    })
    expect(firstAttempt.ok()).toBeTruthy()
    expect((await firstAttempt.json()).data.progress.bestCorrectAnswers).toBe(0)

    const correctAttempt = await request.post(endpoint, {
      headers,
      data: {
        answers: {
          "async-result": "A value that may arrive or fail later",
          "async-failure": "Networks and servers can fail after work starts",
        },
      },
    })
    expect(correctAttempt.ok()).toBeTruthy()
    expect((await correctAttempt.json()).data.result.mastered).toBe(true)

    const summary = await request.get(`/api/learning/assessments/${courseId}`, { headers })
    expect(summary.ok()).toBeTruthy()
    expect((await summary.json()).data.masteredUnits).toBe(1)
  })
})
