"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, BrainCircuit } from "lucide-react"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import PhaseLayout from "@/components/PhaseLayout"
import {
  getLearningStrategy,
  getPatternNode,
  getPatternPracticeProblem,
  getMappedPracticeProblem,
} from "@/lib/learning/leetcode-pattern-graph"

export default function StrategyDetailPage() {
  const params = useParams<{ strategyId: string }>()
  const strategyId = params?.strategyId
  const strategy = strategyId ? getLearningStrategy(strategyId) : null

  if (!strategy) {
    return (
      <SubscriptionGate phaseNumber={5} lockedContentName="Phase 5: API Algorithms">
        <div className="min-h-screen bg-slate-900 text-white p-8">
          <p className="mb-4">Strategy not found.</p>
          <Link href="/phase-5" className="text-cyan-300 underline">
            Back to Phase 5
          </Link>
        </div>
      </SubscriptionGate>
    )
  }

  return (
    <SubscriptionGate phaseNumber={5} lockedContentName={`Phase 5: ${strategy.title}`}>
      <PhaseLayout
        phaseNumber={5}
        title={strategy.title}
        description="Reusable method design"
        icon={BrainCircuit}
        color="from-cyan-500 to-blue-500"
      >
        <section className="mb-8">
          <Link
            href="/phase-5"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Phase 5
          </Link>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-xs text-purple-300 mb-2">Strategy summary</div>
            <p className="text-sm text-purple-100">{strategy.summary}</p>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <div className="text-xs text-cyan-300 mb-2">Mechanics</div>
            <ul className="space-y-1.5 text-sm text-cyan-100">
              {strategy.mechanics.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">Linked problems</div>
            <div className="space-y-2">
              {strategy.linkedProblems.map((link) => {
                const pattern = getPatternNode(link.patternId)
                const parent = getPatternPracticeProblem(link.patternId, link.problemId)
                const mapped = link.mappedId ? getMappedPracticeProblem(link.patternId, link.problemId, link.mappedId) : null

                if (!pattern || !parent) return null

                const href = mapped
                  ? `/phase-5/problems/${link.patternId}/${link.problemId}/mapped/${link.mappedId}`
                  : `/phase-5/problems/${link.patternId}/${link.problemId}`
                const title = mapped ? mapped.title : parent.title
                const subtitle = mapped ? `Mapped from ${parent.title}` : `${pattern.label} pattern`

                return (
                  <Link
                    key={`${link.patternId}-${link.problemId}-${link.mappedId || "base"}`}
                    href={href}
                    className="block rounded border border-slate-700 bg-slate-900/60 p-3 transition-colors hover:border-cyan-400/60"
                  >
                    <div className="text-sm font-semibold text-cyan-200 underline">{title}</div>
                    <div className="text-xs text-gray-300 mt-1">{subtitle}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </PhaseLayout>
    </SubscriptionGate>
  )
}
