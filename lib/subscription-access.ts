/**
 * Pure access rules shared by server pages, API guards and `checkPhaseAccess`.
 * No Prisma import here so it can be unit-tested and reused everywhere.
 */

export type SubscriptionTier = "FREE" | "PREMIUM"
export type PhaseId = number | "cloud" | "ai"

export interface SubscriptionRecord {
  subscriptionTier: string | null | undefined
  subscriptionExpiresAt: Date | null | undefined
}

export function isFreePhase(phase: PhaseId): boolean {
  return phase === 0 || phase === 1
}

export function isPremiumPhase(phase: PhaseId): boolean {
  return (
    phase === "cloud" ||
    phase === "ai" ||
    (typeof phase === "number" && phase >= 2 && phase <= 9)
  )
}

/** Expired premium counts as FREE. */
export function effectiveTier(
  record: SubscriptionRecord | null | undefined,
  now: Date = new Date(),
): { tier: SubscriptionTier; isExpired: boolean } {
  if (!record) return { tier: "FREE", isExpired: false }
  const isExpired = record.subscriptionExpiresAt
    ? record.subscriptionExpiresAt.getTime() < now.getTime()
    : false
  const raw: SubscriptionTier = record.subscriptionTier === "PREMIUM" ? "PREMIUM" : "FREE"
  return { tier: isExpired ? "FREE" : raw, isExpired }
}

export function hasActivePremium(
  record: SubscriptionRecord | null | undefined,
  now: Date = new Date(),
): boolean {
  return effectiveTier(record, now).tier === "PREMIUM"
}
