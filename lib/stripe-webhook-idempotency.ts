import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

const PROCESSING_TIMEOUT_MS = 5 * 60 * 1000

export async function claimStripeWebhookEvent(eventId: string, eventType: string): Promise<boolean> {
  try {
    await prisma.stripeWebhookEvent.create({
      data: { id: eventId, type: eventType },
    })
    return true
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
      throw error
    }
  }

  const staleBefore = new Date(Date.now() - PROCESSING_TIMEOUT_MS)
  const claimed = await prisma.stripeWebhookEvent.updateMany({
    where: {
      id: eventId,
      OR: [
        { status: "failed" },
        { status: "processing", updatedAt: { lt: staleBefore } },
      ],
    },
    data: {
      type: eventType,
      status: "processing",
      attempts: { increment: 1 },
      lastError: null,
      processedAt: null,
    },
  })

  return claimed.count === 1
}

export async function completeStripeWebhookEvent(eventId: string): Promise<void> {
  await prisma.stripeWebhookEvent.update({
    where: { id: eventId },
    data: {
      status: "processed",
      processedAt: new Date(),
      lastError: null,
    },
  })
}

export async function failStripeWebhookEvent(eventId: string, error: unknown): Promise<void> {
  const message = error instanceof Error ? error.message : String(error)
  await prisma.stripeWebhookEvent.update({
    where: { id: eventId },
    data: {
      status: "failed",
      lastError: message.slice(0, 500),
    },
  })
}
