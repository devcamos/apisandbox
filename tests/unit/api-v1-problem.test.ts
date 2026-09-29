import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { problemResponse, problemTypeUrl, zodIssuesToProblemErrors } from "@/lib/api/v1/problem"
import { resolveRequestId, REQUEST_ID_HEADER } from "@/lib/api/v1/request-id"

describe("v1 problem+json", () => {
  it("returns RFC 9457 problem details with requestId", async () => {
    const response = problemResponse({
      status: 403,
      code: "insufficient_scope",
      detail: "API token is missing the required scope: progress:write",
      instance: "/api/v1/me",
      requestId: "req-123",
    })
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(response.headers.get("content-type")).toContain("application/problem+json")
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe("req-123")
    expect(body).toMatchObject({
      type: problemTypeUrl("insufficient_scope"),
      title: "Insufficient scope",
      status: 403,
      detail: "API token is missing the required scope: progress:write",
      instance: "/api/v1/me",
      code: "insufficient_scope",
      requestId: "req-123",
    })
  })

  it("maps Zod issues to problem errors", () => {
    expect(
      zodIssuesToProblemErrors([
        { path: ["done"], message: "Required" },
        { path: [], message: "Invalid" },
      ]),
    ).toEqual([
      { path: "done", message: "Required" },
      { path: "(root)", message: "Invalid" },
    ])
  })
})

describe("v1 request id", () => {
  it("echoes a safe client-supplied X-Request-Id", () => {
    const request = new NextRequest("http://localhost/api/v1/me", {
      headers: { [REQUEST_ID_HEADER]: "client-trace-abc_12" },
    })
    expect(resolveRequestId(request)).toBe("client-trace-abc_12")
  })

  it("mints a UUID when the header is missing or unsafe", () => {
    const missing = resolveRequestId(new NextRequest("http://localhost/api/v1/me"))
    expect(missing).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )

    const unsafe = resolveRequestId(
      new NextRequest("http://localhost/api/v1/me", {
        headers: { [REQUEST_ID_HEADER]: "bad id with spaces" },
      }),
    )
    expect(unsafe).not.toBe("bad id with spaces")
  })
})
