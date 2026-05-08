export type ErrorCategory =
  | "validation_error"
  | "auth_failure"
  | "configuration_error"
  | "bootstrap_failure"
  | "not_found"
  | "unknown_error"

export class AppError extends Error {
  status: number
  category: ErrorCategory
  details?: unknown

  constructor(
    message: string,
    status: number,
    category: ErrorCategory,
    details?: unknown
  ) {
    super(message)
    this.name = "AppError"
    this.status = status
    this.category = category
    this.details = details
  }
}

