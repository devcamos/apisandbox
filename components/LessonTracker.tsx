"use client"

import { useEffect, useMemo, useState } from "react"
import { BookOpen, CheckCircle2, Circle, Target, X } from "lucide-react"
import { getPhaseLessonPlan } from "@/lib/lessons/phase-lessons"
import { useSession } from "@/components/providers/SessionProvider"

interface CheckpointProgress {
  done: boolean
  answer: string
  evidence: string
}

type ProgressState = Record<string, Record<string, CheckpointProgress>>

interface LessonTrackerProps {
  phase: number
}

function progressKey(phase: number, userKey: string) {
  return `lesson-progress:v1:${phase}:${userKey}`
}

export function LessonTracker({ phase }: LessonTrackerProps) {
  const plan = getPhaseLessonPlan(phase)
  const { data: session } = useSession()
  const userKey = session?.user?.id || session?.user?.email || "anonymous"
  const storageKey = progressKey(phase, userKey)
  const [progress, setProgress] = useState<ProgressState>({})
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !plan) return
    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      setProgress({})
      return
    }
    try {
      const parsed = JSON.parse(raw) as ProgressState
      setProgress(parsed || {})
    } catch {
      setProgress({})
    }
  }, [storageKey, plan])

  useEffect(() => {
    if (typeof window === "undefined" || !plan) return
    localStorage.setItem(storageKey, JSON.stringify(progress))
  }, [progress, storageKey, plan])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const { total, completed } = useMemo(() => {
    if (!plan) return { total: 0, completed: 0 }
    let t = 0
    let c = 0
    for (const module of plan.modules) {
      for (const checkpoint of module.checkpoints) {
        t += 1
        if (progress[module.id]?.[checkpoint.id]?.done) c += 1
      }
    }
    return { total: t, completed: c }
  }, [plan, progress])

  if (!plan) return null

  const toggle = (moduleId: string, checkpointId: string) => {
    const state = progress[moduleId]?.[checkpointId]
    if (!state || !state.answer.trim() || !state.evidence.trim()) return
    setProgress((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || {}),
        [checkpointId]: {
          ...state,
          done: !state.done,
        },
      },
    }))
  }

  const updateAnswer = (moduleId: string, checkpointId: string, answer: string) => {
    setProgress((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || {}),
        [checkpointId]: {
          done: prev[moduleId]?.[checkpointId]?.done || false,
          answer,
          evidence: prev[moduleId]?.[checkpointId]?.evidence || "",
        },
      },
    }))
  }

  const updateEvidence = (moduleId: string, checkpointId: string, evidence: string) => {
    setProgress((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || {}),
        [checkpointId]: {
          done: prev[moduleId]?.[checkpointId]?.done || false,
          answer: prev[moduleId]?.[checkpointId]?.answer || "",
          evidence,
        },
      },
    }))
  }

  const reset = () => setProgress({})
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  const lessonComplete = total > 0 && completed === total

  return (
    <>
      <section className="mb-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-gray-300 mb-3">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Guided lesson
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{plan.title}</h2>
              <p className="text-sm text-gray-400">{plan.structureLabel}</p>
            </div>
            <div className="min-w-full lg:min-w-[320px]">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-300">Progress</span>
                <span className="text-white font-semibold">{completed}/{total} ({percent}%)</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${percent}%` }} />
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold"
              >
                {lessonComplete ? <CheckCircle2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                {lessonComplete ? "Review completed lesson" : "Open lesson"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative bg-slate-900 rounded-2xl border border-slate-700 max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideDown">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">{plan.title}</h2>
              </div>
              <p className="text-white/90 max-w-3xl">
                Work through each checkpoint. The lesson is complete only when every checkpoint is done.
              </p>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-132px)] p-8">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 mb-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Lesson Progress</h3>
                    <p className="text-sm text-gray-400">Each checkpoint requires an answer and project evidence before completion.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{completed}/{total}</div>
                      <div className={`text-sm font-semibold ${lessonComplete ? "text-green-400" : "text-gray-400"}`}>
                        {lessonComplete ? "Lesson complete" : "In progress"}
                      </div>
                    </div>
                    <button
                      onClick={reset}
                      className="text-xs text-gray-300 hover:text-white px-3 py-2 rounded-lg border border-slate-600 hover:border-slate-400"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="mt-4 h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${percent}%` }} />
                </div>
              </div>

              <div className="space-y-4">
                {plan.modules.map((module) => (
                  <div key={module.id} className="border border-slate-700 rounded-xl p-4 bg-slate-900/40">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                      <p className="text-sm text-orange-300 mt-1">{module.urgency}</p>
                    </div>
                    <div className="space-y-2">
                      {module.checkpoints.map((checkpoint) => {
                        const state = progress[module.id]?.[checkpoint.id] || {
                          done: false,
                          answer: "",
                          evidence: "",
                        }
                        const done = state.done
                        const canComplete = !!state.answer.trim() && !!state.evidence.trim()
                        const expectedLearning =
                          checkpoint.expectedLearning ||
                          "Explain the constraint, mechanism, and failure impact with a concrete example."
                        const answerGuide =
                          checkpoint.answerGuide ||
                          "Write a specific, measurable answer tied to your implementation."
                        const projectTask =
                          checkpoint.projectTask ||
                          "Complete one project step that proves this checkpoint."
                        return (
                          <div
                            key={checkpoint.id}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              done
                                ? "border-emerald-500/40 bg-emerald-500/10"
                                : "border-slate-700 bg-slate-800/40"
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="mt-0.5">
                                {done ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-slate-400" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                                  <span className="text-sm font-semibold text-cyan-300">{checkpoint.label}</span>
                                </div>
                                <p className="text-sm text-gray-300">{checkpoint.prompt}</p>
                                <p className="text-xs text-emerald-300 mt-2">Expected learning: {expectedLearning}</p>
                                <p className="text-xs text-amber-300 mt-1">Project step: {projectTask}</p>
                              </div>
                            </div>

                            <div className="ml-8 space-y-2">
                              <div>
                                <label className="text-xs text-gray-400">Your answer</label>
                                <textarea
                                  value={state.answer}
                                  onChange={(e) => updateAnswer(module.id, checkpoint.id, e.target.value)}
                                  className="w-full mt-1 p-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-gray-100"
                                  rows={2}
                                  placeholder={answerGuide}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-400">Project evidence</label>
                                <input
                                  value={state.evidence}
                                  onChange={(e) => updateEvidence(module.id, checkpoint.id, e.target.value)}
                                  className="w-full mt-1 p-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-gray-100"
                                  placeholder="What exactly did you build/test/change?"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => toggle(module.id, checkpoint.id)}
                                disabled={!canComplete}
                                className="text-xs px-3 py-2 rounded-md bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {done ? "Mark incomplete" : "Mark complete"}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
