"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import QuickStartGuide from "@/components/home/QuickStartGuide";
import CloudSectionCard from "@/components/home/CloudSectionCard";
import { TryDemoButton } from "@/components/auth/TryDemoButton";
import { getLearningPhases } from "@/lib/learning/dashboard-phase-catalog";

export default function StartPage() {
      const phases = getLearningPhases(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              API Integration Training
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Master the art of API integrations from fundamentals to principal-level architecture
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4 max-w-xl mx-auto">
              <Link 
                href="#phases"
                className="px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-102 transition-all duration-200 text-center"
              >
                Start Learning
              </Link>
              <TryDemoButton
                nextPath="/dashboard"
                className="px-8 py-4 rounded-xl font-semibold border border-amber-500/50 bg-amber-950/40 text-amber-100 hover:bg-amber-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Try live demo (full app)
              </TryDemoButton>
              <Link 
                href="/observability"
                className="px-8 py-4 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Phases Grid */}
      <section id="phases" className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Learning Path</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Our training is organized into <strong className="text-white">5 progressive phases</strong> that take you from API basics to architecture-level theory mastery. Each phase focuses on specific skills and real-world scenarios.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              <strong>💡 New to APIs?</strong> Start with the first-principles foundation. <strong>Already comfortable with HTTP contracts?</strong> Jump to Phase 2. <strong>Building microservices?</strong> Phase 3 is for you. <strong>Ready for cloud?</strong> Explore the Cloud section.
            </p>
          </div>
        </div>
        
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {phases.map((phase) => {
                const Icon = phase.icon;
                const LevelIcon = phase.levelIcon;
                return (
                  <Link key={phase.id} href={phase.href}>
                    <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer relative overflow-hidden">
                      {/* Character Selection Style Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${phase.color} mb-4`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex items-center gap-2">
                            <LevelIcon className={`w-4 h-4 ${phase.levelColor}`} />
                            <span className={`text-sm font-semibold ${phase.levelColor}`}>
                              {phase.level}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm font-semibold text-gray-400 mb-1">
                            Phase {phase.id}
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {phase.title}
                          </h3>
                          <p className="text-gray-400 mb-4">
                            {phase.description}
                          </p>
                        </div>

                        {/* Skills Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {phase.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Topics */}
                        <div className="space-y-2 mb-6">
                          {phase.topics.map((topic, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-300">
                              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${phase.color} mr-2`}></span>
                              {topic}
                            </div>
                          ))}
                        </div>

                        {/* Time Estimate */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            ⏱️ {phase.estimatedTime}
                          </div>
                          <div className="text-blue-400 font-semibold flex items-center group-hover:gap-2 transition-all">
                            Start Learning
                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

        {/* Language Tracks */}
        <div className="mt-10">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white">Language Tracks</h3>
            <p className="text-gray-400 mt-1">
              Prefer learning APIs through a specific programming language? Start here.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Link href="/docs/java">
              <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-emerald-500/40 transition-all hover:shadow-2xl hover:scale-[1.02] cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-semibold">
                        Java Track
                        <span className="text-emerald-300/80">Docs</span>
                      </div>
                      <h4 className="mt-3 text-xl font-bold text-white">Master APIs with Java</h4>
                      <p className="mt-2 text-sm text-gray-400">
                        Use Java 21 to build a typed client and re-implement key endpoints (auth, validation,
                        persistence, webhooks, tests).
                      </p>
                    </div>
                    <div className="text-emerald-300 font-semibold group-hover:translate-x-0.5 transition-transform">
                      →
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/60">
              <div className="text-sm font-semibold text-white">Want another language?</div>
              <p className="mt-2 text-sm text-gray-400">
                Tell me which one (Python, Go, C#, Rust), and we can add a similar track page plus starter
                repo structure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CloudSectionCard href="/cloud" ctaText="Explore Cloud" />

      {/* Learning Path */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-12 border border-slate-600">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Learning Journey</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold text-white mb-2">Learn Concepts</h3>
              <p className="text-gray-400 text-sm">Master core principles and patterns</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold text-white mb-2">Build Projects</h3>
              <p className="text-gray-400 text-sm">Apply knowledge through hands-on work</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold text-white mb-2">Test & Debug</h3>
              <p className="text-gray-400 text-sm">Practice resilience and error handling</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="font-semibold text-white mb-2">Architect</h3>
              <p className="text-gray-400 text-sm">Design enterprise-level solutions</p>
            </div>
          </div>
        </div>
      </section>

      <QuickStartGuide />
    </div>
  );
}
