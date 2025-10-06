"use client";

import Link from "next/link";
import { Brain, Plug, Network, Compass, ArrowRight, BookOpen, Play, Star, Shield, Zap, Target } from "lucide-react";

export default function StartPage() {
      const phases = [
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
          topics: ["Anti-patterns", "Contract testing", "Legacy integration"],
          color: "from-green-500 to-emerald-500",
          href: "/phase-4",
          level: "Expert",
          levelIcon: Target,
          levelColor: "text-purple-400",
          estimatedTime: "5-6 hours",
          skills: ["System Design", "Architecture Patterns", "Performance Optimization", "Legacy Migration"]
        }
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              API Integration Training
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Master the art of API integrations from fundamentals to principal-level architecture
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="#phases"
                className="px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-102 transition-all duration-200"
              >
                Start Learning
              </Link>
              <Link 
                href="/observability"
                className="px-8 py-4 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
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
            Our training is organized into <strong className="text-white">4 progressive phases</strong> that take you from API basics to advanced architecture patterns. Each phase focuses on specific skills and real-world scenarios.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              <strong>💡 New to APIs?</strong> Start with Phase 1. <strong>Already comfortable with REST?</strong> Jump to Phase 2. <strong>Building microservices?</strong> Phase 3 is for you.
            </p>
          </div>
        </div>
        
            <div className="grid md:grid-cols-2 gap-8">
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
      </section>

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
  );
}
