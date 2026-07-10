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
  ArrowRight,
  Clock,
  Bell,
  Trophy,
} from "lucide-react"
import { getPhaseLessonPlan, type LessonCheckpoint } from "@/lib/lessons/phase-lessons"
import {
  canCompleteCheckpoint,
  computeModuleStats,
  computeOverallStats,
  countReviewsDue,
  emptyCheckpointProgress,
  findNextIncomplete,
  getCompletionChecks,
  scheduleNextRetrieval,
  type CheckpointProgress,
  type LessonProgressState as ProgressState,
} from "@/lib/lessons/lesson-progress"
import { useSession } from "@/components/providers/SessionProvider"
import { authApiJsonInit, authApiRequestInit } from "@/lib/auth/client-fetch"
import { courseIdForPhase, hasAnyLessonProgress } from "@/lib/learning/progress-mapping"

interface LessonTrackerProps {
  phase: number
}

function progressKey(phase: number, userKey: string) {
  return `lesson-progress:v2:${phase}:${userKey}`
}

function metaKey(phase: number, userKey: string) {
  return `lesson-progress:v2:${phase}:${userKey}:updated`
}

function importKey(phase: number, userKey: string) {
  return `lesson-progress:v2:${phase}:${userKey}:server-imported`
}

function formatRelativeTime(isoDate: string) {
  if (!isoDate) return ""
  const then = new Date(isoDate)
  if (Number.isNaN(then.getTime())) return ""
  const diffMs = Date.now() - then.getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return then.toLocaleDateString()
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

function formatDueLabel(isoDate: string) {
  if (!isoDate) return "Not scheduled"
  const due = new Date(isoDate)
  const now = new Date()
  if (Number.isNaN(due.getTime())) return "Not scheduled"
  if (due.getTime() <= now.getTime()) return "Due now"
  return `Due ${due.toLocaleDateString()}`
}

export function LessonTracker({ phase }: LessonTrackerProps) {
  const plan = getPhaseLessonPlan(phase)
  const { data: session, status } = useSession()
  const userKey = session?.user?.id || session?.user?.email || "anonymous"
  const storageKey = progressKey(phase, userKey)
  const lastUpdatedStorageKey = metaKey(phase, userKey)
  const serverImportStorageKey = importKey(phase, userKey)
  const courseId = courseIdForPhase(phase)
  const [progress, setProgress] = useState<ProgressState>({})
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>("")
  const [serverHydrated, setServerHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [focusIndex, setFocusIndex] = useState(0)
  const [flashcardMode, setFlashcardMode] = useState(false)
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (globalThis.window === undefined || !plan) return
    let cancelled = false
    setServerHydrated(false)

    const readLocalProgress = (): ProgressState => {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return {}
      try {
        return (JSON.parse(raw) as ProgressState) || {}
      } catch {
        return {}
      }
    }

    const loadProgress = async () => {
      const localProgress = readLocalProgress()
      const localLastUpdated = localStorage.getItem(lastUpdatedStorageKey) ?? ""
      setLastUpdatedAt(localLastUpdated)

      if (status !== "authenticated") {
        if (!cancelled) {
          setProgress(localProgress)
          setServerHydrated(true)
        }
        return
      }

      const shouldImportLocal =
        hasAnyLessonProgress(localProgress) && !localStorage.getItem(serverImportStorageKey)
      if (shouldImportLocal) {
        const importResponse = await fetch(
          "/api/learning/progress",
          authApiJsonInit({ courseId, progress: localProgress }),
        ).catch(() => null)
        if (importResponse?.ok) {
          localStorage.setItem(serverImportStorageKey, "true")
        }
      }

      const response = await fetch(
        `/api/learning/progress?courseId=${encodeURIComponent(courseId)}`,
        authApiRequestInit(),
      ).catch(() => null)
      if (!response?.ok) {
        if (!cancelled) {
          setProgress(localProgress)
          setServerHydrated(true)
        }
        return
      }

      const payload = await response.json().catch(() => null)
      if (cancelled) return
      const serverProgress = payload?.data?.progress ?? {}
      setProgress(serverProgress)
      setLastUpdatedAt(payload?.data?.lastActivityAt ?? localLastUpdated)
      setServerHydrated(true)
    }

    void loadProgress()
    return () => {
      cancelled = true
    }
  }, [courseId, lastUpdatedStorageKey, plan, serverImportStorageKey, status, storageKey])

  useEffect(() => {
    if (globalThis.window === undefined || !plan || !serverHydrated) return
    localStorage.setItem(storageKey, JSON.stringify(progress))
  }, [progress, serverHydrated, storageKey, plan])

  useEffect(() => {
    if (
      globalThis.window === undefined ||
      !plan ||
      !serverHydrated ||
      status !== "authenticated" ||
      !hasAnyLessonProgress(progress)
    ) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void fetch(
        "/api/learning/progress",
        authApiJsonInit({ courseId, progress }),
      ).catch(() => null)
    }, 800)

    return () => window.clearTimeout(timeoutId)
  }, [courseId, progress, serverHydrated, status, plan])

  const markActivity = () => {
    const now = new Date().toISOString()
    setLastUpdatedAt(now)
    if (globalThis.window !== undefined) localStorage.setItem(lastUpdatedStorageKey, now)
  }

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

  const { total, completed, percent } = useMemo(
    () => (plan ? computeOverallStats(plan, progress) : { total: 0, completed: 0, percent: 0 }),
    [plan, progress],
  )

  const moduleStats = useMemo(() => (plan ? computeModuleStats(plan, progress) : []), [plan, progress])

  const moduleProgress = useMemo(() => {
    const map = new Map<string, { total: number; completed: number; percent: number }>()
    for (const stat of moduleStats) {
      map.set(stat.id, { total: stat.total, completed: stat.completed, percent: stat.percent })
    }
    return map
  }, [moduleStats])

  const nextIncomplete = useMemo(() => (plan ? findNextIncomplete(plan, progress) : null), [plan, progress])
  const reviewsDue = useMemo(() => (plan ? countReviewsDue(plan, progress) : 0), [plan, progress])

  useEffect(() => {
    if (!plan || !focusMode) return
    if (focusIndex >= flatCheckpoints.length) {
      setFocusIndex(Math.max(0, flatCheckpoints.length - 1))
    }
  }, [flatCheckpoints, focusIndex, focusMode, plan])

  if (!plan) return null

  const getState = (moduleId: string, checkpointId: string) => progress[moduleId]?.[checkpointId] || emptyCheckpointProgress()

  const patchState = (
    moduleId: string,
    checkpointId: string,
    patch: Partial<CheckpointProgress> | ((current: CheckpointProgress) => Partial<CheckpointProgress>),
  ) => {
    markActivity()
    setProgress((prev) => {
      const current = prev[moduleId]?.[checkpointId] || emptyCheckpointProgress()
      const nextPatch = typeof patch === "function" ? patch(current) : patch
      const moduleProgress = prev[moduleId] ?? {}
      return {
        ...prev,
        [moduleId]: {
          ...moduleProgress,
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
    const isRetrieval = checkpoint.id === "retrieval"
    if (!state.done && !canCompleteCheckpoint(checkpoint, state)) return

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

  const reset = () => {
    setProgress({})
    setLastUpdatedAt("")
    if (globalThis.window !== undefined) localStorage.removeItem(lastUpdatedStorageKey)
  }
  const lessonComplete = total > 0 && completed === total
  const focusItem = flatCheckpoints[focusIndex]

  const resumeAtNext = () => {
    if (nextIncomplete) {
      setFocusMode(true)
      setFocusIndex(nextIncomplete.index)
    }
    setIsOpen(true)
  }

  const checkpointVisible = (moduleId: string, checkpointId: string) => {
    if (!focusMode || !focusItem) return true
    return moduleId === focusItem.moduleId && checkpointId === focusItem.checkpointId
  }

  return (
    <>
      <section className="mb-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-gray-300 mb-3">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Guided lesson
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{plan.title}</h2>
              <p className="text-sm text-gray-400">{plan.structureLabel}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {lastUpdatedAt && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-gray-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Last activity {formatRelativeTime(lastUpdatedAt)}
                  </span>
                )}
                {reviewsDue > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <Bell className="w-3.5 h-3.5" />
                    {reviewsDue} review{reviewsDue > 1 ? "s" : ""} due
                  </span>
                )}
              </div>
            </div>
            <div className="min-w-full lg:min-w-[340px]">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-300">Overall progress</span>
                <span className="text-white font-semibold">
                  {completed}/{total} ({percent}%)
                </span>
              </div>
              <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden mb-4" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500" style={{ width: `${percent}%` }} />
              </div>

              {/* Per-module breakdown */}
              <div className="space-y-2.5 mb-4">
                {moduleStats.map((stat) => (
                  <div key={stat.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={stat.percent === 100 ? "text-emerald-300" : "text-gray-300"}>
                        {stat.percent === 100 && <CheckCircle2 className="inline w-3 h-3 mr-1 -mt-0.5" />}
                        {stat.title}
                      </span>
                      <span className="text-gray-400 tabular-nums">{stat.completed}/{stat.total}</span>
                    </div>
                    <div className="h-1.5 bg-slate-700/70 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${stat.percent === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-cyan-500 to-emerald-500"}`}
                        style={{ width: `${stat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {lessonComplete ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 mb-3 flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-emerald-300 shrink-0" />
                  <p className="text-sm text-emerald-200">All checkpoints complete. Revisit to keep the fundamentals sharp.</p>
                </div>
              ) : (
                nextIncomplete && (
                  <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 mb-3">
                    <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Next up</p>
                    <p className="text-sm text-white font-medium truncate">
                      {nextIncomplete.moduleTitle} · {nextIncomplete.label}
                    </p>
                  </div>
                )
              )}

              <button
                onClick={lessonComplete ? () => setIsOpen(true) : resumeAtNext}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
              >
                {lessonComplete ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                {lessonComplete ? "Review completed lesson" : completed > 0 ? "Resume lesson" : "Start lesson"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default border-0 p-0 appearance-none"
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
                                      <span className="block mb-1">Project evidence</span>
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
