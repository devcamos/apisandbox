import crypto from "crypto"
import { AppError } from "@/lib/http/errors"
import type { AuthPayload } from "@/lib/auth/types"

const JWT_ALG = "HS256"
const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24 * 7 // 7 days

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
  const secret = process.env.AUTH_JWT_SECRET
  if (!secret) {
    throw new AppError(
      "AUTH_JWT_SECRET is not configured",
      500,
      "configuration_error"
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

export function issueJwtToken(payload: AuthPayload) {
  const secret = getJwtSecret()
  const expiresIn = getJwtExpirySeconds()
  const now = Math.floor(Date.now() / 1000)

  const header = {
    typ: "JWT",
    alg: JWT_ALG,
  }

  const body = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
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

  const payload = JSON.parse(base64UrlDecode(encodedBody)) as AuthPayload & { exp?: number }
  if (!payload.sub || !payload.email) {
    throw new AppError("Invalid token payload", 401, "auth_failure")
  }

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new AppError("Token has expired", 401, "auth_failure")
  }

  return {
    sub: payload.sub,
    email: payload.email,
  }
}

