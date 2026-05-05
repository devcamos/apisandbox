"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { ArrowLeft, BookMarked } from "lucide-react"
import PhaseLayout from "@/components/PhaseLayout"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import { getConceptSideQuest } from "@/lib/learning/concept-side-quests"

export default function Phase5ConceptDetailPage() {
  const params = useParams()
  const conceptId = typeof params.conceptId === "string" ? params.conceptId : ""
  const concept = getConceptSideQuest(conceptId)

  if (!concept) {
    notFound()
  }

  return (
    <SubscriptionGate phaseNumber={5} lockedContentName="Phase 5: Concept side quests">
      <PhaseLayout
        phaseNumber={5}
        title={concept.title}
        description={concept.tagline}
        icon={BookMarked}
        color="from-violet-500 to-indigo-600"
      >
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/phase-5/concepts"
            className="inline-flex items-center gap-2 text-violet-300 hover:text-violet-200 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All concept 101s
          </Link>
          <span className="text-gray-600">·</span>
          <Link href="/phase-5" className="text-sm text-gray-400 hover:text-white transition-colors">
            Phase 5 main quest
          </Link>
          {concept.relatedAlgorithmIds && concept.relatedAlgorithmIds.length > 0 && (
            <>
              <span className="text-gray-600">·</span>
              <Link href="/phase-6" className="text-sm text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
                Phase 6 visualizers
              </Link>
            </>
          )}
        </div>

        <article className="space-y-8">
          {concept.sections.map((s) => (
            <section key={s.heading} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">{s.heading}</h2>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{s.body}</p>
            </section>
          ))}
        </article>

        {concept.relatedAlgorithmIds && concept.relatedAlgorithmIds.length > 0 && (
          <div className="mt-10 p-4 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5">
            <p className="text-xs font-semibold text-fuchsia-300 mb-2">Try in Phase 6</p>
            <p className="text-xs text-gray-400 mb-3">
              Open the Algorithm Visualizer, pick the matching category, and connect this concept to the Overview tab for:
            </p>
            <ul className="flex flex-wrap gap-2">
              {concept.relatedAlgorithmIds.map((id) => (
                <li key={id}>
                  <code className="text-[11px] px-2 py-1 rounded bg-slate-900 border border-slate-700 text-fuchsia-200">
                    {id}
                  </code>
                </li>
              ))}
            </ul>
            <Link href="/phase-6" className="inline-block mt-3 text-sm text-fuchsia-400 hover:text-fuchsia-300">
              Go to Phase 6 →
            </Link>
          </div>
        )}
      </PhaseLayout>
    </SubscriptionGate>
  )
}
