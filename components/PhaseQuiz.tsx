"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Trophy, CheckCircle2, AlertCircle, Lock } from "lucide-react"
import { useSession } from "@/components/providers/SessionProvider"

interface PhaseQuizProps {
  phaseNumber: number
  accentClass: string
}

interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
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

interface SubmissionResult {
  correctAnswers: number
  totalQuestions: number
  xpEarned: number
  details: Array<{
    questionId: string
    selectedIndex: number | null
    correctIndex: number
    isCorrect: boolean
    explanation: string
  }>
}

const AUTH_STORAGE_KEY = "auth_jwt"

export default function PhaseQuiz({ phaseNumber, accentClass }: PhaseQuizProps) {
  const { status } = useSession()
  const [quiz, setQuiz] = useState<QuizPayload | null>(null)
  const [progress, setProgress] = useState<ProgressPayload | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SubmissionResult | null>(null)

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false)
      return
    }

    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function loadQuiz() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/phase-progress/${phaseNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

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

  async function submitQuiz() {
    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!token || !quiz) return

    try {
      setSubmitting(true)
      setError(null)
      const res = await fetch(`/api/phase-progress/${phaseNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      })

      if (!res.ok) {
        throw new Error("Failed to submit quiz")
      }

      const payload = await res.json()
      setResult(payload.data.result)
      setProgress(payload.data.progress)
    } catch {
      setError("Quiz submission failed. Try again.")
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
            <h2 className="text-3xl font-bold text-white">Phase Quiz & XP</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Sign in to take the phase quiz, earn XP, and keep progress tied to your account.
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
              <Trophy className="w-4 h-4 text-yellow-400" />
              Phase quiz
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{quiz.title}</h2>
            <p className="text-gray-300">{quiz.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-full lg:min-w-[320px]">
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wide text-gray-400">Best XP</div>
              <div className="text-2xl font-bold text-white">{progress?.xpEarned ?? 0}</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wide text-gray-400">Best score</div>
              <div className="text-2xl font-bold text-white">
                {progress?.correctAnswers ?? 0}/{quiz.totalQuestions}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {index + 1}. {question.prompt}
              </h3>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => {
                  const questionResult = result?.details.find((item) => item.questionId === question.id)
                  const isSelected = answers[question.id] === optionIndex
                  const isCorrect = questionResult?.correctIndex === optionIndex
                  const showCorrect = Boolean(questionResult) && isCorrect
                  const showIncorrectSelection = Boolean(questionResult) && isSelected && !isCorrect

                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        showCorrect
                          ? "border-green-500/50 bg-green-500/10"
                          : showIncorrectSelection
                            ? "border-red-500/50 bg-red-500/10"
                            : isSelected
                              ? "border-cyan-500/50 bg-cyan-500/10"
                              : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={isSelected}
                        onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-200">{option}</span>
                    </label>
                  )
                })}
              </div>
              {result && (
                <div className={`mt-4 rounded-lg border p-4 ${result.details.find((item) => item.questionId === question.id)?.isCorrect ? "border-green-500/30 bg-green-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-white">
                    {result.details.find((item) => item.questionId === question.id)?.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                    Explanation
                  </div>
                  <p className="text-sm text-gray-300">
                    {result.details.find((item) => item.questionId === question.id)?.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mt-8">
          <div className="text-sm text-gray-400">
            {answeredCount}/{quiz.totalQuestions} answered • {quiz.xpPerCorrect} XP per correct answer
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
            {submitting ? "Submitting..." : "Submit for XP"}
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-slate-900/60 border border-slate-700 rounded-xl p-5">
            <h3 className="text-xl font-bold text-white mb-2">Attempt result</h3>
            <p className="text-gray-300">
              You scored <strong className="text-white">{result.correctAnswers}/{result.totalQuestions}</strong> and earned{" "}
              <strong className="text-yellow-300">{result.xpEarned} XP</strong> for this attempt.
              Best stored XP for this phase: <strong className="text-white">{progress?.xpEarned ?? result.xpEarned}</strong>.
            </p>
          </div>
        )}

        {error && quiz && (
          <div className="mt-4 text-sm text-red-300">{error}</div>
        )}
      </div>
    </section>
  )
}
