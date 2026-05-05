"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import PhaseLayout from "@/components/PhaseLayout"
import {
  getPatternNode,
  dsaFoundationsByPattern,
  practiceProblemsByPattern,
  PATTERN_PROGRESS_STORAGE_KEY,
  emptyNodeProgress,
  type PatternProgressState,
  type NodeProgress,
} from "@/lib/learning/leetcode-pattern-graph"

export default function PatternProblemsPage() {
  const params = useParams<{ patternId: string }>()
  const patternId = params?.patternId
  const pattern = patternId ? getPatternNode(patternId) : null
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

  const getNodeProgress = (id: string): NodeProgress => ({
    ...emptyNodeProgress(),
    ...(progress[id] || {}),
  })

  if (!pattern) {
    return (
      <SubscriptionGate phaseNumber={5} lockedContentName="Phase 5: API Algorithms">
        <div className="min-h-screen bg-slate-900 text-white p-8">
          <p className="mb-4">Pattern not found.</p>
          <Link href="/phase-5" className="text-cyan-300 underline">
            Back to Phase 5
          </Link>
        </div>
      </SubscriptionGate>
    )
  }

  const dsa = dsaFoundationsByPattern[pattern.id] || "Core data structures"
  const problems = practiceProblemsByPattern[pattern.id] || []
  const nodeProgress = getNodeProgress(pattern.id)

  const prereqsComplete = pattern.prerequisites.every((id) => getNodeProgress(id).completed)

  const doneCount = problems.filter((p) => {
    const status = nodeProgress.problems[p.id]
    return Boolean(status?.completed && status?.understood)
  }).length

  return (
    <SubscriptionGate phaseNumber={5} lockedContentName={`Phase 5: ${pattern.label}`}>
      <PhaseLayout
        phaseNumber={5}
        title={`${pattern.label} - Problems`}
        description="DSA -> Algo pattern -> Problems (no solutions)"
        icon={CheckCircle2}
        color="from-cyan-500 to-blue-500"
      >
        <section className="mb-8">
          <Link href="/phase-5" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Phase 5 graph
          </Link>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">Learning structure</div>
            <div className="text-sm text-cyan-100 mb-1">
              <span className="font-semibold">DSA:</span> {dsa}
            </div>
            <div className="text-sm text-cyan-100">
              <span className="font-semibold">Algo pattern:</span> {pattern.label}
            </div>
            <div className="mt-4">
              <Link
                href={`/phase-5/fundamentals/${pattern.id}`}
                className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                Read fundamentals first
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-xs text-purple-300 mb-2">Problems to complete / understand (no solutions)</div>
            <div className="text-sm text-purple-100 mb-3">
              Progress: {doneCount}/{problems.length}{" "}
              {nodeProgress.completed ? "• Area completed" : prereqsComplete ? "• In progress" : "• Locked by prerequisites"}
            </div>
            {!prereqsComplete && (
              <p className="text-xs text-rose-300 mb-3">Complete prerequisites in the graph before this area can be completed.</p>
            )}

            <div className="space-y-3">
              {problems.map((problem) => {
                const status = nodeProgress.problems[problem.id] || { completed: false, understood: false }
                return (
                  <Link
                    key={problem.id}
                    href={`/phase-5/problems/${pattern.id}/${problem.id}`}
                    className="block rounded border border-slate-700 bg-slate-900/60 p-3 transition-colors hover:border-cyan-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
                  >
                    <div className="text-sm font-semibold text-cyan-200 hover:text-cyan-100 underline">
                      {problem.title}
                    </div>
                    <div className="text-xs text-gray-300 mb-1">
                      <span className="text-gray-400">Problem statement:</span> {problem.focus}
                    </div>
                    <div className="text-xs text-gray-300">
                      Status: {status.completed ? "Completed" : "Pending"} · {status.understood ? "Understood" : "Not understood yet"}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">Prereqs</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {pattern.prerequisites.length === 0 ? (
                <span className="text-xs text-gray-400">None - entry point pattern.</span>
              ) : (
                pattern.prerequisites.map((id) => {
                  const node = getPatternNode(id)
                  if (!node) return null
                  return (
                    <Link
                      key={id}
                      href={`/phase-5/problems/${id}`}
                      className="text-xs px-2 py-1 rounded border border-slate-600 text-gray-200 hover:border-cyan-400/50"
                    >
                      {node.label}
                    </Link>
                  )
                })
              )}
            </div>

            <div className="text-xs text-gray-400 mb-2">Unlocks next</div>
            <div className="flex flex-wrap gap-2">
              {pattern.unlocks.length === 0 ? (
                <span className="text-xs text-gray-400">Capstone node.</span>
              ) : (
                pattern.unlocks.map((id) => {
                  const node = getPatternNode(id)
                  if (!node) return null
                  return (
                    <Link
                      key={id}
                      href={`/phase-5/problems/${id}`}
                      className="text-xs px-2 py-1 rounded border border-slate-600 text-gray-200 hover:border-cyan-400/50"
                    >
                      {node.label}
                    </Link>
                  )
                })
              )}
            </div>
          </div>
        </section>
      </PhaseLayout>
    </SubscriptionGate>
  )
}
