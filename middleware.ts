import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PREMIUM_PHASE_PATTERN = /^\/phase-([2-6])(\/|$)/
const PROTECTED_API_PATTERN = /^\/api\/(subscription|profile|phase-progress)/

function getSessionToken(request: NextRequest): string | null {
  return (
    request.cookies.get("next-auth.session-token")?.value ??
    request.cookies.get("__Secure-next-auth.session-token")?.value ??
    null
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const paywallEnabled =
    process.env.NEXT_PUBLIC_FF_PREMIUM_PAYWALL === "true"

  if (!paywallEnabled) {
    return NextResponse.next()
  }

  const token = getSessionToken(request)

  if (PROTECTED_API_PATTERN.test(pathname) && !token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    )
  }

  if (PREMIUM_PHASE_PATTERN.test(pathname) && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const response = NextResponse.next()

  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/webhooks).*)",
  ],
}
