import { isJwtSecretConfigured, jwtSecretSource } from "@/lib/auth/jwt-secret"
import { getGoogleClientId, isGoogleAuthConfigured } from "@/lib/google-client-id"
import { okResponse, errorResponse } from "@/lib/http/responses"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const googleClientId = getGoogleClientId()
  const clientIdSuffix = googleClientId.includes(".apps.googleusercontent.com")
    ? googleClientId.split("-")[0] + "-…apps.googleusercontent.com"
    : "missing"

  const jwtConfigured = isJwtSecretConfigured()
  const payload = {
    ok: jwtConfigured,
    jwtSecretConfigured: jwtConfigured,
    jwtSecretSource: jwtSecretSource(),
    googleAuthConfigured: isGoogleAuthConfigured(),
    googleClientIdSuffix: clientIdSuffix,
    authorizedJavaScriptOrigin: `${url.protocol}//${url.host}`,
    hints: [
      jwtConfigured
        ? "JWT secret is configured for register/login/Google sessions."
        : "Set AUTH_JWT_SECRET or AUTH_SECRET on Vercel Preview (Environment Variables → Preview → all branches).",
      "Add authorizedJavaScriptOrigin (exact scheme + host) in Google Cloud → Credentials → OAuth client.",
      "PR preview URLs change per deployment; use stable aliases or add each preview host.",
      "POST /api/auth/google failures after Google popup often mean DB/bootstrap — check GET /api/health/db.",
    ],
  }

  if (!jwtConfigured) {
    return errorResponse(503, "configuration_error", "JWT secret is not configured", payload)
  }

  return okResponse(payload)
}
