import { test, expect } from "@playwright/test"
import { randomUUID } from "node:crypto"

function randomEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${randomUUID()}@example.com`
}

function makeTestGoogleToken(payload: {
  sub: string
  email: string
  given_name?: string
  family_name?: string
  picture?: string
}) {
  return `test-google:${Buffer.from(JSON.stringify(payload)).toString("base64")}`
}

test.describe("Unified Auth", () => {
  test("register creates account with unified auth response", async ({ request }) => {
    const email = randomEmail("register")
    const response = await request.post("/api/auth/register", {
      data: {
        email,
        password: "Test1234!@#$",
        firstName: "Test",
        lastName: "User",
      },
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.success).toBeTruthy()
    expect(body.data.token).toBeTruthy()
    expect(body.data.user.email).toBe(email)
  })

  test("password login returns same auth shape", async ({ request }) => {
    const email = randomEmail("login")
    await request.post("/api/auth/register", {
      data: {
        email,
        password: "Test1234!@#$",
        firstName: "Password",
        lastName: "User",
      },
    })

    const response = await request.post("/api/auth/login", {
      data: {
        email,
        password: "Test1234!@#$",
      },
    })
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.data.token).toBeTruthy()
    expect(body.data.user.email).toBe(email)
  })

  test("google login links to existing email account", async ({ request }) => {
    const email = randomEmail("google-link")
    const registerRes = await request.post("/api/auth/register", {
      data: {
        email,
        password: "Test1234!@#$",
        firstName: "Existing",
        lastName: "User",
      },
    })
    const registerBody = await registerRes.json()
    const existingUserId = registerBody.data.user.id

    const response = await request.post("/api/auth/google", {
      data: {
        idToken: makeTestGoogleToken({
          sub: `google-${Date.now()}`,
          email,
          given_name: "Existing",
          family_name: "User",
        }),
      },
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.data.user.id).toBe(existingUserId)
    expect(body.data.user.email).toBe(email)
  })

  test("oauth-only account cannot login with password", async ({ request }) => {
    const email = randomEmail("oauth-only")
    await request.post("/api/auth/google", {
      data: {
        idToken: makeTestGoogleToken({
          sub: `google-${Date.now()}`,
          email,
          given_name: "OAuth",
          family_name: "Only",
        }),
      },
    })

    const response = await request.post("/api/auth/login", {
      data: {
        email,
        password: "Test1234!@#$",
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.success).toBeFalsy()
    expect(body.error.message).toContain("Google sign-in only")
  })

  test("register bootstrap is transactional for dependent records", async ({ request }) => {
    const email = randomEmail("bootstrap-fail")
    const failRes = await request.post("/api/auth/register", {
      data: {
        email,
        password: "Test1234!@#$",
        firstName: "Atomic",
        lastName: "Failure",
        __testForceBootstrapFail: true,
      },
    })

    expect(failRes.status()).toBe(500)

    // If transaction rolled back, user should not exist and login must fail.
    const loginRes = await request.post("/api/auth/login", {
      data: {
        email,
        password: "Test1234!@#$",
      },
    })
    expect(loginRes.status()).toBe(401)
  })
})
