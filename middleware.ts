/**
 * Next.js Middleware - Route Protection
 *
 * Explore, free/premium options, dashboard, phases, cloud, AI, and upgrade
 * are all open without sign-in. Sign-in remains in the header for optional use.
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(_request: NextRequest) {
  // All routes are public; no redirect to login. Explore and free/premium options open.
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run middleware on all pathnames except static and api
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}

