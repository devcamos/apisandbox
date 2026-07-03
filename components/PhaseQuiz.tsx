"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { CheckCircle2, AlertCircle, Lock, Route, Target, TrendingUp } from "lucide-react"
import { authApiRequestInit } from "@/lib/auth/client-fetch"
import { useSession } from "@/components/providers/SessionProvider"
import { masteryLabel, masterySummary, recommendedRedirects } from "@/lib/learning/phase-quiz-insights"

interface PhaseQuizProps {
  phaseNumber: number
  accentClass: string
}

const phaseNextSteps: Record<number, { href: string; cta: string; note: string }> = {
  0: {
    href: "/phase-1",
    cta: "Continue to Phase 1",
    note: "Phase 1 is also free and builds directly on these fundamentals.",
  },
  1: {
    href: "/phase-2",
    cta: "Continue to Phase 2",
    note: "Phase 2 turns these standards and patterns into real third-party integration practice.",
  },
  2: {
    href: "/phase-3",
    cta: "Continue to Phase 3",
    note: "Phase 3 shifts from single integrations to service-to-service communication and observability.",
  },
  3: {
    href: "/phase-4",
    cta: "Continue to Phase 4",
    note: "Phase 4 raises the bar from service mechanics to architecture-level judgement.",
  },
  4: {
    href: "/phase-5",
    cta: "Continue to Phase 5",
    note: "Phase 5 moves from architectural judgement into production-grade problem solving and execution.",
  },
  8: {
    href: "/phase-9",
    cta: "Continue to Phase 9",
    note: "Phase 9 grounds your API work in database fundamentals — transactions, indexes, and replicas.",
  },
}

interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  concept: string
}

interface QuizPayload {
  phaseNumber: number
  title: string
  description: string
  xpPerCorrect: number
  totalQuestions: number
  questions: QuizQuestion[]
}

interface ProgressPayload {
  xpEarned: number
  totalQuestions: number
  correctAnswers: number
  attempts: number
}

function quizOptionRowClass(showCorrect: boolean, showIncorrectSelection: boolean, isSelected: boolean) {
  if (showCorrect) return "border-green-500/50 bg-green-500/10"
  if (showIncorrectSelection) return "border-red-500/50 bg-red-500/10"
  if (isSelected) return "border-cyan-500/50 bg-cyan-500/10"
  return "border-slate-700 bg-slate-800/50 hover:border-slate-600"
}

function QuizOptionRow(props: Readonly<{
  option: string
  questionId: string
  isSelected: boolean
  showCorrect: boolean
  showIncorrectSelection: boolean
  onSelect: (questionId: string, option: string) => void
}>) {
  const { option, questionId, isSelected, showCorrect, showIncorrectSelection, onSelect } = props
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${quizOptionRowClass(
        showCorrect,
        showIncorrectSelection,
        isSelected,
      )}`}
    >
      <input
        type="radio"
        name={questionId}
        checked={isSelected}
        onChange={() => onSelect(questionId, option)}
        className="w-4 h-4"
      />
      <span className="text-gray-200">{option}</span>
    </label>
  )
}

function QuizQuestionBlock(props: Readonly<{
  question: QuizQuestion
  index: number
  answers: Record<string, string>
  result: SubmissionResult | null
  onSelectOption: (questionId: string, option: string) => void
}>) {
  const { question, index, answers, result, onSelectOption } = props
  const questionResult = result?.details.find((item) => item.questionId === question.id)

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        {index + 1}. {question.prompt}
      </h3>
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = answers[question.id] === option
          const isCorrect = questionResult?.correctAnswer === option
          const showCorrect = Boolean(questionResult) && isCorrect
          const showIncorrectSelection = Boolean(questionResult) && isSelected && !isCorrect

          return (
            <QuizOptionRow
              key={option}
              option={option}
              questionId={question.id}
              isSelected={isSelected}
              showCorrect={showCorrect}
              showIncorrectSelection={showIncorrectSelection}
              onSelect={onSelectOption}
            />
          )
        })}
      </div>
      {result && questionResult && (
        <div className={`mt-4 rounded-lg border p-4 ${questionResult.isCorrect ? "border-green-500/30 bg-green-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-white">
            {questionResult.isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
            Explanation
          </div>
          <p className="text-sm text-gray-300">{questionResult.explanation}</p>
        </div>
      )}
    </div>
  )
}

interface SubmissionResult {
  correctAnswers: number
  totalQuestions: number
  xpEarned: number
  details: Array<{
    questionId: string
    selectedAnswer: string | null
    correctAnswer: string
    isCorrect: boolean
    explanation: string
    concept: string
    redirect?: {
      href: string
      label: string
    } | null
  }>
}

