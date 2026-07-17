"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Network, Play } from "lucide-react"

export default function QuickStartGuide() {
  return (
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
          <h3 className="text-xl font-bold text-white mb-2">Build the Mental Model</h3>
          <p className="text-gray-400 text-sm mb-4">
            Follow one request from program state to a dependable integration.
          </p>
          <Link href="/learn/api-foundations" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold">
            Start foundation <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
          <Play className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Trace a Request</h3>
          <p className="text-gray-400 text-sm mb-4">
            Predict what happens at each layer, then reveal the package-tracking system trace.
          </p>
          <Link href="/learn/api-foundations/network-path" className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold">
            Trace the network <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 text-center">
          <Network className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Monitor Progress</h3>
          <p className="text-gray-400 text-sm mb-4">
            Track your learning with real-time metrics and observability tools.
          </p>
          <Link href="/observability" className="inline-flex items-center text-green-400 hover:text-green-300 font-semibold">
            View Dashboard <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
