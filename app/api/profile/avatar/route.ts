import { NextRequest } from "next/server"
import { requireAuthenticatedUser } from "@/lib/auth/jwt-auth-middleware"
import { uploadAvatarForUser } from "@/lib/services/profile/profile-service"
import { errorResponse, handleRouteError, okResponse } from "@/lib/http/responses"

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser(request)
    const formData = await request.formData()
    const file = formData.get("avatar")

    if (!(file instanceof File)) {
      return errorResponse(400, "validation_error", "avatar file is required")
    }

    const avatarUrl = await uploadAvatarForUser(user.id, file)
    return okResponse({ avatarUrl })
  } catch (error) {
    return handleRouteError(error)
  }
}

