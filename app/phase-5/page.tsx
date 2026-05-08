"use client"

import { Compass, BrainCircuit, ArrowLeft, Heart, BookMarked } from "lucide-react"
import Link from "next/link"
import PhaseLayout from "@/components/PhaseLayout"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import { LessonTracker } from "@/components/LessonTracker"
import { apiAlgorithmLessons } from "@/lib/learning/api-algorithms"
import PatternArchitectureAnimator from "@/components/PatternArchitectureAnimator"
import LeetCodePatternGraph from "@/components/LeetCodePatternGraph"

export default function Phase5Page() {
  return (
    <SubscriptionGate phaseNumber={5} lockedContentName="Phase 5: API Algorithms">
      <PhaseLayout
        phaseNumber={5}
        title="API Algorithms"
        description="Master theory and concepts through architecture constraints"
        icon={Compass}
        color="from-cyan-500 to-blue-500"
      >
        <section className="mb-10">
          <Link
            href="/phase-4"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Phase 4
          </Link>

          <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-semibold mb-3">
              <BrainCircuit className="w-4 h-4" />
              Theory Mastery Track
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">LeetCode concepts mapped to real API architecture</h2>
            <p className="text-gray-300 mb-3">
              This phase is for deep system reasoning, not coding drills. Keep your LeetCode practice separate and use this
              track to convert those concepts into production architecture decisions.
            </p>
            <p className="text-gray-400 text-sm">
              Every lesson follows the same framework: Trigger, Existence, Mechanics, Contrast, Stress, Failure, Trade-offs, Retrieval, Build.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/story"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-200 hover:bg-amber-500/20 transition-all text-sm font-medium"
              >
                <Heart className="w-4 h-4" />
                Before You Begin
              </Link>
              <Link
                href="/phase-5/concepts"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500/10 border border-violet-500/25 rounded-xl text-violet-200 hover:bg-violet-500/20 transition-all text-sm font-medium"
              >
                <BookMarked className="w-4 h-4" />
                Concept 101 — Side quests
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Main quest vs side quests</h2>
              <p className="text-sm text-gray-400 max-w-2xl">
                <span className="text-emerald-300 font-medium">Main quest:</span> the architecture lessons below + Phase 6 algorithm visualizers (master concrete algorithms and system mappings).
                {" "}
                <span className="text-violet-300 font-medium">Side quests:</span> short CS 101 reads — start with{" "}
                <Link href="/phase-5/concepts/big-o" className="text-violet-200 underline underline-offset-2 hover:text-white">
                  Big O
                </Link>
                , then stability, BFS/DFS, monotonicity — vocabulary that transfers everywhere.
              </p>
            </div>
            <Link
              href="/phase-5/concepts"
              className="shrink-0 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-violet-500/20 border border-violet-500/35 text-violet-200 text-sm font-semibold hover:bg-violet-500/30 transition-colors"
            >
              Open concept 101s
            </Link>
          </div>
        </section>

        <LeetCodePatternGraph />

        <LessonTracker phase={5} />

        <section className="space-y-8">
          {apiAlgorithmLessons.map((lesson) => (
            <article key={lesson.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <div className="mb-5">
                <h3 className="text-2xl font-bold text-white">{lesson.title}</h3>
                <p className="text-cyan-300 text-sm mt-1">System: {lesson.systemName}</p>
              </div>

              <PatternArchitectureAnimator lessonId={lesson.id} title={lesson.systemName} />

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-300 mb-2">0. Trigger</div>
                  <p className="text-sm text-gray-300">{lesson.trigger}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-300 mb-2">1. Existence</div>
                  <p className="text-sm text-gray-300">{lesson.existence}</p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 mb-4">
                <div className="text-xs uppercase tracking-wide text-emerald-300 mb-2">2. Mechanics</div>
                <ul className="space-y-2 text-sm text-gray-300">
                  {lesson.mechanics.map((step) => (
                    <li key={step}>• {step}</li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-300 mb-2">3. Contrast (With)</div>
                  <p className="text-sm text-gray-300">{lesson.contrast.withSystem}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-300 mb-2">3. Contrast (Without)</div>
                  <p className="text-sm text-gray-300">{lesson.contrast.withoutSystem}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-300 mb-2">4. Stress</div>
                  <p className="text-sm text-gray-300">{lesson.stress}</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-300 mb-2">5. Failure</div>
                  <p className="text-sm text-gray-300">{lesson.failure}</p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 mb-4">
                <div className="text-xs uppercase tracking-wide text-emerald-300 mb-2">6. Trade-offs</div>
                <ul className="space-y-2 text-sm text-gray-300">
                  {lesson.tradeoffs.map((tradeoff) => (
                    <li key={tradeoff}>• {tradeoff}</li>
                  ))}
                </ul>
              </div>

              <div className="grid lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-300 mb-2">7. Retrieval</div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {lesson.retrievalQuestions.map((question) => (
                      <li key={question}>• {question}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-300 mb-2">8. Build</div>
                  <p className="text-sm text-gray-300">{lesson.buildTask}</p>
                </div>
              </div>

              <details className="group border-2 border-green-500/20 rounded-xl overflow-hidden bg-gradient-to-br from-green-900/20 to-emerald-900/10 hover:border-green-500/30 transition-colors">
                <summary className="flex items-center gap-2.5 px-5 py-3 cursor-pointer select-none">
                  <span className="text-base">☕</span>
                  <span className="text-xs uppercase tracking-wide text-green-400 font-bold">Spring Perspective</span>
                  <span className="text-sm text-green-200/80 flex-1 truncate">{lesson.springContext.headline}</span>
                  <span className="text-green-500 text-xs group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="px-5 pb-4 pt-1 border-t border-green-500/10">
                  <ul className="space-y-1.5 text-sm text-gray-300 mb-3">
                    {lesson.springContext.how.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5 shrink-0">▸</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <details className="group/code">
                    <summary className="text-xs text-green-400/80 cursor-pointer hover:text-green-300 transition-colors font-medium">
                      Show Java code sketch
                    </summary>
                    <pre className="mt-2 bg-slate-950/80 border border-slate-700 rounded-lg p-3 text-xs text-gray-300 overflow-x-auto whitespace-pre leading-relaxed">
                      <code>{lesson.springContext.codeSketch}</code>
                    </pre>
                  </details>
                </div>
              </details>
            </article>
          ))}
        </section>
      </PhaseLayout>
    </SubscriptionGate>
  )
}
