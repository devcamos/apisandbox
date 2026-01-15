/**
 * Rate Limiting Utility
 * 
 * MENTOR NOTE: Rate Limiting Best Practices
 * 
 * Why rate limiting matters:
 * 1. Prevents brute force attacks
 * 2. Protects against DDoS
 * 3. Prevents spam signups
 * 4. Protects API endpoints
 * 
 * Implementation options:
 * - In-memory (simple, but lost on restart)
 * - Redis (production-ready, scalable)
 * - Database (persistent, but slower)
 * 
 * For production, use Redis or a service like Upstash
 */

// Simple in-memory rate limiter (for development)
// MENTOR NOTE: In production, use Redis or a proper rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  // Clean up expired records
  if (record && record.resetTime < now) {
    rateLimitMap.delete(identifier)
  }

  const currentRecord = rateLimitMap.get(identifier)

  if (!currentRecord) {
    // First request in window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    })
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs,
    }
  }

  if (currentRecord.count >= options.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentRecord.resetTime,
    }
  }

  // Increment count
  currentRecord.count++
  rateLimitMap.set(identifier, currentRecord)

  return {
    allowed: true,
    remaining: options.maxRequests - currentRecord.count,
    resetTime: currentRecord.resetTime,
  }
}

/**
 * Get client identifier for rate limiting
 * MENTOR NOTE: Use IP address or user ID
 */
export function getClientIdentifier(request: Request): string {
  // In production, use a proper IP extraction method
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : "unknown"
  return ip
}

// MENTOR NOTE: Predefined rate limit configurations
export const rateLimitConfigs = {
  // Auth endpoints - strict limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },
  // Signup endpoint - prevent spam
  signup: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 signups per hour
  },
  // General API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
  },
}


