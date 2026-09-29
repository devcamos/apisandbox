import { signupRequiredForPremium } from "@/config/featureFlags"
import { isDemoUserEmail } from "@/lib/demo-login"
import { AppError } from "@/lib/http/errors"
import { phaseFromCourseId } from "@/lib/learning/progress-mapping"
import { checkPhaseAccess } from "@/lib/subscription"

const DEMO_PHASE_DENIED =
  "Demo accounts can only access Phase 1. Create a free account to unlock later phases and keep your progress."

const DEMO_FEATURE_DENIED =
  "Demo accounts cannot use this feature. Create a free account to continue."

export function assertNotDemoUser(email: string | undefined | null, message = DEMO_FEATURE_DENIED): void {
  if (isDemoUserEmail(email)) {
    throw new AppError(message, 403, "auth_failure", { demo: true, upgradeRequired: true })
  }
}

/**
 * Whether a phase/section is allowed for this user.
 * Demo sessions are always Phase 0/1 only (even when the premium paywall flag is off).
 * Regular users follow {@link checkPhaseAccess} when the paywall is enabled.
 */
export async function assertPhaseAccessForUser(
  user: { id: string; email: string },
  phaseNumber: number | "cloud" | "ai",
): Promise<void> {
  if (isDemoUserEmail(user.email)) {
    if (phaseNumber === 0 || phaseNumber === 1) return
    throw new AppError(DEMO_PHASE_DENIED, 403, "auth_failure", {
      demo: true,
      upgradeRequired: true,
      phase: phaseNumber,
    })
  }

  if (!signupRequiredForPremium) return

  const access = await checkPhaseAccess(user.id, phaseNumber)
  if (!access.hasAccess) {
    throw new AppError(
      "Upgrade required to access this content",
      403,
      "auth_failure",
      { upgradeRequired: true, tier: access.tier, phase: phaseNumber },
    )
  }
}

/**
 * Learning courses keyed as `phase-N` follow phase rules.
 * Other course ids are denied for demo users (premium / extended tracks).
 */
export async function assertLearningCourseAccessForUser(
  user: { id: string; email: string },
  courseId: string,
): Promise<void> {
  const phase = phaseFromCourseId(courseId)
  if (phase !== null) {
    await assertPhaseAccessForUser(user, phase)
    return
  }

  if (isDemoUserEmail(user.email)) {
    throw new AppError(DEMO_PHASE_DENIED, 403, "auth_failure", {
      demo: true,
      upgradeRequired: true,
      courseId,
    })
  }

  if (!signupRequiredForPremium) return

  // Non-phase courses (e.g. AWS tracks) are treated as premium when the paywall is on.
  await assertPhaseAccessForUser(user, "cloud")
}
