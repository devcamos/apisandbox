import { Prisma } from "@prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  stripeWebhookEvent: {
    create: vi.fn(),
    updateMany: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))

import {
  claimStripeWebhookEvent,
  completeStripeWebhookEvent,
  failStripeWebhookEvent,
} from "@/lib/stripe-webhook-idempotency"

function duplicateEventError() {
  return new Prisma.PrismaClientKnownRequestError("duplicate", {
    code: "P2002",
    clientVersion: "test",
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  prismaMock.stripeWebhookEvent.create.mockResolvedValue({})
  prismaMock.stripeWebhookEvent.updateMany.mockResolvedValue({ count: 0 })
  prismaMock.stripeWebhookEvent.update.mockResolvedValue({})
})

describe("claimStripeWebhookEvent", () => {
  it("claims a new event once", async () => {
    await expect(claimStripeWebhookEvent("evt_1", "customer.subscription.updated")).resolves.toBe(true)
    expect(prismaMock.stripeWebhookEvent.create).toHaveBeenCalledWith({
      data: { id: "evt_1", type: "customer.subscription.updated" },
    })
  })

  it("skips an event that is already complete or actively processing", async () => {
    prismaMock.stripeWebhookEvent.create.mockRejectedValue(duplicateEventError())

    await expect(claimStripeWebhookEvent("evt_2", "invoice.payment_failed")).resolves.toBe(false)
  })

  it("reclaims a failed or stale event", async () => {
    prismaMock.stripeWebhookEvent.create.mockRejectedValue(duplicateEventError())
    prismaMock.stripeWebhookEvent.updateMany.mockResolvedValue({ count: 1 })

    await expect(claimStripeWebhookEvent("evt_3", "customer.subscription.deleted")).resolves.toBe(true)
    expect(prismaMock.stripeWebhookEvent.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: "evt_3" }),
        data: expect.objectContaining({ status: "processing", attempts: { increment: 1 } }),
      }),
    )
  })

  it("does not hide unexpected database errors", async () => {
    prismaMock.stripeWebhookEvent.create.mockRejectedValue(new Error("database unavailable"))
    await expect(claimStripeWebhookEvent("evt_4", "test.event")).rejects.toThrow("database unavailable")
  })
})

describe("event completion", () => {
  it("marks an event processed", async () => {
    await completeStripeWebhookEvent("evt_5")
    expect(prismaMock.stripeWebhookEvent.update).toHaveBeenCalledWith({
      where: { id: "evt_5" },
      data: { status: "processed", processedAt: expect.any(Date), lastError: null },
    })
  })

  it("records a bounded failure message", async () => {
    await failStripeWebhookEvent("evt_6", new Error("x".repeat(600)))
    expect(prismaMock.stripeWebhookEvent.update).toHaveBeenCalledWith({
      where: { id: "evt_6" },
      data: { status: "failed", lastError: "x".repeat(500) },
    })
  })
})
