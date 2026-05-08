import { NextRequest } from "next/server"
import { z } from "zod"
import { loginWithPassword } from "@/lib/services/auth/auth-service"
import {
  authSessionResponse,
  parseJsonBody,
  withRouteErrorHandling,
} from "@/lib/http/auth-route-helpers"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const POST = withRouteErrorHandling(async (request: NextRequest) => {
  const parsed = await parseJsonBody(request, schema, "Invalid login payload")
  if (!parsed.ok) return parsed.response

  const response = await loginWithPassword(parsed.data)
  return authSessionResponse(response)
})
