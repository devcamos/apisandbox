"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, CheckCircle2, Circle, LoaderCircle } from "lucide-react"
import { useSession } from "@/components/providers/SessionProvider"
import { authApiRequestInit, type AuthApiEnvelope } from "@/lib/auth/client-fetch"
import type { AwsCertificationTrack } from "@/lib/learning/aws-certification-course"

interface CourseAssessmentSummary {
  totalUnits: number
  attemptedUnits: number
  masteredUnits: number
  percent: number
  unitProgress: Array<{
    unitId: string
    bestCorrectAnswers: number
    totalQuestions: number
    attempts: number
  }>
}

interface AwsProgressUnit {
  id: string
  questionCount: number
  kind?: "capability" | "domain-exam"
}

const accentClasses = {
  sky: { text: "text-sky-200", fill: "bg-sky-400" },
  orange: { text: "text-orange-200", fill: "bg-orange-400" },
  violet: { text: "text-violet-200", fill: "bg-violet-400" },
} as const

export function AwsCertificationProgress({
  courseId,
  units,
  accent,
}: Readonly<{
  courseId: string
  units: AwsProgressUnit[]
  accent: AwsCertificationTrack["accent"]
}>) {
  const { status } = useSession()
  const [summary, setSummary] = useState<CourseAssessmentSummary | null>(null)
  const [loadError, setLoadError] = useState(false)
  const styles = accentClasses[accent]
  const totalQuestions = units.reduce((total, unit) => total + unit.questionCount, 0)
  const capabilityBased = units.some((unit) => unit.kind === "capability")
  const answeredQuestions = summary?.unitProgress.reduce((total, progress) => total + progress.bestCorrectAnswers, 0) ?? 0
  const questionPercent = totalQuestions === 0 ? 0 : Math.round((answeredQuestions / totalQuestions) * 100)

  useEffect(() => {
    if (status !== "authenticated") return
    let cancelled = false

    async function loadSummary() {
      const response = await fetch(`/api/learning/assessments/${encodeURIComponent(courseId)}`, authApiRequestInit()).catch(() => null)
      if (cancelled) return
      if (!response?.ok) {
        setLoadError(true)
        return
      }
      const payload = (await response.json().catch(() => null)) as AuthApiEnvelope<CourseAssessmentSummary> | null
      if (!payload?.data) {
        setLoadError(true)
        return
      }
      setLoadError(false)
      setSummary(payload.data)
    }

    void loadSummary()
    return () => {
      cancelled = true
    }
  }, [courseId, status])

  if (status === "loading") {
    return (
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-sm text-slate-400">
        <LoaderCircle className="h-4 w-4 animate-spin" /> Loading scored evidence…
      </div>
    )
  }

  if (status !== "authenticated") {
    return (
      <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/60 p-5" aria-label="Scored evidence">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className={`h-5 w-5 ${styles.text}`} />
            <span className="font-semibold text-white">Track scored evidence</span>
          </div>
          <Link href="/login" className={`text-sm font-semibold ${styles.text} hover:text-white`}>Sign in to save results</Link>
        </div>
        <p className="mt-2 text-sm text-slate-400">Only passed scored checkpoints count here; opening pages and watching content do not.</p>
      </section>
    )
  }

  const masteredUnits = summary?.masteredUnits ?? 0
  const attemptedUnits = summary?.attemptedUnits ?? 0
  const coursePercent = summary?.percent ?? 0

  return (
    <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/60 p-5 sm:p-6" aria-label={capabilityBased ? "Scored evidence" : "Question progress"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className={`h-5 w-5 ${styles.text}`} />
          <div>
            <h2 className="font-semibold text-white">{capabilityBased ? "Scored evidence" : "Question progress"}</h2>
            <p className="mt-1 text-sm text-slate-400">{capabilityBased ? "Pass capability and domain exams; practical artifacts remain separate evidence." : "Master each question set to complete the course."}</p>
          </div>
        </div>
        <div className={`text-2xl font-bold ${styles.text}`}>{coursePercent}%</div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <ProgressMetric
          label={capabilityBased ? "Passed checkpoints" : "Course mastery"}
          value={`${masteredUnits}/${units.length} ${capabilityBased ? "scored checkpoints" : "question sets"}`}
          percent={coursePercent}
          fill={styles.fill}
        />
        <ProgressMetric
          label="Best correct answers"
          value={`${answeredQuestions}/${totalQuestions} questions`}
          percent={questionPercent}
          fill={styles.fill}
        />
      </div>

      {loadError ? (
        <p role="alert" className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
          We couldn&apos;t load your saved progress. Your answers are still available below; please try again later.
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> {masteredUnits} mastered</span>
        <span className="inline-flex items-center gap-1.5"><Circle className="h-3.5 w-3.5 text-slate-500" /> {units.length - masteredUnits} remaining</span>
        <span>{attemptedUnits} attempted</span>
      </div>
    </section>
  )
}

function ProgressMetric({ label, value, percent, fill }: Readonly<{ label: string; value: string; percent: number; fill: string }>) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-slate-200">{label}</span>
        <span className="text-slate-400">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className={`h-full rounded-full transition-all ${fill}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
