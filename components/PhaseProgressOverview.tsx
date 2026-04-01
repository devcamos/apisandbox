"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Trophy, BarChart3 } from "lucide-react"
import { useSession } from "@/components/providers/SessionProvider"

const AUTH_STORAGE_KEY = "auth_jwt"

const phaseMeta = [
  { phaseNumber: 0, title: "Fundamentals", href: "/phase-0", color: "from-green-500 to-emerald-500" },
  { phaseNumber: 1, title: "Integration Mindset", href: "/phase-1", color: "from-blue-500 to-cyan-500" },
  { phaseNumber: 2, title: "Third-Party Integrations", href: "/phase-2", color: "from-purple-500 to-pink-500" },
  { phaseNumber: 3, title: "Inter-Service Communication", href: "/phase-3", color: "from-orange-500 to-red-500" },
  { phaseNumber: 4, title: "Principal-Level Architecture", href: "/phase-4", color: "from-emerald-500 to-cyan-500" },
]

interface PhaseProgress {
  phaseNumber: number
  xpEarned: number
  totalQuestions: number
  correctAnswers: number
}

export default function PhaseProgressOverview() {
  const { status } = useSession()
  const [progress, setProgress] = useState<PhaseProgress[]>([])

  useEffect(() => {
    if (status !== "authenticated") return
    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!token) return

    async function loadProgress() {
      const res = await fetch("/api/phase-progress", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const payload = await res.json()
      setProgress(payload.data.progress ?? [])
    }

    void loadProgress()
  }, [status])

  const progressByPhase = useMemo(() => {
    return new Map(progress.map((item) => [item.phaseNumber, item]))
  }, [progress])

  const totalXp = useMemo(() => progress.reduce((sum, item) => sum + item.xpEarned, 0), [progress])

  if (status !== "authenticated") return null

  return (
    <section className="container mx-auto px-6 py-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-gray-300 mb-3">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Phase progress
            </div>
            <h2 className="text-3xl font-bold text-white">Quiz progress and XP</h2>
            <p className="text-gray-400">Each phase now includes a checkpoint quiz. Best score per phase becomes stored XP.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl px-5 py-4">
            <div className="text-sm text-gray-400">Total XP</div>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              {totalXp}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
          {phaseMeta.map((phase) => {
            const item = progressByPhase.get(phase.phaseNumber)
            return (
              <Link
                key={phase.phaseNumber}
                href={phase.href}
                className="block bg-slate-900/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all"
              >
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${phase.color} mb-3`}>
                  Phase {phase.phaseNumber}
                </div>
                <h3 className="font-bold text-white mb-2">{phase.title}</h3>
                <div className="text-sm text-gray-400 mb-1">XP: <span className="text-white">{item?.xpEarned ?? 0}</span></div>
                <div className="text-sm text-gray-400">
                  Score: <span className="text-white">{item?.correctAnswers ?? 0}/{item?.totalQuestions ?? 3}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
