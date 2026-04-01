import { NextRequest } from "next/server"
import { z } from "zod"
import { loginWithPassword } from "@/lib/services/auth/auth-service"
import { handleRouteError, okResponse, errorResponse } from "@/lib/http/responses"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(400, "validation_error", "Invalid login payload", parsed.error.issues)
    }

    const response = await loginWithPassword(parsed.data)
    const res = okResponse(response)
    res.cookies.set("auth_token", response.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: response.expiresIn,
    })
    return res
  } catch (error) {
    return handleRouteError(error)
  }
}

