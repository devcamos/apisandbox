import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { AppError } from "@/lib/http/errors"
import type { VerifiedGoogleIdentity } from "@/lib/auth/types"

export async function linkGoogleIdentityToExistingEmailAccount(
  userId: string,
  identity: VerifiedGoogleIdentity
) {
  try {
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: identity.googleSubject,
        },
      },
      create: {
        userId,
        type: "oauth",
        provider: "google",
        providerAccountId: identity.googleSubject,
      },
      update: {
        userId,
      },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError(
        "Google account is already linked to another user",
        409,
        "auth_failure"
      )
    }
    throw error
  }
}

