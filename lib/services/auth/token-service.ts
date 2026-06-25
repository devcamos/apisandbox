import crypto from "node:crypto"
import { resolveJwtSecret } from "@/lib/auth/jwt-secret"
import { AppError } from "@/lib/http/errors"
import type { AuthPayload } from "@/lib/auth/types"

const JWT_ALG = "HS256"
const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24 * 7 // 7 days
const DEFAULT_IDLE_EXPIRY_SECONDS = 60 * 30 // 30 minutes

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
}

function base64UrlDecode(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/")
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4))
  return Buffer.from(normalized + pad, "base64").toString("utf8")
}

function getJwtSecret() {
  const secret = resolveJwtSecret()
  if (!secret) {
    throw new AppError(
      "JWT secret is not configured",
      503,
      "configuration_error",
      {
        hint: "Set AUTH_JWT_SECRET or AUTH_SECRET on Vercel Preview and Production (32+ chars).",
      },
    )
  }
  return secret
}

export function getJwtExpirySeconds() {
  const raw = process.env.AUTH_JWT_EXPIRES_IN_SECONDS
  if (!raw) return DEFAULT_EXPIRY_SECONDS
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_EXPIRY_SECONDS
}

export function getJwtIdleExpirySeconds() {
  const raw = process.env.AUTH_IDLE_EXPIRES_IN_SECONDS
  if (!raw) return DEFAULT_IDLE_EXPIRY_SECONDS
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_IDLE_EXPIRY_SECONDS
}

export function issueJwtToken(payload: AuthPayload) {
  const secret = getJwtSecret()
  const expiresIn = getJwtExpirySeconds()
  const idleExpiresIn = getJwtIdleExpirySeconds()
  const now = Math.floor(Date.now() / 1000)

  const header = {
    typ: "JWT",
    alg: JWT_ALG,
  }

  const body = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
    idleExp: now + idleExpiresIn,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedBody = base64UrlEncode(JSON.stringify(body))
  const signingInput = `${encodedHeader}.${encodedBody}`
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest()
  const encodedSignature = base64UrlEncode(signature)

  return {
    token: `${signingInput}.${encodedSignature}`,
    expiresIn,
  }
}

export function verifyJwtToken(token: string): AuthPayload {
  const secret = getJwtSecret()
  const parts = token.split(".")
  if (parts.length !== 3) {
    throw new AppError("Invalid token format", 401, "auth_failure")
  }

  const [encodedHeader, encodedBody, encodedSignature] = parts
  const signingInput = `${encodedHeader}.${encodedBody}`
  const expectedSignature = base64UrlEncode(
    crypto.createHmac("sha256", secret).update(signingInput).digest()
  )

  const provided = Buffer.from(encodedSignature)
  const expected = Buffer.from(expectedSignature)
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    throw new AppError("Invalid token signature", 401, "auth_failure")
  }

  const header = JSON.parse(base64UrlDecode(encodedHeader))
  if (header.alg !== JWT_ALG) {
    throw new AppError("Unsupported token algorithm", 401, "auth_failure")
  }

  const payload = JSON.parse(base64UrlDecode(encodedBody)) as AuthPayload
  if (!payload.sub || !payload.email) {
    throw new AppError("Invalid token payload", 401, "auth_failure")
  }

  const now = Math.floor(Date.now() / 1000)
  if (!payload.exp || payload.exp < now) {
    throw new AppError("Token has expired", 401, "auth_failure")
  }

  const idleExpiresAt = payload.idleExp ?? (
    payload.iat ? payload.iat + getJwtIdleExpirySeconds() : null
  )
  if (!idleExpiresAt || idleExpiresAt < now) {
    throw new AppError("Session has expired due to inactivity", 401, "auth_failure")
  }

  return {
    sub: payload.sub,
    email: payload.email,
  }
}
