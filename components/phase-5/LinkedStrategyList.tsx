"use client"

import Link from "next/link"

export interface LinkedStrategy {
  id: string
  title: string
  summary: string
}

interface LinkedStrategyListProps {
  strategies: readonly LinkedStrategy[]
  heading?: string
  containerClass?: string
  headingClass?: string
}

export default function LinkedStrategyList({
  strategies,
  heading = "Method design",
  containerClass = "bg-blue-500/10 border border-blue-500/30 rounded-xl p-4",
  headingClass = "text-xs text-blue-300 mb-2",
}: Readonly<LinkedStrategyListProps>) {
  if (strategies.length === 0) return null
  return (
    <div className={containerClass}>
      <div className={headingClass}>{heading}</div>
      <div className="space-y-2">
        {strategies.map((strategy) => (
          <Link
            key={strategy.id}
            href={`/phase-5/strategies/${strategy.id}`}
            className="block rounded border border-slate-700 bg-slate-900/60 p-3 transition-colors hover:border-cyan-400/60"
          >
            <div className="text-sm font-semibold text-cyan-200 underline">{strategy.title}</div>
            <div className="text-xs text-cyan-100 mt-1">{strategy.summary}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
