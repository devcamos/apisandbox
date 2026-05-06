"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react"

interface Exercise {
  id: string
  type: "identify" | "predict" | "estimate"
  question: string
  scenario?: string
  options: { label: string; value: string }[]
  correctAnswer: string
  explanation: string
}

const exercises: Exercise[] = [
  {
    id: "identify-1",
    type: "identify",
    question: "Which search algorithm should you use?",
    scenario: "You have a sorted array of 1 million user IDs and need to check if a specific ID exists. Access is O(1) per index.",
    options: [
      { label: "Linear Search", value: "linear" },
      { label: "Binary Search", value: "binary" },
      { label: "Jump Search", value: "jump" },
    ],
    correctAnswer: "binary",
    explanation: "Sorted data + random access + exact match = binary search. It needs only ~20 comparisons (log₂ 1,000,000 ≈ 20) vs 500,000 average for linear.",
  },
  {
    id: "identify-2",
    type: "identify",
    question: "Which search algorithm should you use?",
    scenario: "You're scanning a network packet stream in real time for a specific signature. Packets arrive sequentially and you can't skip ahead.",
    options: [
      { label: "Linear Search", value: "linear" },
      { label: "Binary Search", value: "binary" },
      { label: "Jump Search", value: "jump" },
    ],
    correctAnswer: "linear",
    explanation: "Sequential-only access and no guaranteed ordering means linear scan is your only option. Binary search requires random access; jump search requires sorted data.",
  },
  {
    id: "identify-3",
    type: "identify",
    question: "Which search algorithm should you use?",
    scenario: "You have a sorted log file on disk. Each comparison requires a disk seek (expensive). You need to find the first entry after a timestamp.",
    options: [
      { label: "Linear Search", value: "linear" },
      { label: "Binary Search", value: "binary" },
      { label: "Jump Search", value: "jump" },
    ],
    correctAnswer: "binary",
    explanation: "Sorted data + expensive comparisons = minimise comparison count. Binary search uses O(log n) comparisons — crucial when each one involves disk I/O.",
  },
  {
    id: "predict-1",
    type: "predict",
    question: "Will binary search find the target?",
    scenario: "Array: [3, 1, 4, 1, 5, 9, 2, 6]. Target: 5. You run standard binary search on this array.",
    options: [
      { label: "Yes — it will find 5", value: "yes" },
      { label: "No — it may miss 5", value: "no" },
      { label: "It depends on the implementation", value: "depends" },
    ],
    correctAnswer: "no",
    explanation: "The array is NOT sorted. Binary search assumes sorted order — it will compare against the middle element, then discard half the array based on ordering. On unsorted data, it can easily skip over the target.",
  },
  {
    id: "predict-2",
    type: "predict",
    question: "Will linear search find the target?",
    scenario: "Array: [42, 17, 8, 91, 3, 65]. Target: 100. The array has 6 elements.",
    options: [
      { label: "Yes — after checking all elements", value: "yes" },
      { label: "No — 100 is not in the array", value: "no" },
      { label: "Error — array too small", value: "error" },
    ],
    correctAnswer: "no",
    explanation: "Linear search will check every element (6 comparisons) and none equals 100. It correctly reports 'not found'. Linear search always gives the correct answer — it's just slow on large data.",
  },
  {
    id: "estimate-1",
    type: "estimate",
    question: "How many comparisons does binary search need?",
    scenario: "Sorted array of 1,024 elements. Target is the very last element.",
    options: [
      { label: "~5 comparisons", value: "5" },
      { label: "~10 comparisons", value: "10" },
      { label: "~32 comparisons", value: "32" },
      { label: "~512 comparisons", value: "512" },
    ],
    correctAnswer: "10",
    explanation: "log₂(1024) = 10. Binary search always takes at most log₂(n) steps regardless of where the target is. Even the worst case is only 10 comparisons for 1,024 elements.",
  },
  {
    id: "estimate-2",
    type: "estimate",
    question: "How many comparisons does linear search need on average?",
    scenario: "Unsorted array of 200 elements. The target exists somewhere in the array.",
    options: [
      { label: "~1 comparison", value: "1" },
      { label: "~14 comparisons", value: "14" },
      { label: "~100 comparisons", value: "100" },
      { label: "~200 comparisons", value: "200" },
    ],
    correctAnswer: "100",
    explanation: "On average, the target is in the middle of the array, so linear search checks n/2 = 100 elements. Best case is 1 (first element), worst case is 200 (last element).",
  },
  {
    id: "estimate-3",
    type: "estimate",
    question: "What jump size should jump search use?",
    scenario: "Sorted array of 100 elements. You want to minimise total comparisons (jumps + linear scan).",
    options: [
      { label: "Block size 2", value: "2" },
      { label: "Block size 10", value: "10" },
      { label: "Block size 50", value: "50" },
      { label: "Block size 100", value: "100" },
    ],
    correctAnswer: "10",
    explanation: "Optimal block size is √n = √100 = 10. Too small means too many jumps; too large means too much linear scanning. √n balances both phases.",
  },
]

const typeLabels = { identify: "Scenario", predict: "Predict", estimate: "Estimate" }
const typeColors = { identify: "text-violet-400", predict: "text-amber-400", estimate: "text-cyan-400" }

