"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { useAuthSessionWriter } from "@/components/providers/SessionProvider"
import { authApiFetchInit } from "@/lib/auth/client-fetch"
import { completeClientAuthSession } from "@/lib/auth/client-session"
import { parseLoginErrorMessage } from "@/lib/login-error-parser"

const demoEnabled = process.env.NEXT_PUBLIC_FF_DEMO_LOGIN === "true"

interface TryDemoButtonProps {
  nextPath?: string
  className?: string
  children?: React.ReactNode
}

export function TryDemoButton({
  nextPath = "/dashboard",
  className,
  children,
}: Readonly<TryDemoButtonProps>) {
  const { setSessionFromAuthResponse } = useAuthSessionWriter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!demoEnabled) {
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
            : "Demo sign-in failed. Is the demo user provisioned?"
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
        onClick={() => void onClick()}
        disabled={loading}
        className={
          className ??
          "w-full flex items-center justify-center gap-2 rounded-lg border border-amber-500/50 bg-amber-950/40 px-4 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-900/50 disabled:opacity-50 transition-colors"
        }
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Sparkles className="h-4 w-4 text-amber-400" aria-hidden />
        )}
        {children ?? "Try live demo (full app)"}
      </button>
      {error ? <p className="text-center text-xs text-red-400">{error}</p> : null}
    </div>
  )
}
