import { randomUUID } from "node:crypto"
import { expect, test } from "@playwright/test"

test.describe("Stack-aware onboarding", () => {
  test("redirects signed-out visitors to login", async ({ page }) => {
    await page.goto("/onboarding")
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fonboarding/)
  })

  test("persists a stack profile and builds a personalized learning path", async ({ page, request, baseURL }) => {
    const response = await request.post("/api/auth/register", {
      data: {
        email: `onboarding-${Date.now()}-${randomUUID()}@example.com`,
        password: "Test1234!@#$",
        firstName: "Enterprise",
        lastName: "Learner",
      },
    })
    expect(response.ok()).toBeTruthy()
    const token = (await response.json()).data.token as string

    await page.context().addCookies([{
      name: "auth_token",
      value: token,
      url: baseURL ?? "http://localhost:4000",
      httpOnly: true,
      sameSite: "Lax",
    }])
    await page.addInitScript((value) => localStorage.setItem("auth_jwt", value), token)

    await page.goto("/onboarding")
    await expect(page.getByRole("heading", { name: /Build your engineering path/i })).toBeVisible()

    await page.getByText("Backend engineer", { exact: true }).click()
    await expect(page.getByLabel(/Backend engineer/i)).toBeChecked()
    await page.getByText("Senior engineer", { exact: true }).click()
    await expect(page.getByLabel(/Senior engineer/i)).toBeChecked()
    await page.getByRole("button", { name: /Continue/i }).click()

    await page.getByLabel("Primary language").selectOption("java")
    await page.getByLabel("Primary framework").selectOption("spring-boot")
    await page.getByLabel("Runtime environment").selectOption("kubernetes")
    await page.getByLabel("Cloud context").selectOption("aws")
    await page.getByRole("button", { name: /Continue/i }).click()

    await page.getByText("Progress toward principal", { exact: true }).click()
    await expect(page.getByLabel(/Progress toward principal/i)).toBeChecked()
    await expect(page.getByText("Spring Boot with Java")).toBeVisible()
    await page.getByRole("button", { name: /Save and open my path/i }).click()

    await expect(page).toHaveURL(/\/dashboard\?onboarding=complete/)
    const personalizedPath = page.locator("section").filter({ hasText: "Your engineering path" })
    await expect(personalizedPath.getByRole("heading", { name: /Spring Boot.*Senior engineer/i })).toBeVisible()

    await personalizedPath.getByRole("link", { name: /Spring Boot with Java/i }).click()
    await expect(page).toHaveURL(/\/learn\/stack/)
    await expect(page.getByRole("heading", { name: "Spring Boot with Java" })).toBeVisible()
    await expect(page.getByText(/Resilience4j/)).toBeVisible()

    const invalidCombination = await request.patch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
      data: { primaryLanguage: "java", primaryFramework: "nextjs" },
    })
    expect(invalidCombination.status()).toBe(400)
    await expect(invalidCombination.json()).resolves.toMatchObject({
      error: { category: "validation_error" },
    })
  })
})
