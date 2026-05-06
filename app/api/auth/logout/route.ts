import { okResponse } from "@/lib/http/responses"
import { clearAuthCookie } from "@/lib/http/auth-route-helpers"

export async function POST() {
  return clearAuthCookie(okResponse({ loggedOut: true }))
}
