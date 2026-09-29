import { Suspense } from "react"
import { getGoogleClientId } from "@/lib/google-client-id"
import { isDemoLoginRouteEnabled } from "@/lib/demo-login"
import LoginForm from "./LoginForm"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  const googleClientId = getGoogleClientId()
  const demoEnabled = isDemoLoginRouteEnabled()

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <LoginForm googleClientId={googleClientId} demoEnabled={demoEnabled} />
    </Suspense>
  )
}
