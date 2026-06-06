"use client"

import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import { premiumAppSections } from "@/lib/learning/premium-catalog"

interface SectionRoutePreviewProps {
  sectionId: "cloud" | "ai"
  lockedContentName?: string
}

export function SectionRoutePreview({
  sectionId,
  lockedContentName,
}: Readonly<SectionRoutePreviewProps>) {
  const section = premiumAppSections.find((s) => s.id === sectionId)
  if (!section) return null

  const Icon = section.icon
  const title = lockedContentName ?? section.title

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-slate-800/50 p-8 mb-8">
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${section.color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">
              Premium preview
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-300 mt-2">{section.description}</p>
        </div>
      </div>
      <ul className="space-y-2 mb-6">
        {section.topics.map((topic) => (
          <li key={topic} className="flex items-center text-sm text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
            {topic}
          </li>
        ))}
      </ul>
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
