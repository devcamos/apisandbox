/**
 * Upgrade/Pricing Page
 * 
 * MENTOR NOTE: Pricing Page Best Practices
 * 
 * 1. Clear value proposition
 * 2. Feature comparison (Free vs Premium)
 * 3. Social proof (testimonials, user count)
 * 4. Clear pricing
 * 5. Easy upgrade flow
 * 
 * This page allows users to upgrade from FREE to PREMIUM
 */

"use client"

import { useSession } from "@/components/providers/SessionProvider"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Check, Sparkles, Lock, ArrowRight, Star } from "lucide-react"

export default function UpgradePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const handleUpgrade = async () => {
    if (!session?.user?.id) {
      router.push("/login")
      return
    }

    setIsUpgrading(true)

    try {
      // MENTOR NOTE: In production, this would:
      // 1. Create Stripe checkout session
      // 2. Redirect to payment
      // 3. Webhook updates subscription on success
      
      // For now, simulate upgrade (demo mode)
      const response = await fetch("/api/subscription/upgrade", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        alert("Upgrade failed. Please try again.")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-transparent bg-clip-text">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock all learning phases, cloud guides, and advanced features
          </p>
        </div>

        {/* Pricing Comparison */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Free Tier */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-white mb-1">$0</div>
              <p className="text-gray-400">Forever free</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Phase 1: Integration Mindset
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Basic API concepts
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Lock className="w-5 h-5" />
                <span className="line-through">Phases 2-4</span>
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Lock className="w-5 h-5" />
                <span className="line-through">Cloud Migration</span>
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Lock className="w-5 h-5" />
                <span className="line-through">Advanced Demos</span>
              </li>
            </ul>
            <Link
              href="/dashboard"
              className="block w-full py-3 bg-slate-700 text-white rounded-lg font-semibold text-center hover:bg-slate-600 transition-all"
            >
              Continue with Free
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500/50 relative">
            <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              RECOMMENDED
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-4xl font-bold text-white mb-1">$29</div>
              <p className="text-gray-400">per month</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400" />
                <strong>All 4 Learning Phases</strong>
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400" />
                AWS Cloud Migration Guides
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400" />
                Advanced Observability Dashboard
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400" />
                Interactive Demos & Examples
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400" />
                Java + React Integration Examples
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400" />
                Priority Support
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400" />
                Certificate of Completion
              </li>
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={isUpgrading || !session}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {!session ? (
                <>
                  <Lock className="w-5 h-5" />
                  Sign In to Upgrade
                </>
              ) : isUpgrading ? (
                "Upgrading..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Upgrade Now
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {!session && (
              <p className="text-center text-sm text-gray-400 mt-2">
                <Link href="/login" className="text-purple-400 hover:text-purple-300">
                  Sign in
                </Link>{" "}
                or{" "}
                <Link href="/signup" className="text-purple-400 hover:text-purple-300">
                  create an account
                </Link>{" "}
                to upgrade
              </p>
            )}
          </div>
        </div>

        {/* Feature Details */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What You Get with Premium
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">All Learning Phases</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Access to Phases 2, 3, and 4 covering OAuth2, microservices, 
                distributed systems, and principal-level architecture.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Cloud Migration</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Complete AWS migration guides, cost calculators, and 
                architecture templates for enterprise deployments.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Java + React Examples</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Real-world code examples showing how Java backends and 
                React frontends communicate through APIs.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Priority Support</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Get help when you need it with priority email support 
                and access to exclusive community forums.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            <strong className="text-white">30-day money-back guarantee</strong> • Cancel anytime • No credit card required for free tier
          </p>
          <Link
            href="/dashboard"
            className="text-purple-400 hover:text-purple-300 font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

