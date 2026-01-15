/**
 * Next.js Middleware - Route Protection
 * 
 * MENTOR NOTE: Middleware Best Practices
 * 
 * This middleware:
 * 1. Protects routes that require authentication
 * 2. Redirects unauthenticated users to login
 * 3. Handles session validation
 * 4. Preserves intended destination (redirect after login)
 * 
 * Protected Routes:
 * - /dashboard - Main learning dashboard
 * - /phase-* - All learning phases
 * - /observability - Progress dashboard
 * 
 * Public Routes:
 * - / - Landing page
 * - /login - Login page
 * - /signup - Signup page
 * - /api/auth/* - NextAuth endpoints
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // MENTOR NOTE: Simple session check using cookies
  // In NextAuth v5 beta, session token cookie names:
  // - Development: authjs.session-token
  // - Production: __Secure-authjs.session-token
  const sessionToken = request.cookies.get("authjs.session-token") || 
                       request.cookies.get("__Secure-authjs.session-token") ||
                       request.cookies.get("next-auth.session-token") || 
                       request.cookies.get("__Secure-next-auth.session-token")

  const pathname = request.nextUrl.pathname

  // Redirect authenticated users away from landing page to dashboard
  if (pathname === "/" && sessionToken) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // If accessing protected route without session, redirect to login
  if (!sessionToken) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// MENTOR NOTE: Matcher Configuration
// Define which routes require authentication or need special handling
export const config = {
  matcher: [
    "/", // Home page - redirect authenticated users to dashboard
    "/dashboard/:path*",
    "/phase-0/:path*", // Phase 0 is free but requires auth
    "/phase-1/:path*",
    "/phase-2/:path*",
    "/phase-3/:path*",
    "/phase-4/:path*",
    "/observability/:path*",
    "/cloud/:path*", // Protect cloud section
    "/ai/:path*", // Protect AI section
  ],
}

