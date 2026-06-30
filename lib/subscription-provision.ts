import { prisma } from "@/lib/prisma"

/** Same DB shape as Stripe `checkout.session.completed` provisioning. */
export async function applyPremiumSubscription(
  userId: string,
  options?: {
    stripeSubscriptionId?: string | null
    stripeSubscriptionStatus?: string | null
    stripeCurrentPeriodEnd?: Date | null
    subscriptionExpiresAt?: Date | null
  },
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: "PREMIUM",
      stripeSubscriptionId: options?.stripeSubscriptionId ?? null,
      stripeSubscriptionStatus: options?.stripeSubscriptionStatus ?? null,
      stripeCurrentPeriodEnd: options?.stripeCurrentPeriodEnd ?? null,
      subscriptionExpiresAt: options?.subscriptionExpiresAt ?? null,
    },
  })
}

/** Same DB shape as subscription deleted / payment failed downgrade. */
export async function downgradeToFreeSubscription(
  userId: string,
  options?: {
    stripeSubscriptionStatus?: string | null
    stripeCurrentPeriodEnd?: Date | null
  },
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: "FREE",
      stripeSubscriptionId: null,
      stripeSubscriptionStatus: options?.stripeSubscriptionStatus ?? null,
      stripeCurrentPeriodEnd: options?.stripeCurrentPeriodEnd ?? null,
      subscriptionExpiresAt: null,
    },
  })
}

/** Resolve user id from Stripe customer id when metadata is missing. */
export async function findUserIdByStripeCustomerId(
  customerId: string,
): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  })
  return user?.id ?? null
}
