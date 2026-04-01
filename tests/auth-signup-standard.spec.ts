import { test, expect } from "@playwright/test"

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
}

test.describe("Standard Signup API (/api/auth/signup)", () => {
  test("creates account and returns unified auth payload", async ({ request }) => {
    const email = uniqueEmail("std-signup")
    const response = await request.post("/api/auth/signup", {
      data: {
        email,
        password: "Test1234!@#$",
        name: "Standard Signup User",
      },
    })

    expect(response.status()).toBe(201)
    const data = await response.json()
    expect(data.user).toBeTruthy()
    expect(data.user.email).toBe(email)
    expect(data.user.id).toBeTruthy()
    expect(data.message).toBe("Account created successfully")
    expect(data.token).toBeTruthy()
    expect(typeof data.expiresIn).toBe("number")
  })

  test("returns 400 for weak password with validation details", async ({ request }) => {
    const response = await request.post("/api/auth/signup", {
      data: {
        email: uniqueEmail("std-weak"),
        password: "Weakpass",
      },
    })

    expect(response.status()).toBe(400)
    const data = await response.json()
    expect(data.error).toContain("Password does not meet requirements")
    expect(Array.isArray(data.details)).toBeTruthy()
    expect(data.details.length).toBeGreaterThan(0)
  })

  test("returns 400 for duplicate email", async ({ request }) => {
    const email = uniqueEmail("std-dup")
    const first = await request.post("/api/auth/signup", {
      data: { email, password: "Test1234!@#$" },
    })
    expect(first.status()).toBe(201)

    const second = await request.post("/api/auth/signup", {
      data: { email, password: "Test1234!@#$" },
    })
    expect(second.status()).toBe(400)
    const data = await second.json()
    expect(data.error).toContain("already exists")
  })

  test("returns 400 on invalid email format", async ({ request }) => {
    const response = await request.post("/api/auth/signup", {
      data: {
        email: "invalid-email",
        password: "Test1234!@#$",
      },
    })

    expect(response.status()).toBe(400)
    const data = await response.json()
    expect(data.error).toContain("Validation failed")
  })

  test("issues token usable by /api/auth/me", async ({ request }) => {
    const email = uniqueEmail("std-token")
    const signup = await request.post("/api/auth/signup", {
      data: {
        email,
        password: "Test1234!@#$",
        name: "Token User",
      },
    })
    expect(signup.status()).toBe(201)
    const signupData = await signup.json()

    const me = await request.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${signupData.token}`,
      },
    })
    expect(me.status()).toBe(200)
    const meData = await me.json()
    expect(meData.success).toBeTruthy()
    expect(meData.data.user.email).toBe(email)
  })

  test("rolls back user creation when bootstrap fails", async ({ request }) => {
    const email = uniqueEmail("std-bootstrap-fail")

    const failedSignup = await request.post("/api/auth/signup", {
      data: {
        email,
        password: "Test1234!@#$",
        __testForceBootstrapFail: true,
      },
    })
    expect(failedSignup.status()).toBe(500)

    const login = await request.post("/api/auth/login", {
      data: {
        email,
        password: "Test1234!@#$",
      },
    })
    expect(login.status()).toBe(401)
  })
})
