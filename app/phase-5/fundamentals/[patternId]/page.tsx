import Link from "next/link"
import { Compass, ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import PhaseLayout from "@/components/PhaseLayout"
import {
  dsaFoundationsByPattern,
  getPatternFundamentals,
  getPatternNode,
} from "@/lib/learning/leetcode-pattern-graph"

export default async function PatternFundamentalsPage({
  params,
}: {
  params: Promise<{ patternId: string }>
}) {
  const { patternId } = await params
  const pattern = getPatternNode(patternId)
  const fundamentals = getPatternFundamentals(patternId)

  if (!pattern || !fundamentals) {
    return (
      <SubscriptionGate phaseNumber={5} lockedContentName="Phase 5: API Algorithms">
        <div className="min-h-screen bg-slate-900 text-white p-8">
          <p className="mb-4">Fundamentals page not found.</p>
          <Link href="/phase-5" className="text-cyan-300 underline">
            Back to Phase 5
          </Link>
        </div>
      </SubscriptionGate>
    )
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

          <article className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="text-xl font-bold text-white mb-3">Read This Pattern In Real Systems</h3>
            <ul className="space-y-3 text-gray-300">
              {pattern.readFirstExamples.map((example) => (
                <li key={example} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-300" />
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-3 mb-8">
          <article className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="text-xl font-bold text-white mb-3">Mental Model</h3>
            <ul className="space-y-3 text-gray-300">
              {fundamentals.mentalModel.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="text-xl font-bold text-white mb-3">How To Study It</h3>
            <ol className="space-y-3 text-gray-300 list-decimal list-inside">
              {fundamentals.workflow.map((item) => (
                <li key={item} className="leading-7">
                  {item}
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="text-xl font-bold text-white mb-3">Common Pitfalls</h3>
            <ul className="space-y-3 text-gray-300">
              {fundamentals.commonPitfalls.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-rose-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <h3 className="text-xl font-bold text-white mb-3">Ready Check</h3>
          <ul className="space-y-3 text-emerald-50">
            {fundamentals.studyChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </PhaseLayout>
    </SubscriptionGate>
  )
}
