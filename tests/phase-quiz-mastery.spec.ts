import { test, expect, type APIRequestContext } from "@playwright/test"
import { randomUUID } from "node:crypto"

async function createAuthenticatedUser(request: APIRequestContext) {
  const email = `quiz-${Date.now()}-${randomUUID()}@example.com`
  const response = await request.post("/api/auth/register", {
    data: {
      email,
      password: "Test1234!@#$",
      firstName: "Quiz",
      lastName: "User",
    },
  })

  expect(response.ok()).toBeTruthy()
  const body = await response.json()
  return body.data.token as string
}

test.describe("Phase quiz mastery", () => {
  test("surfaces strengths, gaps, redirects, and dashboard mastery status", async ({ page, request }) => {
    const token = await createAuthenticatedUser(request)

    await page.addInitScript((value) => {
      window.localStorage.setItem("auth_jwt", value)
    }, token)

    await page.goto("/phase-1")

    await expect(page.getByRole("heading", { name: /Phase 1 Checkpoint/i })).toBeVisible()
    await expect(page.getByText(/Use this as a short diagnostic/i)).toBeVisible()

    await page.getByLabel("REST").check()
    await page.getByLabel("When you need ultra-low binary overhead between internal services").check()
    await page.getByLabel("To guarantee immediate consistency everywhere").check()
    await page.getByLabel("Because browsers cannot read any other format").check()
    await page.getByLabel("When you want producers and consumers to be loosely coupled in time").check()

    await page.getByRole("button", { name: /Check my understanding/i }).click()

    await expect(page.getByRole("heading", { name: /Checkpoint result/i })).toBeVisible()
    await expect(page.getByText(/Needs reinforcement/i)).toBeVisible()
    await expect(page.getByText(/API style selection/i)).toBeVisible()
    await expect(page.getByText(/GraphQL fit/i)).toBeVisible()
    await expect(page.getByText(/Event-driven architecture/i)).toBeVisible()
    await expect(page.getByText(/Universal API standards/i)).toBeVisible()
    await expect(page.getByText(/Sync request-response/i)).toBeVisible()
    await expect(page.getByRole("link", { name: /Review GraphQL vs REST/i })).toBeVisible()
    await expect(page.getByRole("heading", { name: /✅ What's Next\\?/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /Continue to Phase 2/i })).toBeVisible()

    await page.goto("/dashboard")

    const masterySection = page.locator("section").filter({ hasText: "Checkpoint mastery across phases" })
    await expect(masterySection.getByRole("heading", { name: /Checkpoint mastery across phases/i })).toBeVisible()
    await expect(masterySection.getByText(/Next focus/i)).toBeVisible()
    const phaseCard = masterySection.getByRole("link", { name: /Integration Mindset/i })
    await expect(phaseCard).toContainText("Best checkpoint: 1/5")
    await expect(phaseCard).toContainText("Attempts: 1")
    await expect(phaseCard).toContainText("Needs reinforcement")
  })
})
