import { Sparkles, Brain, BarChart3 } from "lucide-react"

/**
 * Phase 6 uses ShinobiLearningBoard + SearchMicroExercises as its "Do" mechanism
 * instead of PhaseQuiz/LessonTracker (see ARCH-002 design decision).
 */
export default function Phase6ProgressNote() {
  return (
    <div className="mb-8 rounded-xl border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-fuchsia-500/15 border border-fuchsia-400/20 shrink-0">
          <Sparkles className="w-6 h-6 text-fuchsia-300" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Your progress lives in the Do layer</h3>
          <p className="text-sm text-gray-300 mb-4">
            Phase 6 skips the standard checkpoint quiz in favour of interactive visualisers and micro-exercises.
            Complete algorithm runs and exercises on the Shinobi board — that is your proof of completion here.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700 text-gray-300">
              <Brain className="w-3.5 h-3.5 text-fuchsia-400" />
              SearchMicroExercises
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700 text-gray-300">
              <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
              ShinobiLearningBoard XP
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
