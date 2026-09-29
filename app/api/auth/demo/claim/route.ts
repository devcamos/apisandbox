import { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { parseJsonBody, authSessionResponse, withRouteErrorHandling } from "@/lib/http/auth-route-helpers"
import { claimDemoAccount } from "@/lib/services/auth/demo-claim-service"

const claimSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  name: z.string().trim().max(120).optional(),
  plan: z.enum(["free", "pro"]).optional(),
})

export const POST = withRouteErrorHandling(async (request: NextRequest) => {
  const user = await requireAuthenticatedUser(request)
  const parsed = await parseJsonBody(request, claimSchema, "Invalid demo claim payload")
  if (!parsed.ok) return parsed.response

  const result = await claimDemoAccount({
    userId: user.id,
    email: parsed.data.email,
    password: parsed.data.password,
    name: parsed.data.name,
    plan: parsed.data.plan,
  })

  return authSessionResponse(result)
})
