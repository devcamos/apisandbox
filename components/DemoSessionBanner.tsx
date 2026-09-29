"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { isDemoUserEmail } from "@/lib/demo-login"
import { useSession, signOut } from "@/components/providers/SessionProvider"
import { SignOutProgressOverlay } from "@/components/auth/SignOutProgressOverlay"

interface DemoSessionBannerProps {
  /** When true, show the banner for any demo-session email. */
  enabled: boolean
}

export function DemoSessionBanner({ enabled }: Readonly<DemoSessionBannerProps>) {
  const { data, status } = useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)
    await signOut({ callbackUrl: "/" })
  }

  if (!enabled || status !== "authenticated" || !data?.user?.email) {
    return null
  }

  if (!isDemoUserEmail(data.user.email) && !data.isDemo) {
    return null
  }

  return (
    <>
      <div className="border-b border-amber-500/40 bg-amber-950/50 px-4 py-2 text-center text-sm text-amber-100">
        <Sparkles className="inline-block h-4 w-4 align-text-bottom text-amber-400 mr-1.5" aria-hidden />
        You are in a <strong>Phase 1 demo</strong> (temporary session). Later phases stay locked.{" "}
        <Link href="/signup" className="font-semibold text-amber-300 underline-offset-2 hover:underline">
          Create a free account
        </Link>
        {" to keep progress · "}
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={isSigningOut}
          className="font-semibold text-amber-300 underline-offset-2 hover:underline disabled:cursor-wait disabled:opacity-60"
        >
          Exit demo
        </button>
        {" · "}
        <Link href="/phase-1" className="text-amber-200/90 underline-offset-2 hover:underline">
          Open Phase 1
        </Link>
      </div>
      <SignOutProgressOverlay visible={isSigningOut} />
    </>
  )
}
