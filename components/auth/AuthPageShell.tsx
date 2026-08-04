"use client"

import type { ReactNode } from "react"

interface AuthPageShellProps {
  title: string
  subtitle: string
  children: ReactNode
  isLoading?: boolean
  loadingMessage?: string
}

export default function AuthPageShell({
  title,
  subtitle,
  children,
  isLoading = false,
  loadingMessage = "Signing you in securely…",
}: Readonly<AuthPageShellProps>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
            {title}
          </h1>
          <p className="text-gray-400">{subtitle}</p>
        </div>
        <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          {children}
          {isLoading && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-slate-900/90 px-6 text-center backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-cyan-300/30 border-t-cyan-300" aria-hidden />
              <div>
                <p className="font-semibold text-white">{loadingMessage}</p>
                <p className="mt-1 text-sm text-slate-300">This may take a moment.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
