"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Target,
  X,
  ChevronDown,
  ChevronRight,
  Focus,
  Timer,
} from "lucide-react"
import { getPhaseLessonPlan, type LessonCheckpoint } from "@/lib/lessons/phase-lessons"
import { useSession } from "@/components/providers/SessionProvider"

interface CheckpointProgress {
  done: boolean
  answer: string
  evidence: string
  serviceName: string
  endpointName: string
  criticalPathStep: string
  auditEvidence: string
  retrievalStep: number
  retrievalDueAt: string
}

type ProgressState = Record<string, Record<string, CheckpointProgress>>

interface LessonTrackerProps {
  phase: number
}

interface CompletionCheck {
  id: string
  label: string
  pass: boolean
}

const RETRIEVAL_INTERVAL_DAYS = [1, 3, 7, 14]

function progressKey(phase: number, userKey: string) {
  return `lesson-progress:v2:${phase}:${userKey}`
}

function emptyProgress(): CheckpointProgress {
  return {
    done: false,
    answer: "",
    evidence: "",
    serviceName: "",
    endpointName: "",
    criticalPathStep: "",
    auditEvidence: "",
    retrievalStep: 0,
    retrievalDueAt: "",
  }
}

function countBullets(value: string) {
  return value
    .split("\n")
    .filter((line) => /^\s*([-*•]|\d+\.)\s+/.test(line.trim())).length
}

function hasMeasurableDecision(value: string) {
  const measurablePattern =
    /(\b\d+(\.\d+)?\s?(ms|s|sec|seconds|minutes|m|hours|h|%|x)\b)|(\bp(95|99)\b)|(\bslo\b)|(\blatency\b)|(\berror rate\b)|(\bcost\b)/i
  return measurablePattern.test(value)
}

function hasFallbackPolicy(value: string) {
  return /(fallback|fail-open|fail-closed|graceful degradation|degrade|circuit breaker|retry budget|shed load|timeout)/i.test(value)
}

function checkpointTemplate(checkpoint: LessonCheckpoint) {
  return [
    "Risks:",
    "- ",
    "- ",
    "- ",
    "",
    "Failure modes:",
    "- ",
    "- ",
    "",
    "Fallback:",
    "- Primary fallback policy:",
    "- Trigger threshold (measurable):",
    "",
    "Micro-example:",
    `- ${checkpoint.label}: p95 increased from 220ms to 610ms under burst retries; fallback returned stale response for 90s.`,
  ].join("\n")
}

function getCompletionChecks(state: CheckpointProgress): CompletionCheck[] {
  const answer = state.answer.trim()
  return [
    { id: "answer", label: "Answer is provided", pass: answer.length > 0 },
    { id: "evidence", label: "Project evidence is provided", pass: state.evidence.trim().length > 0 },
    { id: "bullets", label: "Minimum 3 bullets", pass: countBullets(state.answer) >= 3 },
    { id: "measurable", label: "Contains 1 measurable decision", pass: hasMeasurableDecision(state.answer) },
    { id: "fallback", label: "Contains 1 explicit fallback policy", pass: hasFallbackPolicy(state.answer) },
  ]
}

function formatDueLabel(isoDate: string) {
  if (!isoDate) return "Not scheduled"
  const due = new Date(isoDate)
  const now = new Date()
  if (Number.isNaN(due.getTime())) return "Not scheduled"
  if (due.getTime() <= now.getTime()) return "Due now"
  return `Due ${due.toLocaleDateString()}`
}

function scheduleNextRetrieval(prevStep: number) {
  const boundedStep = Math.max(0, Math.min(prevStep, RETRIEVAL_INTERVAL_DAYS.length - 1))
  const nextStep = Math.min(boundedStep + 1, RETRIEVAL_INTERVAL_DAYS.length - 1)
  const days = RETRIEVAL_INTERVAL_DAYS[boundedStep]
  const dueAt = new Date()
  dueAt.setDate(dueAt.getDate() + days)
  return { nextStep, dueAt: dueAt.toISOString() }
}

