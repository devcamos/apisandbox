import { prisma } from "@/lib/prisma"
import { AppError } from "@/lib/http/errors"
import {
  type ApiTokenScope,
  generateApiToken,
  hashApiToken,
  getTokenPrefix,
  hasApiTokenScope,
  isApiTokenExpired,
  redactApiTokenRecord,
  validateApiTokenInput,
} from "@/lib/api-tokens/token-policy"

interface RequestContext {
  ipAddress?: string | null
  userAgent?: string | null
}

interface CreateApiTokenInput extends RequestContext {
  userId: string
  name: string
  scopes: string[]
  expiresAt?: string | null
}

export async function listApiTokensForUser(userId: string) {
  const tokens = await prisma.apiToken.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
  return tokens.map(redactApiTokenRecord)
}

export async function createApiToken(input: CreateApiTokenInput) {
  const parsed = validateApiTokenInput(input)
  if (!parsed.ok) {
    throw new AppError(parsed.reason, 400, "validation_error")
  }

  const token = generateApiToken()
  const record = await prisma.apiToken.create({
    data: {
      userId: input.userId,
      name: parsed.value.name,
      tokenHash: hashApiToken(token),
      tokenPrefix: getTokenPrefix(token),
      scopes: parsed.value.scopes,
      expiresAt: parsed.value.expiresAt,
      auditEvents: {
        create: {
          userId: input.userId,
          event: "created",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
      },
    },
  })

  return {
    token,
    apiToken: redactApiTokenRecord(record),
  }
}

export async function revokeApiTokenForUser(input: {
  userId: string
  tokenId: string
} & RequestContext) {
  const existing = await prisma.apiToken.findFirst({
    where: {
      id: input.tokenId,
      userId: input.userId,
    },
  })

  if (!existing) {
    throw new AppError("API token not found", 404, "not_found")
  }

  const revokedAt = existing.revokedAt ?? new Date()
  const token = await prisma.apiToken.update({
    where: { id: existing.id },
    data: {
      revokedAt,
      auditEvents: {
        create: {
          userId: input.userId,
          event: existing.revokedAt ? "revoke_requested" : "revoked",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
      },
    },
  })

  return redactApiTokenRecord(token)
}

export async function authenticateApiToken(rawToken: string, requiredScope?: ApiTokenScope) {
  const token = await prisma.apiToken.findUnique({
    where: { tokenHash: hashApiToken(rawToken) },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          isActive: true,
          subscriptionTier: true,
        },
      },
    },
  })

  if (!token || token.revokedAt || isApiTokenExpired(token.expiresAt) || !token.user.isActive) {
    throw new AppError("Invalid API token", 401, "auth_failure")
  }

  if (requiredScope && !hasApiTokenScope(token.scopes, requiredScope)) {
    throw new AppError("API token does not have the required scope", 403, "auth_failure")
  }

  await prisma.apiToken.update({
    where: { id: token.id },
    data: { lastUsedAt: new Date() },
  })

  return {
    tokenId: token.id,
    userId: token.userId,
    userEmail: token.user.email,
    scopes: token.scopes,
    subscriptionTier: token.user.subscriptionTier,
  }
}
