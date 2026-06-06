/**
 * Subscription Gate Component
 *
 * Checks subscription tier and renders premium children or a free preview + upgrade CTA.
 */

"use client"

import { useSession } from "@/components/providers/SessionProvider"
import { useEffect, useState } from "react"
import { UpgradePrompt } from "./UpgradePrompt"
import { signupRequiredForPremium } from "@/config/featureFlags"
import { PhaseRoutePreview } from "@/components/premium/PhaseRoutePreview"
import { SectionRoutePreview } from "@/components/premium/SectionRoutePreview"

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

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user?.id) {
      const isFreePhase = phaseNumber === 0 || phaseNumber === 1
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
  }, [session, status, phaseNumber])

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
          {preview ?? (
            <UpgradePrompt
              lockedContent={lockedContentName}
              currentTier={accessCheck.tier}
            />
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
