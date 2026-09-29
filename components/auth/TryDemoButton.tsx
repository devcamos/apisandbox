"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useAuthSessionWriter } from "@/components/providers/SessionProvider"
import { authApiFetchInit } from "@/lib/auth/client-fetch"
import { completeClientAuthSession } from "@/lib/auth/client-session"
import { parseLoginErrorMessage } from "@/lib/login-error-parser"

const demoEnabled = process.env.NEXT_PUBLIC_FF_DEMO_LOGIN === "true"

/** Shared muted teal style for the one-click demo entry CTA. */
export const ENTER_DEMO_ACCOUNT_BUTTON_CLASS =
  "w-full rounded-lg border border-teal-700/70 bg-teal-950/80 px-4 py-3 text-center text-sm font-semibold text-teal-50/95 hover:bg-teal-900/80 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"

interface TryDemoButtonProps {
  nextPath?: string
  className?: string
  /** Server-computed gate (preferred). Falls back to NEXT_PUBLIC_FF_DEMO_LOGIN. */
  enabled?: boolean
  children?: React.ReactNode
}

export function TryDemoButton({
  nextPath = "/dashboard",
  className,
  children,
  enabled,
}: Readonly<TryDemoButtonProps>) {
  const { setSessionFromAuthResponse } = useAuthSessionWriter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!(enabled ?? demoEnabled)) {
    return null
  }

  const onClick = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/demo", { method: "POST", ...authApiFetchInit })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg =
          typeof body?.error?.message === "string"
            ? body.error.message
            : "Demo sign-in failed. Try again in a moment."
        setError(parseLoginErrorMessage(msg).message)
        setLoading(false)
        return
      }
      if (!body?.data?.token) {
        setError("Unexpected response from demo sign-in.")
        setLoading(false)
        return
      }
      await completeClientAuthSession({
        authData: body.data,
        redirectTo: nextPath,
        setSession: setSessionFromAuthResponse,
      })
    } catch {
      setError("Network error. Try again.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        data-testid="enter-demo-account"
        onClick={() => void onClick()}
        disabled={loading}
        title="Phase 0 & 1 only — private session, expires in 24 hours"
        className={className ?? ENTER_DEMO_ACCOUNT_BUTTON_CLASS}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Entering demo…
          </span>
        ) : (
          (children ?? "Enter Demo Account")
        )}
      </button>
      {error ? <p className="text-center text-xs text-red-400">{error}</p> : null}
    </div>
  )
}
