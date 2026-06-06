"use client"

import { useState } from "react"
import { CreditCard, Loader2 } from "lucide-react"
import { authApiFetchInit } from "@/lib/auth/client-fetch"

interface ManageSubscriptionButtonProps {
  className?: string
  label?: string
  onNavigate?: () => void
}

export function ManageSubscriptionButton({
  className,
  label = "Manage subscription",
  onNavigate,
}: Readonly<ManageSubscriptionButtonProps>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openPortal = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        ...authApiFetchInit,
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || typeof body.url !== "string") {
        setError(
          typeof body.error === "string"
            ? body.error
            : "Billing portal is unavailable.",
        )
        setLoading(false)
        return
      }
      onNavigate?.()
      globalThis.window.location.href = body.url
    } catch {
      setError("Could not open billing portal.")
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void openPortal()}
        disabled={loading}
        className={
          className ??
          "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700 transition-all w-full text-sm disabled:opacity-50"
        }
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        <span>{label}</span>
      </button>
      {error ? <p className="text-xs text-red-400 mt-1 px-3">{error}</p> : null}
    </div>
  )
}
