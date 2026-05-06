import type { NextRequest, NextResponse } from "next/server"
import type { z } from "zod"
import { errorResponse, handleRouteError, okResponse } from "@/lib/http/responses"

/**
 * Extract a bearer token from the `Authorization` header, falling back to the
 * `auth_token` cookie. Shared by API routes and middleware so token discovery
 * stays consistent.
 */
export function readAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }
  return request.cookies.get("auth_token")?.value ?? null
}

interface SetAuthCookieOptions {
  token: string
  maxAge: number
}

/**
 * Apply our standard auth cookie options to a response. Centralized so all
 * routes set/clear the cookie the same way (httpOnly, sameSite, secure-in-prod).
 */
export function setAuthCookie(
  response: NextResponse,
  { token, maxAge }: Readonly<SetAuthCookieOptions>,
) {
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  })
  return response
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return response
}

interface ParseResult<T> {
  ok: true
  data: T
}

interface ParseFailure {
  ok: false
  response: NextResponse
}

/**
 * Parse and validate the JSON body of a request against a Zod schema.
 * Returns either parsed data or a ready-to-return validation error response.
 */
export async function parseJsonBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
  errorMessage = "Invalid request payload",
): Promise<ParseResult<T> | ParseFailure> {
  const body: unknown = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return {
      ok: false,
      response: errorResponse(400, "validation_error", errorMessage, parsed.error.issues),
    }
  }
  return { ok: true, data: parsed.data }
}

interface AuthSessionResponse {
  token: string
  expiresIn: number
}

/**
 * Build the standard 200 (or other) JSON success response and attach the
 * auth_token cookie sourced from the response payload.
 */
export function authSessionResponse<T extends AuthSessionResponse>(payload: T, status = 200) {
  const res = okResponse(payload, status)
  return setAuthCookie(res, { token: payload.token, maxAge: payload.expiresIn })
}

type RouteHandler = (request: NextRequest) => Promise<NextResponse>

/**
 * Wrap a route handler in a try/catch that funnels errors through
 * handleRouteError. Useful when the handler does not need to manage
 * additional cleanup logic.
 */
export function withRouteErrorHandling(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest) => {
    try {
      return await handler(request)
    } catch (error) {
      return handleRouteError(error)
    }
  }
}
