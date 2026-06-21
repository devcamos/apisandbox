/**
 * Dashboard Page – Explore free/premium
 *
 * Open to all (no sign-in required). Shows all phases + Cloud + AI.
 * Free: only Phase 0 & 1 open; premium content links to /upgrade.
 * Premium: all phases and sections open.
 */

"use client"

import { useSession } from "@/components/providers/SessionProvider"
import Link from "next/link"
import { Brain, Lock, Sparkles, Target } from "lucide-react"
import { useEffect, useState } from "react"
import { signupRequiredForPremium } from "@/config/featureFlags"
import PhaseProgressOverview from "@/components/PhaseProgressOverview"
import AppGuide from "@/components/home/AppGuide"
import CloudSectionCard from "@/components/home/CloudSectionCard"
import { getLearningPhases } from "@/lib/learning/dashboard-phase-catalog"
import { getPremiumCatalogPhases } from "@/lib/learning/premium-catalog"

const isPremiumPhase = (phaseId: number) => phaseId > 1

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [subscription, setSubscription] = useState<{
    tier: "FREE" | "PREMIUM"
    isExpired: boolean
  } | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/subscription/status")
        .then(res => res.json())
        .then(data => setSubscription(data))
        .catch(() => setSubscription({ tier: "FREE", isExpired: false }))
    } else {
      setSubscription({ tier: "FREE", isExpired: false })
    }
  }, [session])

  const tier = subscription?.tier ?? "FREE"
  // When signup not required (staging), unlock all so navigation works; when live, gate by tier
  const isPremium = !signupRequiredForPremium || tier === "PREMIUM"

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-6 py-16 animate-pulse space-y-8">
          <div className="h-12 max-w-lg mx-auto rounded-xl bg-slate-800/80" />
          <div className="h-6 max-w-2xl mx-auto rounded-lg bg-slate-800/60" />
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-800/50 border border-slate-700/50" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const phases = [
    ...getLearningPhases(true).filter((p) => p.id <= 1),
    ...getPremiumCatalogPhases(),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Welcome Section */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                    {session ? `Welcome back, ${session.user?.name || session.user?.email}!` : "Explore your learning path"}
                  </h1>
                  <p className="text-xl text-gray-300 mb-4">
                    {session ? "Continue your API integration learning journey" : "All phases and topics in one place. Free: Phase 0 & 1. Premium: unlock all."}
                  </p>
                  
                  {/* Pareto Principle Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg mb-4">
                    <span className="text-2xl">📊</span>
                    <span className="text-yellow-300 font-semibold">Pareto-Powered Training</span>
                    <span className="text-gray-400 text-sm">• Master the 20% that delivers 80%</span>
                  </div>
            
            {/* Subscription Status Badge */}
            {subscription && (
              <div className="flex items-center justify-center gap-3 mb-4">
                {subscription.tier === "PREMIUM" ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 font-semibold">Premium Member</span>
                  </div>
                ) : (
                  <Link
                    href="/upgrade"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 transition-all"
                  >
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">Free Plan</span>
                    <span className="text-blue-400 text-sm font-semibold">Upgrade →</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

            <PhaseProgressOverview />

            {/* Learning Path Section */}
            <section id="phases" className="container mx-auto px-6 py-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Choose Your Learning Path</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
                  Our curriculum spans <strong className="text-white">10 learning phases</strong> (Phase 0–9) plus Cloud and AI tracks — from fundamentals through algorithms, monetisation, and production data systems. <strong className="text-green-400">Phase 0 and Phase 1 are free</strong> — start your journey today!
                </p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              <strong>💡 New to programming?</strong> Start with Phase 0 (Getting Started). <strong>New to APIs?</strong> Start with Phase 1. <strong>Already comfortable with REST?</strong> Jump to Phase 2. <strong>Building microservices?</strong> Phase 3 is for you. <strong>Ready for cloud?</strong> Explore the Cloud section. <strong>Interested in AI?</strong> Check out the AI section.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {phases.map((phase) => {
            const Icon = phase.icon
            const LevelIcon = phase.levelIcon
            const premiumOnly = isPremiumPhase(phase.id)
            const canOpen = !premiumOnly || isPremium
            const href = phase.href
            return (
              <Link key={phase.id} href={href}>
                <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${phase.color} mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {premiumOnly && !isPremium && (
                          <Lock className="w-4 h-4 text-yellow-400" />
                        )}
                        <LevelIcon className={`w-4 h-4 ${phase.levelColor}`} />
                        <span className={`text-sm font-semibold ${phase.levelColor}`}>
                          {phase.level}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-400">
                          Phase {phase.id}
                        </span>
                        {premiumOnly && !isPremium && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-400 font-semibold">
                            Premium
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {phase.title}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {phase.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {phase.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2 mb-6">
                      {phase.topics.map((topic, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-300">
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${phase.color} mr-2`}></span>
                          {topic}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        ⏱️ {phase.estimatedTime}
                      </div>
                      <div className={`font-semibold flex items-center group-hover:gap-2 transition-all ${canOpen ? "text-blue-400" : "text-yellow-400"}`}>
                        {canOpen ? "Start Learning" : "View preview"}
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <CloudSectionCard
        href={isPremium ? "/cloud" : "/upgrade"}
        locked={!isPremium}
        ctaText={isPremium ? "Explore Cloud" : "Upgrade to unlock"}
      />

      {/* AI Section Card */}
      <section className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">AI Learning</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Master AI through its core components: Heart, Brain, Context, and Instructions
          </p>
        </div>
        <Link href={isPremium ? "/ai" : "/upgrade"}>
          <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-700 hover:border-purple-500 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {!isPremium && (
              <div className="absolute top-4 right-4">
                <Lock className="w-5 h-5 text-yellow-400" />
              </div>
            )}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-400">
                    AI
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-400 mb-1">
                  AI Section
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  AI Components & Learning
                </h3>
                <p className="text-gray-400 mb-4">
                  Understand AI through Heart (ethics), Brain (intelligence), Context (understanding), and Instructions (guidance)
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">
                  Heart
                </span>
                <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">
                  Brain
                </span>
                <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">
                  Context
                </span>
                <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">
                  Instructions
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 mr-2"></span>
                  Ethics, Human-Centered Design, Bias Mitigation
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mr-2"></span>
                  Machine Learning, Neural Networks, NLP
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 mr-2"></span>
                  Data Processing, Contextual Understanding
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mr-2"></span>
                  Prompt Engineering, Instruction Design
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  ⏱️ Self-paced
                </div>
                <div className={`font-semibold flex items-center group-hover:gap-2 transition-all ${isPremium ? "text-purple-400" : "text-yellow-400"}`}>
                  {isPremium ? "Explore AI" : "Upgrade to unlock"}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      <AppGuide />
    </div>
  )
}
