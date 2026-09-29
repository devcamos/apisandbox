import { prisma } from "@/lib/prisma"
import { parseApiTokenScopes } from "@/lib/api-tokens/token-policy"
import { withV1Auth, v1Json } from "@/lib/api/v1/handler"
import { V1AuthError } from "@/lib/api/v1/require-api-token"

export const GET = withV1Auth({ scope: "profile:read" }, async ({ auth, requestId }) => {
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      name: true,
      subscriptionTier: true,
    },
  })

  if (!user) {
    // Token was valid at auth time; treat race as invalid token.
    throw new V1AuthError(401, "invalid_token", "User for this token no longer exists")
  }

  return v1Json(
    {
      id: user.id,
      name: user.name ?? null,
      subscriptionTier: user.subscriptionTier,
      token: {
        id: auth.tokenId,
        scopes: parseApiTokenScopes(auth.scopes),
        expiresAt: auth.expiresAt,
      },
    },
    requestId,
  )
})
