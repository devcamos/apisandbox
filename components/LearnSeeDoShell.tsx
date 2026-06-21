"use client"

import { useState, type ReactNode } from "react"
import { BookOpen, Eye, FlaskConical, type LucideIcon } from "lucide-react"

type SectionId = "learn" | "see" | "do"

interface LearnSeeDoShellProps {
  learn: ReactNode
  see: ReactNode
  do: ReactNode
  defaultSection?: SectionId
  accentClass?: string
}

const tabs: { id: SectionId; label: string; subtitle: string; icon: LucideIcon }[] = [
  { id: "learn", label: "Learn", subtitle: "Concepts & tradeoffs", icon: BookOpen },
  { id: "see", label: "See", subtitle: "Code & evidence", icon: Eye },
  { id: "do", label: "Do", subtitle: "Practice & proof", icon: FlaskConical },
]

export function LearnSeeDoShell({
  learn,
  see,
  do: doSection,
  defaultSection = "learn",
  accentClass = "from-blue-500 to-cyan-500",
}: Readonly<LearnSeeDoShellProps>) {
  const [active, setActive] = useState<SectionId>(defaultSection)

  const panels: Record<SectionId, ReactNode> = {
    learn,
    see,
    do: doSection,
  }

  return (
    <div className="mb-12">
      <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-800/40 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Learning loop</p>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Learn → See → Do</h2>
        <p className="text-sm text-gray-400 max-w-2xl">
          Build production instincts in order: understand the concept, inspect real examples, then prove it with practice.
        </p>
      </div>

      <div
        className="flex flex-col sm:flex-row gap-2 mb-8 p-1.5 rounded-xl bg-slate-900/60 border border-slate-700"
        role="tablist"
        aria-label="Learn See Do sections"
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`lsd-panel-${tab.id}`}
              id={`lsd-tab-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                isActive
                  ? `bg-gradient-to-r ${accentClass} text-white shadow-lg`
                  : "text-gray-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/20 shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">{tab.label}</span>
                <span className={`block text-xs truncate ${isActive ? "text-white/80" : "text-gray-500"}`}>
                  {index + 1}. {tab.subtitle}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div
        id={`lsd-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`lsd-tab-${active}`}
        className="transition-opacity duration-200"
      >
        {panels[active]}
      </div>
    </div>
  )
}
