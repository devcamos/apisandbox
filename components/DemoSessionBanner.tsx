"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { isFeatureEnabled } from "@/config/featureFlags"
import { getPublicDemoUserEmail, isDemoSessionEmail } from "@/lib/demo-login"
import { useSession, signOut } from "@/components/providers/SessionProvider"

export function DemoSessionBanner() {
  const { data, status } = useSession()
  const demoVisible = isFeatureEnabled("DEMO_LOGIN")
  const demoEmail = getPublicDemoUserEmail()

  if (!demoVisible || status !== "authenticated" || !data?.user?.email) {
    return null
  }

  if (!isDemoSessionEmail(data.user.email)) {
    return null
  }

  return (
    <div className="border-b border-amber-500/40 bg-amber-950/50 px-4 py-2 text-center text-sm text-amber-100">
      <Sparkles className="inline-block h-4 w-4 align-text-bottom text-amber-400 mr-1.5" aria-hidden />
      You are signed in as the <strong>live demo</strong> account ({demoEmail}).{" "}
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/" })}
        className="font-semibold text-amber-300 underline-offset-2 hover:underline"
      >
        Exit demo
      </button>
      {" · "}
      <Link href="/dashboard" className="text-amber-200/90 underline-offset-2 hover:underline">
        Dashboard
      </Link>
    </div>
  )
}
