import type { NextRequest } from "next/server"
import { API_TOKEN_PREFIX, hasApiTokenScope } from "@/lib/api-tokens/token-policy"
import type { ApiTokenScope } from "@/lib/api-tokens/token-types"
import { AppError } from "@/lib/http/errors"
import { authenticateApiToken } from "@/lib/services/api-token-service"
import type { V1ProblemCode } from "@/lib/api/v1/problem"

export interface ApiTokenPrincipal {
  tokenId: string
  userId: string
  scopes: string[]
  subscriptionTier: string
  expiresAt: string | null
}

export class V1AuthError extends Error {
  status: number
  code: V1ProblemCode
  detail: string

  constructor(status: number, code: V1ProblemCode, detail: string) {
    super(detail)
    this.name = "V1AuthError"
    this.status = status
    this.code = code
    this.detail = detail
  }
}

function readBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization")
  if (!header?.startsWith("Bearer ")) return null
  const token = header.slice("Bearer ".length).trim()
  return token || null
}

/**
 * Authenticate a personal API token (`apisb_…`) and optionally enforce a scope.
 * Website session JWTs are rejected — they belong on the internal `/api/*` BFF.
 */
export async function requireApiToken(
  request: NextRequest,
  requiredScope?: ApiTokenScope,
): Promise<ApiTokenPrincipal> {
  const raw = readBearerToken(request)
  if (!raw) {
    throw new V1AuthError(401, "missing_token", "Provide Authorization: Bearer apisb_…")
  }

  if (!raw.startsWith(`${API_TOKEN_PREFIX}_`)) {
    throw new V1AuthError(
      401,
      "invalid_token",
      "This endpoint accepts personal API tokens only (prefix apisb_)",
    )
  }

  let authenticated: Awaited<ReturnType<typeof authenticateApiToken>>
  try {
    authenticated = await authenticateApiToken(raw)
  } catch (error) {
    if (error instanceof AppError && error.status === 401) {
      throw new V1AuthError(401, "invalid_token", "Invalid, revoked, or expired API token")
    }
    throw error
  }

  if (requiredScope && !hasApiTokenScope(authenticated.scopes, requiredScope)) {
    throw new V1AuthError(
      403,
      "insufficient_scope",
      `API token is missing the required scope: ${requiredScope}`,
    )
  }

  return {
    tokenId: authenticated.tokenId,
    userId: authenticated.userId,
    scopes: authenticated.scopes,
    subscriptionTier: authenticated.subscriptionTier,
    expiresAt: authenticated.expiresAt,
  }
}
