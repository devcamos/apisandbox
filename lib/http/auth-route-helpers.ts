import { NextResponse, type NextRequest } from "next/server"
import type { z } from "zod"
import { errorResponse, handleRouteError, okResponse } from "@/lib/http/responses"
import { AppError } from "@/lib/http/errors"
import type { AuthUser } from "@/lib/auth/types"
import { verifyJwtToken } from "@/lib/services/auth/token-service"
import { issueAuthTokenForUser } from "@/lib/services/auth/auth-response-mapper"
import {
  createUserSession,
  findActiveUserSession,
  getUserSessionContext,
} from "@/lib/services/auth/user-session-service"

/**
 * Bearer token for API routes, with `auth_token` cookie fallback.
 * Page middleware uses `readSessionCookieToken` in `lib/auth/session-token.ts` (legacy NextAuth cookies).
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
  user: AuthUser
}

async function getRefreshSessionId(userId: string, currentToken: string | null) {
  // Never resurrect a session revoked after the initial authentication check.
  if (!currentToken) throw new AppError("Unauthorized", 401, "auth_failure")
  const payload = verifyJwtToken(currentToken)
  if (payload.sub !== userId) throw new AppError("Unauthorized", 401, "auth_failure")
  // Valid legacy tokens may be upgraded to a persisted session.
  if (!payload.sid) return undefined
  const session = await findActiveUserSession(userId, payload.sid)
  if (!session) throw new AppError("Session has been revoked or expired", 401, "auth_failure")
  return session.id
}

async function getOrCreateSessionId(userId: string, request: NextRequest, issuance: "authenticate" | "refresh") {
  const currentToken = readAuthToken(request)
  if (issuance === "refresh") {
    const sessionId = await getRefreshSessionId(userId, currentToken)
    if (sessionId) return sessionId
  }
  if (issuance === "authenticate" && currentToken) {
    try {
      const currentPayload = verifyJwtToken(currentToken)
      if (currentPayload.sub === userId && currentPayload.sid) {
        const activeSession = await findActiveUserSession(userId, currentPayload.sid)
        if (activeSession) return activeSession.id
      }
    } catch {
      // A login response may not have an existing token. A new session is created below.
    }
  }

  const session = await createUserSession(userId, getUserSessionContext(request))
  return session.id
}

/** Build a JSON success response and attach the session's auth_token cookie. */
export async function authSessionResponse<T extends AuthSessionResponse>(
  payload: T,
  status = 200,
  request?: NextRequest,
  // The legacy signup endpoint exposes fields at the top level.
  responseFormat: "envelope" | "plain" = "envelope",
  issuance: "authenticate" | "refresh" = "authenticate",
) {
  const sessionId = request ? await getOrCreateSessionId(payload.user.id, request, issuance) : undefined
  const responsePayload = sessionId
    ? { ...payload, ...issueAuthTokenForUser(payload.user, sessionId) }
    : payload

  const res = responseFormat === "plain"
    ? NextResponse.json(responsePayload, { status })
    : okResponse(responsePayload, status)
  return setAuthCookie(res, {
    token: responsePayload.token,
    maxAge: responsePayload.expiresIn,
  })
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
