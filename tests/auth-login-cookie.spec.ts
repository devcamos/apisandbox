import { test, expect, type APIRequestContext } from "@playwright/test"
import { randomUUID } from "node:crypto"
import { dismissCookieBanner } from "./helpers/smoke-helpers"

async function registerUser(request: APIRequestContext) {
  const email = `cookie-login-${Date.now()}-${randomUUID()}@example.com`
  const password = "Test1234!@#$"
  const response = await request.post("/api/auth/register", {
    data: { email, password, firstName: "Cookie", lastName: "Test" },
  })
  expect(response.ok()).toBeTruthy()
  return { email, password }
}

test.describe("Login session cookie", () => {
  test("password login sets auth cookie and reaches dashboard", async ({ page, request }) => {
    const { email, password } = await registerUser(request)

    await page.goto("/login", { waitUntil: "domcontentloaded" })
    await dismissCookieBanner(page)

    const loginResponsePromise = page.waitForResponse(
      (res) => res.url().includes("/api/auth/login") && res.request().method() === "POST",
    )

    await page.locator("#email").fill(email)
    await page.locator("#password").fill(password)
    await page.getByRole("button", { name: /^Sign In$/i }).click()

    const loginResponse = await loginResponsePromise
    expect(loginResponse.ok()).toBeTruthy()

    await expect
      .poll(async () => {
        const cookies = await page.context().cookies()
        return cookies.some((c) => c.name === "auth_token")
      })
      .toBe(true)

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 })
    await expect(page.getByText(/choose your learning path/i)).toBeVisible()
  })

  test("middleware allows dashboard when only auth cookie is present", async ({
    page,
    request,
    baseURL,
  }) => {
    const register = await request.post("/api/auth/register", {
      data: {
        email: `cookie-only-${Date.now()}-${randomUUID()}@example.com`,
        password: "Test1234!@#$",
      },
    })
    expect(register.ok()).toBeTruthy()
    const { token } = (await register.json()).data

    await page.context().addCookies([
      {
        name: "auth_token",
        value: token,
        url: baseURL ?? "http://127.0.0.1:4000",
        httpOnly: true,
        sameSite: "Lax",
      },
    ])

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
    await expect(page).toHaveURL(/\/dashboard/)
    await expect.poll(async () => page.evaluate(() => localStorage.getItem("auth_jwt"))).toBeTruthy()
  })
})
