import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const requireApiTokenMock = vi.hoisted(() => vi.fn())
const applyV1TokenRateLimitMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/api/v1/require-api-token", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/v1/require-api-token")>(
    "@/lib/api/v1/require-api-token",
  )
  return {
    ...actual,
    requireApiToken: requireApiTokenMock,
  }
})

vi.mock("@/lib/api/v1/rate-limit", () => ({
  applyV1TokenRateLimit: applyV1TokenRateLimitMock,
  attachV1RateLimitHeaders: (response: NextResponse) => response,
}))

import { parseV1JsonBody, withV1Auth, v1Json } from "@/lib/api/v1/handler"
import { V1AuthError } from "@/lib/api/v1/require-api-token"
import { REQUEST_ID_HEADER } from "@/lib/api/v1/request-id"
import {
  v1CheckpointPutBodySchema,
  v1CourseListResponseSchema,
  v1MeResponseSchema,
} from "@/lib/api/v1/schemas"
import { buildV1OpenApiDocument } from "@/lib/api/v1/openapi"

describe("withV1Auth", () => {
  beforeEach(() => {
    requireApiTokenMock.mockReset()
    applyV1TokenRateLimitMock.mockReset()
    applyV1TokenRateLimitMock.mockResolvedValue({
      blocked: null,
      result: { allowed: true, remaining: 100, resetAt: 0 },
    })
  })

  it("returns 401 problem+json for auth failures", async () => {
    requireApiTokenMock.mockRejectedValue(
      new V1AuthError(401, "invalid_token", "Invalid, revoked, or expired API token"),
    )

    const handler = withV1Auth({ scope: "profile:read" }, async () =>
      v1Json({ ok: true }, "unused"),
    )
    const response = await handler(new NextRequest("http://localhost/api/v1/me"))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.code).toBe("invalid_token")
    expect(body.requestId).toBeTruthy()
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(body.requestId)
  })

  it("returns 403 when the scope is missing", async () => {
    requireApiTokenMock.mockRejectedValue(
      new V1AuthError(403, "insufficient_scope", "API token is missing the required scope: progress:write"),
    )

    const handler = withV1Auth({ scope: "progress:write" }, async () =>
      v1Json({ ok: true }, "unused"),
    )
    const response = await handler(
      new NextRequest("http://localhost/api/v1/progress/courses/phase-1/modules/m/checkpoints/c", {
        method: "PUT",
      }),
    )
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.code).toBe("insufficient_scope")
  })

  it("invokes the handler with auth context when allowed", async () => {
    requireApiTokenMock.mockResolvedValue({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["profile:read"],
      subscriptionTier: "FREE",
      expiresAt: null,
    })

    const handler = withV1Auth({ scope: "profile:read" }, async ({ auth, requestId }) =>
      v1Json({ userId: auth.userId, requestId }, requestId),
    )
    const response = await handler(
      new NextRequest("http://localhost/api/v1/me", {
        headers: { [REQUEST_ID_HEADER]: "fixed-request-id" },
      }),
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ userId: "user_1", requestId: "fixed-request-id" })
    expect(requireApiTokenMock).toHaveBeenCalledWith(expect.anything(), "profile:read")
  })
  it("returns 429 when the per-token rate limit blocks", async () => {
    requireApiTokenMock.mockResolvedValue({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["profile:read"],
      subscriptionTier: "FREE",
      expiresAt: null,
    })
    applyV1TokenRateLimitMock.mockResolvedValue({
      blocked: new NextResponse(JSON.stringify({ code: "rate_limited" }), { status: 429 }),
      result: undefined,
    })

    const handler = withV1Auth({ scope: "profile:read" }, async () =>
      v1Json({ ok: true }, "unused"),
    )
    const response = await handler(new NextRequest("http://localhost/api/v1/me"))
    expect(response.status).toBe(429)
  })

  it("maps AppError from handlers to problem+json", async () => {
    requireApiTokenMock.mockResolvedValue({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["progress:read"],
      subscriptionTier: "FREE",
      expiresAt: null,
    })
    const { AppError } = await import("@/lib/http/errors")

    const handler = withV1Auth({ scope: "progress:read" }, async () => {
      throw new AppError("Learning course not found", 404, "not_found")
    })
    const response = await handler(new NextRequest("http://localhost/api/v1/progress/courses/x"))
    const body = await response.json()
    expect(response.status).toBe(404)
    expect(body.code).toBe("not_found")
  })

  it("maps auth-shaped AppErrors to invalid_token and insufficient_scope codes", async () => {
    requireApiTokenMock.mockResolvedValue({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["profile:read"],
      subscriptionTier: "FREE",
      expiresAt: null,
    })
    const { AppError } = await import("@/lib/http/errors")

    const unauthorized = withV1Auth({ scope: "profile:read" }, async () => {
      throw new AppError("nope", 401, "auth_failure")
    })
    const forbidden = withV1Auth({ scope: "profile:read" }, async () => {
      throw new AppError("nope", 403, "auth_failure")
    })
    expect((await (await unauthorized(new NextRequest("http://localhost/api/v1/me"))).json()).code).toBe(
      "invalid_token",
    )
    expect((await (await forbidden(new NextRequest("http://localhost/api/v1/me"))).json()).code).toBe(
      "insufficient_scope",
    )
  })

  it("maps validation AppErrors with details", async () => {
    requireApiTokenMock.mockResolvedValue({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["progress:write"],
      subscriptionTier: "FREE",
      expiresAt: null,
    })
    const { AppError } = await import("@/lib/http/errors")

    const handler = withV1Auth({ scope: "progress:write" }, async () => {
      throw new AppError("Invalid", 400, "validation_error", [
        { path: ["done"], message: "Required" },
      ])
    })
    const response = await handler(new NextRequest("http://localhost/api/v1/x", { method: "PUT" }))
    const body = await response.json()
    expect(response.status).toBe(400)
    expect(body.code).toBe("validation_error")
    expect(body.errors).toEqual([{ path: "done", message: "Required" }])
  })

  it("maps unexpected errors to 500 unknown_error", async () => {
    requireApiTokenMock.mockResolvedValue({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["profile:read"],
      subscriptionTier: "FREE",
      expiresAt: null,
    })

    const handler = withV1Auth({ scope: "profile:read" }, async () => {
      throw new Error("boom")
    })
    const response = await handler(new NextRequest("http://localhost/api/v1/me"))
    const body = await response.json()
    expect(response.status).toBe(500)
    expect(body.code).toBe("unknown_error")
  })

  it("resolves async route params", async () => {
    requireApiTokenMock.mockResolvedValue({
      tokenId: "tok_1",
      userId: "user_1",
      scopes: ["progress:read"],
      subscriptionTier: "FREE",
      expiresAt: null,
    })

    const handler = withV1Auth({ scope: "progress:read" }, async ({ params, requestId }) =>
      v1Json({ courseId: params.courseId }, requestId),
    )
    const response = await handler(new NextRequest("http://localhost/api/v1/progress/courses/phase-1"), {
      params: Promise.resolve({ courseId: "phase-1" }),
    })
    const body = await response.json()
    expect(body.courseId).toBe("phase-1")
  })
})

