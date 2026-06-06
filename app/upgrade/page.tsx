"use client"

import { isAllowedStripeCheckoutRedirectUrl } from "@/lib/safe-redirect"
import { isFeatureEnabled } from "@/config/featureFlags"
import { useSession } from "@/components/providers/SessionProvider"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Check, Sparkles, Lock, ArrowRight } from "lucide-react"
import { PremiumCatalogPreview } from "@/components/premium/PremiumCatalogPreview"
import { authApiFetchInit } from "@/lib/auth/client-fetch"

export default function UpgradePage() {
  const { data: session, refresh } = useSession()
  const router = useRouter()
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async () => {
    if (!session?.user?.id) {
      router.push("/login?callbackUrl=/upgrade")
      return
    }

    setIsUpgrading(true)
    setError(null)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        ...authApiFetchInit,
      })

      if (response.ok) {
        const { url } = await response.json()
        if (typeof url === "string" && isAllowedStripeCheckoutRedirectUrl(url)) {
          if (globalThis.window !== undefined) {
            window.location.href = url
          }
          return
        }
      }

      if (!isFeatureEnabled("STRIPE_CHECKOUT")) {
        const fallback = await fetch("/api/subscription/upgrade", {
          method: "POST",
          ...authApiFetchInit,
        })
        if (fallback.ok) {
          await refresh()
          router.push("/upgrade/success")
          return
        }
      }

      const errBody = await response.json().catch(() => ({}))
      setError(
        typeof errBody.error === "string"
          ? errBody.error
          : "Checkout is unavailable. Confirm billing is configured or try again later.",
      )
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text">
            Unlock Full Access
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Master APIs, algorithms, and architecture with interactive tools and guided practice
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-white mb-1">£0</div>
              <p className="text-gray-400">Account recommended</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                Phase 0: How the Internet Works
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                Phase 1: Integration Mindset
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                Observability &amp; docs (architecture, Java)
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Lock className="w-5 h-5 shrink-0" />
                <span className="line-through">Phases 2–9, Cloud &amp; AI</span>
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Lock className="w-5 h-5 shrink-0" />
                <span className="line-through">Interactive visualisers &amp; full progress</span>
              </li>
            </ul>
            <Link
              href="/phase-0"
              className="block w-full py-3 bg-slate-700 text-white rounded-lg font-semibold text-center hover:bg-slate-600 transition-all"
            >
              Start Free
            </Link>
          </div>

          <div className="bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-violet-500/50 relative">
            <div className="absolute top-4 right-4 bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              FULL ACCESS
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-4xl font-bold text-white mb-1">£5</div>
              <p className="text-gray-400">per month · cancel anytime</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                <strong>All learning phases (2–9)</strong>
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                Cloud &amp; AI sections
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                Interactive algorithm visualisers
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                Shinobi progress board &amp; XP
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                Learning assistant on premium routes
              </li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {!session ? (
                <>
                  <Lock className="w-5 h-5" />
                  Sign in to upgrade
                </>
              ) : isUpgrading ? (
                "Redirecting to checkout..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Upgrade — £5/month
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {!session && (
              <p className="text-center text-sm text-gray-400 mt-3">
                <Link href="/login?callbackUrl=/upgrade" className="text-violet-400 hover:text-violet-300">
                  Sign in
                </Link>{" "}
                or{" "}
                <Link href="/signup" className="text-violet-400 hover:text-violet-300">
                  create an account
                </Link>{" "}
                to upgrade
              </p>
            )}
            {error && (
              <p className="text-center text-sm text-rose-400 mt-3">{error}</p>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What you unlock</h2>
          <PremiumCatalogPreview />
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            <strong className="text-white">7-day refund guarantee</strong> · Cancel anytime · Secure payment via Stripe
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/phase-1" className="text-violet-400 hover:text-violet-300 transition-colors">
              ← Back to free content
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
