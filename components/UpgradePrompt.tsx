/**
 * Upgrade Prompt Component
 * 
 * MENTOR NOTE: Freemium UX Best Practices
 * 
 * This component:
 * 1. Shows what user is missing (value proposition)
 * 2. Clear CTA to upgrade
 * 3. Shows benefits of premium
 * 4. Non-intrusive but visible
 * 
 * Used by:
 * - GitHub (upgrade prompts for private repos)
 * - Notion (upgrade for more blocks)
 * - Spotify (upgrade to remove ads)
 */

"use client"

import Link from "next/link"
import { Lock, Sparkles, ArrowRight, Check } from "lucide-react"

interface UpgradePromptProps {
  lockedContent: string // e.g., "Phase 2", "Cloud Section"
  currentTier?: "FREE" | "PREMIUM"
}

export function UpgradePrompt({ lockedContent }: UpgradePromptProps) {
  return (
    <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 border-2 border-purple-500/30 rounded-2xl p-8 mb-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-500/20 rounded-lg">
          <Lock className="w-8 h-8 text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">
            {lockedContent} Requires Premium
          </h3>
          <p className="text-gray-300 mb-4">
            Upgrade to Premium to unlock all learning phases, cloud migration guides, and advanced features.
          </p>
          
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-white mb-3">Premium includes:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-green-400" />
                All 4 learning phases (currently only Phase 1 available)
              </li>
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-green-400" />
                AWS Cloud Migration guides
              </li>
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-green-400" />
                Advanced observability dashboard
              </li>
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-green-400" />
                Interactive demos and examples
              </li>
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-green-400" />
                Priority support
              </li>
            </ul>
          </div>

          <Link
            href="/upgrade"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Upgrade to Premium
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}