function microExerciseCompletionBlurb(pct: number): string {
  if (pct >= 88) return "Legendary — you think in constraints, not algorithms."
  if (pct >= 75) return "Heroic — strong pattern recognition."
  if (pct >= 50) return "Normal — review the constraints you missed."
  return "Easy — revisit the decision checklist and try again."
}

function microExerciseTrophyClass(pct: number): string {
  if (pct >= 75) return "text-amber-400"
  if (pct >= 50) return "text-gray-300"
  return "text-gray-600"
}

function microExerciseOptionClasses(
  showResult: boolean,
  selected: string | null,
  optValue: string,
  correctAnswer: string,
): { border: string; bg: string; text: string } {
  if (showResult && optValue === correctAnswer) {
    return { border: "border-emerald-500/50", bg: "bg-emerald-500/10", text: "text-emerald-300" }
  }
  if (showResult && optValue === selected) {
    return { border: "border-rose-500/50", bg: "bg-rose-500/10", text: "text-rose-300" }
  }
  if (!showResult && selected === optValue) {
    return { border: "border-green-500/50", bg: "bg-green-500/10", text: "text-green-300" }
  }
  return { border: "border-slate-700", bg: "bg-slate-900/40", text: "text-gray-300" }
}

type MicroExerciseOptionButtonProps = Readonly<{
  opt: { label: string; value: string }
  showResult: boolean
  selected: string | null
  correctAnswer: string
  onSelect: (value: string) => void
}>

function MicroExerciseOptionButton({
  opt,
  showResult,
  selected,
  correctAnswer,
  onSelect,
}: MicroExerciseOptionButtonProps) {
  const { border: borderClass, bg: bgClass, text: textClass } = microExerciseOptionClasses(
    showResult,
    selected,
    opt.value,
    correctAnswer,
  )
  return (
    <button
      type="button"
      onClick={() => {
        if (showResult) {
          return
        }
        onSelect(opt.value)
      }}
      disabled={showResult}
      className={`w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all text-xs ${borderClass} ${bgClass} ${textClass} ${showResult ? "" : "hover:border-slate-600"}`}
    >
      {opt.label}
    </button>
  )
}

export default function SearchMicroExercises() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const exercise = exercises[currentIdx]
  const isCorrect = selected === exercise.correctAnswer
  const isComplete = currentIdx >= exercises.length

  const submitAnswer = useCallback(() => {
    if (!selected) return
    setShowResult(true)
    setScore((s) => ({
      correct: s.correct + (selected === exercise.correctAnswer ? 1 : 0),
      total: s.total + 1,
    }))
  }, [selected, exercise.correctAnswer])

  function nextExercise() {
    setSelected(null)
    setShowResult(false)
    setCurrentIdx((i) => i + 1)
  }

  function resetAll() {
    setCurrentIdx(0)
    setSelected(null)
    setShowResult(false)
    setScore({ correct: 0, total: 0 })
  }

  if (isComplete) {
    const pct = Math.round((score.correct / score.total) * 100)
    return (
      <div className="text-center py-8 space-y-4">
        <Trophy className={`w-10 h-10 mx-auto ${microExerciseTrophyClass(pct)}`} />
        <div>
          <p className="text-lg font-bold text-white">{score.correct}/{score.total} Correct</p>
          <p className="text-xs text-gray-400 mt-1">{microExerciseCompletionBlurb(pct)}</p>
        </div>
        <button onClick={resetAll} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors">
          <RotateCcw className="w-3 h-3" />
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-bold text-white">Micro-Exercises</h3>
        </div>
        <span className="text-[10px] text-gray-500">{currentIdx + 1} / {exercises.length} · {score.correct} correct</span>
      </div>

      <div className="flex items-center gap-1">
        {exercises.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < currentIdx ? "bg-green-500" : i === currentIdx ? "bg-green-500/40" : "bg-slate-700"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.15 }}
          className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className={`text-[9px] uppercase tracking-wider font-bold ${typeColors[exercise.type]}`}>
              {typeLabels[exercise.type]}
            </span>
          </div>

          <p className="text-xs font-semibold text-white">{exercise.question}</p>

          {exercise.scenario && (
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3">
              <p className="text-[11px] text-gray-300 leading-relaxed font-mono">{exercise.scenario}</p>
            </div>
          )}

          <div className="space-y-2">
            {exercise.options.map((opt) => (
              <MicroExerciseOptionButton
                key={opt.value}
                opt={opt}
                showResult={showResult}
                selected={selected}
                correctAnswer={exercise.correctAnswer}
                onSelect={setSelected}
              />
            ))}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`rounded-lg border p-3 ${isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"}`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />}
                  <div>
                    <p className={`text-xs font-semibold ${isCorrect ? "text-emerald-300" : "text-rose-300"}`}>
                      {isCorrect ? "Correct!" : "Not quite"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{exercise.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-end gap-2 pt-1">
            {showResult ? (
              <button
                type="button"
                onClick={nextExercise}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors"
              >
                Next <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitAnswer}
                disabled={!selected}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors disabled:opacity-40"
              >
                Check Answer
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
