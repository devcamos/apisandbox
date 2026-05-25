import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { AppError } from "@/lib/http/errors"
import { composeDisplayName } from "@/lib/user-name"

interface BootstrapInput {
  email: string
  passwordHash: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl?: string | null
  forceBootstrapFailure?: boolean
}

export async function createUserWithInitialData(input: BootstrapInput) {
  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          name: composeDisplayName(input.firstName, input.lastName),
          image: input.avatarUrl ?? null,
          passwordHash: input.passwordHash,
          isActive: true,
          loginAttempts: 0,
          subscriptionTier: "FREE",
        },
      })

      await tx.userProfile.create({
        data: {
          userId: user.id,
          firstName: input.firstName,
          lastName: input.lastName,
          avatarUrl: input.avatarUrl ?? null,
        },
      })

      if (input.forceBootstrapFailure) {
        throw new AppError("Forced bootstrap failure", 500, "bootstrap_failure")
      }

      return tx.user.findUniqueOrThrow({
        where: { id: user.id },
        include: { profile: true },
      })
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError("An account with this email already exists", 400, "validation_error")
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
      throw new AppError(
        "Database schema is missing required tables. Run prisma migrations before signing up.",
        500,
        "configuration_error"
      )
    }

    if (
      error instanceof Error &&
      (error.message.includes("does not exist") || error.message.includes("no such table"))
    ) {
      throw new AppError(
        "Database schema is missing required tables. Run prisma migrations before signing up.",
        500,
        "configuration_error"
      )
    }

    throw new AppError(
      "Failed to initialize account data",
      500,
      "bootstrap_failure"
    )
  }
}
