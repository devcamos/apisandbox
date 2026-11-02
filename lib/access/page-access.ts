import { hasActivePremium, isFreePhase, type PhaseId, type SubscriptionRecord } from "@/lib/subscription-access"

export type PageAccessDecision = "granted" | "signin" | "upgrade" | "demo-locked"

export interface PageViewer extends SubscriptionRecord {
  id: string
  email: string
  isDemo: boolean
}

/**
 * Server-side decision for a premium learning page. Mirrors checkPhaseAccess +
 * assertPhaseAccessForUser so pages and APIs agree.
 */
export function decidePageAccess(input: {
  phase: PhaseId
  paywallEnabled: boolean
  viewer: PageViewer | null
  now?: Date
}): PageAccessDecision {
  const { phase, paywallEnabled, viewer, now } = input
  if (isFreePhase(phase)) return "granted"
  if (viewer?.isDemo) return "demo-locked"
  if (!paywallEnabled) return "granted"
  if (!viewer) return "signin"
  return hasActivePremium(viewer, now) ? "granted" : "upgrade"
}
