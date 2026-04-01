import { NextRequest } from "next/server"
import { z } from "zod"
import { registerWithPassword } from "@/lib/services/auth/auth-service"
import { handleRouteError, okResponse, errorResponse } from "@/lib/http/responses"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  __testForceBootstrapFail: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(400, "validation_error", "Invalid register payload", parsed.error.issues)
    }

    const fallbackNameParts = (parsed.data.name || "").trim().split(/\s+/).filter(Boolean)
    const response = await registerWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
      firstName: parsed.data.firstName ?? fallbackNameParts[0] ?? undefined,
      lastName:
        parsed.data.lastName ??
        (fallbackNameParts.length > 1 ? fallbackNameParts.slice(1).join(" ") : undefined),
      forceBootstrapFailure:
        process.env.NODE_ENV !== "production" ? parsed.data.__testForceBootstrapFail : false,
    })

    const res = okResponse(response, 201)
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