describe("parseV1JsonBody", () => {
  it("rejects non-JSON content types with 415", async () => {
    const request = new NextRequest("http://localhost/api/v1/x", {
      method: "PUT",
      headers: { "content-type": "text/plain" },
      body: "nope",
    })
    const result = await parseV1JsonBody(request, z.object({ done: z.boolean() }), "req-1")
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.response.status).toBe(415)
    const body = await result.response.json()
    expect(body.code).toBe("unsupported_media_type")
  })

  it("rejects invalid JSON with 400", async () => {
    const request = new NextRequest("http://localhost/api/v1/x", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: "{",
    })
    const result = await parseV1JsonBody(request, z.object({ done: z.boolean() }), "req-2")
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.response.status).toBe(400)
  })

  it("rejects schema mismatches with validation errors", async () => {
    const request = new NextRequest("http://localhost/api/v1/x", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ done: "yes" }),
    })
    const result = await parseV1JsonBody(request, z.object({ done: z.boolean() }), "req-3")
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.response.status).toBe(400)
    const body = await result.response.json()
    expect(body.code).toBe("validation_error")
    expect(body.errors?.length).toBeGreaterThan(0)
  })

  it("returns parsed data for a valid body", async () => {
    const request = new NextRequest("http://localhost/api/v1/x", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ done: true }),
    })
    const result = await parseV1JsonBody(request, z.object({ done: z.boolean() }), "req-4")
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data).toEqual({ done: true })
  })
})

describe("v1 contract schemas", () => {
  it("accepts a /me success payload without email", () => {
    const parsed = v1MeResponseSchema.safeParse({
      id: "user_1",
      name: "Ada",
      subscriptionTier: "FREE",
      token: { id: "tok_1", scopes: ["profile:read"], expiresAt: null },
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect("email" in parsed.data).toBe(false)
    }
  })

  it("accepts a course list payload", () => {
    expect(
      v1CourseListResponseSchema.safeParse({
        data: [{ courseId: "phase-1", status: "in_progress", completed: 2, total: 10 }],
      }).success,
    ).toBe(true)
  })

  it("accepts a checkpoint PUT body", () => {
    expect(
      v1CheckpointPutBodySchema.safeParse({
        done: true,
        answer: "ok",
      }).success,
    ).toBe(true)
  })
})

describe("OpenAPI v1 document", () => {
  it("describes the token-authenticated paths and bearer scheme", () => {
    const doc = buildV1OpenApiDocument()
    expect(doc.openapi).toBe("3.1.0")
    expect(doc.paths["/api/v1/me"].get.security).toEqual([{ bearerAuth: [] }])
    expect(doc.paths["/api/v1/progress/courses"].get).toBeTruthy()
    expect(
      doc.paths[
        "/api/v1/progress/courses/{courseId}/modules/{moduleId}/checkpoints/{checkpointId}"
      ].put,
    ).toBeTruthy()
    expect(doc.components.securitySchemes.bearerAuth.scheme).toBe("bearer")
    expect(doc.components.schemas.MeResponse).toBeTruthy()
    expect(doc.components.schemas.Problem).toBeTruthy()
  })
})
