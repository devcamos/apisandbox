import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  user: {
    update: vi.fn(),
    findUnique: vi.fn(),
  },
}))

const loggerMock = vi.hoisted(() => ({
  info: vi.fn(),
  warn: vi.fn(),
}))

const sendSubscriptionConfirmationMock = vi.hoisted(() => vi.fn())
const sendSubscriptionCancelledMock = vi.hoisted(() => vi.fn())

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))
vi.mock("@/lib/logger", () => ({ logger: loggerMock }))
vi.mock("@/lib/email", () => ({
  sendSubscriptionConfirmation: sendSubscriptionConfirmationMock,
  sendSubscriptionCancelled: sendSubscriptionCancelledMock,
}))

import {
  currentPeriodEndUnix,
  dispatchStripeWebhookEvent,
  handleCheckoutSessionCompleted,
  handleCustomerSubscriptionDeleted,
  handleCustomerSubscriptionUpdated,
  handleInvoicePaymentFailed,
} from "@/lib/stripe-webhook-handlers"

beforeEach(() => {
  vi.clearAllMocks()
  prismaMock.user.update.mockResolvedValue({})
  prismaMock.user.findUnique.mockResolvedValue(null)
  sendSubscriptionConfirmationMock.mockResolvedValue(null)
  sendSubscriptionCancelledMock.mockResolvedValue(null)
})

describe("currentPeriodEndUnix", () => {
  it("returns number when current_period_end is a number", () => {
    expect(currentPeriodEndUnix({ current_period_end: 123 } as any)).toBe(123)
  })

  it("returns null when current_period_end is missing or not a number", () => {
    expect(currentPeriodEndUnix({} as any)).toBeNull()
    expect(currentPeriodEndUnix({ current_period_end: "123" } as any)).toBeNull()
  })
})

describe("handleCheckoutSessionCompleted", () => {
  it("returns early when userId metadata is missing", async () => {
    await handleCheckoutSessionCompleted({
      type: "checkout.session.completed",
      data: { object: { metadata: {} } },
    } as any)

    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })

  it("updates user to PREMIUM and sends confirmation email when email is present", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ email: "user@example.com" })

    await handleCheckoutSessionCompleted({
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { userId: "user_1" },
          subscription: "sub_123",
        },
      },
    } as any)

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user_1" },
      data: {
        subscriptionTier: "PREMIUM",
        stripeSubscriptionId: "sub_123",
        subscriptionExpiresAt: null,
      },
    })
    expect(sendSubscriptionConfirmationMock).toHaveBeenCalledWith("user@example.com")
    expect(loggerMock.info).toHaveBeenCalled()
  })

  it("handles subscription object form and skips email when user lookup has no email", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    await handleCheckoutSessionCompleted({
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { userId: "user_2" },
          subscription: { id: "sub_obj" },
        },
      },
    } as any)

    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user_2" },
        data: expect.objectContaining({ stripeSubscriptionId: "sub_obj" }),
      }),
    )
    expect(sendSubscriptionConfirmationMock).not.toHaveBeenCalled()
  })
})

describe("handleInvoicePaymentFailed", () => {
  it("logs warning when customer id is present", async () => {
    await handleInvoicePaymentFailed({
      type: "invoice.payment_failed",
      data: { object: { customer: "cus_777" } },
    } as any)

    expect(loggerMock.warn).toHaveBeenCalled()
  })
})

describe("handleCustomerSubscriptionDeleted", () => {
  it("downgrades user to FREE and sends cancellation email when email is present", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ email: "user@example.com" })

    await handleCustomerSubscriptionDeleted({
      type: "customer.subscription.deleted",
      data: { object: { metadata: { userId: "user_3" } } },
    } as any)

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user_3" },
      data: {
        subscriptionTier: "FREE",
        stripeSubscriptionId: null,
        subscriptionExpiresAt: null,
      },
    })
    expect(sendSubscriptionCancelledMock).toHaveBeenCalledWith(
      "user@example.com",
      expect.any(Date),
    )
    expect(loggerMock.info).toHaveBeenCalled()
  })
})

describe("handleCustomerSubscriptionUpdated", () => {
  it("returns early when userId metadata is missing", async () => {
    await handleCustomerSubscriptionUpdated({
      type: "customer.subscription.updated",
      data: { object: { metadata: {} } },
    } as any)
    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })

  it("sets subscriptionExpiresAt when cancelling at period end and period end is numeric", async () => {
    await handleCustomerSubscriptionUpdated({
      type: "customer.subscription.updated",
      data: {
        object: {
          metadata: { userId: "user_4" },
          cancel_at_period_end: true,
          current_period_end: 2_000_000_000,
        },
      },
    } as any)

    const updateArg = prismaMock.user.update.mock.calls[0]?.[0]
    expect(updateArg.where).toEqual({ id: "user_4" })
    expect(updateArg.data.subscriptionExpiresAt).toBeInstanceOf(Date)
    expect(loggerMock.info).toHaveBeenCalled()
  })

  it("does nothing when cancelling at period end but period end is not a number", async () => {
    await handleCustomerSubscriptionUpdated({
      type: "customer.subscription.updated",
      data: {
        object: {
          metadata: { userId: "user_5" },
          cancel_at_period_end: true,
          current_period_end: "not-a-number",
        },
      },
    } as any)

    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })

  it("clears subscriptionExpiresAt when not cancelling at period end", async () => {
    await handleCustomerSubscriptionUpdated({
      type: "customer.subscription.updated",
      data: {
        object: {
          metadata: { userId: "user_6" },
          cancel_at_period_end: false,
        },
      },
    } as any)

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user_6" },
      data: { subscriptionExpiresAt: null },
    })
  })
})

describe("dispatchStripeWebhookEvent", () => {
  it("dispatches supported event types (smoke)", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ email: "user@example.com" })

    await dispatchStripeWebhookEvent({
      type: "checkout.session.completed",
      data: { object: { metadata: { userId: "user_7" }, subscription: "sub_777" } },
    } as any)

    await dispatchStripeWebhookEvent({
      type: "invoice.payment_failed",
      data: { object: { customer: "cus_777" } },
    } as any)

    await dispatchStripeWebhookEvent({
      type: "customer.subscription.deleted",
      data: { object: { metadata: { userId: "user_7" } } },
    } as any)

    await dispatchStripeWebhookEvent({
      type: "customer.subscription.updated",
      data: {
        object: {
          metadata: { userId: "user_7" },
          cancel_at_period_end: false,
        },
      },
    } as any)

    expect(prismaMock.user.update).toHaveBeenCalled()
  })
})
