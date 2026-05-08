import Link from "next/link"
import { Compass, ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import PhaseLayout from "@/components/PhaseLayout"
import Phase5NotFound from "@/components/phase-5/Phase5NotFound"
import BulletListCard from "@/components/phase-5/BulletListCard"
import {
  dsaFoundationsByPattern,
  getPatternFundamentals,
  getPatternNode,
} from "@/lib/learning/leetcode-pattern-graph"

export default async function PatternFundamentalsPage({
  params,
}: Readonly<{
  params: Promise<{ patternId: string }>
}>) {
  const { patternId } = await params
  const pattern = getPatternNode(patternId)
  const fundamentals = getPatternFundamentals(patternId)

  if (!pattern || !fundamentals) {
    return <Phase5NotFound message="Fundamentals page not found." />
  }

  const dsa = dsaFoundationsByPattern[pattern.id] || "Core data structures"

  return (
    <SubscriptionGate phaseNumber={5} lockedContentName={`Phase 5: ${pattern.label} Fundamentals`}>
      <PhaseLayout
        phaseNumber={5}
        title={`${pattern.label} Fundamentals`}
        description="Study the concept first, then move into problem practice"
        icon={BookOpen}
        color="from-cyan-500 to-blue-500"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Phase 5", href: "/phase-5" },
          { label: "Fundamentals", href: `/phase-5/fundamentals/${pattern.id}` },
        ]}
      >
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href="/phase-5"
              className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to graph
            </Link>
            <Link
              href={`/phase-5/problems/${pattern.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/20 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Open practice problems
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-5 md:col-span-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200 mb-3">
                <Compass className="w-4 h-4" />
                Study Reader
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">{pattern.label}</h2>
              <p className="text-gray-300 leading-7">{fundamentals.coreIdea}</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Learning structure</div>
              <div className="text-sm text-cyan-100 mb-2">
                <span className="font-semibold">DSA:</span> {dsa}
              </div>
              <div className="text-sm text-cyan-100 mb-2">
                <span className="font-semibold">Difficulty:</span> {pattern.difficulty}
              </div>
              <div className="text-sm text-cyan-100">
                <span className="font-semibold">Unlocks:</span> {pattern.unlocks.length}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 mb-8">
          <article className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="text-xl font-bold text-white mb-3">Why It Matters</h3>
            <p className="text-gray-300 leading-7">{fundamentals.whyItMatters}</p>
          </article>

          <BulletListCard
            heading="Read This Pattern In Real Systems"
            items={pattern.readFirstExamples}
            dotClass="mt-2 h-2 w-2 rounded-full bg-emerald-300"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3 mb-8">
          <BulletListCard heading="Mental Model" items={fundamentals.mentalModel} />

          <BulletListCard heading="How To Study It" items={fundamentals.workflow} ordered />

          <BulletListCard
            heading="Common Pitfalls"
            items={fundamentals.commonPitfalls}
            dotClass="mt-2 h-2 w-2 rounded-full bg-rose-300"
          />
        </section>

        <BulletListCard
          heading="Ready Check"
          items={fundamentals.studyChecklist}
          containerClass="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6"
          listClass="space-y-3 text-emerald-50"
          dotClass="mt-2 h-2 w-2 rounded-full bg-emerald-300"
        />
      </PhaseLayout>
    </SubscriptionGate>
  )
}
