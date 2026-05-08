/**
 * NextAuth.js v5 Configuration
 * 
 * MENTOR NOTE: Authentication Architecture
 * 
 * This configuration provides:
 * 1. Email/Password authentication (Credentials Provider)
 * 2. OAuth authentication (Google, GitHub)
 * 3. Session management (JWT or database)
 * 4. Security best practices
 * 
 * Key Security Features:
 * - Password hashing with bcrypt (12 rounds)
 * - Rate limiting (handled in API routes)
 * - Account lockout (after failed attempts)
 * - HTTPS-only cookies in production
 * - CSRF protection (built into NextAuth)
 */

import NextAuth, { type NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { OAuth2Client } from "google-auth-library"
import { authorizeWithEmailPassword, authorizeWithGoogleIdToken } from "@/lib/auth-authorize-helpers"

// MENTOR NOTE: Environment variables for OAuth
// In production, set these in your hosting platform:
// - Vercel: Project Settings → Environment Variables
// - AWS: Secrets Manager or Parameter Store
// - Docker: docker-compose.yml or .env file
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const googleOAuth2Client = GOOGLE_CLIENT_ID
  ? new OAuth2Client(GOOGLE_CLIENT_ID)
  : null

export const authConfig: NextAuthConfig = {
  // MENTOR NOTE: Base path configuration
  // Ensures OAuth callbacks and session endpoints work correctly
  basePath: "/api/auth",
  // MENTOR NOTE: Prisma Adapter
  // - Automatically creates/manages sessions in database
  // - Handles OAuth account linking
  // - Provides type-safe database access
  // Note: Adapter is configured in the route handler

  // MENTOR NOTE: Session Strategy
  // - "jwt": Stateless, stored in cookie (faster, scalable)
  // - "database": Stored in DB (more secure, can revoke)
  // For SaaS apps, "jwt" is usually preferred for performance
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // MENTOR NOTE: Pages customization
  // Customize the default NextAuth pages
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login", // Error code passed as ?error=
  },

  providers: [
    // Provider 1: Email/Password (Credentials)
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        googleIdToken: { label: "Google ID Token", type: "text" },
      },
      async authorize(credentials) {
        const googleIdToken = credentials?.googleIdToken as string | undefined
        if (googleIdToken && googleOAuth2Client && GOOGLE_CLIENT_ID) {
          try {
            return await authorizeWithGoogleIdToken(googleIdToken, googleOAuth2Client, GOOGLE_CLIENT_ID)
          } catch (err) {
            console.error("Google id_token verification failed", err)
            throw new Error(err instanceof Error ? err.message : "Google sign-in failed")
          }
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        return authorizeWithEmailPassword(credentials.email as string, credentials.password as string)
      }
    }),

    // Provider 2: Google OAuth
    ...(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        // MENTOR NOTE: OAuth Scopes
        // Request only necessary permissions
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
  ],

  callbacks: {
    // MENTOR NOTE: JWT Callback
    // Called when JWT is created or updated
    // Add custom data to the token here
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
      }

      // OAuth account linking
      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },

    // MENTOR NOTE: Session Callback
    // Called whenever a session is checked
    // Return data that will be available in useSession()
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      // MENTOR NOTE: Always return session object (never null)
      // NextAuth v5 expects a session object, even if empty
      return session
    },

    // MENTOR NOTE: Redirect Callback
    // Controls where users are redirected after sign in
    // Default to dashboard, but respect callbackUrl from middleware
    async redirect({ url, baseUrl }) {
      // If callbackUrl is provided (from middleware), use it
      if (url.startsWith(baseUrl)) {
        return url
      }
      // Default to dashboard after login
      return `${baseUrl}/dashboard`
    },
  },

  // MENTOR NOTE: Security Configuration
  // Production security settings
  ...(process.env.NODE_ENV === "production" && {
    cookies: {
      sessionToken: {
        name: `__Secure-next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: true, // HTTPS only
        },
      },
    },
  }),
}

// MENTOR NOTE: Don't create auth instance here
// The auth instance is created in the route handler with the Prisma adapter
// Import auth from '@/app/api/auth/[...nextauth]/route' for server-side use

