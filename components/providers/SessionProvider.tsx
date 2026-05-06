"use client"

import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { getSafeClientRelativeRedirect } from "@/lib/safe-redirect"

type SessionStatus = "loading" | "authenticated" | "unauthenticated"

interface SessionUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

interface SessionData {
  user: SessionUser
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
}): SessionData {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null
  return {
    user: {
      id: user.id,
      email: user.email,
      name,
      image: user.avatarUrl,
    },
  }
}

async function fetchCurrentUser(token?: string) {
  const res = await fetch("/api/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!res.ok) {
    throw new Error("Not authenticated")
  }
  const payload = await res.json()
  return payload?.data?.user as {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading")
  const [data, setData] = useState<SessionData | null>(null)

  const refresh = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    if (!token) {
      setStatus("unauthenticated")
      setData(null)
      return
    }

    try {
      const user = await fetchCurrentUser(token)
      setData(mapToSessionData(user))
      setStatus("authenticated")
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      setData(null)
      setStatus("unauthenticated")
    }
  }

  useEffect(() => {
    void refresh()
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
      await fetch("/api/auth/logout", { method: "POST" })
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
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
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

