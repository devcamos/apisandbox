import { prisma } from "@/lib/prisma"
import {
  APP_GUIDE_STEP_IDS,
  type AppGuideStepId,
  type AppGuideStepsRecord,
  computeGuideUnderstandingPercent,
  createEmptyGuideSteps,
  isGuideComplete,
  parseGuideSteps,
} from "@/lib/learning/app-guide"

export async function getOrCreateUserAppGuide(userId: string) {
  const existing = await prisma.userAppGuide.findUnique({ where: { userId } })
  if (existing) {
    return existing
  }
  return prisma.userAppGuide.create({
    data: {
      userId,
      steps: createEmptyGuideSteps(),
    },
  })
}

export function toGuideResponse(
  guide: { steps: unknown; completedAt: Date | null; updatedAt: Date },
  userCreatedAt: Date,
) {
  const steps = parseGuideSteps(guide.steps)
  const understandingPercent = computeGuideUnderstandingPercent(steps)
  const completed = isGuideComplete(steps, guide.completedAt)
  const accountAgeDays = Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24))
  const isNewUser = !completed && accountAgeDays <= 30

  return {
    steps,
    understandingPercent,
    completedAt: guide.completedAt?.toISOString() ?? null,
    isComplete: completed,
    showQuickStart: isNewUser,
    updatedAt: guide.updatedAt.toISOString(),
  }
}

export async function updateGuideStep(
  userId: string,
  stepId: AppGuideStepId,
  patch: { understood?: boolean; visited?: boolean },
) {
  if (!APP_GUIDE_STEP_IDS.includes(stepId)) {
    throw new Error("Invalid guide step")
  }
  const guide = await getOrCreateUserAppGuide(userId)
  const steps = parseGuideSteps(guide.steps)
  const current = steps[stepId]
  steps[stepId] = {
    completedAt:
      patch.visited || patch.understood
        ? new Date().toISOString()
        : current.completedAt,
    understood: patch.understood ?? current.understood,
  }

  const allUnderstood = APP_GUIDE_STEP_IDS.every((id) => steps[id].understood)

  return prisma.userAppGuide.update({
    where: { userId },
    data: {
      steps,
      completedAt: allUnderstood ? new Date() : guide.completedAt,
    },
  })
}

export async function completeUserAppGuide(userId: string) {
  const guide = await getOrCreateUserAppGuide(userId)
  const steps = parseGuideSteps(guide.steps)
  const completedSteps: AppGuideStepsRecord = { ...steps }
  for (const id of APP_GUIDE_STEP_IDS) {
    completedSteps[id] = {
      completedAt: completedSteps[id].completedAt ?? new Date().toISOString(),
      understood: true,
    }
  }
  return prisma.userAppGuide.update({
    where: { userId },
    data: {
      steps: completedSteps,
      completedAt: new Date(),
    },
  })
}
