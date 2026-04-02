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
import { Brain, Plug, Network, Compass, ArrowRight, BookOpen, Play, Star, Shield, Zap, Target, Cloud, Lock, Sparkles, GraduationCap, BrainCircuit } from "lucide-react"
import { useEffect, useState } from "react"
import { signupRequiredForPremium } from "@/config/featureFlags"
import PhaseProgressOverview from "@/components/PhaseProgressOverview"

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const phases = [
    {
      id: 0,
      icon: GraduationCap,
      title: "Fundamentals",
      description: "Essential building blocks: algorithms, data structures, callbacks, VMs, HTTP",
      topics: ["Callbacks & Async", "Data Structures", "VMs & EC2", "HTTP Basics", "Git", "Algorithms"],
      color: "from-green-500 to-emerald-500",
      href: "/phase-0",
      level: "Foundation",
      levelIcon: BookOpen,
      levelColor: "text-green-400",
      estimatedTime: "1-2 hours",
      skills: ["Callbacks", "Data Structures", "VMs", "HTTP", "Git Basics", "Algorithms"]
    },
    {
      id: 1,
      icon: Brain,
      title: "Integration Mindset",
      description: "Understand the 'why' behind integrations",
      topics: ["REST, GraphQL, gRPC", "OpenAPI & protobuf", "Loose coupling & idempotency"],
      color: "from-blue-500 to-cyan-500",
      href: "/phase-1",
      level: "Beginner",
      levelIcon: Star,
      levelColor: "text-green-400",
      estimatedTime: "2-3 hours",
      skills: ["API Fundamentals", "HTTP Methods", "JSON/XML", "Basic Authentication"]
    },
    {
      id: 2,
      icon: Plug,
      title: "Third-Party Integrations",
      description: "Safely connect and maintain external APIs",
      topics: ["OAuth2 & JWTs", "Resilience patterns", "Data transformation"],
      color: "from-purple-500 to-pink-500",
      href: "/phase-2",
      level: "Intermediate",
      levelIcon: Shield,
      levelColor: "text-blue-400",
      estimatedTime: "3-4 hours",
      skills: ["OAuth2", "JWT Tokens", "Rate Limiting", "Error Handling"]
    },
    {
      id: 3,
      icon: Network,
      title: "Inter-Service Communication",
      description: "Master service-to-service patterns",
      topics: ["Sync vs async", "Event-driven with Kafka", "Distributed tracing"],
      color: "from-orange-500 to-red-500",
      href: "/phase-3",
      level: "Advanced",
      levelIcon: Zap,
      levelColor: "text-orange-400",
      estimatedTime: "4-5 hours",
      skills: ["Microservices", "Event Streaming", "Circuit Breakers", "Distributed Tracing"]
    },
    {
      id: 4,
      icon: Compass,
      title: "Principal-Level Architecture",
      description: "Think like an integration architect",
      topics: ["Constraint-driven design", "API algorithmic thinking", "Anti-patterns", "Contract testing"],
      color: "from-green-500 to-emerald-500",
      href: "/phase-4",
      level: "Expert",
      levelIcon: Target,
      levelColor: "text-purple-400",
      estimatedTime: "5-6 hours",
      skills: ["Constraint Analysis", "System Design", "Algorithmic Reasoning", "Trade-off Reasoning", "Legacy Migration"]
    },
    {
      id: 5,
      icon: BrainCircuit,
      title: "API Algorithms",
      description: "Master theory by mapping algorithmic thinking to production system design",
      topics: ["Idempotency & hash maps", "Priority queues", "Rate limiting windows", "Trade-off analysis"],
      color: "from-cyan-500 to-blue-500",
      href: "/phase-5",
      level: "Architect",
      levelIcon: Target,
      levelColor: "text-cyan-300",
      estimatedTime: "4-5 hours",
      skills: ["Algorithmic Reasoning", "Failure Modeling", "Performance Trade-offs", "Architecture Decisions"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Welcome Section */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="container mx-auto px-6 py-12 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                  <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
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

            {/* Pareto Methodology Section */}
            <section className="container mx-auto px-6 py-8">
              <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border-2 border-yellow-500/30 rounded-2xl p-8 mb-12">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <span className="text-3xl">📊</span>
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Training Powered by the Pareto Principle
                      </h2>
                      <p className="text-gray-300">
                        Every concept is selected using the 80/20 rule, then deep-dived for mastery
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                      <h3 className="text-lg font-bold text-yellow-400 mb-3">🎯 Content Selection</h3>
                      <p className="text-gray-300 text-sm mb-3">
                        We identify the <strong className="text-white">20% of concepts</strong> that solve <strong className="text-white">80% of real-world API integration challenges</strong>. No fluff, only high-impact knowledge.
                      </p>
                      <div className="text-xs text-gray-400">
                        Example: Callbacks appear in 80% of OAuth flows → Deep dive into callbacks
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                      <h3 className="text-lg font-bold text-orange-400 mb-3">🚀 Deep Dive for Growth</h3>
                      <p className="text-gray-300 text-sm mb-3">
                        Once selected, each concept gets a <strong className="text-white">comprehensive deep dive</strong> with documentation, examples, and interactive demos to ensure true mastery.
                      </p>
                      <div className="text-xs text-gray-400">
                        Example: HTTP fundamentals → Full documentation + REST API examples + Real-world use cases
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                    <p className="text-sm text-gray-300 text-center">
                      <strong className="text-white">Result:</strong> You master the vital 20% that unlocks 80% of API integration scenarios, then deep dive to ensure you can apply it confidently in production.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Learning Path Section */}
            <section id="phases" className="container mx-auto px-6 py-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Choose Your Learning Path</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
                  Our training is organized into <strong className="text-white">6 progressive phases</strong> (Phase 0-5) that take you from fundamentals to architecture-level theory mastery. <strong className="text-green-400">Phase 0 and Phase 1 are free</strong> - start your learning journey today!
                </p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              <strong>💡 New to programming?</strong> Start with Phase 0 (Fundamentals). <strong>New to APIs?</strong> Start with Phase 1. <strong>Already comfortable with REST?</strong> Jump to Phase 2. <strong>Building microservices?</strong> Phase 3 is for you. <strong>Ready for cloud?</strong> Explore the Cloud section. <strong>Interested in AI?</strong> Check out the AI section.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {phases.map((phase) => {
            const Icon = phase.icon
            const LevelIcon = phase.levelIcon
            const premiumOnly = isPremiumPhase(phase.id)
            const canOpen = !premiumOnly || isPremium
            const href = canOpen ? phase.href : "/upgrade"
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
                        {canOpen ? "Start Learning" : "Upgrade to unlock"}
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

      {/* Cloud Section Card */}
      <section className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Cloud Migration</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Learn how to migrate your applications to AWS cloud
          </p>
        </div>
        <Link href={isPremium ? "/cloud" : "/upgrade"}>
          <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-700 hover:border-orange-500 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {!isPremium && (
              <div className="absolute top-4 right-4">
                <Lock className="w-5 h-5 text-yellow-400" />
              </div>
            )}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 mb-4">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-semibold text-orange-400">
                    Cloud
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-400 mb-1">
                  Cloud Section
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  AWS Cloud Migration
                </h3>
                <p className="text-gray-400 mb-4">
                  Master AWS cloud integration and learn how to migrate your applications to the cloud
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">
                  AWS Services
                </span>
                <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">
                  Migration Strategies
                </span>
                <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">
                  Cost Optimization
                </span>
                <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">
                  Architecture
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-2"></span>
                  EC2, S3, RDS, Lambda, API Gateway
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-2"></span>
                  Lift & Shift, Re-platform, Refactor
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-2"></span>
                  Migration Dashboard & Tools
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  ⏱️ Self-paced
                </div>
                <div className={`font-semibold flex items-center group-hover:gap-2 transition-all ${isPremium ? "text-orange-400" : "text-yellow-400"}`}>
                  {isPremium ? "Explore Cloud" : "Upgrade to unlock"}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

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

      {/* Quick Start Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Quick Start Guide</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            New to API integrations? Start here for a guided introduction to the fundamentals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
            <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Read the Docs</h3>
            <p className="text-gray-400 text-sm mb-4">
              Start with our comprehensive documentation covering all integration patterns.
            </p>
            <Link 
              href="/phase-1"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
            >
              Read More <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
            <Play className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Try Interactive Demos</h3>
            <p className="text-gray-400 text-sm mb-4">
              Hands-on experience with real API calls and interactive examples.
            </p>
            <Link 
              href="/phase-1/categories"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold"
            >
              Try Demos <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
            <Network className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Monitor Progress</h3>
            <p className="text-gray-400 text-sm mb-4">
              Track your learning with real-time metrics and observability tools.
            </p>
            <Link 
              href="/observability"
              className="inline-flex items-center text-green-400 hover:text-green-300 font-semibold"
            >
              View Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
