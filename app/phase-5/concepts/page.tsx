"use client"

import Link from "next/link"
import { ArrowLeft, BookMarked, Sparkles } from "lucide-react"
import PhaseLayout from "@/components/PhaseLayout"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import { conceptSideQuests } from "@/lib/learning/concept-side-quests"

export default function Phase5ConceptsIndexPage() {
  return (
    <SubscriptionGate phaseNumber={5} lockedContentName="Phase 5: Concept side quests">
      <PhaseLayout
        phaseNumber={5}
        title="Concept 101 — Side quests"
        description="Main quest: algorithms & API patterns. Side quest: vocabulary and invariants that make algorithms stick."
        icon={BookMarked}
        color="from-violet-500 to-indigo-600"
      >
        <Link
          href="/phase-5"
          className="inline-flex items-center gap-2 text-violet-300 hover:text-violet-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Phase 5
        </Link>

        <div className="bg-violet-500/10 border border-violet-500/25 rounded-2xl p-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            Side quest track
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Master concepts, not only implementations</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            These short 101s pair with the main Phase 5 lessons and Phase 6 algorithm visualizers. Start with{" "}
            <Link href="/phase-5/concepts/big-o" className="text-violet-300 hover:text-violet-200 underline underline-offset-2">
              Big O
            </Link>{" "}
            if scaling vocabulary is fuzzy — then dig into stability, monotonicity, and the rest.
          </p>
        </div>

        <ul className="space-y-3">
          {conceptSideQuests.map((c) => (
            <li key={c.id}>
              <Link
                href={`/phase-5/concepts/${c.id}`}
                className="block rounded-xl border border-slate-700 bg-slate-800/50 p-5 hover:border-violet-500/40 hover:bg-slate-800/80 transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-1">{c.title}</h3>
                <p className="text-sm text-gray-400">{c.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </PhaseLayout>
    </SubscriptionGate>
  )
}
