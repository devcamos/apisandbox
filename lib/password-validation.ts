export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MANAGER_MIN_LENGTH = 12

export type PasswordRequirement = {
  id: string
  label: string
  met: boolean
}

function hasUppercase(password: string) {
  return /[A-Z]/.test(password)
}

function hasLowercase(password: string) {
  return /[a-z]/.test(password)
}

function hasDigit(password: string) {
  return /[0-9]/.test(password)
}

function hasSpecialCharacter(password: string) {
  return /[^A-Za-z0-9]/.test(password)
}

/** Password managers often emit long alphanumeric strings without symbols. */
function meetsPasswordManagerStyle(password: string) {
  return (
    password.length >= PASSWORD_MANAGER_MIN_LENGTH &&
    hasUppercase(password) &&
    hasLowercase(password) &&
    hasDigit(password)
  )
}

export function meetsSpecialCharacterRequirement(password: string) {
  return hasSpecialCharacter(password) || meetsPasswordManagerStyle(password)
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      id: "length",
      label: "At least 8 characters",
      met: password.length >= PASSWORD_MIN_LENGTH,
    },
    {
      id: "upper",
      label: "One uppercase letter",
      met: hasUppercase(password),
    },
    {
      id: "lower",
      label: "One lowercase letter",
      met: hasLowercase(password),
    },
    {
      id: "digit",
      label: "One number",
      met: hasDigit(password),
    },
    {
      id: "special",
      label:
        "One special character, or 12+ characters with upper, lower, and a number",
      met: meetsSpecialCharacterRequirement(password),
    },
  ]
}

export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors = getPasswordRequirements(password)
    .filter((requirement) => !requirement.met)
    .map((requirement) => {
      switch (requirement.id) {
        case "length":
          return "Password must be at least 8 characters"
        case "upper":
          return "Password must contain at least one uppercase letter"
        case "lower":
          return "Password must contain at least one lowercase letter"
        case "digit":
          return "Password must contain at least one number"
        case "special":
          return "Password must contain a special character, or be at least 12 characters with uppercase, lowercase, and a number"
        default:
          return requirement.label
      }
    })

  return {
    isValid: errors.length === 0,
    errors,
  }
}
