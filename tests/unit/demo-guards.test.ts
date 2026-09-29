import { beforeEach, describe, expect, it, vi } from "vitest"
import { AppError } from "@/lib/http/errors"

const checkPhaseAccess = vi.hoisted(() => vi.fn())

vi.mock("@/lib/subscription", () => ({
  checkPhaseAccess,
}))

vi.mock("@/config/featureFlags", () => ({
  signupRequiredForPremium: true,
}))

import {
  assertLearningCourseAccessForUser,
  assertNotDemoUser,
  assertPhaseAccessForUser,
} from "@/lib/auth/demo-guards"

describe("demo-guards", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("assertNotDemoUser allows regular emails", () => {
    expect(() => assertNotDemoUser("learner@example.com")).not.toThrow()
  })

  it("assertNotDemoUser blocks ephemeral demo emails", () => {
    expect(() => assertNotDemoUser("demo.abc@apisandbox.demo")).toThrow(AppError)
    try {
      assertNotDemoUser("demo.abc@apisandbox.demo")
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
      expect((error as AppError).status).toBe(403)
    }
  })

  it("allows demo users Phase 1 and denies Phase 2+", async () => {
    await expect(
      assertPhaseAccessForUser({ id: "d1", email: "demo.abc@apisandbox.demo" }, 1),
    ).resolves.toBeUndefined()

    await expect(
      assertPhaseAccessForUser({ id: "d1", email: "demo.abc@apisandbox.demo" }, 2),
    ).rejects.toMatchObject({ status: 403, category: "auth_failure" })

    await expect(
      assertPhaseAccessForUser({ id: "d1", email: "demo.abc@apisandbox.demo" }, "cloud"),
    ).rejects.toMatchObject({ status: 403 })

    expect(checkPhaseAccess).not.toHaveBeenCalled()
  })

  it("uses subscription checks for regular users when paywall is on", async () => {
    checkPhaseAccess.mockResolvedValue({
      hasAccess: false,
      tier: "FREE",
      isExpired: false,
      upgradeRequired: true,
    })

    await expect(
      assertPhaseAccessForUser({ id: "u1", email: "user@example.com" }, 2),
    ).rejects.toMatchObject({ status: 403 })

    expect(checkPhaseAccess).toHaveBeenCalledWith("u1", 2)
  })

  it("allows regular users when subscription grants access", async () => {
    checkPhaseAccess.mockResolvedValue({
      hasAccess: true,
      tier: "PREMIUM",
      isExpired: false,
      upgradeRequired: false,
    })

    await expect(
      assertPhaseAccessForUser({ id: "u1", email: "user@example.com" }, 2),
    ).resolves.toBeUndefined()
  })

  it("allows demo learning progress for phase-1 courses only", async () => {
    await expect(
      assertLearningCourseAccessForUser(
        { id: "d1", email: "demo.abc@apisandbox.demo" },
        "phase-1",
      ),
    ).resolves.toBeUndefined()

    await expect(
      assertLearningCourseAccessForUser(
        { id: "d1", email: "demo.abc@apisandbox.demo" },
        "phase-2",
      ),
    ).rejects.toMatchObject({ status: 403 })

    await expect(
      assertLearningCourseAccessForUser(
        { id: "d1", email: "demo.abc@apisandbox.demo" },
        "aws-certification",
      ),
    ).rejects.toMatchObject({ status: 403 })
  })
})
