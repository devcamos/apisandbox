/**
 * Subscription Gate Component
 *
 * Checks subscription tier and renders premium children or a free preview + upgrade CTA.
 * Demo sessions are always limited to Phase 0/1, even when the paywall flag is off.
 */

"use client"

import Link from "next/link"
import { useSession } from "@/components/providers/SessionProvider"
import { useEffect, useState } from "react"
import { UpgradePrompt } from "./UpgradePrompt"
import { signupRequiredForPremium } from "@/config/featureFlags"
import { PhaseRoutePreview } from "@/components/premium/PhaseRoutePreview"
import { SectionRoutePreview } from "@/components/premium/SectionRoutePreview"
import { Lock, Sparkles, ArrowRight } from "lucide-react"

interface SubscriptionGateProps {
  children: React.ReactNode
  phaseNumber: number | "cloud" | "ai"
  lockedContentName: string
  freePreview?: React.ReactNode
}

function defaultFreePreview(
  phaseNumber: number | "cloud" | "ai",
  lockedContentName: string,
) {
  if (phaseNumber === "cloud" || phaseNumber === "ai") {
    return (
      <SectionRoutePreview
        sectionId={phaseNumber}
        lockedContentName={lockedContentName}
      />
    )
  }
  if (typeof phaseNumber === "number") {
    return (
      <PhaseRoutePreview
        phaseNumber={phaseNumber}
        lockedContentName={lockedContentName}
      />
    )
  }
  return null
}

function DemoUpgradePrompt({ lockedContent }: Readonly<{ lockedContent: string }>) {
  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900/40 border-2 border-amber-500/30 rounded-2xl p-8 mb-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-500/20 rounded-lg">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">
            {lockedContent} is locked in the demo
          </h3>
          <p className="text-gray-300 mb-4">
            This demo includes full Phase 1 only. Create a free account to keep your progress and unlock later phases with Premium.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Create a free account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/phase-1"
              className="inline-flex items-center gap-2 px-6 py-3 border border-amber-500/40 text-amber-100 rounded-lg font-semibold hover:bg-amber-950/40 transition-all"
            >
              Continue Phase 1
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SubscriptionGate({
  children,
  phaseNumber,
  lockedContentName,
  freePreview,
}: Readonly<SubscriptionGateProps>) {
  const { data: session, status } = useSession()
  const [accessCheck, setAccessCheck] = useState<{
    hasAccess: boolean
    tier: "FREE" | "PREMIUM"
    upgradeRequired: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isDemo = Boolean(session?.isDemo)

  useEffect(() => {
    if (status === "loading") return

    const isFreePhase = phaseNumber === 0 || phaseNumber === 1

    if (isDemo) {
      setAccessCheck({
        hasAccess: isFreePhase,
        tier: "FREE",
        upgradeRequired: !isFreePhase,
      })
      setIsLoading(false)
      return
    }

    if (!session?.user?.id) {
      const unlockAll = !signupRequiredForPremium
      setAccessCheck({
        hasAccess: unlockAll || isFreePhase,
        tier: "FREE",
        upgradeRequired: !unlockAll && !isFreePhase,
      })
      setIsLoading(false)
      return
    }

    if (!signupRequiredForPremium) {
      setAccessCheck({ hasAccess: true, tier: "FREE", upgradeRequired: false })
      setIsLoading(false)
      return
    }

    fetch(`/api/subscription/check?phase=${phaseNumber}`)
      .then((res) => res.json())
      .then((data) => {
        setAccessCheck(data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [session, status, phaseNumber, isDemo])

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!accessCheck) {
    return null
  }

  if (phaseNumber === 0 || phaseNumber === 1) {
    return <>{children}</>
  }

  if (!accessCheck.hasAccess || accessCheck.upgradeRequired) {
    const preview =
      freePreview ?? defaultFreePreview(phaseNumber, lockedContentName)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-6 py-12">
          {isDemo ? (
            <DemoUpgradePrompt lockedContent={lockedContentName} />
          ) : (
            preview ?? (
              <UpgradePrompt
                lockedContent={lockedContentName}
                currentTier={accessCheck.tier}
              />
            )
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
