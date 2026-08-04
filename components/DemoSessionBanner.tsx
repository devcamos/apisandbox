"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { isDemoSessionEmail } from "@/lib/demo-login"
import { useSession, signOut } from "@/components/providers/SessionProvider"
import { SignOutProgressOverlay } from "@/components/auth/SignOutProgressOverlay"

interface DemoSessionBannerProps {
  /** Server-resolved `getDemoUserEmail()` when demo flag is on; otherwise null. */
  demoAccountEmail: string | null
}

export function DemoSessionBanner({ demoAccountEmail }: Readonly<DemoSessionBannerProps>) {
  const { data, status } = useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)
    await signOut({ callbackUrl: "/" })
  }

  if (!demoAccountEmail || status !== "authenticated" || !data?.user?.email) {
    return null
  }

  if (!isDemoSessionEmail(data.user.email, demoAccountEmail)) {
    return null
  }

  return (
    <>
      <div className="border-b border-amber-500/40 bg-amber-950/50 px-4 py-2 text-center text-sm text-amber-100">
        <Sparkles className="inline-block h-4 w-4 align-text-bottom text-amber-400 mr-1.5" aria-hidden />
        You are signed in as the <strong>live demo</strong> account ({demoAccountEmail}).{" "}
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={isSigningOut}
          className="font-semibold text-amber-300 underline-offset-2 hover:underline disabled:cursor-wait disabled:opacity-60"
        >
          Exit demo
        </button>
        {" · "}
        <Link href="/dashboard" className="text-amber-200/90 underline-offset-2 hover:underline">
          Dashboard
        </Link>
      </div>
      <SignOutProgressOverlay visible={isSigningOut} />
    </>
  )
}
