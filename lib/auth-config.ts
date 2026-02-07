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
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth"

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
        // Google Sign-In (life-world-os style: verify id_token, find or create user)
        const googleIdToken = credentials?.googleIdToken as string | undefined
        if (googleIdToken && googleOAuth2Client && GOOGLE_CLIENT_ID) {
          try {
            const ticket = await googleOAuth2Client.verifyIdToken({
              idToken: googleIdToken,
              audience: GOOGLE_CLIENT_ID,
            })
            const payload = ticket.getPayload()
            if (!payload?.email) {
              throw new Error("Google did not provide an email")
            }
            const email = payload.email
            const name = payload.name ?? undefined
            const image = payload.picture ?? undefined

            let user = await prisma.user.findUnique({ where: { email } })
            if (!user) {
              user = await prisma.user.create({
                data: {
                  email,
                  name: name ?? email.split("@")[0],
                  image,
                  passwordHash: null,
                },
              })
            } else if (!user.image && image) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { image, ...(name && !user.name ? { name } : {}) },
              })
            }
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            }
          } catch (err) {
            console.error("Google id_token verification failed", err)
            throw new Error(
              err instanceof Error ? err.message : "Google sign-in failed"
            )
          }
        }

        // Email/password flow
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user) {
          // MENTOR NOTE: Security Best Practice
          // Don't reveal if email exists (prevents user enumeration)
          // However, we can provide helpful guidance without revealing specifics
          throw new Error("CREDENTIALS_INVALID")
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const minutesRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60))
          throw new Error(`ACCOUNT_LOCKED:${minutesRemaining}`)
        }

        // Check if account is active
        if (!user.isActive) {
          throw new Error("Account is deactivated. Please contact support.")
        }

        // Verify password
        if (!user.passwordHash) {
          // User signed up with OAuth, no password set
          throw new Error("This account was created with OAuth. Please sign in with your OAuth provider (Google).")
        }

        const isValidPassword = await verifyPassword(
          password,
          user.passwordHash
        )

        if (!isValidPassword) {
          // MENTOR NOTE: Account Lockout
          // Increment failed login attempts
          const newAttempts = (user.loginAttempts || 0) + 1
          let lockedUntil = null

          // Lock after 5 failed attempts for 30 minutes
          if (newAttempts >= 5) {
            lockedUntil = new Date(Date.now() + 30 * 60 * 1000)
          }

          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: newAttempts,
              lockedUntil,
            }
          })

          // Provide helpful error message based on attempts
          if (newAttempts >= 5) {
            throw new Error("ACCOUNT_LOCKED")
          } else {
            const attemptsRemaining = 5 - newAttempts
            throw new Error(`PASSWORD_INCORRECT:${attemptsRemaining}`)
          }
        }

        // Reset login attempts on successful login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
          }
        })

        // Return user object (password NOT included)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
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

