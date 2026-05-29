/** Returns an error message when invalid, or empty string when valid. */
export function validateEmailFormat(emailValue: string, requiredMessage = "Email is required"): string {
  if (!emailValue) {
    return requiredMessage
  }
  const at = emailValue.indexOf("@")
  if (at <= 0 || at !== emailValue.lastIndexOf("@")) {
    return "Please enter a valid email address"
  }
  const local = emailValue.slice(0, at)
  const domain = emailValue.slice(at + 1)
  if (!local || !domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) {
    return "Please enter a valid email address"
  }
  return ""
}
