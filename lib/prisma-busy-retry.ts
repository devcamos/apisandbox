import { isPrismaDatabaseBusyError } from "@/lib/http/database-busy"

export interface PrismaBusyRetryOptions {
  /** Total attempts including the first try. Default 2. */
  tries?: number
  /** Inclusive lower bound for jitter delay in ms. Default 100. */
  minDelayMs?: number
  /** Inclusive upper bound for jitter delay in ms. Default 300. */
  maxDelayMs?: number
  /** Injected sleep for tests. */
  sleep?: (ms: number) => Promise<void>
  /** Injected random in [0, 1) for tests. */
  random?: () => number
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function jitterMs(minDelayMs: number, maxDelayMs: number, random: () => number): number {
  const span = Math.max(0, maxDelayMs - minDelayMs)
  return minDelayMs + Math.floor(random() * (span + 1))
}

/**
 * Retry a Prisma-backed auth operation once when the DB pool is saturated.
 * Cheap and bounded: 2 tries with 100–300ms jitter by default.
 */
export async function withPrismaBusyRetry<T>(
  operation: () => Promise<T>,
  options: PrismaBusyRetryOptions = {},
): Promise<T> {
  const tries = options.tries ?? 2
  const minDelayMs = options.minDelayMs ?? 100
  const maxDelayMs = options.maxDelayMs ?? 300
  const sleep = options.sleep ?? defaultSleep
  const random = options.random ?? Math.random

  let lastError: unknown
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      const canRetry = attempt < tries && isPrismaDatabaseBusyError(error)
      if (!canRetry) throw error
      await sleep(jitterMs(minDelayMs, maxDelayMs, random))
    }
  }
  throw lastError
}
