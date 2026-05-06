import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { registerWithPassword } from "@/lib/services/auth/auth-service"
import { AppError } from "@/lib/http/errors"
import { setAuthCookie } from "@/lib/http/auth-route-helpers"
import { splitFullName } from "@/lib/user-name"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().trim().optional(),
  __testForceBootstrapFail: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { firstName, lastName } = splitFullName(parsed.data.name)
    const authResponse = await registerWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      forceBootstrapFailure:
        process.env.NODE_ENV !== "production" ? parsed.data.__testForceBootstrapFail : false,
    })

    const response = NextResponse.json(
      {
        user: authResponse.user,
        token: authResponse.token,
        expiresIn: authResponse.expiresIn,
        message: "Account created successfully",
      },
      { status: 201 }
    )
    return setAuthCookie(response, {
      token: authResponse.token,
      maxAge: authResponse.expiresIn,
    })
  } catch (error) {
    if (error instanceof AppError) {
      const payload: { error: string; details?: unknown } = { error: error.message }
      if (error.details !== undefined) {
        payload.details = error.details
      }
      return NextResponse.json(payload, { status: error.status })
    }
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}
