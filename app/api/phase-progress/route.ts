import { NextRequest } from "next/server"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { prisma } from "@/lib/prisma"
import { handleRouteError, okResponse } from "@/lib/http/responses"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const progress = await prisma.userPhaseProgress.findMany({
      where: { userId: user.id },
      orderBy: { phaseNumber: "asc" },
    })

    const totalXp = progress.reduce((sum: number, item) => sum + item.xpEarned, 0)
    return okResponse({ progress, totalXp })
  } catch (error) {
    return handleRouteError(error)
  }
}
