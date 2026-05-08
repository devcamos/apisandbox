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

function extractIntegerAfterColon(message: string): string | null {
  const colonIndex = message.indexOf(":")
  if (colonIndex < 0) return null
  let i = colonIndex + 1
  while (i < message.length && (message.codePointAt(i) ?? -1) === 32) i += 1
  let start = i
  while (i < message.length) {
    const code = message.codePointAt(i) ?? -1
    if (code < 48 || code > 57) break
    i += 1
  }
  if (i === start) return null
  return message.slice(start, i)
}

function extractIntegerBeforeWord(message: string, wordLower: string): string | null {
  const lower = message.toLowerCase()
  const wordIndex = lower.indexOf(wordLower)
  if (wordIndex < 0) return null
  let i = wordIndex - 1
  while (i >= 0 && (lower.codePointAt(i) ?? -1) === 32) i -= 1
  let end = i + 1
  while (i >= 0) {
    const code = lower.codePointAt(i) ?? -1
    if (code < 48 || code > 57) break
    i -= 1
  }
  const start = i + 1
  if (start >= end) return null
  return message.slice(start, end)
}

function parseAccountLockedPrefix(message: string): LoginErrorInfo | null {
  if (message.startsWith("ACCOUNT_LOCKED")) {
    const minutes = extractIntegerAfterColon(message) ?? "30"
    const minuteWord = minutes === "1" ? "minute" : "minutes"
    return {
      message: "Account temporarily locked",
      type: "account",
      recoverable: true,
      suggestion: `Your account has been temporarily locked due to multiple failed login attempts. Please wait ${minutes} ${minuteWord} before trying again, or contact support if you need immediate access.`,
    }
  }
  return null
}

function passwordIncorrectAttemptsHint(attemptsRemaining: string): string {
  if (attemptsRemaining === "0") return ""
  const plural = attemptsRemaining === "1" ? "" : "s"
  return `You have ${attemptsRemaining} attempt${plural} remaining before your account is locked. `
}

function parsePasswordIncorrectPrefix(message: string): LoginErrorInfo | null {
  if (message.startsWith("PASSWORD_INCORRECT")) {
    const attemptsRemaining = extractIntegerAfterColon(message) ?? "0"
    const hint = passwordIncorrectAttemptsHint(attemptsRemaining)
    return {
      message: "Incorrect password",
      type: "authentication",
      recoverable: true,
      suggestion: `The password you entered is incorrect. ${hint}Please check your password or use "Forgot password" to reset it.`,
    }
  }
  return null
}

function parseCredentialsInvalid(message: string): LoginErrorInfo | null {
  if (message === "CREDENTIALS_INVALID") {
    return {
      message: "Invalid login credentials",
      type: "authentication",
      recoverable: true,
      suggestion:
        "The email address or password you entered is incorrect. Please check both and try again. If you've forgotten your password, use the 'Forgot password' link below. If you don't have an account, please sign up.",
    }
  }
  return null
}

function parseDeactivated(message: string): LoginErrorInfo | null {
  if (message.includes("deactivated")) {
    return {
      message: "Account deactivated",
      type: "account",
      recoverable: false,
      suggestion: "Your account has been deactivated. Please contact support to reactivate your account.",
    }
  }
  return null
}

function parseOAuthHint(message: string): LoginErrorInfo | null {
  if (message.includes("OAuth") || message.includes("Google")) {
    return {
      message: "Account created with Google",
      type: "authentication",
      recoverable: true,
      suggestion: "This account was created using Google sign-in. Please use the 'Sign in with Google' button below instead of email and password.",
    }
  }
  return null
}

function parseLegacyInvalidCredentials(message: string): LoginErrorInfo | null {
  if (message.includes("Invalid email or password") || message.includes("invalid")) {
    const attempts = extractIntegerBeforeWord(message, "attempt")
    if (attempts) {
      const plural = attempts === "1" ? "" : "s"
      return {
        message: "Invalid login credentials",
        type: "authentication",
        recoverable: true,
        suggestion: `${attempts} attempt${plural} remaining. The email address or password may be incorrect. Please check both, or use "Forgot password" to reset.`,
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
  return null
}

function parseLegacyLockout(message: string): LoginErrorInfo | null {
  if (message.includes("locked") || message.includes("lockout")) {
    const minutes = extractIntegerBeforeWord(message, "minute") ?? "30"
    return {
      message: "Account temporarily locked",
      type: "account",
      recoverable: true,
      suggestion: `Your account is temporarily locked. Please wait ${minutes} minutes or contact support if you need immediate access.`,
    }
  }
  return null
}

function parseRequiredFields(message: string): LoginErrorInfo | null {
  if (message.includes("required")) {
    return {
      message,
      type: "validation",
      recoverable: true,
      suggestion: "Please fill in all required fields.",
    }
  }
  return null
}

function parseNetwork(message: string): LoginErrorInfo | null {
  if (message.includes("network") || message.includes("fetch") || message.includes("timeout")) {
    return {
      message: "Network error. Please check your connection.",
      type: "network",
      recoverable: true,
      suggestion: "Check your internet connection and try again. If the problem persists, please try again in a few moments.",
    }
  }
  return null
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
