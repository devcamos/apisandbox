"use client"

import { useEffect, useState } from "react"
import { Loader2, LogOut, MonitorSmartphone } from "lucide-react"
import { authApiRequestInit } from "@/lib/auth/client-fetch"
import { signOut } from "@/components/providers/SessionProvider"

type UserSession = {
  id: string
  deviceName: string | null
  userAgent: string | null
  ipAddress: string | null
  lastUsedAt: string
  expiresAt: string
  createdAt: string
  current: boolean
}

type ApiEnvelope<T> = {
  data?: T
  error?: { message?: string }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function UserSessionsPanel() {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadSessions() {
    setLoading(true)
    const response = await fetch("/api/auth/sessions", authApiRequestInit())
    const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<{ sessions: UserSession[] }>
    if (!response.ok) {
      setMessage(payload.error?.message ?? "Could not load logged-in devices")
      setLoading(false)
      return
    }
    setSessions(payload.data?.sessions ?? [])
    setLoading(false)
  }

  useEffect(() => {
    void loadSessions()
  }, [])

  async function revokeSession(session: UserSession) {
    setBusyId(session.id)
    setMessage(null)
    const response = await fetch(
      `/api/auth/sessions/${encodeURIComponent(session.id)}`,
      authApiRequestInit({ method: "DELETE" }),
    )
    const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<{ revoked: boolean; current: boolean }>
    setBusyId(null)

    if (!response.ok) {
      setMessage(payload.error?.message ?? "Could not revoke this session")
      return
    }

    if (payload.data?.current) {
      await signOut({ callbackUrl: "/login" })
      return
    }
    setSessions((current) => current.filter((item) => item.id !== session.id))
  }

  async function revokeOtherSessions() {
    setBusyId("others")
    setMessage(null)
    const response = await fetch("/api/auth/sessions", authApiRequestInit({ method: "DELETE" }))
    const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<{ revoked: number }>
    setBusyId(null)
    if (!response.ok) {
      setMessage(payload.error?.message ?? "Could not sign out other devices")
      return
    }
    setSessions((current) => current.filter((session) => session.current))
  }

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MonitorSmartphone className="h-4 w-4 text-cyan-300" />
            <h2 className="font-semibold">Logged-in devices</h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Each browser or device has its own session. Revoke access without changing your password.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void revokeOtherSessions()}
          disabled={busyId !== null || sessions.filter((session) => !session.current).length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
        >
          {busyId === "others" ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Sign out other devices
        </button>
      </div>

      {message && (
        <div className="border-b border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm text-amber-100">
          {message}
        </div>
      )}

      <div className="divide-y divide-slate-800">
        {loading ? (
          <div className="flex items-center gap-2 p-5 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading devices
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-5 text-sm text-slate-400">No active sessions found.</div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white">{session.deviceName ?? "Unknown device"}</h3>
                  {session.current && (
                    <span className="rounded-sm border border-cyan-400/40 px-2 py-0.5 text-xs text-cyan-200">
                      This device
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Last active {formatDate(session.lastUsedAt)} · Created {formatDate(session.createdAt)}
                  {session.ipAddress ? ` · IP ${session.ipAddress}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void revokeSession(session)}
                disabled={busyId !== null}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-red-500/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyId === session.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                {session.current ? "Sign out" : "Revoke"}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
