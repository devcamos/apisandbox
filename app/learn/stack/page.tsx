"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle2, Code2, Layers3, Loader2, Settings2 } from "lucide-react"
import { useSession } from "@/components/providers/SessionProvider"
import { authApiRequestInit } from "@/lib/auth/client-fetch"
import {
  getLearnerProfileLabels,
  getStackBlueprint,
  isLearnerProfileComplete,
  type LearnerProfileSelection,
} from "@/lib/learning/learner-profile"

type StoredProfile = LearnerProfileSelection & { onboardingCompletedAt: string | null }

export default function StackFoundationPage() {
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
      if (response?.ok) {
        const payload = await response.json().catch(() => null)
        setProfile(payload?.data?.profile ?? null)
      }
      setLoading(false)
    }

    void loadProfile()
  }, [status])

  const complete = profile ? isLearnerProfileComplete(profile) : false
  const labels = useMemo(() => profile ? getLearnerProfileLabels(profile) : null, [profile])
  const blueprint = useMemo(() => getStackBlueprint(profile?.primaryFramework ?? null), [profile])

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-300" /> Loading your stack foundation
        </div>
      </main>
    )
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <section className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="text-3xl font-bold">Sign in to open your stack foundation</h1>
          <Link href="/login?callbackUrl=/learn/stack" className="mt-6 inline-flex rounded-lg bg-cyan-400 px-5 py-3 font-bold text-slate-950">Sign in</Link>
        </section>
      </main>
    )
  }

  if (!complete) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <section className="mx-auto max-w-3xl rounded-2xl border border-cyan-400/30 bg-slate-900 p-8">
          <Code2 className="h-8 w-8 text-cyan-300" />
          <h1 className="mt-4 text-3xl font-bold">Choose a language and framework first</h1>
          <p className="mt-3 text-slate-300">Your stack foundation maps each universal engineering concern into the tools you use.</p>
          <Link href="/onboarding" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 font-bold text-slate-950">
            Build my profile <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-100">
                <Layers3 className="h-4 w-4" /> Stack foundation
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{labels?.framework} with {labels?.language}</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                The framework is an implementation vocabulary. The underlying runtime, HTTP,
                contract, failure, testing, and operational concerns remain universal.
              </p>
            </div>
            <Link href="/onboarding" className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800">
              <Settings2 className="h-4 w-4" /> Change stack
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4"><div className="text-xs uppercase tracking-wide text-slate-400">Level</div><div className="mt-1 font-bold">{labels?.experience}</div></div>
            <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4"><div className="text-xs uppercase tracking-wide text-slate-400">Runtime</div><div className="mt-1 font-bold">{labels?.runtime}</div></div>
            <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4"><div className="text-xs uppercase tracking-wide text-slate-400">Cloud</div><div className="mt-1 font-bold">{labels?.cloud}</div></div>
          </div>
        </header>

        <section className="py-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200"><Code2 className="h-4 w-4" /> Concept-to-framework map</div>
            <h2 className="mt-2 text-3xl font-bold">What your framework is doing for you</h2>
            <p className="mt-3 text-slate-400">Learn each abstraction together with the production responsibility it cannot remove.</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blueprint.map((item, index) => (
              <article key={item.concept} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-cyan-200">{index + 1} · {item.concept}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                </div>
                <h3 className="mt-3 text-lg font-bold">{item.implementation}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 pb-12 lg:grid-cols-2">
          <Link href="/learn/api-foundations" className="group rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-6 hover:border-emerald-300/50">
            <BookOpen className="h-6 w-6 text-emerald-300" />
            <h2 className="mt-3 text-xl font-bold">Validate the universal foundation</h2>
            <p className="mt-2 text-slate-300">Trace the request before relying on framework abstractions.</p>
            <div className="mt-4 inline-flex items-center gap-2 font-semibold text-emerald-200">Open API Foundations <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
          </Link>
          <Link href="/dashboard" className="group rounded-xl border border-cyan-400/25 bg-cyan-400/10 p-6 hover:border-cyan-300/50">
            <Layers3 className="h-6 w-6 text-cyan-300" />
            <h2 className="mt-3 text-xl font-bold">Continue the enterprise path</h2>
            <p className="mt-2 text-slate-300">Return to your recommended production and architecture sequence.</p>
            <div className="mt-4 inline-flex items-center gap-2 font-semibold text-cyan-200">Open dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
          </Link>
        </section>
      </div>
    </main>
  )
}
