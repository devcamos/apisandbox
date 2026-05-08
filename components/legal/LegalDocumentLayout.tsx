import Link from "next/link"
import type { ReactNode } from "react"

const LAST_UPDATED = "May 2026"

export function LegalDocumentLayout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link
          href="/"
          className="text-sm text-violet-400 hover:text-violet-300 mb-8 inline-block"
        >
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">{children}</div>
      </div>
    </div>
  )
}
