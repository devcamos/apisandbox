import { test, expect, type APIRequestContext } from "@playwright/test"
import { randomUUID } from "node:crypto"

async function createAuthenticatedSession(request: APIRequestContext) {
  const uniqueEmail = `phase0-${Date.now()}-${randomUUID()}@example.com`
  const response = await request.post("/api/auth/register", {
    data: {
      email: uniqueEmail,
      password: "Test1234!@#$",
      firstName: "Phase",
      lastName: "Zero",
    },
  })

  expect(response.ok()).toBeTruthy()
  const body = await response.json()
  return {
    token: body.data.token as string,
  }
}

async function applySession(page: Parameters<typeof test>[0]["page"], token: string) {
  await page.context().addCookies([
    {
      name: "auth_token",
      value: token,
      url: "http://localhost:4000",
      httpOnly: true,
      sameSite: "Lax",
    },
  ])

  await page.addInitScript((sessionToken) => {
    window.localStorage.setItem("auth_jwt", sessionToken)
  }, token)
}

test.describe("Phase 0: Getting Started", () => {
  test("opens Spring term details with code sample and implementation notes", async ({
    page,
    request,
  }) => {
    const session = await createAuthenticatedSession(request)
    await applySession(page, session.token)
    await page.goto("/phase-0")

    await page.getByRole("button", { name: /@Async/i }).click()

    await expect(page.getByRole("heading", { name: "@Async" })).toBeVisible()
    await expect(page.getByText(/Async service boundary/i)).toBeVisible()
    await expect(page.getByText(/Use @Async at a clear service boundary/i)).toBeVisible()
    await expect(page.getByText(/Back @Async with an explicit executor/i)).toBeVisible()
    await expect(page.getByText(/Self-invocation does not pass through Spring’s proxy/i)).toBeVisible()
  })
})
