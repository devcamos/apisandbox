import { randomUUID } from "node:crypto"
import type { NextRequest } from "next/server"

export const REQUEST_ID_HEADER = "x-request-id"

/**
 * Accept a client-supplied request ID when it looks safe, otherwise mint one.
 * Echoed on every `/api/v1` response and included in problem bodies / logs.
 */
export function resolveRequestId(request: NextRequest): string {
  const incoming = request.headers.get(REQUEST_ID_HEADER)?.trim()
  if (incoming && /^[\w.=-]{8,128}$/.test(incoming)) {
    return incoming
  }
  return randomUUID()
}
