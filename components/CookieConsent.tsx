"use client"

import { useState, useEffect } from "react"

const CONSENT_KEY = "cookie-consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted")
    setVisible(false)
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, "rejected")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="max-w-xl mx-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-5">
        <p className="text-sm text-gray-300 mb-4">
          We use essential cookies to keep you signed in and optional analytics cookies
          to improve the platform. No advertising cookies are used.{" "}
          <a href="/privacy#cookies" className="text-violet-400 hover:text-violet-300 underline">
            Learn more
          </a>
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={accept}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            Accept all
          </button>
          <button
            onClick={reject}
            className="px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Essential only
          </button>
        </div>
      </div>
    </div>
  )
}

export function hasAnalyticsConsent(): boolean {
  if (globalThis.window === undefined) return false
  return localStorage.getItem(CONSENT_KEY) === "accepted"
}
