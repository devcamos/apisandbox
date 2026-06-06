"use client"

import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import {
  getPremiumCatalogPhases,
  premiumAppSections,
  premiumFeatureHighlights,
} from "@/lib/learning/premium-catalog"

interface PremiumCatalogPreviewProps {
  showFeatures?: boolean
  showSections?: boolean
  compact?: boolean
}

export function PremiumCatalogPreview({
  showFeatures = true,
  showSections = true,
  compact = false,
}: Readonly<PremiumCatalogPreviewProps>) {
  const phases = getPremiumCatalogPhases()

  return (
    <div className={compact ? "space-y-6" : "space-y-10"}>
      <div>
        <h3 className={`font-bold text-white mb-4 ${compact ? "text-lg" : "text-2xl"}`}>
          Premium learning phases
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.map((phase) => {
            const Icon = phase.icon
            return (
              <Link
                key={phase.id}
                href={phase.href}
                className="group rounded-xl border border-slate-700 bg-slate-800/40 p-4 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs text-gray-400">Phase {phase.id}</span>
                </div>
                <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${phase.color} mb-2`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">{phase.title}</h4>
                <p className="text-gray-400 text-xs line-clamp-2">{phase.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {showSections ? (
        <div>
          <h3 className={`font-bold text-white mb-4 ${compact ? "text-lg" : "text-xl"}`}>
            Cloud &amp; AI
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {premiumAppSections.map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="rounded-xl border border-slate-700 bg-slate-800/40 p-4 hover:border-purple-500/40 transition-all"
                >
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${section.color} mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">{section.title}</h4>
                  <p className="text-gray-400 text-xs">{section.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}

      {showFeatures ? (
        <div>
          <h3 className={`font-bold text-white mb-4 ${compact ? "text-lg" : "text-xl"}`}>
            Also included
          </h3>
          <ul className="grid sm:grid-cols-3 gap-3">
            {premiumFeatureHighlights.map((feature) => {
              const Icon = feature.icon
              return (
                <li
                  key={feature.id}
                  className="flex gap-3 rounded-lg border border-slate-700 bg-slate-800/30 p-3"
                >
                  <Icon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">{feature.title}</p>
                    <p className="text-gray-400 text-xs">{feature.description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export function PremiumCatalogCta() {
  return (
    <Link
      href="/upgrade"
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
    >
      View plans &amp; upgrade
      <ArrowRight className="w-4 h-4" />
    </Link>
  )
}
