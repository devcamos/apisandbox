/**
 * Maps API / transport error strings to structured UI copy for the login page.
 * Split into small parsers to keep cognitive complexity low for static analysis.
 */

export type LoginErrorType = "validation" | "authentication" | "network" | "account" | "unknown"

export interface LoginErrorInfo {
  message: string
  type: LoginErrorType
  recoverable: boolean
  suggestion?: string
}

function parseAccountLockedPrefix(message: string): LoginErrorInfo | null {
  if (!message.startsWith("ACCOUNT_LOCKED")) return null
  const minutesMatch = message.match(/:(\d+)/)
  const minutes = minutesMatch ? minutesMatch[1] : "30"
  return {
    message: "Account temporarily locked",
    type: "account",
    recoverable: true,
    suggestion: `Your account has been temporarily locked due to multiple failed login attempts. Please wait ${minutes} minute${minutes !== "1" ? "s" : ""} before trying again, or contact support if you need immediate access.`,
  }
}

function parsePasswordIncorrectPrefix(message: string): LoginErrorInfo | null {
  if (!message.startsWith("PASSWORD_INCORRECT")) return null
  const attemptsMatch = message.match(/:(\d+)/)
  const attemptsRemaining = attemptsMatch ? attemptsMatch[1] : "0"
  return {
    message: "Incorrect password",
    type: "authentication",
    recoverable: true,
    suggestion: `The password you entered is incorrect. ${attemptsRemaining !== "0" ? `You have ${attemptsRemaining} attempt${attemptsRemaining !== "1" ? "s" : ""} remaining before your account is locked. ` : ""}Please check your password or use "Forgot password" to reset it.`,
  }
}

function parseCredentialsInvalid(message: string): LoginErrorInfo | null {
  if (message !== "CREDENTIALS_INVALID") return null
  return {
    message: "Invalid login credentials",
    type: "authentication",
    recoverable: true,
    suggestion:
      "The email address or password you entered is incorrect. Please check both and try again. If you've forgotten your password, use the 'Forgot password' link below. If you don't have an account, please sign up.",
  }
}

function parseDeactivated(message: string): LoginErrorInfo | null {
  if (!message.includes("deactivated")) return null
  return {
    message: "Account deactivated",
    type: "account",
    recoverable: false,
    suggestion: "Your account has been deactivated. Please contact support to reactivate your account.",
  }
}

function parseOAuthHint(message: string): LoginErrorInfo | null {
  if (!message.includes("OAuth") && !message.includes("Google")) return null
  return {
    message: "Account created with Google",
    type: "authentication",
    recoverable: true,
    suggestion: "This account was created using Google sign-in. Please use the 'Sign in with Google' button below instead of email and password.",
  }
}

function parseLegacyInvalidCredentials(message: string): LoginErrorInfo | null {
  if (!message.includes("Invalid email or password") && !message.includes("invalid")) return null
  const attemptsMatch = message.match(/(\d+)\s*attempt/i)
  if (attemptsMatch) {
    const attempts = attemptsMatch[1]
    return {
      message: "Invalid login credentials",
      type: "authentication",
      recoverable: true,
      suggestion: `${attempts} attempt${attempts !== "1" ? "s" : ""} remaining. The email address or password may be incorrect. Please check both, or use "Forgot password" to reset.`,
    }
  }
  return {
    message: "Invalid login credentials",
    type: "authentication",
    recoverable: true,
    suggestion:
      "The email address or password you entered may be incorrect. Please check both and try again, or use 'Forgot password' to reset your password.",
  }
}

function parseLegacyLockout(message: string): LoginErrorInfo | null {
  if (!message.includes("locked") && !message.includes("lockout")) return null
  const minutesMatch = message.match(/(\d+)\s*minute/i)
  const minutes = minutesMatch ? minutesMatch[1] : "30"
  return {
    message: "Account temporarily locked",
    type: "account",
    recoverable: true,
    suggestion: `Your account is temporarily locked. Please wait ${minutes} minutes or contact support if you need immediate access.`,
  }
}

function parseRequiredFields(message: string): LoginErrorInfo | null {
  if (!message.includes("required")) return null
  return {
    message,
    type: "validation",
    recoverable: true,
    suggestion: "Please fill in all required fields.",
  }
}

function parseNetwork(message: string): LoginErrorInfo | null {
  if (!message.includes("network") && !message.includes("fetch") && !message.includes("timeout")) return null
  return {
    message: "Network error. Please check your connection.",
    type: "network",
    recoverable: true,
    suggestion: "Check your internet connection and try again. If the problem persists, please try again in a few moments.",
  }
}

const parsers: Array<(message: string) => LoginErrorInfo | null> = [
  parseAccountLockedPrefix,
  parsePasswordIncorrectPrefix,
  parseCredentialsInvalid,
  parseDeactivated,
  parseOAuthHint,
  parseLegacyInvalidCredentials,
  parseLegacyLockout,
  parseRequiredFields,
  parseNetwork,
]

export function parseLoginErrorMessage(errorMessage: string): LoginErrorInfo {
  for (const parse of parsers) {
    const info = parse(errorMessage)
    if (info) return info
  }
  return {
    message: errorMessage || "An unexpected error occurred",
    type: "unknown",
    recoverable: true,
    suggestion: "Please try again. If the problem continues, contact support.",
  }
}
