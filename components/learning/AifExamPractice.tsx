"use client"

import Link from "next/link"
import { useMemo, useState, type FormEvent } from "react"
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  LoaderCircle,
  Target,
} from "lucide-react"
import type { AifC01DomainId } from "@/lib/learning/aws-ai-practitioner-mastery"
import type {
  AifExamPracticeSessionGrade,
  AifQuestionBankSummary,
  SanitizedAifExamQuestion,
} from "@/lib/learning/aif-c01-question-bank"

type PracticeFilter = "all" | "metrics" | AifC01DomainId

const DOMAIN_FILTERS: Array<{ id: PracticeFilter; label: string }> = [
  { id: "all", label: "All domains" },
  { id: "metrics", label: "D1 metrics focus" },
  { id: "ai-ml-fundamentals", label: "Domain 1 · AI/ML" },
  { id: "genai-fundamentals", label: "Domain 2 · GenAI" },
  { id: "foundation-models", label: "Domain 3 · Foundation models" },
  { id: "responsible-ai", label: "Domain 4 · Responsible AI" },
  { id: "ai-security", label: "Domain 5 · Security" },
]

function toggleSelection(
  current: string[] | undefined,
  optionId: string,
  mode: "single" | "multi",
): string[] {
  if (mode === "single") return [optionId]
  const existing = current ?? []
  return existing.includes(optionId)
    ? existing.filter((id) => id !== optionId)
    : [...existing, optionId]
}

