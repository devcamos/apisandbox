const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns an error message when invalid, or empty string when valid. */
export function validateEmailFormat(emailValue: string, requiredMessage = "Email is required"): string {
  if (!emailValue) {
    return requiredMessage
  }
  if (!EMAIL_FORMAT.test(emailValue)) {
    return "Please enter a valid email address"
  }
  return ""
}
