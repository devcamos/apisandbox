export const API_TOKEN_SCOPES = [
  "profile:read",
  "progress:read",
  "progress:write",
] as const

export type ApiTokenScope = (typeof API_TOKEN_SCOPES)[number]

export interface PublicApiToken {
  id: string
  name: string
  tokenPrefix: string
  scopes: ApiTokenScope[]
  expiresAt: string | null
  lastUsedAt: string | null
  revokedAt: string | null
  createdAt: string
}
