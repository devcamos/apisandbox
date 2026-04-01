import { okResponse } from "@/lib/http/responses"

export async function POST() {
  const response = okResponse({ loggedOut: true })
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  })
  return response
}

