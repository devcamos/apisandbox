"use client"

import { Compass, BrainCircuit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import PhaseLayout from "@/components/PhaseLayout"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import { LessonTracker } from "@/components/LessonTracker"
import { apiAlgorithmLessons } from "@/lib/learning/api-algorithms"

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
          </div>
        </section>

        <LessonTracker phase={5} />

        <section className="space-y-8">
          {apiAlgorithmLessons.map((lesson) => (
            <article key={lesson.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <div className="mb-5">
                <h3 className="text-2xl font-bold text-white">{lesson.title}</h3>
                <p className="text-cyan-300 text-sm mt-1">System: {lesson.systemName}</p>
              </div>

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

              <div className="grid lg:grid-cols-2 gap-4">
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
            </article>
          ))}
        </section>
      </PhaseLayout>
    </SubscriptionGate>
  )
}
