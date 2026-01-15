/**
 * User Registration API Route
 * 
 * MENTOR NOTE: Signup Flow Best Practices
 * 
 * 1. Validate input (email format, password strength)
 * 2. Check if user already exists
 * 3. Hash password BEFORE storing
 * 4. Create user in database
 * 5. Return user (NO password)
 * 6. Optionally send verification email
 * 
 * Security considerations:
 * - Rate limiting (prevent spam signups)
 * - Email verification (prevent fake accounts)
 * - Password strength requirements
 * - Input sanitization
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashPassword, validatePasswordStrength } from "@/lib/auth"
import { rateLimit, getClientIdentifier, rateLimitConfigs } from "@/lib/rate-limit"

// MENTOR NOTE: Input Validation Schema
// Zod provides runtime type checking and validation
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
})

export async function POST(request: NextRequest) {
  // MENTOR NOTE: Rate Limiting
  // Prevent spam signups and abuse
  const clientId = getClientIdentifier(request)
  const rateLimitResult = rateLimit(clientId, rateLimitConfigs.signup)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { 
        error: "Too many signup attempts. Please try again later.",
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitConfigs.signup.maxRequests.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
          "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        }
      }
    )
  }

  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = signupSchema.parse(body)
    const { email, password, name } = validatedData

    // MENTOR NOTE: Password Strength Validation
    // Client-side validation is for UX, but ALWAYS validate server-side!
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: "Password does not meet requirements", details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // MENTOR NOTE: Security Best Practice
      // Don't reveal if email exists (prevents user enumeration)
      // But for signup, it's okay to be specific
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // MENTOR NOTE: Hash Password BEFORE Storing
    // NEVER store plain text passwords!
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash, // Only hash stored, NOT plain text
        name: name || null,
        isActive: true,
        loginAttempts: 0,
      }
    })

    // MENTOR NOTE: Return User (NO Password)
    // Never return password or passwordHash to client
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      message: "Account created successfully"
    }, { status: 201 })

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}

