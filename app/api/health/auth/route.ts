import { getGoogleClientId, isGoogleAuthConfigured } from "@/lib/google-client-id"
import { okResponse } from "@/lib/http/responses"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const googleClientId = getGoogleClientId()
  const clientIdSuffix = googleClientId.includes(".apps.googleusercontent.com")
    ? googleClientId.split("-")[0] + "-…apps.googleusercontent.com"
    : "missing"

  return okResponse({
    ok: true,
    googleAuthConfigured: isGoogleAuthConfigured(),
    googleClientIdSuffix: clientIdSuffix,
    /** Origin Google Cloud Console must allow for GSI (no path). */
    authorizedJavaScriptOrigin: `${url.protocol}//${url.host}`,
    hints: [
      "Add authorizedJavaScriptOrigin (exact scheme + host) in Google Cloud → Credentials → OAuth client.",
      "PR preview URLs change per deployment; use stable aliases or add each preview host.",
      "POST /api/auth/google failures after Google popup often mean DB/bootstrap — check GET /api/health/db.",
    ],
  })
}
