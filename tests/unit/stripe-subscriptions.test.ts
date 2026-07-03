import { describe, expect, it } from "vitest"

import { blocksNewStripeSubscription } from "@/lib/stripe-subscriptions"

describe("blocksNewStripeSubscription", () => {
  it.each(["active", "past_due", "paused", "trialing", "unpaid"] as const)(
    "blocks checkout for %s subscriptions",
    (status) => expect(blocksNewStripeSubscription(status)).toBe(true),
  )

  it.each(["canceled", "incomplete", "incomplete_expired"] as const)(
    "allows checkout for %s subscriptions",
    (status) => expect(blocksNewStripeSubscription(status)).toBe(false),
  )
})
