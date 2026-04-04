"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import PhaseLayout from "@/components/PhaseLayout"
import {
  getPatternNode,
  getPatternPracticeProblem,
  getMappedPracticeProblem,
  getLearningStrategy,
  dsaFoundationsByPattern,
} from "@/lib/learning/leetcode-pattern-graph"

export default function MappedProblemPage() {
  const params = useParams<{ patternId: string; problemId: string; mappedId: string }>()
  const patternId = params?.patternId
  const problemId = params?.problemId
  const mappedId = params?.mappedId

  const pattern = patternId ? getPatternNode(patternId) : null
  const parentProblem = patternId && problemId ? getPatternPracticeProblem(patternId, problemId) : null
  const mappedProblem = patternId && problemId && mappedId ? getMappedPracticeProblem(patternId, problemId, mappedId) : null

  if (!pattern || !parentProblem || !mappedProblem) {
    return (
      <SubscriptionGate phaseNumber={5} lockedContentName="Phase 5: API Algorithms">
        <div className="min-h-screen bg-slate-900 text-white p-8">
          <p className="mb-4">Mapped problem not found.</p>
          <Link href="/phase-5" className="text-cyan-300 underline">
            Back to Phase 5
          </Link>
        </div>
      </SubscriptionGate>
    )
  }

  const dsa = dsaFoundationsByPattern[pattern.id] || "Core data structures"
  const linkedStrategies = (mappedProblem.strategies || [])
    .map((id) => getLearningStrategy(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <SubscriptionGate phaseNumber={5} lockedContentName={`Phase 5: ${pattern.label}`}>
      <PhaseLayout
        phaseNumber={5}
        title={mappedProblem.title}
        description={`Mapped from ${parentProblem.title}`}
        icon={CheckCircle2}
        color="from-cyan-500 to-blue-500"
      >
        <section className="mb-8">
          <Link
            href={`/phase-5/problems/${pattern.id}/${parentProblem.id}`}
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {parentProblem.title}
          </Link>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">Learning structure</div>
            <div className="text-sm text-cyan-100 mb-1">
              <span className="font-semibold">DSA:</span> {dsa}
            </div>
            <div className="text-sm text-cyan-100 mb-1">
              <span className="font-semibold">Algo pattern:</span> {pattern.label}
            </div>
            <div className="text-sm text-cyan-100">
              <span className="font-semibold">Mapped from:</span> {parentProblem.title}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-xs text-purple-300 mb-2">Problem statement</div>
            <p className="text-sm text-purple-100">{mappedProblem.problemStatement}</p>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-xs text-blue-300 mb-2">Why this maps to {parentProblem.title}</div>
            <p className="text-sm text-blue-100">{mappedProblem.whyItMaps}</p>
          </div>
        </section>

        {linkedStrategies.length > 0 && (
          <section className="mb-8">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
              <div className="text-xs text-cyan-300 mb-2">Method design</div>
              <div className="space-y-2">
                {linkedStrategies.map((strategy) => (
                  <Link
                    key={strategy.id}
                    href={`/phase-5/strategies/${strategy.id}`}
                    className="block rounded border border-slate-700 bg-slate-900/60 p-3 transition-colors hover:border-cyan-400/60"
                  >
                    <div className="text-sm font-semibold text-cyan-200 underline">{strategy.title}</div>
                    <div className="text-xs text-cyan-100 mt-1">{strategy.summary}</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="grid lg:grid-cols-2 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <div className="text-xs text-emerald-300 mb-2">What to learn</div>
            <ul className="space-y-1.5 text-sm text-emerald-100">
              {mappedProblem.learn.map((item) => (
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
              {mappedProblem.do.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </PhaseLayout>
    </SubscriptionGate>
  )
}
