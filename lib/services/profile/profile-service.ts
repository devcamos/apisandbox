import fs from "node:fs/promises"
import path from "node:path"
import { prisma } from "@/lib/prisma"
import { AppError } from "@/lib/http/errors"
import { composeDisplayName } from "@/lib/user-name"

interface UpdateProfileInput {
  firstName?: string | null
  lastName?: string | null
  avatarUrl?: string | null
  roleLabel?: string | null
  identityStatement?: string | null
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

  const [profile] = await prisma.$transaction([
    prisma.userProfile.update({
      where: { userId },
      data: {
        ...(updates.firstName === undefined ? {} : { firstName: updates.firstName }),
        ...(updates.lastName === undefined ? {} : { lastName: updates.lastName }),
        ...(updates.avatarUrl === undefined ? {} : { avatarUrl: updates.avatarUrl }),
        ...(updates.roleLabel === undefined ? {} : { roleLabel: updates.roleLabel }),
        ...(updates.identityStatement === undefined ? {} : { identityStatement: updates.identityStatement }),
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        ...(updates.avatarUrl === undefined ? {} : { image: updates.avatarUrl }),
        name: composeDisplayName(nextFirstName ?? null, nextLastName ?? null),
      },
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
