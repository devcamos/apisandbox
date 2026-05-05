"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, GraduationCap, RotateCcw, Scroll, Sparkles, Swords } from "lucide-react"
import {
  SHINOBI_ATTRIBUTES,
  getOverallShinobiTitle,
  getRankForXp,
} from "@/lib/learning/shinobi-progress"
import { shinobiQuizQuestions } from "@/lib/learning/shinobi-quiz"
import type { ShinobiProgressApi } from "@/hooks/useShinobiProgress"
import type { ShinobiQuizQuestion } from "@/lib/learning/shinobi-quiz"

interface Props {
  shinobi: ShinobiProgressApi
}

export default function ShinobiLearningBoard({ shinobi }: Props) {
  const { state, hydrated, awardQuizAnswer, finishQuizRun, resetProgress } = shinobi
  const [expanded, setExpanded] = useState(true)
  const [quizOpen, setQuizOpen] = useState(false)

  const overall = useMemo(() => {
    if (!state) return { label: "Genin", tier: getRankForXp(0).tier }
    return getOverallShinobiTitle(state.xp)
  }, [state])

  if (!hydrated || !state) {
    return (
      <div className="mb-8 rounded-2xl border border-orange-500/20 bg-orange-950/20 p-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-700 rounded mb-4" />
        <div className="h-24 bg-slate-800/80 rounded-xl" />
      </div>
    )
  }

  return (
    <>
      <section className="mb-8 rounded-2xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-950/40 via-slate-900/80 to-amber-950/30 overflow-hidden shadow-lg shadow-orange-900/20">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-orange-500/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/40">
              <Scroll className="w-6 h-6 text-orange-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                Shinobi path
                <span className="text-xs font-normal text-orange-200/90 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/35">
                  Overall: {overall.label}
                </span>
              </h2>
              <p className="text-xs text-orange-200/70 mt-0.5">
                Five layers rank from Genin → Chūnin → Jōnin → Hokage. Quiz + exploring each algorithm tab earns XP.
              </p>
            </div>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-orange-300 shrink-0" /> : <ChevronDown className="w-5 h-5 text-orange-300 shrink-0" />}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-4 border-t border-orange-500/20">
                <div className="overflow-x-auto pt-4">
                  <table className="w-full text-left text-xs min-w-[520px]">
                    <thead>
                      <tr className="text-orange-200/80 border-b border-orange-500/20">
                        <th className="pb-2 pr-3 font-semibold">Layer</th>
                        <th className="pb-2 pr-3 font-semibold">What improves</th>
                        <th className="pb-2 pr-3 font-semibold">Rank</th>
                        <th className="pb-2 font-semibold">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      {SHINOBI_ATTRIBUTES.map((attr) => {
                        const xp = state.xp[attr.id]
                        const { tier, next, progress } = getRankForXp(xp)
                        const bar = next ? progress : 1
                        return (
                          <tr key={attr.id} className="border-b border-slate-700/50">
                            <td className="py-2.5 pr-3 font-medium text-white">{attr.layer}</td>
                            <td className="py-2.5 pr-3 text-gray-400">{attr.improves}</td>
                            <td className="py-2.5 pr-3 whitespace-nowrap">
                              <span className="text-amber-300 font-semibold">{tier.label}</span>
                              <span className="text-gray-600 ml-1">({xp} XP)</span>
                            </td>
                            <td className="py-2.5 w-[140px]">
                              <div className="h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-600">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                                  style={{ width: `${Math.round(bar * 100)}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuizOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/25 border border-orange-500/40 text-orange-100 text-sm font-semibold hover:bg-orange-500/35 transition-colors"
                  >
                    <Swords className="w-4 h-4" />
                    Training quiz ({shinobiQuizQuestions.length} questions)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.confirm("Reset all Shinobi XP and exploration bonuses on this device?")) {
                        resetProgress()
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-600 text-slate-400 text-xs hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset progress
                  </button>
                  <span className="text-[10px] text-gray-500">
                    Quizzes completed: {state.quizRunsCompleted} · Stored locally in your browser
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <QuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        awardQuizAnswer={awardQuizAnswer}
        finishQuizRun={finishQuizRun}
      />
    </>
  )
}

function QuizModal({
  open,
  onClose,
  awardQuizAnswer,
  finishQuizRun,
}: {
  open: boolean
  onClose: () => void
  awardQuizAnswer: (question: ShinobiQuizQuestion, correct: boolean) => void
  finishQuizRun: ShinobiProgressApi["finishQuizRun"]
}) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showExplain, setShowExplain] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (open) {
      setIdx(0)
      setSelected(null)
      setShowExplain(false)
      setDone(false)
    }
  }, [open])

  const q = shinobiQuizQuestions[idx]
  const last = idx >= shinobiQuizQuestions.length - 1

  function closeModal() {
    setIdx(0)
    setSelected(null)
    setShowExplain(false)
    setDone(false)
    onClose()
  }

  function pickOption(i: number) {
    if (showExplain) return
    setSelected(i)
    const correct = i === q.correctIndex
    awardQuizAnswer(q, correct)
    setShowExplain(true)
  }

  function next() {
    if (last) {
      finishQuizRun()
      setDone(true)
      return
    }
    setIdx((n) => n + 1)
    setSelected(null)
    setShowExplain(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl border-2 border-orange-500/40 bg-slate-900 shadow-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-orange-500/25 bg-orange-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-orange-300" />
            <span className="font-bold text-white">Training quiz</span>
          </div>
          <button type="button" onClick={closeModal} className="text-sm text-gray-400 hover:text-white">
            Close
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-white font-semibold">Run complete</p>
            <p className="text-sm text-gray-400">XP applied to each layer you answered correctly. Come back anytime to train again.</p>
            <button
              type="button"
              onClick={closeModal}
              className="mt-2 px-5 py-2 rounded-xl bg-orange-500/25 border border-orange-500/40 text-orange-100 text-sm font-medium"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <p className="text-[10px] text-orange-300/80 uppercase tracking-wider">
              Question {idx + 1} / {shinobiQuizQuestions.length} · trains {SHINOBI_ATTRIBUTES.find((a) => a.id === q.attribute)?.layer}
            </p>
            <p className="text-sm text-gray-200 leading-relaxed">{q.prompt}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                let cls = "border-slate-600 bg-slate-800/80 text-gray-300 hover:border-orange-500/40"
                if (showExplain) {
                  if (i === q.correctIndex) cls = "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                  else if (i === selected && i !== q.correctIndex) cls = "border-rose-500/50 bg-rose-500/10 text-rose-200"
                } else if (selected === i) {
                  cls = "border-orange-500/50 bg-orange-500/10 text-orange-100"
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={showExplain}
                    onClick={() => pickOption(i)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-colors ${cls}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {showExplain && (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-xs text-gray-400">
                <span className="text-gray-500 font-medium">Why: </span>
                {q.explanation}
              </div>
            )}
            {showExplain && (
              <button
                type="button"
                onClick={next}
                className="w-full py-2.5 rounded-xl bg-orange-500/25 border border-orange-500/40 text-orange-100 text-sm font-semibold"
              >
                {last ? "Finish run" : "Next question"}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
