"use client"

import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import {
  getPhaseCatalogEntry,
  premiumPhaseIcons,
} from "@/lib/learning/premium-catalog"

interface PhaseRoutePreviewProps {
  phaseNumber: number
  lockedContentName?: string
  compact?: boolean
}

export function PhaseRoutePreview({
  phaseNumber,
  lockedContentName,
  compact = false,
}: Readonly<PhaseRoutePreviewProps>) {
  const entry = getPhaseCatalogEntry(phaseNumber)
  const title = lockedContentName ?? entry?.title ?? `Phase ${phaseNumber}`
  const Icon = entry ? entry.icon : premiumPhaseIcons[phaseNumber]
  const description = entry?.description ?? "Premium learning content"
  const topics = entry?.topics ?? []

  return (
    <div
      className={
        compact
          ? "rounded-xl border border-slate-700 bg-slate-800/40 p-4"
          : "rounded-2xl border border-purple-500/30 bg-slate-800/50 p-8 mb-8"
      }
    >
      <div className="flex items-start gap-4 mb-4">
        {Icon ? (
          <div
            className={`p-3 rounded-lg bg-gradient-to-r ${entry?.color ?? "from-purple-500 to-pink-500"}`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
        ) : null}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">
              Premium preview
            </span>
          </div>
          <h2 className={`font-bold text-white ${compact ? "text-lg" : "text-2xl"}`}>
            {title}
          </h2>
          <p className="text-gray-300 mt-2 text-sm">{description}</p>
        </div>
      </div>

      {topics.length > 0 ? (
        <ul className="space-y-2 mb-6">
          {topics.map((topic) => (
            <li key={topic} className="flex items-center text-sm text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
              {topic}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="text-gray-400 text-sm mb-4">
        Upgrade to unlock full lessons, interactive demos, quizzes, and progress tracking for
        this phase.
      </p>

      <Link
        href="/upgrade"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
      >
        Unlock full access
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
