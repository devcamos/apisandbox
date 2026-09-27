import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth"
import { AppError } from "@/lib/http/errors"
import { databaseBusyAppError, isPrismaDatabaseBusyError } from "@/lib/http/database-busy"
import {
  accountLockedMessage,
  effectiveFailedAttempts,
  isAccountLocked,
  lockMinutesRemaining,
  registerFailedAttempt,
} from "@/lib/auth/login-lockout"
import { withPrismaBusyRetry } from "@/lib/prisma-busy-retry"

export const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password"

function invalidCredentials(): AppError {
  return new AppError(INVALID_CREDENTIALS_MESSAGE, 401, "auth_failure", {
    code: "INVALID_CREDENTIALS",
  })
}

export async function validatePasswordLogin(email: string, password: string) {
  try {
    return await withPrismaBusyRetry(() => validatePasswordLoginOnce(email, password))
  } catch (error) {
    if (isPrismaDatabaseBusyError(error)) {
      throw databaseBusyAppError()
    }
    throw error
  }
}

async function validatePasswordLoginOnce(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { profile: true },
  })

  if (!user) {
    throw invalidCredentials()
  }

  if (!user.isActive) {
    throw new AppError("Account is deactivated", 401, "auth_failure", { code: "ACCOUNT_DEACTIVATED" })
  }

  const now = new Date()
  if (isAccountLocked(user, now)) {
    const minutes = lockMinutesRemaining(user, now)
    throw new AppError(accountLockedMessage(minutes), 423, "auth_failure", {
      code: "ACCOUNT_LOCKED",
      minutesRemaining: minutes,
    })
  }

  if (!user.passwordHash) {
    throw new AppError(
      "This account uses Google sign-in only. Set a password before using password login.",
      401,
      "auth_failure",
      { code: "OAUTH_ONLY_ACCOUNT" },
    )
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    const update = registerFailedAttempt(user, now)
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: update.loginAttempts, lockedUntil: update.lockedUntil },
    })
    throw invalidCredentials()
  }

  if (effectiveFailedAttempts(user, now) > 0 || user.lockedUntil || (user.loginAttempts ?? 0) > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null },
    })
  }

  return user
}
