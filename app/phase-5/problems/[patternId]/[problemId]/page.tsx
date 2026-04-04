"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Circle, CheckCircle2 } from "lucide-react"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import PhaseLayout from "@/components/PhaseLayout"
import {
  getPatternNode,
  getPatternPracticeProblem,
  dsaFoundationsByPattern,
  practiceProblemsByPattern,
  getLearningStrategy,
  PATTERN_PROGRESS_STORAGE_KEY,
  emptyNodeProgress,
  isProblemChecklistComplete,
  type PatternProgressState,
} from "@/lib/learning/leetcode-pattern-graph"

interface ProblemProgress {
  completed: boolean
  understood: boolean
}

export default function ProblemDetailPage() {
  const params = useParams<{ patternId: string; problemId: string }>()
  const patternId = params?.patternId
  const problemId = params?.problemId
  const pattern = patternId ? getPatternNode(patternId) : null
  const problem = patternId && problemId ? getPatternPracticeProblem(patternId, problemId) : null
  const [progress, setProgress] = useState<PatternProgressState>({})

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem(PATTERN_PROGRESS_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as PatternProgressState
      setProgress(parsed || {})
    } catch {
      setProgress({})
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem(PATTERN_PROGRESS_STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  if (!pattern || !problem) {
    return (
      <SubscriptionGate phaseNumber={5} lockedContentName="Phase 5: API Algorithms">
        <div className="min-h-screen bg-slate-900 text-white p-8">
          <p className="mb-4">Problem not found.</p>
          <Link href="/phase-5" className="text-cyan-300 underline">
            Back to Phase 5
          </Link>
        </div>
      </SubscriptionGate>
    )
  }

  const nodeProgress = {
    ...emptyNodeProgress(),
    ...(progress[pattern.id] || {}),
  }
  const problemStatus = nodeProgress.problems[problem.id] || { completed: false, understood: false }
  const prereqsComplete = pattern.prerequisites.every((id) => {
    const p = progress[id]
    return Boolean(p?.completed)
  })
  const dsa = dsaFoundationsByPattern[pattern.id] || "Core data structures"

  const updateProblem = (key: keyof ProblemProgress) => {
    const nextStatus = {
      ...problemStatus,
      [key]: !problemStatus[key],
    }
    const nextProblems = {
      ...nodeProgress.problems,
      [problem.id]: nextStatus,
    }
    const nextNodeProgress = {
      ...nodeProgress,
      problems: nextProblems,
      completed: false,
    }

    const autoComplete = prereqsComplete && isProblemChecklistComplete(pattern.id, nextNodeProgress)
    setProgress((prev) => ({
      ...prev,
      [pattern.id]: {
        ...nextNodeProgress,
        completed: autoComplete,
      },
    }))
  }

  const relatedProblems = (practiceProblemsByPattern[pattern.id] || []).filter((p) => p.id !== problem.id)
  const linkedStrategies = (problem.strategies || [])
    .map((id) => getLearningStrategy(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <SubscriptionGate phaseNumber={5} lockedContentName={`Phase 5: ${pattern.label}`}>
      <PhaseLayout
        phaseNumber={5}
        title={`${problem.title}`}
        description="Problem page (no solution)"
        icon={CheckCircle2}
        color="from-cyan-500 to-blue-500"
      >
        <section className="mb-8">
          <Link
            href={`/phase-5/problems/${pattern.id}`}
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {pattern.label} problems
          </Link>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">Learning structure</div>
            <div className="text-sm text-cyan-100 mb-1">
              <span className="font-semibold">DSA:</span> {dsa}
            </div>
            <div className="text-sm text-cyan-100">
              <span className="font-semibold">Algo pattern:</span> {pattern.label}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-xs text-purple-300 mb-2">Problem statement</div>
            <div className="text-sm text-white font-semibold mb-1">{problem.title}</div>
            <p className="text-sm text-purple-100">{problem.focus}</p>
          </div>
        </section>

        {linkedStrategies.length > 0 && (
          <section className="mb-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="text-xs text-blue-300 mb-2">Method design</div>
              <div className="space-y-2">
                {linkedStrategies.map((strategy) => (
                  <Link
                    key={strategy.id}
                    href={`/phase-5/strategies/${strategy.id}`}
                    className="block rounded border border-slate-700 bg-slate-900/60 p-3 transition-colors hover:border-cyan-400/60"
                  >
                    <div className="text-sm font-semibold text-cyan-200 underline">{strategy.title}</div>
                    <div className="text-xs text-blue-100 mt-1">{strategy.summary}</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mb-8 grid lg:grid-cols-2 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <div className="text-xs text-emerald-300 mb-2">What to learn</div>
            <ul className="space-y-1.5 text-sm text-emerald-100">
              {problem.learn.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <div className="text-xs text-cyan-300 mb-2">What to do</div>
            <ul className="space-y-1.5 text-sm text-cyan-100">
              {problem.do.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {problem.mappedProblems && problem.mappedProblems.length > 0 && (
          <section className="mb-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="text-xs text-blue-300 mb-2">Dive Deeper (maps to {problem.title})</div>
              <div className="space-y-2">
                {problem.mappedProblems.slice(0, 5).map((mapped) => (
                  <Link
                    key={mapped.id}
                    href={`/phase-5/problems/${pattern.id}/${problem.id}/mapped/${mapped.id}`}
                    className="block rounded border border-slate-700 bg-slate-900/60 p-3 transition-colors hover:border-cyan-400/60"
                  >
                    <div className="text-sm font-semibold text-cyan-200 underline">{mapped.title}</div>
                    <div className="text-xs text-gray-300 mt-1">
                      <span className="text-gray-400">Problem statement:</span> {mapped.problemStatement}
                    </div>
                    <div className="text-xs text-blue-100 mt-1">{mapped.whyItMaps}</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">Your status</div>
            {!prereqsComplete && (
              <p className="text-xs text-rose-300 mb-2">Prerequisites are not complete yet. You can still study this page.</p>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateProblem("completed")}
                className={`text-xs px-2 py-1 rounded border inline-flex items-center gap-1 ${
                  problemStatus.completed ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-100" : "border-slate-600 text-gray-200"
                }`}
              >
                {problemStatus.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                {problemStatus.completed ? "Completed" : "Mark complete"}
              </button>
              <button
                type="button"
                onClick={() => updateProblem("understood")}
                className={`text-xs px-2 py-1 rounded border inline-flex items-center gap-1 ${
                  problemStatus.understood ? "border-blue-400/50 bg-blue-500/20 text-blue-100" : "border-slate-600 text-gray-200"
                }`}
              >
                {problemStatus.understood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                {problemStatus.understood ? "Understood" : "Mark understood"}
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">Other problems in this pattern</div>
            <div className="flex flex-wrap gap-2">
              {relatedProblems.length === 0 ? (
                <span className="text-xs text-gray-400">No additional problems defined.</span>
              ) : (
                relatedProblems.map((p) => (
                  <Link
                    key={p.id}
                    href={`/phase-5/problems/${pattern.id}/${p.id}`}
                    className="text-xs px-2 py-1 rounded border border-slate-600 text-gray-200 hover:border-cyan-400/50"
                  >
                    {p.title}
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      </PhaseLayout>
    </SubscriptionGate>
  )
}
