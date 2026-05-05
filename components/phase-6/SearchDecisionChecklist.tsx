"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, ArrowRight, RotateCcw, Lightbulb } from "lucide-react"

interface ChecklistQuestion {
  id: string
  question: string
  options: { label: string; value: string; hint: string }[]
}

const questions: ChecklistQuestion[] = [
  {
    id: "sorted",
    question: "Is the data sorted?",
    options: [
      { label: "Yes — sorted ascending/descending", value: "sorted", hint: "Opens up binary and jump search" },
      { label: "No — unsorted or unknown order", value: "unsorted", hint: "Limits you to linear scan" },
    ],
  },
  {
    id: "access",
    question: "What access pattern does the data structure support?",
    options: [
      { label: "Random access (array, buffer)", value: "random", hint: "Can jump to any index in O(1)" },
      { label: "Sequential only (linked list, stream)", value: "sequential", hint: "Must walk through elements one by one" },
    ],
  },
  {
    id: "comparison-cost",
    question: "How expensive is each comparison?",
    options: [
      { label: "Cheap — integers, simple equality", value: "cheap", hint: "Comparison count matters less than total time" },
      { label: "Expensive — string matching, I/O, network", value: "expensive", hint: "Minimising comparisons is critical" },
    ],
  },
  {
    id: "match-type",
    question: "What kind of match do you need?",
    options: [
      { label: "Exact match — find this specific value", value: "exact", hint: "Standard search problem" },
      { label: "First/last occurrence — duplicates exist", value: "boundary", hint: "Needs modified binary search with boundary tracking" },
      { label: "Threshold — first value satisfying a condition", value: "predicate", hint: "Search-space binary search (monotonic predicate)" },
    ],
  },
]

interface Recommendation {
  algorithm: string
  algorithmId: string
  reason: string
  confidence: "strong" | "moderate" | "weak"
}

function getRecommendation(answers: Record<string, string>): Recommendation {
  const { sorted, access, "comparison-cost": cost, "match-type": matchType } = answers

  if (sorted === "unsorted" || access === "sequential") {
    return { algorithm: "Linear Search", algorithmId: "linear", reason: "Unsorted data or sequential-only access means you must scan element by element. No shortcut exists.", confidence: "strong" }
  }

  if (matchType === "predicate") {
    return { algorithm: "Binary Search (Search Space)", algorithmId: "binary", reason: "Monotonic predicate over a sorted search space — classic binary search pattern. Halve the space each step until you find the boundary.", confidence: "strong" }
  }

  if (matchType === "boundary") {
    return { algorithm: "Binary Search (Modified)", algorithmId: "binary", reason: "Finding first/last occurrence needs a binary search that doesn't stop at the first match — it continues narrowing to find the boundary.", confidence: "strong" }
  }

  if (cost === "expensive") {
    return { algorithm: "Binary Search", algorithmId: "binary", reason: "Expensive comparisons make O(log n) comparisons far more valuable than O(n). Binary search minimises the number of comparisons.", confidence: "strong" }
  }

  if (sorted === "sorted" && access === "random") {
    if (cost === "cheap") {
      return { algorithm: "Jump Search or Binary Search", algorithmId: "jump", reason: "Both work on sorted random-access data. Jump search is simpler to implement and can be tuned with block size. Binary search is faster (log n vs √n) but harder to adapt.", confidence: "moderate" }
    }
    return { algorithm: "Binary Search", algorithmId: "binary", reason: "Sorted data with random access — binary search is the optimal general choice.", confidence: "strong" }
  }

  return { algorithm: "Linear Search", algorithmId: "linear", reason: "When in doubt, linear search always works. It's the baseline.", confidence: "weak" }
}

const confidenceColor = { strong: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", moderate: "text-amber-400 border-amber-500/30 bg-amber-500/10", weak: "text-gray-400 border-slate-600 bg-slate-800/50" }

export default function SearchDecisionChecklist({ onSelectAlgorithm }: { onSelectAlgorithm: (id: string) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(0)

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === questions.length
  const recommendation = allAnswered ? getRecommendation(answers) : null

  function selectOption(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep((s) => Math.min(s + 1, questions.length - 1)), 300)
    }
  }

  function resetChecklist() {
    setAnswers({})
    setCurrentStep(0)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-bold text-white">Search Decision Checklist</h3>
        </div>
        {answeredCount > 0 && (
          <button onClick={resetChecklist} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors">
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>
      <p className="text-[11px] text-gray-400">Answer these constraints to find the right search strategy. Pattern recognition beats memorisation.</p>

      <div className="flex items-center gap-1 mb-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentStep(i)}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              answers[q.id] ? "bg-green-500" : i === currentStep ? "bg-green-500/40" : "bg-slate-700"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questions[currentStep].id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.15 }}
          className="bg-slate-800/60 border border-slate-700 rounded-xl p-4"
        >
          <div className="flex items-start gap-2 mb-3">
            {answers[questions[currentStep].id] ? (
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="text-xs font-semibold text-white">
                {currentStep + 1}. {questions[currentStep].question}
              </p>
            </div>
          </div>

          <div className="space-y-2 ml-6">
            {questions[currentStep].options.map((opt) => {
              const isSelected = answers[questions[currentStep].id] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => selectOption(questions[currentStep].id, opt.value)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all text-xs ${
                    isSelected
                      ? "border-green-500/50 bg-green-500/10 text-green-300"
                      : "border-slate-700 bg-slate-900/40 text-gray-300 hover:border-slate-600 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="font-medium">{opt.label}</span>
                  <p className="text-[10px] mt-1 opacity-60">{opt.hint}</p>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between mt-3 ml-6">
            <button
              onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
              disabled={currentStep === 0}
              className="text-[10px] text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep((s) => Math.min(s + 1, questions.length - 1))}
              disabled={currentStep === questions.length - 1}
              className="text-[10px] text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`rounded-xl border-2 p-4 ${confidenceColor[recommendation.confidence]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span className="text-sm font-bold">Use: {recommendation.algorithm}</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider opacity-60">{recommendation.confidence} match</span>
            </div>
            <p className="text-[11px] opacity-80 mb-3">{recommendation.reason}</p>
            <button
              onClick={() => onSelectAlgorithm(recommendation.algorithmId)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 transition-colors"
            >
              Open {recommendation.algorithm} Visualizer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
