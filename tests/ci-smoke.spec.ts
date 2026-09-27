import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";
import {
  expectAuthHealthReady,
  expectDbHealthReady,
  expectSaasReadinessReady,
} from "./helpers/readiness-helpers";
import {
  blockSmokeThirdPartyRequests,
  dismissCookieBanner,
} from "./helpers/smoke-helpers";

/**
 * Minimal checks for GitHub Actions (fast, stable gate).
 * Run the full suite locally: npm run test:ci or npm run test
 */
test.describe("CI smoke", () => {
  test.describe.configure({ mode: "parallel" });

  test.describe("App readiness (pre-login)", () => {
    test("GET /api/health/auth reports JWT configured", async ({ request }) => {
      await expectAuthHealthReady(await request.get("/api/health/auth"));
    });

    test("GET /api/health/db reaches the database", async ({ request }) => {
      await expectDbHealthReady(await request.get("/api/health/db"));
    });

    test("GET /api/health/saas has no blocking failures", async ({ request }) => {
      await expectSaasReadinessReady(await request.get("/api/health/saas"));
    });

    test("GET /api/auth/me without session returns 401", async ({ request }) => {
      const response = await request.get("/api/auth/me");
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error?.category).toBe("auth_failure");
    });

    test("POST /api/assistant without session is rejected", async ({ request }) => {
      const response = await request.post("/api/assistant", {
        data: { message: "smoke probe", pathname: "/" },
      });
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error?.category).toBe("auth_failure");
    });
  });

  test.beforeEach(async ({ page }) => {
    await blockSmokeThirdPartyRequests(page);
  });

  test("home page loads", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await expect(
      page.getByRole("heading", { name: /API Integration Training/i }),
    ).toBeVisible();
  });

  test("phase-5 route redirects to login when signed out", async ({ page }) => {
    await page.goto("/phase-5", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login/);
  });

  test("architecture docs route redirects to login when signed out", async ({
    page,
  }) => {
    await page.goto("/docs/architecture", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page loads", async ({ page }) => {
    const response = await page.goto("/login", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await expect(
      page.getByText(/Sign in to continue your API integration journey/i),
    ).toBeVisible();
    // GSI script is blocked in smoke — container is attached before the button renders.
    await expect(page.getByTestId("google-auth-section")).toBeAttached();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toHaveAttribute("autocomplete", "username");
    await expect(page.getByLabel(/^password$/i)).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("signup page presents Google and local account creation", async ({ page }) => {
    const response = await page.goto("/signup", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();
    await expect(
      page.getByText(/Free access to Phases 0 & 1/i),
    ).toBeVisible();
    await expect(page.getByTestId("google-auth-section")).toBeAttached();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toHaveAttribute("autocomplete", "new-password");
    await expect(page.getByLabel(/confirm password/i)).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  test("password login works end to end", async ({ page, request }) => {
    const uniqueEmail = `smoke-${Date.now()}-${randomUUID()}@example.com`;
    const password = "Test1234!@#$";

    const registerResponse = await request.post("/api/auth/register", {
      data: {
        email: uniqueEmail,
        password,
        firstName: "Smoke",
        lastName: "User",
      },
    });

    expect(registerResponse.ok()).toBeTruthy();

    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);

    await page.locator("#email").fill(uniqueEmail);
    await page.locator("#password").fill(password);
    await expect(page.getByRole("button", { name: /^Sign In$/i })).toBeEnabled();
    await page.getByRole("button", { name: /^Sign In$/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByText(/choose your learning path/i)).toBeVisible();
  });

  test.describe("Sign-in cases", () => {
    const strongPassword = "Test1234!@#$";

    async function registerUser(request: import("@playwright/test").APIRequestContext) {
      const email = `signin-${Date.now()}-${randomUUID()}@example.com`;
      const res = await request.post("/api/auth/register", {
        data: { email, password: strongPassword, firstName: "Sign", lastName: "In" },
      });
      expect(res.ok()).toBeTruthy();
      await request.post("/api/auth/logout");
      return email;
    }

    async function apiLogin(
      request: import("@playwright/test").APIRequestContext,
      email: string,
      password: string,
    ) {
      return request.post("/api/auth/login", { data: { email, password } });
    }

    test("wrong password shows Invalid login credentials on the sign-in page", async ({ page, request }) => {
      const email = await registerUser(request);
      await page.goto("/login", { waitUntil: "domcontentloaded" });
      await dismissCookieBanner(page);
      await page.locator("#email").fill(email);
      await page.locator("#password").fill("WrongPassword1!");
      await page.getByRole("button", { name: /^Sign In$/i }).click();
      await expect(page.getByText("Invalid login credentials")).toBeVisible();
      await expect(page).toHaveURL(/\/login/);
    });

    test("unknown email returns the same generic 401", async ({ request }) => {
      const res = await apiLogin(request, `nobody-${randomUUID()}@example.com`, "whatever1");
      expect(res.status()).toBe(401);
      expect((await res.json()).error.message).toBe("Invalid email or password");
    });

    test("5 wrong attempts are allowed, the 6th is locked with a duration", async ({ request }) => {
      const email = await registerUser(request);
      for (let i = 1; i <= 5; i++) {
        const res = await apiLogin(request, email, `Wrong-${i}-pass`);
        expect(res.status(), `attempt ${i}`).toBe(401);
        expect((await res.json()).error.message).toBe("Invalid email or password");
      }
      const sixth = await apiLogin(request, email, strongPassword);
      expect(sixth.status()).toBe(423);
      expect((await sixth.json()).error.message).toMatch(
        /Account locked after 5 failed sign-in attempts\. Try again in 30 minutes\./,
      );
    });

    test("a correct login after 4 failures resets the counter", async ({ request }) => {
      const email = await registerUser(request);
      for (let i = 0; i < 4; i++) {
        expect((await apiLogin(request, email, "Wrong-pass-1")).status()).toBe(401);
      }
      expect((await apiLogin(request, email, strongPassword)).status()).toBe(200);
      await request.post("/api/auth/logout");
      // Counter was reset: 4 more failures still do not lock the account.
      for (let i = 0; i < 4; i++) {
        expect((await apiLogin(request, email, "Wrong-pass-2")).status()).toBe(401);
      }
      expect((await apiLogin(request, email, strongPassword)).status()).toBe(200);
    });

    test("logout then sign in again works", async ({ request }) => {
      const email = await registerUser(request);
      const first = await apiLogin(request, email, strongPassword);
      expect(first.status()).toBe(200);
      const token = (await first.json()).data.token as string;
      const me = await request.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
      expect(me.status()).toBe(200);
      const logout = await request.post("/api/auth/logout");
      expect(logout.ok()).toBeTruthy();
      expect(logout.headers()["set-cookie"] ?? "").toMatch(/auth_token=;|auth_token=(?:\s|;)|Max-Age=0|Expires=Thu, 01 Jan 1970/i);
      const again = await apiLogin(request, email, strongPassword);
      expect(again.status()).toBe(200);
      const token2 = (await again.json()).data.token as string;
      expect(
        (await request.get("/api/auth/me", { headers: { Authorization: `Bearer ${token2}` } })).status(),
      ).toBe(200);
    });

    test("Try the demo on the sign-in page opens an ephemeral Phase 1 demo", async ({ page }) => {
      await page.goto("/login", { waitUntil: "domcontentloaded" });
      await dismissCookieBanner(page);
      const panel = page.getByTestId("login-demo-panel");
      await expect(panel).toBeVisible();
      await panel.getByRole("button", { name: /try the demo/i }).click();
      await expect(page).toHaveURL(/\/dashboard/);
      const me = await page.evaluate(async () => {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        return { status: res.status, body: await res.text() };
      });
      expect(me.status).toBe(200);
      expect(me.body).toMatch(/demo\.[a-z0-9_-]+@apisandbox\.demo/);
    });

    test("demo credentials typed into the normal form sign in as a demo", async ({ page }) => {
      await page.goto("/login", { waitUntil: "domcontentloaded" });
      await dismissCookieBanner(page);
      await page.getByRole("button", { name: /demo@apisandbox\.demo/i }).click();
      await expect(page.locator("#email")).toHaveValue("demo@apisandbox.demo");
      await page.getByRole("button", { name: /^Sign In$/i }).click();
      await expect(page).toHaveURL(/\/dashboard/);
    });

    for (const plan of ["free", "pro"] as const) {
      test(`demo claim to ${plan} keeps the session and allows normal sign-in`, async ({ request }) => {
        const demo = await request.post("/api/auth/demo");
        expect(demo.status()).toBe(200);
        const demoToken = (await demo.json()).data.token as string;
        const email = `claim-${plan}-${randomUUID()}@example.com`;
        const claim = await request.post("/api/auth/demo/claim", {
          headers: { Authorization: `Bearer ${demoToken}` },
          data: { email, password: strongPassword, name: "Claimed User", plan },
        });
        expect(claim.status()).toBe(200);
        const body = await claim.json();
        expect(body.data.user.email).toBe(email);
        expect(body.data.user.isDemo).toBe(false);
        expect(body.data.plan).toBe(plan);
        await request.post("/api/auth/logout");
        expect((await apiLogin(request, email, strongPassword)).status()).toBe(200);
      });
    }
  });
});
