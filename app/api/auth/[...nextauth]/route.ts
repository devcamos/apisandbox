/**
 * NextAuth.js v5 API Route Handler
 * 
 * MENTOR NOTE: This is the main authentication endpoint
 * 
 * Routes handled:
 * - /api/auth/signin - Sign in page
 * - /api/auth/signout - Sign out
 * - /api/auth/callback/[provider] - OAuth callback
 * - /api/auth/session - Get current session
 * - /api/auth/csrf - CSRF token
 * 
 * NextAuth.js automatically handles:
 * - Session management
 * - CSRF protection
 * - OAuth flows
 * - Token generation
 */

import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth-config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// MENTOR NOTE: NextAuth v5 configuration
// Combine config with adapter
const { handlers, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
})

// MENTOR NOTE: Export auth function for server-side use
// This allows other API routes to get the session
export { auth }

// MENTOR NOTE: Export handlers for GET and POST requests
export const { GET, POST } = handlers

