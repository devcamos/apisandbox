/**
 * Shared helpers for splitting/composing user-facing display names.
 * Centralized so auth, profile, and bootstrap pipelines stay consistent.
 */

export interface SplitName {
  firstName: string | null
  lastName: string | null
}

/**
 * Split a free-form full name into first/last components.
 * - Whitespace is collapsed; everything after the first token is treated as the last name.
 * - Returns nulls for empty input.
 */
export function splitFullName(name: string | null | undefined): SplitName {
  if (!name) return { firstName: null, lastName: null }
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: null, lastName: null }
  return {
    firstName: parts[0] || null,
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : null,
  }
}

/**
 * Build a display-name string from first/last parts. Returns null when neither
 * field has any content.
 */
export function composeDisplayName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
): string | null {
  return [firstName, lastName].filter(Boolean).join(" ").trim() || null
}
