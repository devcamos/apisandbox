import crypto from "node:crypto"
import {
  API_TOKEN_SCOPES,
  type ApiTokenScope,
  type PublicApiToken,
} from "@/lib/api-tokens/token-types"

export { API_TOKEN_SCOPES, type ApiTokenScope, type PublicApiToken }

export const API_TOKEN_PREFIX = "apisb"
export const API_TOKEN_RANDOM_BYTES = 32
export const API_TOKEN_VISIBLE_PREFIX_LENGTH = 16
export const MAX_API_TOKEN_NAME_LENGTH = 80

export function generateApiToken() {
  const secret = crypto.randomBytes(API_TOKEN_RANDOM_BYTES).toString("base64url")
  return `${API_TOKEN_PREFIX}_${secret}`
}

export function hashApiToken(token: string) {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex")
}

export function getTokenPrefix(token: string) {
  return token.slice(0, API_TOKEN_VISIBLE_PREFIX_LENGTH)
}

export function normalizeTokenName(name: string) {
  return name.trim().replace(/\s+/g, " ").slice(0, MAX_API_TOKEN_NAME_LENGTH)
}

export function parseApiTokenScopes(scopes: readonly string[]) {
  const allowed = new Set<string>(API_TOKEN_SCOPES)
  const normalized = Array.from(new Set(scopes.map((scope) => scope.trim()).filter(Boolean)))
  return normalized.filter((scope): scope is ApiTokenScope => allowed.has(scope))
}

export function validateApiTokenInput(input: {
  name: string
  scopes: readonly string[]
  expiresAt?: string | null
}) {
  const name = normalizeTokenName(input.name)
  if (!name) {
    return { ok: false as const, reason: "Token name is required" }
  }

  const scopes = parseApiTokenScopes(input.scopes)
  const requestedScopes = new Set(input.scopes.map((scope) => scope.trim()).filter(Boolean))
  if (scopes.length === 0 || scopes.length !== requestedScopes.size) {
    return { ok: false as const, reason: "Select one or more valid token scopes" }
  }

  const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null
  if (expiresAt && (!Number.isFinite(expiresAt.getTime()) || expiresAt <= new Date())) {
    return { ok: false as const, reason: "Expiry must be a future date" }
  }

  return {
    ok: true as const,
    value: {
      name,
      scopes,
      expiresAt,
    },
  }
}

export function isApiTokenExpired(expiresAt: Date | string | null | undefined, now = new Date()) {
  if (!expiresAt) return false
  return new Date(expiresAt) <= now
}

export function hasApiTokenScope(scopes: readonly string[], requiredScope: ApiTokenScope) {
  return scopes.includes(requiredScope)
}

export function redactApiTokenRecord(record: {
  id: string
  name: string
  tokenPrefix: string
  scopes: string[]
  expiresAt: Date | null
  lastUsedAt: Date | null
  revokedAt: Date | null
  createdAt: Date
}): PublicApiToken {
  return {
    id: record.id,
    name: record.name,
    tokenPrefix: record.tokenPrefix,
    scopes: parseApiTokenScopes(record.scopes),
    expiresAt: record.expiresAt?.toISOString() ?? null,
    lastUsedAt: record.lastUsedAt?.toISOString() ?? null,
    revokedAt: record.revokedAt?.toISOString() ?? null,
    createdAt: record.createdAt.toISOString(),
  }
}
