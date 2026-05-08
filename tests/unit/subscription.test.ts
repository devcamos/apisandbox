import { describe, it, expect } from "vitest"
import { getTierFeatures } from "@/lib/subscription"

describe("Subscription Utilities", () => {
  describe("getTierFeatures", () => {
    it("FREE tier gets phases 0 and 1 only", () => {
      const features = getTierFeatures("FREE")
      expect(features.phases).toEqual([0, 1])
      expect(features.cloud).toBe(false)
      expect(features.ai).toBe(false)
      expect(features.demos).toBe(false)
    })

    it("PREMIUM tier gets all phases and features", () => {
      const features = getTierFeatures("PREMIUM")
      expect(features.phases).toEqual([0, 1, 2, 3, 4, 5])
      expect(features.cloud).toBe(true)
      expect(features.ai).toBe(true)
      expect(features.demos).toBe(true)
    })
  })
})
