import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { AppError } from "@/lib/http/errors"
import { logger } from "@/lib/logger"
import { composeDisplayName } from "@/lib/user-name"

interface BootstrapInput {
  email: string
  passwordHash: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl?: string | null
  forceBootstrapFailure?: boolean
}

const MISSING_SCHEMA_MESSAGE =
  "Database schema is missing required tables. Run prisma migrations before signing up."

function missingSchemaError(): AppError {
  return new AppError(MISSING_SCHEMA_MESSAGE, 500, "configuration_error")
}

function duplicateEmailError(): AppError {
  return new AppError("An account with this email already exists", 400, "validation_error")
}

function isMissingSchemaError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
    return true
  }

  return (
    error instanceof Error &&
    (error.message.includes("does not exist") || error.message.includes("no such table"))
  )
}

function mapKnownBootstrapError(error: unknown): AppError | null {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return duplicateEmailError()
  }

  if (isMissingSchemaError(error)) {
    return missingSchemaError()
  }

  return null
}

function bootstrapDevDetails(error: unknown): Record<string, unknown> | undefined {
  if (process.env.NODE_ENV === "production" || !(error instanceof Error)) {
    return undefined
  }

  return {
    prismaCode:
      error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined,
    message: error.message,
  }
}

export async function createUserWithInitialData(input: BootstrapInput) {
  if (input.forceBootstrapFailure) {
    throw new AppError("Forced bootstrap failure", 500, "bootstrap_failure")
  }

  try {
    // Sequential writes (no nested create / transaction) for Neon HTTP driver on Vercel.
    const user = await prisma.user.create({
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

    try {
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          firstName: input.firstName,
          lastName: input.lastName,
          avatarUrl: input.avatarUrl ?? null,
        },
      })
    } catch (profileError) {
      await prisma.user.delete({ where: { id: user.id } }).catch(() => undefined)
      throw profileError
    }

    return prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      include: { profile: true },
    })
  } catch (error) {
    const known = mapKnownBootstrapError(error)
    if (known) {
      throw known
    }

    logger.error({ err: error }, "User bootstrap failed")

    throw new AppError(
      "Failed to initialize account data",
      500,
      "bootstrap_failure",
      bootstrapDevDetails(error),
    )
  }
}
