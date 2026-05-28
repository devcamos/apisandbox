import { NextRequest } from "next/server"
import { z } from "zod"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { APP_GUIDE_STEP_IDS } from "@/lib/learning/app-guide"
import { handleRouteError, okResponse } from "@/lib/http/responses"
import { parseJsonBody } from "@/lib/http/auth-route-helpers"
import { prisma } from "@/lib/prisma"
import {
  completeUserAppGuide,
  getOrCreateUserAppGuide,
  toGuideResponse,
  updateGuideStep,
} from "@/lib/services/user-app-guide-service"

const patchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("complete_step"),
    stepId: z.enum(APP_GUIDE_STEP_IDS),
    understood: z.boolean().optional(),
    visited: z.boolean().optional(),
  }),
  z.object({
    action: z.literal("complete_guide"),
  }),
])

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const dbUser = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { createdAt: true },
    })
    const guide = await getOrCreateUserAppGuide(user.id)
    return okResponse(toGuideResponse(guide, dbUser.createdAt))
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const parsed = await parseJsonBody(request, patchSchema)
    if (!parsed.ok) {
      return parsed.response
    }

    const dbUser = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { createdAt: true },
    })

    if (parsed.data.action === "complete_guide") {
      const guide = await completeUserAppGuide(user.id)
      return okResponse(toGuideResponse(guide, dbUser.createdAt))
    }

    const guide = await updateGuideStep(user.id, parsed.data.stepId, {
      understood: parsed.data.understood,
      visited: parsed.data.visited,
    })
    return okResponse(toGuideResponse(guide, dbUser.createdAt))
  } catch (error) {
    return handleRouteError(error)
  }
}
