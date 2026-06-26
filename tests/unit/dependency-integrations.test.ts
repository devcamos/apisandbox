import { describe, expect, it } from "vitest"
import {
  findDependencyIntegrationById,
  getDependencyIntegrations,
  groupDependencyIntegrationsByType,
} from "@/lib/dependency-integrations"

describe("dependency integrations", () => {
  it("tracks Stripe as the premium payment dependency", () => {
    const stripe = findDependencyIntegrationById("stripe")

    expect(stripe).toMatchObject({
      name: "Stripe",
      type: "payment",
    })
    expect(stripe?.routes).toContain("/api/checkout")
    expect(stripe?.envVars).toContain("STRIPE_WEBHOOK_SECRET")
    expect(stripe?.learningAreas).toContain("Phase 7: Monetisation")
  })

  it("groups integrations by dependency type", () => {
    const grouped = groupDependencyIntegrationsByType()

    expect(grouped.payment.map((item) => item.id)).toContain("stripe")
    expect(grouped.database.map((item) => item.id)).toContain("prisma")
    expect(grouped.framework.map((item) => item.id)).toContain("nextjs")
  })

  it("keeps each dependency id unique", () => {
    const ids = getDependencyIntegrations().map((item) => item.id)

    expect(new Set(ids).size).toBe(ids.length)
  })
})
