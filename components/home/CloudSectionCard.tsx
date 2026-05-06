"use client"

import Link from "next/link"
import { Cloud, Lock, Target } from "lucide-react"

interface CloudSectionCardProps {
  href: string
  locked?: boolean
  ctaText: string
}

export default function CloudSectionCard({
  href,
  locked = false,
  ctaText,
}: Readonly<CloudSectionCardProps>) {
  return (
    <section className="container mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Cloud Migration</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Learn how to migrate your applications to AWS cloud
        </p>
      </div>
      <Link href={href}>
        <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-700 hover:border-orange-500 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          {locked && (
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
                <span className="text-sm font-semibold text-orange-400">Cloud</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-400 mb-1">Cloud Section</div>
              <h3 className="text-2xl font-bold text-white mb-2">AWS Cloud Migration</h3>
              <p className="text-gray-400 mb-4">
                Master AWS cloud integration and learn how to migrate your applications to the cloud
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">AWS Services</span>
              <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">Migration Strategies</span>
              <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">Cost Optimization</span>
              <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded">Architecture</span>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-2" />
                EC2, S3, RDS, Lambda, API Gateway
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-2" />
                Lift & Shift, Re-platform, Refactor
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-2" />
                Migration Dashboard & Tools
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">⏱️ Self-paced</div>
              <div className={`font-semibold flex items-center group-hover:gap-2 transition-all ${locked ? "text-yellow-400" : "text-orange-400"}`}>
                {ctaText}
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  )
}
