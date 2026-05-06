"use client"

import type { ReactNode } from "react"

interface AuthPageShellProps {
  title: string
  subtitle: string
  children: ReactNode
}

export default function AuthPageShell({
  title,
  subtitle,
  children,
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
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          {children}
        </div>
      </div>
    </div>
  )
}
