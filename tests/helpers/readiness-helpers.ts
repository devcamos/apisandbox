import { expect, type APIResponse } from "@playwright/test";

type OkEnvelope<T> = { success: true; data: T };
type ErrEnvelope = {
  success: false;
  error?: { details?: Record<string, unknown> };
};

/** GET /api/health/auth — JWT must be configured before register/login. */
export async function expectAuthHealthReady(response: APIResponse) {
  const body = (await response.json()) as OkEnvelope<{
    ok?: boolean;
    jwtSecretConfigured?: boolean;
  }> | ErrEnvelope;

  expect(
    response.status(),
    body.success === false
      ? JSON.stringify(body.error?.details ?? body)
      : "auth health",
  ).toBe(200);
  expect(body.success).toBe(true);
  if (!body.success) return;
  expect(body.data.jwtSecretConfigured).toBe(true);
  expect(body.data.ok).toBe(true);
}

/** GET /api/health/db — Prisma can reach Postgres. */
export async function expectDbHealthReady(response: APIResponse) {
  const body = (await response.json()) as OkEnvelope<{ ok?: boolean }> | ErrEnvelope;

  expect(
    response.status(),
    body.success === false ? JSON.stringify(body.error?.details ?? body) : "db health",
  ).toBe(200);
  expect(body.success).toBe(true);
  if (!body.success) return;
  expect(body.data.ok).toBe(true);
}

type SaasCheck = { id: string; status: "ok" | "warn" | "fail" };

/** GET /api/health/saas — no blocking misconfig (JWT, DB URL, Stripe when enabled, etc.). */
export async function expectSaasReadinessReady(
  response: APIResponse,
  requiredOkIds: string[] = ["database", "auth", "app_url"],
) {
  const body = (await response.json()) as {
    data?: {
      ready?: boolean;
      failures?: number;
      checks?: SaasCheck[];
    };
  };

  expect(response.status(), JSON.stringify(body.data ?? body)).toBe(200);
  expect(body.data?.ready).toBe(true);
  expect(body.data?.failures).toBe(0);

  const checks = body.data?.checks ?? [];
  for (const id of requiredOkIds) {
    const check = checks.find((c) => c.id === id);
    expect(check?.status, `SaaS check "${id}": ${check?.detail ?? "missing"}`).toBe("ok");
  }
}
