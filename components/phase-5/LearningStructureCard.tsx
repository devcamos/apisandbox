"use client"

import type { ReactNode } from "react"

interface LearningStructureItem {
  label: string
  value: ReactNode
}

interface LearningStructureCardProps {
  items: readonly LearningStructureItem[]
  heading?: string
  footer?: ReactNode
}

export default function LearningStructureCard({
  items,
  heading = "Learning structure",
  footer,
}: Readonly<LearningStructureCardProps>) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="text-xs text-gray-400 mb-1">{heading}</div>
      {items.map((item, idx) => (
        <div
          key={item.label}
          className={`text-sm text-cyan-100${idx < items.length - 1 ? " mb-1" : ""}`}
        >
          <span className="font-semibold">{item.label}:</span> {item.value}
        </div>
      ))}
      {footer}
    </div>
  )
}
