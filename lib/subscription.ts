/**
 * Subscription & Access Control Utilities
 * 
 * MENTOR NOTE: Freemium Model Implementation
 * 
 * Subscription Tiers:
 * - FREE: Access to Phase 1 only
 * - PREMIUM: Access to all phases (1-5) + Cloud section
 * 
 * Access Control Strategy:
 * 1. Check user's subscription tier
 * 2. Check if subscription is expired (for trials)
 * 3. Return access status
 * 4. Show upgrade prompts for locked content
 * 
 * This pattern is used by:
 * - GitHub (free repos vs paid)
 * - Notion (free blocks vs paid)
 * - Spotify (free with ads vs premium)
 */

import { prisma } from "@/lib/prisma"

export type SubscriptionTier = "FREE" | "PREMIUM"

export interface AccessCheck {
  hasAccess: boolean
  tier: SubscriptionTier
  isExpired: boolean
  upgradeRequired: boolean
}

/**
 * Check if user has access to a specific phase
 * 
 * MENTOR NOTE: Access Control Logic
 * - FREE tier: Only Phase 1
 * - PREMIUM tier: All phases (1-5) + Cloud + AI
 * - Expired subscriptions: Treated as FREE
 * 
 * @param userId - User ID
 * @param phaseNumber - Phase number (1, 2, 3, 4, 5), "cloud", or "ai"
 * @returns Access check result
 */
export async function checkPhaseAccess(
  userId: string,
  phaseNumber: number | "cloud" | "ai"
): Promise<AccessCheck> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      subscriptionExpiresAt: true,
    },
  })

  if (!user) {
    return {
      hasAccess: false,
      tier: "FREE",
      isExpired: false,
      upgradeRequired: true,
    }
  }

  const tier = user.subscriptionTier as SubscriptionTier
  const isExpired = user.subscriptionExpiresAt
    ? user.subscriptionExpiresAt < new Date()
    : false

  // MENTOR NOTE: Effective tier (expired premium = free)
  const effectiveTier: SubscriptionTier = isExpired ? "FREE" : tier

  // Access rules
  let hasAccess = false
  let upgradeRequired = false

  if (phaseNumber === 0 || phaseNumber === 1 || phaseNumber === 7 || phaseNumber === 8) {
    hasAccess = true
  } else if (phaseNumber === "cloud" || phaseNumber === "ai") {
    // Cloud and AI sections require premium
    hasAccess = effectiveTier === "PREMIUM"
    upgradeRequired = !hasAccess
  } else if (phaseNumber >= 2 && phaseNumber <= 5) {
    // Phases 2-5 require premium
    hasAccess = effectiveTier === "PREMIUM"
    upgradeRequired = !hasAccess
  }

  return {
    hasAccess,
    tier: effectiveTier,
    isExpired,
    upgradeRequired,
  }
}

/**
 * Get user's subscription status
 */
export async function getUserSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionTier: true,
      subscriptionExpiresAt: true,
    },
  })

  if (!user) {
    return null
  }

  const isExpired = user.subscriptionExpiresAt
    ? user.subscriptionExpiresAt < new Date()
    : false

  return {
    tier: user.subscriptionTier as SubscriptionTier,
    isExpired,
    expiresAt: user.subscriptionExpiresAt,
  }
}

/**
 * Upgrade user to premium (for testing/demo)
 * 
 * MENTOR NOTE: In production, this would:
 * 1. Verify payment with Stripe/PayPal
 * 2. Create subscription record
 * 3. Set expiration date
 * 4. Send confirmation email
 */
export async function upgradeToPremium(
  userId: string,
  expiresAt?: Date
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: "PREMIUM",
      subscriptionExpiresAt: expiresAt || null, // null = lifetime
    },
  })
}

/**
 * Get features available for each tier
 */
export function getTierFeatures(tier: SubscriptionTier) {
  if (tier === "PREMIUM") {
    return {
      phases: [0, 1, 2, 3, 4, 5],
      cloud: true,
      ai: true,
      observability: true,
      demos: true,
    }
  }

  return {
    phases: [0, 1], // Phase 0 and Phase 1 are free
    cloud: false,
    ai: false,
    observability: false,
    demos: false,
  }
}
