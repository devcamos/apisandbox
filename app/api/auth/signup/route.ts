import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { registerWithPassword } from "@/lib/services/auth/auth-service"
import { AppError } from "@/lib/http/errors"

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

    const parts = (parsed.data.name || "").trim().split(/\s+/).filter(Boolean)
    const authResponse = await registerWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
      firstName: parts[0],
      lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
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
    response.cookies.set("auth_token", authResponse.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: authResponse.expiresIn,
    })
    return response
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
