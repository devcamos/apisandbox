"use client"

import Link from "next/link"
import { CheckCircle, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useSession } from "@/components/providers/SessionProvider"
import { authApiFetchInit } from "@/lib/auth/client-fetch"

const POLL_INTERVAL_MS = 1500
const MAX_ATTEMPTS = 20

export default function UpgradeSuccessPage() {
  const { refresh } = useSession()
  const [status, setStatus] = useState<"activating" | "ready" | "timeout">("activating")
  const [countdown, setCountdown] = useState(5)

  const pollSubscription = useCallback(async () => {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetch("/api/subscription/status", authApiFetchInit)
        if (res.ok) {
          const data = await res.json()
          if (data.tier === "PREMIUM" && !data.isExpired) {
            await refresh()
            setStatus("ready")
            return
          }
        }
      } catch {
        // retry
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
    }
    setStatus("timeout")
  }, [refresh])

  useEffect(() => {
    void pollSubscription()
  }, [pollSubscription])

  useEffect(() => {
    if (status !== "ready") return

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          globalThis.window.location.href = "/phase-2"
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [status])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {status === "activating" ? (
          <>
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet-500/20 border border-violet-500/30">
              <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Activating Premium…</h1>
            <p className="text-gray-400 mb-8">
              We&apos;re confirming your payment with Stripe. This usually takes a few seconds.
            </p>
          </>
        ) : status === "timeout" ? (
          <>
            <h1 className="text-3xl font-bold text-white mb-3">Almost there</h1>
            <p className="text-gray-400 mb-8">
              Payment succeeded but your account is still updating. Refresh the dashboard in a
              moment or contact support if access does not appear within a few minutes.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-700 text-white font-medium"
            >
              Go to dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Welcome to Premium!</h1>
            <p className="text-gray-400 mb-8">
              Your subscription is active. You now have full access to all phases, interactive
              visualisers, and guided exercises.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/phase-2"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Start Phase 2
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-gray-500 text-sm">Redirecting in {countdown}s…</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
