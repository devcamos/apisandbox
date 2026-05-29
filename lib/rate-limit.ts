import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { isFeatureEnabled } from "@/config/featureFlags"

const hasRedisConfig =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

function createRedis() {
  if (!hasRedisConfig) return null
  return Redis.fromEnv()
}

const redis = createRedis()

function createLimiter(
  tokens: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
  prefix: string
) {
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: `rl:${prefix}`,
    analytics: true,
  })
}

export const authLimiter = createLimiter(5, "15 m", "auth")
export const signupLimiter = createLimiter(3, "1 h", "signup")
export const apiLimiter = createLimiter(100, "15 m", "api")
export const webhookLimiter = createLimiter(50, "1 m", "webhook")
export const demoLoginLimiter = createLimiter(20, "1 h", "demo-login")
/** Per-user cap on AI assistant calls (cost control). */
export const assistantLimiter = createLimiter(30, "1 h", "assistant")

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit | null
): Promise<RateLimitResult> {
  if (!isFeatureEnabled("RATE_LIMITING") || !limiter) {
    return { allowed: true, remaining: 999, resetAt: 0 }
  }

  const result = await limiter.limit(identifier)
  return {
    allowed: result.success,
    remaining: result.remaining,
    resetAt: result.reset,
  }
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  return realIp ?? forwarded?.split(",")[0]?.trim() ?? "unknown"
}

export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetAt),
  }
}
