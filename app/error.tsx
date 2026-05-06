"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Home, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 mb-4">
          500
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
        <p className="text-gray-400 mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-300 hover:text-white font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
        {error.digest && (
          <p className="text-gray-600 text-xs mt-6">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
