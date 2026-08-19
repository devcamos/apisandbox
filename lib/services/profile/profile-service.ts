import fs from "node:fs/promises"
import path from "node:path"
import type { Prisma, UserProfile } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { AppError } from "@/lib/http/errors"
import { composeDisplayName } from "@/lib/user-name"
import {
  isFrameworkCompatible,
  isLearnerProfileComplete,
} from "@/lib/learning/learner-profile"
import type { LearnerProfileUpdate } from "@/lib/validation/learner-profile"

interface UpdateProfileInput extends LearnerProfileUpdate {
  firstName?: string | null
  lastName?: string | null
  avatarUrl?: string | null
  roleLabel?: string | null
  identityStatement?: string | null
}

function resolveLearnerProfile(existing: UserProfile, updates: UpdateProfileInput) {
  return {
    engineeringRole: updates.engineeringRole === undefined ? existing.engineeringRole : updates.engineeringRole,
    experienceLevel: updates.experienceLevel === undefined ? existing.experienceLevel : updates.experienceLevel,
    primaryLanguage: updates.primaryLanguage === undefined ? existing.primaryLanguage : updates.primaryLanguage,
    primaryFramework: updates.primaryFramework === undefined ? existing.primaryFramework : updates.primaryFramework,
    runtimeEnvironment: updates.runtimeEnvironment === undefined ? existing.runtimeEnvironment : updates.runtimeEnvironment,
    cloudProvider: updates.cloudProvider === undefined ? existing.cloudProvider : updates.cloudProvider,
    learningGoal: updates.learningGoal === undefined ? existing.learningGoal : updates.learningGoal,
  }
}

function buildProfileUpdateData(
  updates: UpdateProfileInput,
  onboardingCompletedAt: Date | null,
): Prisma.UserProfileUpdateInput {
  const data: Prisma.UserProfileUpdateInput = { onboardingCompletedAt }
  if (updates.firstName !== undefined) data.firstName = updates.firstName
  if (updates.lastName !== undefined) data.lastName = updates.lastName
  if (updates.avatarUrl !== undefined) data.avatarUrl = updates.avatarUrl
  if (updates.roleLabel !== undefined) data.roleLabel = updates.roleLabel
  if (updates.identityStatement !== undefined) data.identityStatement = updates.identityStatement
  if (updates.engineeringRole !== undefined) data.engineeringRole = updates.engineeringRole
  if (updates.experienceLevel !== undefined) data.experienceLevel = updates.experienceLevel
  if (updates.primaryLanguage !== undefined) data.primaryLanguage = updates.primaryLanguage
  if (updates.primaryFramework !== undefined) data.primaryFramework = updates.primaryFramework
  if (updates.runtimeEnvironment !== undefined) data.runtimeEnvironment = updates.runtimeEnvironment
  if (updates.cloudProvider !== undefined) data.cloudProvider = updates.cloudProvider
  if (updates.learningGoal !== undefined) data.learningGoal = updates.learningGoal
  return data
}

function buildUserUpdateData(
  updates: UpdateProfileInput,
  name: string | null,
): Prisma.UserUpdateInput {
  const data: Prisma.UserUpdateInput = { name }
  if (updates.avatarUrl !== undefined) data.image = updates.avatarUrl
  return data
}

export async function getProfileByUserId(userId: string) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  })

  if (!profile) {
    const created = await prisma.userProfile.create({
      data: { userId },
    })
    return created
  }

  return profile
}

export async function updateProfileByUserId(userId: string, updates: UpdateProfileInput) {
  const existing = await getProfileByUserId(userId)
  const nextFirstName = updates.firstName ?? existing.firstName
  const nextLastName = updates.lastName ?? existing.lastName
  const resolvedProfile = resolveLearnerProfile(existing, updates)

  if (
    resolvedProfile.primaryLanguage &&
    resolvedProfile.primaryFramework &&
    !isFrameworkCompatible(resolvedProfile.primaryLanguage, resolvedProfile.primaryFramework)
  ) {
    throw new AppError(
      "The selected framework does not match the selected language",
      400,
      "validation_error",
    )
  }

  const onboardingComplete = isLearnerProfileComplete(resolvedProfile)
  const onboardingCompletedAt = onboardingComplete
    ? existing.onboardingCompletedAt ?? new Date()
    : null

  const [profile] = await prisma.$transaction([
    prisma.userProfile.update({
      where: { userId },
      data: buildProfileUpdateData(updates, onboardingCompletedAt),
    }),
    prisma.user.update({
      where: { id: userId },
      data: buildUserUpdateData(
        updates,
        composeDisplayName(nextFirstName ?? null, nextLastName ?? null),
      ),
    }),
  ])

  return profile
}

export async function uploadAvatarForUser(userId: string, file: File) {
  if (!file.type.startsWith("image/")) {
    throw new AppError("Avatar must be an image", 400, "validation_error")
  }

  const extension = path.extname(file.name) || ".png"
  const safeExt = extension.replace(/[^a-zA-Z0-9.]/g, "") || ".png"
  const filename = `${userId}-${Date.now()}${safeExt}`
  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars")
  await fs.mkdir(uploadDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(uploadDir, filename), buffer)
  const avatarUrl = `/uploads/avatars/${filename}`

  await updateProfileByUserId(userId, { avatarUrl })
  return avatarUrl
}
