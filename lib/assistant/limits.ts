/** Must match `export const maxDuration` literal in `app/api/assistant/route.ts` (Next requires a literal). */
export const ASSISTANT_MAX_DURATION_SECONDS = 30
/** Soft cap for the upstream LLM call; leave headroom under route maxDuration. */
export const ASSISTANT_LLM_TIMEOUT_MS = 25_000
export const ASSISTANT_MAX_MESSAGE_CHARS = 4_000
export const ASSISTANT_MAX_HISTORY_ITEMS = 12
export const ASSISTANT_MAX_HISTORY_ITEM_CHARS = 4_000
/** Reject oversized JSON bodies before parsing into memory-heavy strings. */
export const ASSISTANT_MAX_BODY_BYTES = 32_768

export type AssistantHistoryItem = {
  role: "user" | "assistant"
  content: string
}

export type AssistantInputValidation =
  | { ok: true; message: string; history: AssistantHistoryItem[]; pathname: string; mode: "guided" | "expert" }
  | { ok: false; status: number; error: string }

function isRole(value: unknown): value is "user" | "assistant" {
  return value === "user" || value === "assistant"
}

/**
 * Validate assistant request shape and enforce size caps on message / history.
 */
export function validateAssistantInput(body: unknown): AssistantInputValidation {
  if (!body || typeof body !== "object") {
    return { ok: false, status: 400, error: "Invalid request" }
  }

  const record = body as Record<string, unknown>
  if (typeof record.message !== "string") {
    return { ok: false, status: 400, error: "Invalid request" }
  }

  if (record.message.length > ASSISTANT_MAX_MESSAGE_CHARS) {
    return {
      ok: false,
      status: 413,
      error: `Message exceeds the ${ASSISTANT_MAX_MESSAGE_CHARS} character limit.`,
    }
  }

  const pathname = typeof record.pathname === "string" ? record.pathname : "/"
  const mode = record.mode === "expert" ? "expert" : "guided"

  const rawHistory = Array.isArray(record.history) ? record.history : []
  const historySlice = rawHistory.slice(-ASSISTANT_MAX_HISTORY_ITEMS)
  const history: AssistantHistoryItem[] = []

  for (const item of historySlice) {
    if (!item || typeof item !== "object") {
      return { ok: false, status: 400, error: "Invalid request" }
    }
    const entry = item as Record<string, unknown>
    if (!isRole(entry.role) || typeof entry.content !== "string") {
      return { ok: false, status: 400, error: "Invalid request" }
    }
    if (entry.content.length > ASSISTANT_MAX_HISTORY_ITEM_CHARS) {
      return {
        ok: false,
        status: 413,
        error: `History message exceeds the ${ASSISTANT_MAX_HISTORY_ITEM_CHARS} character limit.`,
      }
    }
    history.push({ role: entry.role, content: entry.content })
  }

  return {
    ok: true,
    message: record.message,
    history,
    pathname,
    mode,
  }
}

export function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const name = "name" in error ? String(error.name) : ""
  if (name === "AbortError" || name === "TimeoutError" || name === "APIUserAbortError") {
    return true
  }
  if ("code" in error && error.code === "ABORT_ERR") return true
  return false
}
