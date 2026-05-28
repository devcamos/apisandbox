"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle2, Circle, Network, Play, Sparkles } from "lucide-react"
import { useSession } from "@/components/providers/SessionProvider"
import { authApiFetchInit } from "@/lib/auth/client-fetch"
import {
  APP_GUIDE_STEP_IDS,
  APP_GUIDE_STEP_META,
  type AppGuideStepId,
  type AppGuideStepsRecord,
} from "@/lib/learning/app-guide"
import ParetoMethodologySection from "@/components/home/ParetoMethodologySection"

type GuideApiResponse = {
  steps: AppGuideStepsRecord
  understandingPercent: number
  showQuickStart: boolean
  isComplete: boolean
}

const STEP_ICONS: Record<AppGuideStepId, typeof BookOpen> = {
  pareto_methodology: Sparkles,
  read_docs: BookOpen,
  try_demos: Play,
  track_progress: Network,
}

const STEP_COLORS: Record<AppGuideStepId, string> = {
  pareto_methodology: "text-yellow-400",
  read_docs: "text-blue-400",
  try_demos: "text-purple-400",
  track_progress: "text-green-400",
}

export default function AppGuide() {
  const { data: session, status } = useSession()
  const [guide, setGuide] = useState<GuideApiResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const loadGuide = useCallback(async () => {
    const res = await fetch("/api/user/guide", { ...authApiFetchInit })
    if (!res.ok) {
      setGuide(null)
      return
    }
    const body = await res.json()
    setGuide(body.data as GuideApiResponse)
  }, [])

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      setLoading(false)
      setGuide(null)
      return
    }
    void loadGuide().finally(() => setLoading(false))
  }, [status, session?.user, loadGuide])

  const patchStep = async (stepId: AppGuideStepId, understood: boolean) => {
    const res = await fetch("/api/user/guide", {
      ...authApiFetchInit,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_step", stepId, understood, visited: true }),
    })
    if (res.ok) {
      const body = await res.json()
      setGuide(body.data as GuideApiResponse)
    }
  }

  const completeGuide = async () => {
    const res = await fetch("/api/user/guide", {
      ...authApiFetchInit,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_guide" }),
    })
    if (res.ok) {
      const body = await res.json()
      setGuide(body.data as GuideApiResponse)
    }
  }

  if (loading || status !== "authenticated" || !guide?.showQuickStart) {
    return null
  }

  return (
    <>
      <ParetoMethodologySection />

      <section className="container mx-auto px-6 py-16" data-testid="app-guide-quick-start">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Quick Start Guide</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            New here? Complete these steps so we know how you learn — progress is saved to your account.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-600">
            <span className="text-sm text-gray-400">App understanding</span>
            <span className="text-sm font-semibold text-cyan-400">{guide.understandingPercent}%</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {APP_GUIDE_STEP_IDS.filter((id) => id !== "pareto_methodology").map((stepId) => {
            const meta = APP_GUIDE_STEP_META[stepId]
            const step = guide.steps[stepId]
            const Icon = STEP_ICONS[stepId]
            const color = STEP_COLORS[stepId]
            return (
              <div
                key={stepId}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Icon className={`w-10 h-10 ${color}`} aria-hidden />
                  <button
                    type="button"
                    onClick={() => void patchStep(stepId, !step.understood)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                    aria-pressed={step.understood}
                  >
                    {step.understood ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                    {step.understood ? "Understood" : "Mark understood"}
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{meta.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{meta.description}</p>
                <Link
                  href={meta.href}
                  onClick={() => void patchStep(stepId, step.understood)}
                  className={`inline-flex items-center font-semibold ${color} hover:opacity-80`}
                >
                  {meta.linkLabel} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => void patchStep("pareto_methodology", true)}
            className="text-sm text-yellow-300 hover:text-yellow-200 underline-offset-2 hover:underline"
          >
            I understand the 80/20 methodology
          </button>
          <button
            type="button"
            onClick={() => void completeGuide()}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all"
          >
            Finish quick start
          </button>
        </div>
      </section>
    </>
  )
}
