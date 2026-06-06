"use client"

import { Sparkles } from "lucide-react"
import { PremiumCatalogPreview, PremiumCatalogCta } from "./PremiumCatalogPreview"

export function FullAccessPrompt() {
  return (
    <section className="mt-16 mb-8 rounded-2xl border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 p-8 md:p-10">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-8 h-8 text-violet-400" />
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Unlock the full curriculum
        </h2>
      </div>
      <p className="text-gray-300 mb-8 max-w-2xl">
        You&apos;ve completed the free foundation. Upgrade for every advanced phase, cloud and AI
        guides, interactive visualisers, and progress tracking.
      </p>
      <PremiumCatalogPreview compact showFeatures />
      <div className="mt-8 flex justify-center">
        <PremiumCatalogCta />
      </div>
    </section>
  )
}
