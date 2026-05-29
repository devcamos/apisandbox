"use client"

import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import type { AuthSubscriptionTier } from "@/lib/auth/types"
import { authApiFetchInit } from "@/lib/auth/client-fetch"
import { getSafeClientRelativeRedirect } from "@/lib/safe-redirect"

type SessionStatus = "loading" | "authenticated" | "unauthenticated"

interface SessionUser {
  id: string
  email: string
  firstName?: string | null
  name?: string | null
  image?: string | null
}

interface SessionData {
  user: SessionUser
  subscriptionTier: AuthSubscriptionTier
}

interface AuthContextValue {
  status: SessionStatus
  data: SessionData | null
  refresh: () => Promise<void>
  setSessionFromAuthResponse: (authData: {
    token: string
    user: {
      id: string
      email: string
      firstName: string | null
      lastName: string | null
      avatarUrl: string | null
      subscriptionTier?: AuthSubscriptionTier
    }
  }) => void
  clearSession: () => Promise<void>
}

const STORAGE_KEY = "auth_jwt"

const AuthContext = createContext<AuthContextValue | null>(null)

function mapToSessionData(user: {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  subscriptionTier?: AuthSubscriptionTier
}): SessionData {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null
  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      name,
      image: user.avatarUrl,
    },
    subscriptionTier: user.subscriptionTier ?? "FREE",
  }
}

export function welcomeFirstName(user: SessionUser): string {
  if (user.firstName?.trim()) return user.firstName.trim()
  if (user.name?.trim()) return user.name.trim().split(/\s+/)[0] ?? user.name.trim()
  if (user.email) return user.email.split("@")[0] ?? "there"
  return "there"
}

async function fetchCurrentUser(token?: string) {
  const res = await fetch("/api/auth/me", {
    ...authApiFetchInit,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!res.ok) {
    throw new Error("Not authenticated")
  }
  const payload = await res.json()
  return payload?.data as {
    user: {
      id: string
      email: string
      firstName: string | null
      lastName: string | null
      avatarUrl: string | null
      subscriptionTier: AuthSubscriptionTier
    }
    token?: string
  }
}

export function SessionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [status, setStatus] = useState<SessionStatus>("loading")
  const [data, setData] = useState<SessionData | null>(null)

  const refresh = async () => {
    const token = globalThis.window === undefined ? null : localStorage.getItem(STORAGE_KEY)
    try {
      const session = await fetchCurrentUser(token ?? undefined)
      if (session.token && globalThis.window !== undefined) {
        localStorage.setItem(STORAGE_KEY, session.token)
      }
      setData(mapToSessionData(session.user))
      setStatus("authenticated")
    } catch {
      if (token && globalThis.window !== undefined) {
        localStorage.removeItem(STORAGE_KEY)
      }
      setStatus("unauthenticated")
      setData(null)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  useEffect(() => {
    if (globalThis.window === undefined) return

    function handleWindowFocus() {
      void refresh()
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refresh()
      }
    }

    window.addEventListener("focus", handleWindowFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("focus", handleWindowFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const setSessionFromAuthResponse: AuthContextValue["setSessionFromAuthResponse"] = (
    authData
  ) => {
    localStorage.setItem(STORAGE_KEY, authData.token)
    setData(mapToSessionData(authData.user))
    setStatus("authenticated")
  }

  const clearSession = async () => {
    localStorage.removeItem(STORAGE_KEY)
    setData(null)
    setStatus("unauthenticated")
    try {
      await fetch("/api/auth/logout", { method: "POST", ...authApiFetchInit })
    } catch {
      // no-op
    }
  }

  return (
    <AuthContext.Provider
      value={{ status, data, refresh, setSessionFromAuthResponse, clearSession }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useSession must be used inside SessionProvider")
  return {
    data: ctx.data,
    status: ctx.status,
    refresh: ctx.refresh,
  }
}

export async function signOut(options?: { callbackUrl?: string }) {
  const callback = getSafeClientRelativeRedirect(options?.callbackUrl, "/")
  if (globalThis.window !== undefined) {
    localStorage.removeItem(STORAGE_KEY)
    try {
      await fetch("/api/auth/logout", { method: "POST", ...authApiFetchInit })
    } catch {
      // no-op
    }
    window.location.href = callback
  }
}

export function useAuthSessionWriter() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthSessionWriter must be used inside SessionProvider")
  return {
    setSessionFromAuthResponse: ctx.setSessionFromAuthResponse,
    clearSession: ctx.clearSession,
  }
}
