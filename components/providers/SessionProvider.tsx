/**
 * Session Provider Component
 * 
 * MENTOR NOTE: NextAuth.js Session Management
 * 
 * This component wraps your app to provide:
 * - useSession() hook access
 * - Automatic session refresh
 * - Client-side session state
 * 
 * Usage:
 * - Wrap your app in layout.tsx
 * - Use useSession() in any component
 */

"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { ReactNode } from "react"

export function SessionProvider({ children }: { children: ReactNode }) {
  // MENTOR NOTE: NextAuth v5 beta requires basePath to match server config
  // This ensures the client knows where to find the auth endpoints
  return (
    <NextAuthSessionProvider basePath="/api/auth">
      {children}
    </NextAuthSessionProvider>
  )
}

