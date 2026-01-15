/**
 * SaaS Landing Page
 * 
 * MENTOR NOTE: Landing Page Best Practices
 * 
 * 1. Clear value proposition (hero section)
 * 2. Feature highlights (what you get)
 * 3. Social proof (testimonials, stats)
 * 4. Pricing/CTA (call to action)
 * 5. Preview content (blurred/limited to entice signup)
 * 6. Trust indicators (security, guarantees)
 * 
 * This page is PUBLIC for unauthenticated users
 * Authenticated users are redirected to dashboard
 * All learning content is behind authentication
 */

"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, Check, Star, Shield, Zap, BookOpen, BarChart3, Lock } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render landing page if authenticated (redirect will happen)
  if (status === "authenticated") {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              API Integration Training
            </h1>
            <h2 className="text-3xl font-semibold mb-6 text-gray-300">
              Master API Integrations
            </h2>
            <p className="text-xl text-gray-300 mb-4">
              From fundamentals to enterprise architecture
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Interactive, hands-on training designed for developers who want to master API integrations
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link 
                href="/signup"
                className="px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                Explore Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/login"
                className="px-8 py-4 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all"
              >
                Sign In
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Phase 0 & 1 free to explore
            </p>
          </div>
        </div>
      </section>

      {/* Pareto Principle Methodology Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 border-2 border-yellow-500/30 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-yellow-500/20 rounded-xl">
                <span className="text-4xl">📊</span>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Powered by the Pareto Principle
                </h2>
                <p className="text-lg text-gray-300">
                  The 80/20 Rule: Master the 20% that delivers 80% of results
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-800/70 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <span>🎯</span> Content Selection Engine
                </h3>
                <p className="text-gray-300 mb-4">
                  Every concept in this training is carefully selected using the Pareto Principle. We identify the <strong className="text-white">20% of concepts</strong> that solve <strong className="text-white">80% of real-world API integration challenges</strong>.
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">✓</span>
                    <span>Focus on high-impact patterns used in 80% of integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">✓</span>
                    <span>Skip edge cases that rarely occur in practice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 font-bold">✓</span>
                    <span>Prioritize concepts that unlock multiple use cases</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-slate-800/70 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                  <span>🚀</span> Deep Dive for Growth
                </h3>
                <p className="text-gray-300 mb-4">
                  Once we've identified the vital 20%, we provide <strong className="text-white">comprehensive deep dives</strong> to ensure you truly master each concept and can apply it confidently in production.
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">✓</span>
                    <span>Detailed documentation with real-world examples</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">✓</span>
                    <span>Interactive demos to reinforce understanding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold">✓</span>
                    <span>Practical use cases and best practices</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
              <h3 className="text-lg font-bold text-white mb-3">💡 How It Works</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">1</div>
                  <p className="text-gray-300">Identify the 20% of concepts that solve 80% of problems</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-2">2</div>
                  <p className="text-gray-300">Structure content around these high-impact concepts</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400 mb-2">3</div>
                  <p className="text-gray-300">Deep dive into each concept to ensure mastery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Training?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to master API integrations, from REST basics to distributed systems
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">4 Progressive Phases</h3>
            <p className="text-gray-400 mb-4">
              Structured learning path from API basics to principal-level architecture patterns
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Integration Mindset
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Third-Party Integrations
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Inter-Service Communication
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Principal-Level Architecture
              </li>
            </ul>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Interactive Demos</h3>
            <p className="text-gray-400 mb-4">
              Hands-on experience with real API calls, OAuth flows, and resilience patterns
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Live API Testing
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                OAuth2 Simulator
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Circuit Breaker Demos
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Real-time Examples
              </li>
            </ul>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-time Metrics</h3>
            <p className="text-gray-400 mb-4">
              Monitor your progress with observability tools and performance metrics
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Progress Tracking
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Performance Analytics
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Learning Dashboard
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Achievement System
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-12 border border-slate-600">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What You&apos;ll Master</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                5
              </div>
              <h3 className="font-semibold text-white mb-2">API Types</h3>
              <p className="text-gray-400 text-sm">REST, GraphQL, gRPC, WebSocket, Event-driven</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                10+
              </div>
              <h3 className="font-semibold text-white mb-2">Resilience Patterns</h3>
              <p className="text-gray-400 text-sm">Retries, circuit breakers, timeouts, rate limiting</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="font-semibold text-white mb-2">Learning Phases</h3>
              <p className="text-gray-400 text-sm">From fundamentals to principal-level architecture</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                100%
              </div>
              <h3 className="font-semibold text-white mb-2">Hands-on</h3>
              <p className="text-gray-400 text-sm">Interactive demos and real-world examples</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section - Blurred Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Preview Your Learning Path</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See what awaits you inside (sign up to unlock full access)
          </p>
        </div>

        {/* Blurred Preview Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 relative">
          {/* Blur Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-white mb-2">Explore to unlock</p>
              <p className="text-gray-400 mb-4">Get full access to all learning phases</p>
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Explore Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Preview Content (blurred) */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 opacity-50 blur-sm">
            <div className="text-sm font-semibold text-gray-400 mb-2">Phase 1</div>
            <h3 className="text-2xl font-bold text-white mb-2">Integration Mindset</h3>
            <p className="text-gray-400 mb-4">Understand the fundamentals of API integrations</p>
            <div className="space-y-2">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="h-2 bg-slate-700 rounded w-3/4"></div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 opacity-50 blur-sm">
            <div className="text-sm font-semibold text-gray-400 mb-2">Phase 2</div>
            <h3 className="text-2xl font-bold text-white mb-2">Third-Party Integrations</h3>
            <p className="text-gray-400 mb-4">Master OAuth2, JWTs, and resilience patterns</p>
            <div className="space-y-2">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="h-2 bg-slate-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-xl text-gray-300">
            Start learning today, no credit card required
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Trial */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-white mb-1">$0</div>
              <p className="text-gray-400">Always free</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Explore Phase 0 & 1 (Free)
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Interactive demos
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Progress tracking
              </li>
            </ul>
            <Link
              href="/signup"
              className="block w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all"
            >
              Explore Free
            </Link>
          </div>

          {/* Premium */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-500 relative">
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              POPULAR
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-4xl font-bold text-white mb-1">$29</div>
              <p className="text-gray-400">per month</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Explore all phases (2-4)
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Explore Cloud & AI sections
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Priority support
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Advanced analytics
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400" />
                Certificate of completion
              </li>
            </ul>
            <Link
              href="/signup"
              className="block w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all"
            >
              Explore Premium
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-400 text-sm">
                Your data is encrypted and never shared
              </p>
            </div>
            <div>
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Trusted by Developers</h3>
              <p className="text-gray-400 text-sm">
                Join thousands of developers mastering APIs
              </p>
            </div>
            <div>
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Cancel Anytime</h3>
              <p className="text-gray-400 text-sm">
                No long-term commitments, cancel when you want
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join developers who are mastering API integrations with our comprehensive, interactive training program. Start exploring Phase 0 & 1 for free!
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Explore Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
