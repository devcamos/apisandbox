import { beforeEach, describe, expect, it, vi } from "vitest"

const prismaMock = vi.hoisted(() => ({
  user: {
    update: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
  },
}))

const loggerMock = vi.hoisted(() => ({
  debug: vi.fn(),
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
  subscriptionStatusGrantsAccess,
} from "@/lib/stripe-webhook-handlers"

beforeEach(() => {
  vi.clearAllMocks()
  prismaMock.user.update.mockResolvedValue({})
  prismaMock.user.findUnique.mockResolvedValue(null)
  prismaMock.user.findFirst.mockResolvedValue(null)
  sendSubscriptionConfirmationMock.mockResolvedValue(null)
  sendSubscriptionCancelledMock.mockResolvedValue(null)
})

describe("subscription status helpers", () => {
  it("reads the legacy current period end field safely", () => {
    expect(currentPeriodEndUnix({ current_period_end: 123 } as any)).toBe(123)
    expect(currentPeriodEndUnix({} as any)).toBeNull()
    expect(currentPeriodEndUnix({ current_period_end: "123" } as any)).toBeNull()
  })

  it("reads current period end from subscription items on the pinned Stripe API", () => {
    expect(
      currentPeriodEndUnix({
        items: { data: [{ current_period_end: 100 }, { current_period_end: 200 }] },
      } as any),
    ).toBe(200)
  })

  it.each([
    ["active", true],
    ["trialing", true],
    ["past_due", true],
    ["unpaid", false],
    ["canceled", false],
    ["paused", false],
  ] as const)("maps %s access to %s", (status, expected) => {
    expect(subscriptionStatusGrantsAccess(status)).toBe(expected)
  })
})

describe("handleCheckoutSessionCompleted", () => {
  it("does not provision access before payment succeeds", async () => {
    await handleCheckoutSessionCompleted({
      type: "checkout.session.completed",
      data: { object: { id: "cs_1", payment_status: "unpaid", metadata: { userId: "user_1" } } },
    } as any)

    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })

  it("returns early when the paid session has no mapped user", async () => {
    await handleCheckoutSessionCompleted({
      type: "checkout.session.completed",
      data: { object: { id: "cs_2", payment_status: "paid", metadata: {} } },
    } as any)

    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })

  it("provisions premium and sends confirmation after payment", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ email: "user@example.com" })

    await handleCheckoutSessionCompleted({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_3",
          payment_status: "paid",
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
        stripeSubscriptionStatus: "active",
      },
    })
    expect(sendSubscriptionConfirmationMock).toHaveBeenCalledWith("user@example.com")
  })

  it("uses client_reference_id and supports expanded subscription objects", async () => {
    await handleCheckoutSessionCompleted({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_4",
          payment_status: "no_payment_required",
          client_reference_id: "user_2",
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
  })
})

describe("handleInvoicePaymentFailed", () => {
  it("logs the failure without revoking access during Stripe recovery", async () => {
    prismaMock.user.findFirst.mockResolvedValue({ id: "user_pay_fail" })

    await handleInvoicePaymentFailed({
      type: "invoice.payment_failed",
      data: { object: { id: "in_1", customer: "cus_777" } },
    } as any)

    expect(prismaMock.user.update).not.toHaveBeenCalled()
    expect(loggerMock.warn).toHaveBeenCalled()
  })
})

describe("subscription reconciliation", () => {
  it("downgrades a deleted subscription and sends cancellation email", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ email: "user@example.com" })

    await handleCustomerSubscriptionDeleted({
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_deleted",
          status: "canceled",
          customer: "cus_1",
          metadata: { userId: "user_3" },
        },
      },
    } as any)

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user_3" },
      data: {
        subscriptionTier: "FREE",
        stripeSubscriptionId: null,
        stripeSubscriptionStatus: "canceled",
        stripeCurrentPeriodEnd: null,
        subscriptionExpiresAt: null,
      },
    })
    expect(sendSubscriptionCancelledMock).toHaveBeenCalledWith("user@example.com", expect.any(Date))
  })

  it("retains premium while cancellation is pending", async () => {
    await handleCustomerSubscriptionUpdated({
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_4",
          status: "active",
          customer: "cus_4",
          metadata: { userId: "user_4" },
          cancel_at_period_end: true,
          current_period_end: 2_000_000_000,
        },
      },
    } as any)

    const end = new Date(2_000_000_000 * 1000)
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user_4" },
      data: {
        subscriptionTier: "PREMIUM",
        stripeSubscriptionId: "sub_4",
        stripeSubscriptionStatus: "active",
        stripeCurrentPeriodEnd: end,
        subscriptionExpiresAt: end,
      },
    })
  })

  it("keeps premium with a null period when Stripe omits the legacy period field", async () => {
    await handleCustomerSubscriptionUpdated({
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_5",
          status: "past_due",
          customer: "cus_5",
          metadata: { userId: "user_5" },
          cancel_at_period_end: false,
        },
      },
    } as any)

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user_5" },
      data: expect.objectContaining({
        subscriptionTier: "PREMIUM",
        stripeSubscriptionStatus: "past_due",
        stripeCurrentPeriodEnd: null,
        subscriptionExpiresAt: null,
      }),
    })
  })

  it("revokes access when the subscription becomes unpaid", async () => {
    await handleCustomerSubscriptionUpdated({
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_6",
          status: "unpaid",
          customer: "cus_6",
          metadata: { userId: "user_6" },
        },
      },
    } as any)

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user_6" },
      data: expect.objectContaining({
        subscriptionTier: "FREE",
        stripeSubscriptionId: null,
        stripeSubscriptionStatus: "unpaid",
      }),
    })
  })

  it("falls back to the Stripe customer mapping", async () => {
    prismaMock.user.findFirst.mockResolvedValue({ id: "user_customer" })

    await handleCustomerSubscriptionUpdated({
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_7",
          status: "active",
          customer: "cus_7",
          metadata: {},
          cancel_at_period_end: false,
        },
      },
    } as any)

    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "user_customer" } }),
    )
  })
})

describe("dispatchStripeWebhookEvent", () => {
  it("dispatches supported event types", async () => {
    await dispatchStripeWebhookEvent({
      type: "checkout.session.async_payment_succeeded",
      data: {
        object: {
          id: "cs_7",
          payment_status: "paid",
          metadata: { userId: "user_7" },
          subscription: "sub_777",
        },
      },
    } as any)
    await dispatchStripeWebhookEvent({
      type: "customer.subscription.created",
      data: {
        object: {
          id: "sub_777",
          status: "active",
          customer: "cus_777",
          metadata: { userId: "user_7" },
          cancel_at_period_end: false,
        },
      },
    } as any)
    await dispatchStripeWebhookEvent({ type: "unknown.event", data: { object: {} } } as any)

    expect(prismaMock.user.update).toHaveBeenCalled()
    expect(loggerMock.debug).toHaveBeenCalled()
  })
})
