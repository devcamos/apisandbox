"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import PhaseLayout from "@/components/PhaseLayout"
import Phase5NotFound from "@/components/phase-5/Phase5NotFound"
import LearningStructureCard from "@/components/phase-5/LearningStructureCard"
import LinkedStrategyList from "@/components/phase-5/LinkedStrategyList"
import LearnDoSection from "@/components/phase-5/LearnDoSection"
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
    return <Phase5NotFound message="Mapped problem not found." />
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

          <LearningStructureCard
            items={[
              { label: "DSA", value: dsa },
              { label: "Algo pattern", value: pattern.label },
              { label: "Mapped from", value: parentProblem.title },
            ]}
          />
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
            <LinkedStrategyList
              strategies={linkedStrategies}
              containerClass="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4"
              headingClass="text-xs text-cyan-300 mb-2"
            />
          </section>
        )}

        <LearnDoSection learn={mappedProblem.learn} doItems={mappedProblem.do} />
      </PhaseLayout>
    </SubscriptionGate>
  )
}