export function AifExamPractice({
  questions,
  summary,
  initialFilter,
}: Readonly<{
  questions: SanitizedAifExamQuestion[]
  summary: AifQuestionBankSummary
  initialFilter: PracticeFilter
}>) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [result, setResult] = useState<AifExamPracticeSessionGrade | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const resultByQuestion = useMemo(() => {
    const map = new Map<string, AifExamPracticeSessionGrade["details"][number]>()
    for (const detail of result?.details ?? []) {
      map.set(detail.questionId, detail)
    }
    return map
  }, [result])

  const completed = questions.every((question) => {
    const selected = answers[question.id] ?? []
    return selected.length === question.selectCount
  })

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!completed || loading || questions.length === 0) return

    setLoading(true)
    setError("")
    setResult(null)

    const response = await fetch("/api/learning/aif-c01-practice/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionIds: questions.map((question) => question.id),
        answers,
      }),
    }).catch(() => null)

    const payload = (await response?.json().catch(() => null)) as
      | { data?: AifExamPracticeSessionGrade; error?: { message?: string } }
      | null

    setLoading(false)

    if (!response?.ok || !payload?.data) {
      setError(payload?.error?.message ?? "We could not grade that set. Please try again.")
      return
    }

    setResult(payload.data)
  }

  function resetAnswers() {
    setAnswers({})
    setResult(null)
    setError("")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-400" />
        <div className="container mx-auto max-w-5xl px-6 py-10 sm:py-12">
          <Link
            href="/cloud/aws/certifications/ai-practitioner"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            AI Practitioner track
          </Link>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200">
            <Target className="h-3.5 w-3.5" />
            AIF-C01 practice · bank v{summary.version}
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Exam-style practice
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Original multiple-choice and multiple-response questions mapped to the five official
            AIF-C01 domains. Submit a set to see plain-English explanations for every option.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5">
              {summary.totalQuestions} questions in bank
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5">
              {summary.multiResponseCount} multi-response
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5">
              {summary.metricsTopicCount} metrics-focused
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5">
              Showing {questions.length} now
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-6 py-8 sm:py-10">
        <section
          aria-label="Practice filters"
          className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            Choose a focus
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DOMAIN_FILTERS.map((filter) => {
              const active = filter.id === initialFilter
              const href =
                filter.id === "all"
                  ? "/cloud/aws/certifications/ai-practitioner/practice"
                  : `/cloud/aws/certifications/ai-practitioner/practice?filter=${encodeURIComponent(filter.id)}`
              return (
                <Link
                  key={filter.id}
                  href={href}
                  onClick={resetAnswers}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    active
                      ? "border-violet-300 bg-violet-400/15 text-white"
                      : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {filter.label}
                </Link>
              )
            })}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Timed full mocks and weak-area tracking come in later tickets. This view grades a short
            practice set with instant feedback.
          </p>
        </section>

        {questions.length === 0 ? (
          <p className="mt-8 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            No questions matched that filter. Try another domain.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-6">
            {questions.map((question, index) => {
              const selected = answers[question.id] ?? []
              const detail = resultByQuestion.get(question.id)
              const inputType = question.format === "single-choice" ? "radio" : "checkbox"
              return (
                <fieldset
                  key={question.id}
                  className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5"
                >
                  <legend className="px-1 text-sm font-semibold leading-6 text-white">
                    {index + 1}. {question.stem}
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-slate-500">
                    <span>{question.domainId}</span>
                    <span>·</span>
                    <span>Task {question.taskStatement}</span>
                    <span>·</span>
                    <span>{question.topic}</span>
                    <span>·</span>
                    <span>{question.difficulty}</span>
                    <span>·</span>
                    <span>
                      {question.format === "single-choice"
                        ? "Pick 1"
                        : `Pick ${question.selectCount}`}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2">
                    {question.options.map((option) => {
                      const optionResult = detail?.options.find(
                        (entry) => entry.optionId === option.id,
                      )
                      const checked = selected.includes(option.id)
                      let optionClass =
                        "border-slate-700 text-slate-300 hover:border-slate-500"
                      if (checked && !detail) {
                        optionClass = "border-violet-300 bg-violet-400/10 text-white"
                      }
                      if (optionResult?.correct) {
                        optionClass = "border-emerald-400/40 bg-emerald-400/10 text-emerald-50"
                      } else if (optionResult?.selected) {
                        optionClass = "border-amber-400/40 bg-amber-400/10 text-amber-50"
                      }

                      return (
                        <div key={option.id}>
                          <label
                            htmlFor={`${question.id}-${option.id}`}
                            className={`flex cursor-pointer gap-3 rounded-lg border p-3 text-sm transition-colors ${optionClass}`}
                          >
                            <input
                              id={`${question.id}-${option.id}`}
                              type={inputType}
                              name={question.id}
                              value={option.id}
                              checked={checked}
                              disabled={Boolean(detail)}
                              onChange={() =>
                                setAnswers((current) => ({
                                  ...current,
                                  [question.id]: toggleSelection(
                                    current[question.id],
                                    option.id,
                                    question.format === "single-choice" ? "single" : "multi",
                                  ),
                                }))
                              }
                              className="mt-0.5 accent-violet-400"
                            />
                            <span>
                              <span className="font-semibold text-slate-200">{option.id}.</span>{" "}
                              {option.text}
                            </span>
                          </label>
                          {optionResult ? (
                            <p className="mt-1.5 px-3 text-sm leading-6 text-slate-400">
                              {optionResult.explanation}
                            </p>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>

                  {detail ? (
                    <p
                      className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${
                        detail.correct ? "text-emerald-300" : "text-amber-300"
                      }`}
                    >
                      {detail.correct ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <CircleAlert className="h-4 w-4" />
                      )}
                      {detail.correct ? "Correct" : "Review this one"}
                    </p>
                  ) : null}
                </fieldset>
              )
            })}

            {error ? (
              <p
                role="alert"
                className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100"
              >
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={!completed || loading || Boolean(result)}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <ClipboardCheck className="h-4 w-4" />
                )}
                Submit practice set
              </button>
              {result ? (
                <Link
                  href={
                    initialFilter === "all"
                      ? `/cloud/aws/certifications/ai-practitioner/practice?set=${Date.now()}`
                      : `/cloud/aws/certifications/ai-practitioner/practice?filter=${encodeURIComponent(initialFilter)}&set=${Date.now()}`
                  }
                  onClick={resetAnswers}
                  className="inline-flex rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-400"
                >
                  New set
                </Link>
              ) : null}
            </div>
          </form>
        )}

        {result ? (
          <div
            className={`mt-8 rounded-2xl border p-5 ${
              result.scorePercent >= 80
                ? "border-emerald-400/30 bg-emerald-400/10"
                : "border-amber-400/30 bg-amber-400/10"
            }`}
          >
            <h2 className="text-xl font-bold text-white">Practice result</h2>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              You answered {result.correctCount}/{result.totalQuestions} correctly (
              {result.scorePercent}%). Explanations for every option are shown above.
            </p>
          </div>
        ) : null}

        <p className="mt-10 text-xs leading-5 text-slate-500">
          API Sandbox (NEXUS MOTIVUS LTD) provides original preparation content and does not issue
          AWS certifications or guarantee exam outcomes.
        </p>
      </div>
    </main>
  )
}