export default function PhaseQuiz({ phaseNumber, accentClass }: PhaseQuizProps) {
  const { status } = useSession()
  const [quiz, setQuiz] = useState<QuizPayload | null>(null)
  const [progress, setProgress] = useState<ProgressPayload | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SubmissionResult | null>(null)

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false)
      return
    }

    let cancelled = false

    async function loadQuiz() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/phase-progress/${phaseNumber}`, authApiRequestInit())

        if (!res.ok) {
          throw new Error("Failed to load quiz")
        }

        const payload = await res.json()
        if (cancelled) return
        setQuiz(payload.data.quiz)
        setProgress(payload.data.progress)
      } catch {
        if (!cancelled) {
          setError("Unable to load quiz right now.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadQuiz()

    return () => {
      cancelled = true
    }
  }, [phaseNumber, status])

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])
  const mastery = useMemo(() => {
    if (!result) return null
    return {
      label: masteryLabel(result.correctAnswers, result.totalQuestions),
      ...masterySummary(result.details),
      redirects: recommendedRedirects(result.details),
    }
  }, [result])
  const nextStep = phaseNextSteps[phaseNumber] ?? null

  const selectQuizOption = useCallback((questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }, [])

  async function submitQuiz() {
    if (!quiz) return

    try {
      setSubmitting(true)
      setError(null)
      const res = await fetch(
        `/api/phase-progress/${phaseNumber}`,
        authApiRequestInit({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        }),
      )

      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        const message =
          payload?.error?.message ??
          (res.status === 401 ? "Session expired — sign in again." : "Failed to submit quiz")
        throw new Error(message)
      }

      setResult(payload.data.result)
      setProgress(payload.data.progress)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Quiz submission failed. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (status !== "authenticated") {
    return (
      <section className="mb-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Phase mastery checkpoint</h2>
            </div>
          <p className="text-gray-300 mb-4">
            Sign in to run the checkpoint, see where your understanding is strong, and keep progress tied to your account.
          </p>
          <Link
            href="/login"
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r ${accentClass} text-white font-semibold`}
          >
            Sign in to track progress
          </Link>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="mb-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-gray-300">
          Loading phase quiz...
        </div>
      </section>
    )
  }

  if (error && !quiz) {
    return (
      <section className="mb-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-red-200">
          {error}
        </div>
      </section>
    )
  }

  if (!quiz) return null

  return (
    <section className="mb-12">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-gray-300 mb-3">
              <Target className="w-4 h-4 text-cyan-400" />
              Mastery checkpoint
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{quiz.title}</h2>
            <p className="text-gray-300">{quiz.description}</p>
            <p className="text-sm text-slate-400 mt-3">
              Use this as a short diagnostic: retrieve what you know, inspect the explanations, then revisit weak spots before moving on.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-full lg:min-w-[320px]">
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wide text-gray-400">Best checkpoint</div>
              <div className="text-2xl font-bold text-white">
                {progress?.correctAnswers ?? 0}/{quiz.totalQuestions}
              </div>
            </div>
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wide text-gray-400">Attempts</div>
              <div className="text-2xl font-bold text-white">
                {progress?.attempts ?? 0}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <QuizQuestionBlock
              key={question.id}
              question={question}
              index={index}
              answers={answers}
              result={result}
              onSelectOption={selectQuizOption}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mt-8">
          <div className="text-sm text-gray-400">
            {answeredCount}/{quiz.totalQuestions} answered • short diagnostic, scenario-first, explanation-heavy
          </div>
          <button
            onClick={() => void submitQuiz()}
            disabled={answeredCount !== quiz.totalQuestions || submitting}
            className={`px-6 py-3 rounded-xl text-white font-semibold transition-all ${
              answeredCount === quiz.totalQuestions && !submitting
                ? `bg-gradient-to-r ${accentClass}`
                : "bg-slate-700 cursor-not-allowed"
            }`}
          >
            {submitting ? "Checking..." : "Check my understanding"}
          </button>
        </div>

        {result && (
          <div className="mt-6 space-y-6">
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5">
              <h3 className="text-xl font-bold text-white mb-2">Checkpoint result</h3>
            <p className="text-gray-300">
              You got <strong className="text-white">{result.correctAnswers}/{result.totalQuestions}</strong> correct.
              Current reading: <strong className="text-cyan-200">{mastery?.label}</strong>.
            </p>
            {mastery ? (
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Stronger areas
                  </div>
                  <div className="text-sm text-gray-300">
                    {mastery.strengths.length ? mastery.strengths.join(", ") : "No clear strengths yet from this attempt."}
                  </div>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    Revisit next
                  </div>
                  <div className="text-sm text-gray-300">
                    {mastery.gaps.length ? mastery.gaps.join(", ") : "No urgent gaps from this attempt."}
                  </div>
                </div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <Route className="w-4 h-4 text-cyan-400" />
                    Best next move
                  </div>
                  <div className="flex flex-col gap-2">
                    {mastery.redirects.length ? (
                      mastery.redirects.map((redirect) => (
                        <Link
                          key={redirect.href}
                          href={redirect.href}
                          className="inline-flex items-center rounded-lg border border-cyan-500/20 bg-slate-950/40 px-3 py-2 text-sm text-cyan-100 hover:bg-slate-900/70 transition-colors"
                        >
                          {redirect.label}
                        </Link>
                      ))
                    ) : (
                      <span className="text-sm text-gray-300">Move on to the next phase or retake this checkpoint later.</span>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
            </div>

            {nextStep ? (
              <div className="rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/15 to-emerald-500/15 p-6">
                <h3 className="text-2xl font-bold text-white mb-3">✅ What&apos;s Next?</h3>
                <p className="text-gray-300 mb-4">
                  {mastery?.label === "Ready for the next phase"
                    ? "You have enough signal from this checkpoint to move forward. Keep the explanations in mind and build on them in the next phase."
                    : "You can move forward, but the strongest path is to review the flagged concepts first, then continue once the weak spots feel mechanical instead of fuzzy."}
                </p>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <Link
                    href={nextStep.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-6 py-3 text-white font-semibold transition-all ${accentClass}`}
                  >
                    {nextStep.cta}
                  </Link>
                  <span className="text-sm text-gray-300">{nextStep.note}</span>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {error && quiz && (
          <div className="mt-4 text-sm text-red-300">{error}</div>
        )}
      </div>
    </section>
  )
}
