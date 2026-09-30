"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Loader2, Settings2, Sparkles } from "lucide-react"
import { useSession } from "@/components/providers/SessionProvider"
import { authApiRequestInit } from "@/lib/auth/client-fetch"
import {
  getLearnerProfileLabels,
  getPersonalizedLearningPath,
  isLearnerProfileComplete,
  type LearnerProfileSelection,
} from "@/lib/learning/learner-profile"

type StoredProfile = LearnerProfileSelection & { onboardingCompletedAt: string | null }

export default function PersonalizedLearningPath() {
  const { status } = useSession()
  const [profile, setProfile] = useState<StoredProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false)
      return
    }
    if (status !== "authenticated") return

    async function loadProfile() {
      const response = await fetch("/api/profile", authApiRequestInit()).catch(() => null)
      if (!response?.ok) {
        setLoading(false)
        return
      }
      const payload = await response.json().catch(() => null)
      setProfile(payload?.data?.profile ?? null)
      setLoading(false)
    }

    void loadProfile()
  }, [status])

  const complete = profile ? isLearnerProfileComplete(profile) : false
  const labels = useMemo(() => profile ? getLearnerProfileLabels(profile) : null, [profile])
  const path = useMemo(() => profile ? getPersonalizedLearningPath(profile) : [], [profile])

  if (status !== "authenticated") return null

  if (loading) {
    return (
      <section className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/50 p-6 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
          Loading your engineering path
        </div>
      </section>
    )
  }

  if (!complete) {
    return (
      <section className="container mx-auto px-6 py-8">
        <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-400/10 via-slate-800/70 to-violet-400/10 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                <Sparkles className="h-4 w-4" /> Personalise your curriculum
              </div>
              <h2 className="mt-2 text-2xl font-bold text-white">Tell us your language and framework</h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                We will keep the engineering model universal, then map examples, assessments, and
                production decisions into the stack you use.
              </p>
            </div>
            <Link href="/onboarding" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300">
              Build my path <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-6 py-8">
      <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Your engineering path
            </div>
            <h2 className="mt-2 text-3xl font-bold text-white">{labels?.framework} · {labels?.experience}</h2>
            <p className="mt-2 text-slate-300">Goal: {labels?.goal} · Context: {labels?.runtime} · {labels?.cloud}</p>
          </div>
          <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700">
            <Settings2 className="h-4 w-4" /> Edit profile
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {path.map((step) => (
            <Link key={step.id} href={step.href} className="group rounded-xl border border-slate-700 bg-slate-950/60 p-5 transition-colors hover:border-cyan-400/50">
              <div className="text-xs font-semibold uppercase tracking-wide text-cyan-200">{step.label}</div>
              <h3 className="mt-2 text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 min-h-16 text-sm text-slate-400">{step.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
                Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