export function LessonTracker({ phase }: LessonTrackerProps) {
  const plan = getPhaseLessonPlan(phase)
  const { data: session } = useSession()
  const userKey = session?.user?.id || session?.user?.email || "anonymous"
  const storageKey = progressKey(phase, userKey)
  const [progress, setProgress] = useState<ProgressState>({})
  const [isOpen, setIsOpen] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [focusIndex, setFocusIndex] = useState(0)
  const [flashcardMode, setFlashcardMode] = useState(false)
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({})

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

  const flatCheckpoints = useMemo(() => {
    if (!plan) return [] as Array<{ moduleId: string; checkpointId: string; moduleTitle: string; checkpoint: LessonCheckpoint }>
    return plan.modules.flatMap((module) =>
      module.checkpoints.map((checkpoint) => ({
        moduleId: module.id,
        moduleTitle: module.title,
        checkpointId: checkpoint.id,
        checkpoint,
      })),
    )
  }, [plan])

  const { total, completed } = useMemo(() => {
    if (!plan) return { total: 0, completed: 0 }
    let t = 0
    let c = 0
    for (const courseModule of plan.modules) {
      for (const checkpoint of courseModule.checkpoints) {
        t += 1
        if (progress[courseModule.id]?.[checkpoint.id]?.done) c += 1
      }
    }
    return { total: t, completed: c }
  }, [plan, progress])

  const moduleProgress = useMemo(() => {
    if (!plan) return new Map<string, { total: number; completed: number; percent: number }>()
    const map = new Map<string, { total: number; completed: number; percent: number }>()
    for (const courseModule of plan.modules) {
      const totalCheckpoints = courseModule.checkpoints.length
      const completedCheckpoints = courseModule.checkpoints.filter((cp) => progress[courseModule.id]?.[cp.id]?.done).length
      const percent = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0
      map.set(courseModule.id, { total: totalCheckpoints, completed: completedCheckpoints, percent })
    }
    return map
  }, [plan, progress])

  useEffect(() => {
    if (!plan || !focusMode) return
    if (focusIndex >= flatCheckpoints.length) {
      setFocusIndex(Math.max(0, flatCheckpoints.length - 1))
    }
  }, [flatCheckpoints, focusIndex, focusMode, plan])

  if (!plan) return null

  const getState = (moduleId: string, checkpointId: string) => progress[moduleId]?.[checkpointId] || emptyProgress()

  const patchState = (
    moduleId: string,
    checkpointId: string,
    patch: Partial<CheckpointProgress> | ((current: CheckpointProgress) => Partial<CheckpointProgress>),
  ) => {
    setProgress((prev) => {
      const current = prev[moduleId]?.[checkpointId] || emptyProgress()
      const nextPatch = typeof patch === "function" ? patch(current) : patch
      return {
        ...prev,
        [moduleId]: {
          ...(prev[moduleId] || {}),
          [checkpointId]: {
            ...current,
            ...nextPatch,
          },
        },
      }
    })
  }

  const toggleComplete = (moduleId: string, checkpoint: LessonCheckpoint) => {
    const state = getState(moduleId, checkpoint.id)
    const checks = getCompletionChecks(state)
    const isRetrieval = checkpoint.id === "retrieval"
    if (!state.done && !isRetrieval && checks.some((c) => !c.pass)) return

    patchState(moduleId, checkpoint.id, (current) => {
      if (current.done) {
        return { done: false }
      }

      if (isRetrieval) {
        const { nextStep, dueAt } = scheduleNextRetrieval(current.retrievalStep || 0)
        return { done: true, retrievalStep: nextStep, retrievalDueAt: dueAt }
      }

      return { done: true }
    })
  }

  const selfGradeRetrieval = (moduleId: string, checkpointId: string, passed: boolean) => {
    patchState(moduleId, checkpointId, (current) => {
      if (!passed) {
        return { done: false }
      }
      const { nextStep, dueAt } = scheduleNextRetrieval(current.retrievalStep || 0)
      return { done: true, retrievalStep: nextStep, retrievalDueAt: dueAt }
    })
  }

  const reset = () => setProgress({})
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  const lessonComplete = total > 0 && completed === total
  const focusItem = flatCheckpoints[focusIndex]

  const checkpointVisible = (moduleId: string, checkpointId: string) => {
    if (!focusMode || !focusItem) return true
    return moduleId === focusItem.moduleId && checkpointId === focusItem.checkpointId
  }

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
                <span className="text-white font-semibold">
                  {completed}/{total} ({percent}%)
                </span>
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
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            role="button"
            tabIndex={0}
            aria-label="Close lesson dialog"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setIsOpen(false)
              }
            }}
          />

          <div className="relative bg-slate-900 rounded-2xl border border-slate-700 max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideDown">
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
                Completion is objective: answer + evidence + 3 bullets + measurable decision + explicit fallback.
              </p>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-132px)] p-8">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 mb-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Lesson Progress</h3>
                    <p className="text-sm text-gray-400">Pattern-level and checkpoint-level progress with strict completion rules.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFocusMode((v) => !v)}
                      className={`text-xs px-3 py-2 rounded-lg border inline-flex items-center gap-2 ${
                        focusMode
                          ? "border-cyan-400/70 text-cyan-300 bg-cyan-500/10"
                          : "border-slate-600 text-gray-300 hover:text-white hover:border-slate-400"
                      }`}
                    >
                      <Focus className="w-3.5 h-3.5" />
                      {focusMode ? "Focus mode on" : "Focus mode"}
                    </button>
                    <button
                      onClick={() => setFlashcardMode((v) => !v)}
                      className={`text-xs px-3 py-2 rounded-lg border inline-flex items-center gap-2 ${
                        flashcardMode
                          ? "border-amber-400/70 text-amber-300 bg-amber-500/10"
                          : "border-slate-600 text-gray-300 hover:text-white hover:border-slate-400"
                      }`}
                    >
                      <Timer className="w-3.5 h-3.5" />
                      {flashcardMode ? "Flashcard mode on" : "Flashcard mode"}
                    </button>
                    <button
                      onClick={reset}
                      className="text-xs text-gray-300 hover:text-white px-3 py-2 rounded-lg border border-slate-600 hover:border-slate-400"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="mt-4 h-3 bg-slate-900 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${percent}%` }} />
                </div>

                <div className="grid md:grid-cols-3 gap-2 text-xs">
                  {flatCheckpoints.map((item, idx) => {
                    const done = getState(item.moduleId, item.checkpointId).done
                    return (
                      <button
                        key={`${item.moduleId}-${item.checkpointId}`}
                        onClick={() => {
                          setFocusMode(true)
                          setFocusIndex(idx)
                        }}
                        className={`text-left px-2 py-1 rounded border ${
                          done
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                            : "border-slate-700 bg-slate-900/40 text-gray-300 hover:border-slate-500"
                        }`}
                      >
                        {idx + 1}. {item.checkpoint.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {focusMode && focusItem && (
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-cyan-200">
                      Focusing: <strong>{focusItem.moduleTitle}</strong> · <strong>{focusItem.checkpoint.label}</strong> ({focusIndex + 1}/
                      {flatCheckpoints.length})
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFocusIndex((i) => Math.max(0, i - 1))}
                        disabled={focusIndex === 0}
                        className="text-xs px-3 py-1.5 rounded border border-cyan-500/40 text-cyan-200 disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setFocusIndex((i) => Math.min(flatCheckpoints.length - 1, i + 1))}
                        disabled={focusIndex >= flatCheckpoints.length - 1}
                        className="text-xs px-3 py-1.5 rounded border border-cyan-500/40 text-cyan-200 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {plan.modules.map((module) => {
                  const collapsed = collapsedModules[module.id] ?? false
                  const mp = moduleProgress.get(module.id) || { total: module.checkpoints.length, completed: 0, percent: 0 }
                  const showModule = !focusMode || module.id === focusItem?.moduleId
                  if (!showModule) return null
                  return (
                    <div key={module.id} className="border border-slate-700 rounded-xl p-4 bg-slate-900/40">
                      <div className="mb-3">
                        <button
                          onClick={() => setCollapsedModules((prev) => ({ ...prev, [module.id]: !collapsed }))}
                          className="w-full flex items-start justify-between gap-3 text-left"
                        >
                          <div>
                            <h3 className="text-lg font-semibold text-white inline-flex items-center gap-2">
                              {collapsed ? <ChevronRight className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                              {module.title}
                            </h3>
                            <p className="text-sm text-orange-300 mt-1">{module.urgency}</p>
                          </div>
                          <div className="text-xs text-gray-300">
                            {mp.completed}/{mp.total} ({mp.percent}%)
                          </div>
                        </button>
                        <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${mp.percent}%` }} />
                        </div>
                      </div>

                      {!collapsed && (
                        <div className="space-y-2">
                          {module.checkpoints.map((checkpoint) => {
                            if (!checkpointVisible(module.id, checkpoint.id)) return null

                            const state = getState(module.id, checkpoint.id)
                            const done = state.done
                            const checks = getCompletionChecks(state)
                            const incompleteReasons = checks.filter((c) => !c.pass).map((c) => c.label)
                            const isRetrieval = checkpoint.id === "retrieval"
                            const canComplete = isRetrieval ? true : incompleteReasons.length === 0

                            const expectedLearning =
                              checkpoint.expectedLearning ||
                              "Explain the constraint, mechanism, and failure impact with a concrete example."
                            const answerGuide =
                              checkpoint.answerGuide ||
                              "Write a specific, measurable answer tied to your implementation."
                            const projectTask = checkpoint.projectTask || "Complete one project step that proves this checkpoint."
                            const retrievalDue = formatDueLabel(state.retrievalDueAt)

                            return (
                              <div
                                key={checkpoint.id}
                                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                  done ? "border-emerald-500/40 bg-emerald-500/10" : "border-slate-700 bg-slate-800/40"
                                }`}
                              >
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="mt-0.5">{done ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-slate-400" />}</div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Target className="w-3.5 h-3.5 text-cyan-400" />
                                      <span className="text-sm font-semibold text-cyan-300">{checkpoint.label}</span>
                                      {isRetrieval && (
                                        <span className="text-[11px] px-2 py-0.5 rounded border border-amber-400/40 text-amber-300">
                                          {retrievalDue}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-300">{checkpoint.prompt}</p>
                                    {!flashcardMode || !isRetrieval ? (
                                      <>
                                        <p className="text-xs text-emerald-300 mt-2">Expected learning: {expectedLearning}</p>
                                        <p className="text-xs text-amber-300 mt-1">Project step: {projectTask}</p>
                                      </>
                                    ) : null}
                                  </div>
                                </div>

                                {flashcardMode && isRetrieval ? (
                                  <div className="ml-8 space-y-3">
                                    <div className="text-xs text-gray-300">Self-grade against rubric:</div>
                                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                                      {checks.map((check) => (
                                        <div key={check.id} className={`px-2 py-1 rounded border ${check.pass ? "border-emerald-500/40 text-emerald-300" : "border-slate-700 text-gray-400"}`}>
                                          {check.label}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => selfGradeRetrieval(module.id, checkpoint.id, false)}
                                        className="text-xs px-3 py-2 rounded-md border border-red-500/40 text-red-300"
                                      >
                                        Needs work
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => selfGradeRetrieval(module.id, checkpoint.id, true)}
                                        className="text-xs px-3 py-2 rounded-md bg-emerald-600 text-white"
                                      >
                                        Pass and schedule next review
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="ml-8 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label htmlFor={`lt-answer-${module.id}-${checkpoint.id}`} className="text-xs text-gray-400">Your answer</label>
                                      <button
                                        type="button"
                                        onClick={() => patchState(module.id, checkpoint.id, { answer: checkpointTemplate(checkpoint) })}
                                        className="text-[11px] px-2 py-1 rounded border border-slate-600 text-gray-300 hover:text-white"
                                      >
                                        Use template
                                      </button>
                                    </div>
                                    <textarea
                                      id={`lt-answer-${module.id}-${checkpoint.id}`}
                                      value={state.answer}
                                      onChange={(e) => patchState(module.id, checkpoint.id, { answer: e.target.value })}
                                      className="w-full mt-1 p-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-gray-100"
                                      rows={7}
                                      placeholder={`${answerGuide}\n\n${checkpointTemplate(checkpoint)}`}
                                    />

                                    <label className="block text-xs text-gray-400">
                                      Project evidence
                                      <input
                                        id={`lt-evidence-${module.id}-${checkpoint.id}`}
                                        value={state.evidence}
                                        onChange={(e) => patchState(module.id, checkpoint.id, { evidence: e.target.value })}
                                        className="w-full mt-1 p-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-gray-100"
                                        placeholder="What exactly did you build/test/change?"
                                      />
                                    </label>

                                    <div className="grid md:grid-cols-2 gap-2">
                                      <div>
                                        <label htmlFor={`lt-service-${module.id}-${checkpoint.id}`} className="text-xs text-gray-400">Service name</label>
                                        <input
                                          id={`lt-service-${module.id}-${checkpoint.id}`}
                                          value={state.serviceName}
                                          onChange={(e) => patchState(module.id, checkpoint.id, { serviceName: e.target.value })}
                                          className="w-full mt-1 p-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-gray-100"
                                          placeholder="billing-service"
                                        />
                                      </div>
                                      <div>
                                        <label htmlFor={`lt-endpoint-${module.id}-${checkpoint.id}`} className="text-xs text-gray-400">Endpoint / handler</label>
                                        <input
                                          id={`lt-endpoint-${module.id}-${checkpoint.id}`}
                                          value={state.endpointName}
                                          onChange={(e) => patchState(module.id, checkpoint.id, { endpointName: e.target.value })}
                                          className="w-full mt-1 p-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-gray-100"
                                          placeholder="POST /api/orders"
                                        />
                                      </div>
                                      <div>
                                        <label htmlFor={`lt-critical-${module.id}-${checkpoint.id}`} className="text-xs text-gray-400">Critical path step</label>
                                        <input
                                          id={`lt-critical-${module.id}-${checkpoint.id}`}
                                          value={state.criticalPathStep}
                                          onChange={(e) => patchState(module.id, checkpoint.id, { criticalPathStep: e.target.value })}
                                          className="w-full mt-1 p-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-gray-100"
                                          placeholder="checkout -> payment-authorize"
                                        />
                                      </div>
                                      <div>
                                        <label htmlFor={`lt-audit-${module.id}-${checkpoint.id}`} className="text-xs text-gray-400">Audit evidence (PR / runbook / test / dashboard)</label>
                                        <input
                                          id={`lt-audit-${module.id}-${checkpoint.id}`}
                                          value={state.auditEvidence}
                                          onChange={(e) => patchState(module.id, checkpoint.id, { auditEvidence: e.target.value })}
                                          className="w-full mt-1 p-2 rounded-md bg-slate-900 border border-slate-700 text-sm text-gray-100"
                                          placeholder="PR #412 · test: payment_idempotency_spec"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                      {checks.map((check) => (
                                        <div
                                          key={check.id}
                                          className={`px-2 py-1 rounded border ${
                                            check.pass ? "border-emerald-500/40 text-emerald-300" : "border-slate-700 text-gray-400"
                                          }`}
                                        >
                                          {check.label}
                                        </div>
                                      ))}
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => toggleComplete(module.id, checkpoint)}
                                      disabled={!done && !canComplete}
                                      className="text-xs px-3 py-2 rounded-md bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      {done ? "Mark incomplete" : "Mark complete"}
                                    </button>
                                    {!done && !canComplete && (
                                      <p className="text-xs text-rose-300">
                                        Cannot complete yet: {incompleteReasons[0]}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
