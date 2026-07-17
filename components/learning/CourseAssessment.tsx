"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useState } from "react"
import { CheckCircle2, CircleAlert, ClipboardCheck, LoaderCircle } from "lucide-react"
import { useSession } from "@/components/providers/SessionProvider"
import { authApiJsonInit, authApiRequestInit, type AuthApiEnvelope } from "@/lib/auth/client-fetch"
import type { AssessmentGrade, SanitizedAssessmentDefinition } from "@/lib/learning/api-foundations-course"

interface AssessmentProgress {
  bestCorrectAnswers: number
  totalQuestions: number
  attempts: number
  completedAt: string | null
}

interface AssessmentResult {
  progress: AssessmentProgress
  result: AssessmentGrade
  improved: boolean
}

interface AssessmentResponse {
  assessment: SanitizedAssessmentDefinition
  progress: AssessmentProgress | null
}

export function CourseAssessment({
  courseId,
  unitId,
  assessment,
}: Readonly<{
  courseId: string
  unitId: string
  assessment: SanitizedAssessmentDefinition
}>) {
  const { status } = useSession()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [reflection, setReflection] = useState("")
  const [progress, setProgress] = useState<AssessmentProgress | null>(null)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState("")

  const endpoint = `/api/learning/assessments/${encodeURIComponent(courseId)}/${encodeURIComponent(unitId)}`
  const completed = useMemo(
    () => assessment.questions.every((question) => Boolean(answers[question.id])),
    [answers, assessment.questions],
  )

  useEffect(() => {
    if (status !== "authenticated") return
    let cancelled = false

    async function loadProgress() {
      const response = await fetch(endpoint, authApiRequestInit()).catch(() => null)
      if (!response?.ok || cancelled) return
      const payload = (await response.json().catch(() => null)) as AuthApiEnvelope<AssessmentResponse> | null
      if (!cancelled) setProgress(payload?.data?.progress ?? null)
    }

    void loadProgress()
    return () => {
      cancelled = true
    }
  }, [endpoint, status])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!completed || loading) return

    setLoading(true)
    setLoadError("")
    const response = await fetch(endpoint, authApiJsonInit({ answers })).catch(() => null)
    const payload = (await response?.json().catch(() => null)) as AuthApiEnvelope<AssessmentResult> | null
    setLoading(false)

    if (!response?.ok || !payload?.data) {
      setLoadError(payload?.error?.message ?? "We could not save that assessment. Please try again.")
      return
    }

    setResult(payload.data)
    setProgress(payload.data.progress)
  }

  if (status === "unauthenticated") {
    return (
      <section className="rounded-2xl border border-violet-400/25 bg-violet-400/5 p-6" aria-labelledby="assessment-title">
        <ClipboardCheck className="h-6 w-6 text-violet-300" />
        <h2 id="assessment-title" className="mt-3 text-xl font-bold text-white">{assessment.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">Sign in to take the unit assessment and keep your best result.</p>
        <Link href={`/login?callbackUrl=${encodeURIComponent(`/learn/api-foundations/${unitId}`)}`} className="mt-4 inline-flex rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">
          Sign in to assess understanding
        </Link>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-violet-400/25 bg-violet-400/5 p-5 sm:p-6" aria-labelledby="assessment-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            <ClipboardCheck className="h-4 w-4" />
            Unit assessment
          </div>
          <h2 id="assessment-title" className="mt-2 text-xl font-bold text-white">{assessment.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">{assessment.description}</p>
        </div>
        {progress ? (
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-300">
            Best: <span className="font-semibold text-white">{progress.bestCorrectAnswers}/{progress.totalQuestions}</span> · {progress.attempts} attempt{progress.attempts === 1 ? "" : "s"}
          </div>
        ) : null}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-6">
        {assessment.questions.map((question, questionIndex) => (
          <fieldset key={question.id} className="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
            <legend className="px-1 text-sm font-semibold leading-6 text-white">{questionIndex + 1}. {question.prompt}</legend>
            <div className="mt-3 grid gap-2">
              {question.options.map((option, optionIndex) => {
                const inputId = `${question.id}-${optionIndex}`
                return (
                  <label key={option} htmlFor={inputId} className={`flex cursor-pointer gap-3 rounded-lg border p-3 text-sm transition-colors ${answers[question.id] === option ? "border-violet-300 bg-violet-400/10 text-white" : "border-slate-700 text-slate-300 hover:border-slate-500"}`}>
                    <input id={inputId} type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} className="mt-0.5 accent-violet-400" />
                    <span>{option}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}

        <div>
          <label htmlFor={`${unitId}-reflection`} className="text-sm font-semibold text-white">Explain it back <span className="font-normal text-slate-400">(not graded or saved)</span></label>
          <p className="mt-1 text-sm text-slate-400">{assessment.reflectionPrompt}</p>
          <textarea id={`${unitId}-reflection`} value={reflection} onChange={(event) => setReflection(event.target.value)} rows={4} className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/50 p-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-300 focus:outline-none" placeholder="Teach the idea back in your own words…" />
        </div>

        {loadError ? <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">{loadError}</p> : null}

        <button type="submit" disabled={!completed || loading || status !== "authenticated"} className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
          Check my understanding
        </button>
      </form>

      {result ? (
        <div className={`mt-6 rounded-xl border p-4 ${result.result.mastered ? "border-emerald-400/30 bg-emerald-400/10" : "border-amber-400/30 bg-amber-400/10"}`}>
          <div className="flex gap-3">
            {result.result.mastered ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" /> : <CircleAlert className="h-5 w-5 shrink-0 text-amber-300" />}
            <div>
              <h3 className="font-semibold text-white">{result.result.mastered ? "Concept demonstrated" : "Keep the model moving"}</h3>
              <p className="mt-1 text-sm text-slate-200">You answered {result.result.correctAnswers}/{result.result.totalQuestions} correctly ({result.result.scorePercent}%). {result.result.mastered ? "80% is the demonstrated-understanding threshold." : "Revisit the explanations below, then try again when ready."}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {result.result.details.map((detail) => (
              <li key={detail.questionId} className="rounded-lg bg-slate-950/35 p-3 text-sm text-slate-200">
                <span className={detail.correct ? "font-semibold text-emerald-300" : "font-semibold text-amber-300"}>{detail.correct ? "Understood" : `Review: ${detail.reviewLabel}`}</span>
                <p className="mt-1 leading-5 text-slate-300">{detail.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
