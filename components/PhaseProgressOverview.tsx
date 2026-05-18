"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Trophy, BarChart3, Target, TrendingUp } from "lucide-react"
import { useSession } from "@/components/providers/SessionProvider"
import { masteryLabel } from "@/lib/learning/phase-quiz-insights"

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
  attempts: number
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
  const overall = useMemo(() => {
    const attempted = progress.filter((item) => item.attempts > 0)
    const readyCount = attempted.filter((item) => masteryLabel(item.correctAnswers, item.totalQuestions) === "Ready for the next phase").length
    const reinforcement = attempted.filter((item) => masteryLabel(item.correctAnswers, item.totalQuestions) === "Needs reinforcement")
    const nextFocus = reinforcement[0] ?? attempted.find((item) => masteryLabel(item.correctAnswers, item.totalQuestions) !== "Ready for the next phase") ?? null

    return {
      attemptedCount: attempted.length,
      readyCount,
      nextFocus,
    }
  }, [progress])

  if (status !== "authenticated") return null

  return (
    <section className="container mx-auto px-6 py-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-gray-300 mb-3">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Mastery overview
            </div>
            <h2 className="text-3xl font-bold text-white">Checkpoint mastery across phases</h2>
            <p className="text-gray-400">Use the stored best attempt per phase to see where understanding is solid, where to revisit, and what to open next.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl px-5 py-4">
            <div className="text-sm text-gray-400">XP retained</div>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              {totalXp}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Ready phases
            </div>
            <div className="text-2xl font-bold text-white">{overall.readyCount}</div>
            <div className="text-sm text-gray-300">Best attempts currently show next-phase readiness.</div>
          </div>
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Attempted phases
            </div>
            <div className="text-2xl font-bold text-white">{overall.attemptedCount}</div>
            <div className="text-sm text-gray-300">Phases with at least one checkpoint result saved.</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Next focus
            </div>
            <div className="text-base font-bold text-white">
              {overall.nextFocus ? `Phase ${overall.nextFocus.phaseNumber}` : "No urgent gap"}
            </div>
            <div className="text-sm text-gray-300">
              {overall.nextFocus
                ? masteryLabel(overall.nextFocus.correctAnswers, overall.nextFocus.totalQuestions)
                : "You can keep moving or retake a checkpoint later."}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
          {phaseMeta.map((phase) => {
            const item = progressByPhase.get(phase.phaseNumber)
            const label = item ? masteryLabel(item.correctAnswers, item.totalQuestions) : "Not attempted yet"
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
                <div className="text-sm text-cyan-100 mb-3">{label}</div>
                <div className="text-sm text-gray-400 mb-1">
                  Best checkpoint: <span className="text-white">{item?.correctAnswers ?? 0}/{item?.totalQuestions ?? 3}</span>
                </div>
                <div className="text-sm text-gray-400 mb-1">
                  Attempts: <span className="text-white">{item?.attempts ?? 0}</span>
                </div>
                <div className="text-sm text-gray-400">
                  XP retained: <span className="text-white">{item?.xpEarned ?? 0}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
