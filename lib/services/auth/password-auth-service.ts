import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth"
import { AppError } from "@/lib/http/errors"

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_MINUTES = 30

export async function validatePasswordLogin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { profile: true },
  })

  if (!user) {
    throw new AppError("Invalid email or password", 401, "auth_failure")
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", 401, "auth_failure")
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AppError("Account temporarily locked", 401, "auth_failure")
  }

  if (!user.passwordHash) {
    throw new AppError(
      "This account uses Google sign-in only. Set a password before using password login.",
      401,
      "auth_failure"
    )
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    const nextAttempts = user.loginAttempts + 1
    const shouldLock = nextAttempts >= MAX_LOGIN_ATTEMPTS
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: nextAttempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
          : null,
      },
    })

    throw new AppError("Invalid email or password", 401, "auth_failure")
  }

  if (user.loginAttempts > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null },
    })
  }

  return user
}

