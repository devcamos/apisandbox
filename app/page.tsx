import Link from "next/link";
import { ArrowRight, BookOpen, Play, BarChart3, Users, Zap } from "lucide-react";

export default function Home() {
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
                href="/start"
                className="px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-102 transition-all duration-200"
              >
                Start Learning
              </Link>
              <Link 
                href="/observability"
                className="px-8 py-4 border border-gray-600 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Training?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive, hands-on learning designed for developers who want to master API integrations
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 text-center">
            <Play className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Interactive Demos</h3>
            <p className="text-gray-400 mb-4">
              Hands-on experience with real API calls, OAuth flows, and resilience patterns
            </p>
            <Link 
              href="/start"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
            >
              Try Demos <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 text-center">
            <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Comprehensive Learning</h3>
            <p className="text-gray-400 mb-4">
              From REST basics to advanced distributed systems patterns
            </p>
            <Link 
              href="/start"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold"
            >
              Explore Content <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 text-center">
            <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Real-time Metrics</h3>
            <p className="text-gray-400 mb-4">
              Monitor your progress with observability tools and performance metrics
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

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join developers who are mastering API integrations with our comprehensive, interactive training program.
          </p>
          <Link 
            href="/start"
            className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-102 transition-all duration-200"
          >
            Start Your Journey <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}

