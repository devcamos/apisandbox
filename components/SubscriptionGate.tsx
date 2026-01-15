/**
 * Subscription Gate Component
 * 
 * MENTOR NOTE: Access Control Pattern
 * 
 * This component:
 * 1. Checks user's subscription tier
 * 2. Shows upgrade prompt if access denied
 * 3. Renders content if access granted
 * 
 * Usage:
 * <SubscriptionGate phaseNumber={2}>
 *   <Phase2Content />
 * </SubscriptionGate>
 */

"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { UpgradePrompt } from "./UpgradePrompt"
import { useRouter } from "next/navigation"

interface SubscriptionGateProps {
  children: React.ReactNode
  phaseNumber: number | "cloud" | "ai"
  lockedContentName: string
}

export function SubscriptionGate({ 
  children, 
  phaseNumber, 
  lockedContentName 
}: SubscriptionGateProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [accessCheck, setAccessCheck] = useState<{
    hasAccess: boolean
    tier: "FREE" | "PREMIUM"
    upgradeRequired: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user?.id) {
      router.push("/login")
      return
    }

    // Check access
    fetch(`/api/subscription/check?phase=${phaseNumber}`)
      .then(res => res.json())
      .then(data => {
        setAccessCheck(data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [session, status, phaseNumber, router])

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

  // Phase 0 and Phase 1 are always accessible (FREE tier)
  if (phaseNumber === 0 || phaseNumber === 1) {
    return <>{children}</>
  }

  // Show upgrade prompt if access denied
  if (!accessCheck.hasAccess || accessCheck.upgradeRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-6 py-12">
          <UpgradePrompt 
            lockedContent={lockedContentName}
            currentTier={accessCheck.tier}
          />
        </div>
      </div>
    )
  }

  // User has access, render content
  return <>{children}</>
}

