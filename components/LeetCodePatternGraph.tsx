"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  leetcodePatternNodes,
  patternLevelMeta,
  getPatternNode,
  dsaFoundationsByPattern,
  PATTERN_PROGRESS_STORAGE_KEY,
  emptyNodeProgress,
  type PatternProgressState,
  type PatternDifficulty,
  type PatternNode,
} from "@/lib/learning/leetcode-pattern-graph"

function difficultyClasses(difficulty: PatternDifficulty) {
  if (difficulty === "Easy") return "border-emerald-400/50 bg-emerald-500/10 text-emerald-200"
  if (difficulty === "Medium") return "border-blue-400/50 bg-blue-500/10 text-blue-200"
  return "border-red-400/50 bg-red-500/10 text-red-200"
}

function badgeClasses(difficulty: PatternDifficulty) {
  if (difficulty === "Easy") return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
  if (difficulty === "Medium") return "bg-blue-500/20 text-blue-200 border-blue-400/40"
  return "bg-red-500/20 text-red-200 border-red-400/40"
}

function collectNeighbors(node: PatternNode) {
  return new Set([node.id, ...node.prerequisites, ...node.unlocks])
}

export default function LeetCodePatternGraph() {
  const [selectedId, setSelectedId] = useState("arrays-strings")
  const [progress, setProgress] = useState<PatternProgressState>({})

  const selected = getPatternNode(selectedId) || leetcodePatternNodes[0]
  const related = useMemo(() => collectNeighbors(selected), [selected])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem(PATTERN_PROGRESS_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as PatternProgressState
      setProgress(parsed || {})
    } catch {
      setProgress({})
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem(PATTERN_PROGRESS_STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const getNodeProgress = (id: string) => ({
    ...emptyNodeProgress(),
    ...(progress[id] || {}),
  })

  const isAvailable = (node: PatternNode) =>
    node.prerequisites.every((prereqId) => getNodeProgress(prereqId).completed)

  const grouped = useMemo(() => {
    return patternLevelMeta.map((level) => ({
      ...level,
      nodes: leetcodePatternNodes.filter((node) => node.level === level.level),
    }))
  }, [])

  const selectedProgress = getNodeProgress(selected.id)
  const dsaFoundation = dsaFoundationsByPattern[selected.id] || "Core data structures"

  return (
    <section className="mb-10">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-2">Interactive LeetCode Pattern Graph</h3>
        <p className="text-sm text-gray-300 mb-4">
          Mechanical progression engine: nodes unlock only after prerequisites.
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-5 text-xs">
          <span className="px-2 py-1 rounded border bg-emerald-500/20 text-emerald-200 border-emerald-400/40">Easy</span>
          <span className="px-2 py-1 rounded border bg-blue-500/20 text-blue-200 border-blue-400/40">Medium</span>
          <span className="px-2 py-1 rounded border bg-red-500/20 text-red-200 border-red-400/40">Hard</span>
          <span className="px-2 py-1 rounded border bg-cyan-500/20 text-cyan-200 border-cyan-400/40">Selected / related path</span>
          <span className="px-2 py-1 rounded border bg-yellow-500/20 text-yellow-200 border-yellow-400/40">Locked</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="order-2 space-y-4">
            {grouped.map((level) => (
              <div key={level.level} className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
                <div className="mb-3">
                  <div className="text-sm font-semibold text-white">
                    Level {level.level}: {level.title}
                  </div>
                  <div className="text-xs text-cyan-300">{level.range}</div>
                  <p className="text-xs text-gray-400 mt-1">{level.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-2">
                  {level.nodes.map((node) => {
                    const isSelected = node.id === selected.id
                    const isRelated = related.has(node.id)
                    const unlocked = isAvailable(node)
                    const nodeProgress = getNodeProgress(node.id)
                    return (
                      <motion.button
                        key={node.id}
                        onClick={() => setSelectedId(node.id)}
                        whileHover={{ y: -1.5 }}
                        whileTap={{ scale: 0.985 }}
                        className={`text-left rounded-lg border px-3 py-2 transition-all ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-500/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]"
                            : isRelated
                              ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100"
                              : !unlocked
                                ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-100"
                                : difficultyClasses(node.difficulty)
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">{node.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${badgeClasses(node.difficulty)}`}>
                            {node.difficulty}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-300 mt-1">
                          prereq: {node.prerequisites.length} · unlocks: {node.unlocks.length}
                        </div>
                        <div className="text-[11px] mt-1 text-gray-300">
                          {nodeProgress.completed ? "Completed" : unlocked ? "Unlocked" : "Locked"}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="order-1 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
            <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Selected node</div>
            <h4 className="text-xl font-bold text-white mb-2">{selected.label}</h4>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-1 rounded border border-cyan-400/40 text-cyan-200 bg-cyan-500/15">Level {selected.level}</span>
              <span className={`text-xs px-2 py-1 rounded border ${badgeClasses(selected.difficulty)}`}>{selected.difficulty}</span>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-1">Why this level?</div>
              <p className="text-sm text-gray-200">{selected.whyThisLevel}</p>
            </div>

            <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <div className="text-xs text-emerald-300 mb-2">Read first: real-world usage</div>
              <ul className="space-y-1.5 text-sm text-emerald-100">
                {selected.readFirstExamples.map((example) => (
                  <li key={example} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
              <div className="text-xs text-cyan-300 mb-2">Learning structure</div>
              <div className="text-sm text-cyan-100">
                <span className="font-semibold">DSA:</span> {dsaFoundation}
              </div>
              <div className="text-sm text-cyan-100">
                <span className="font-semibold">Algo pattern:</span> {selected.label}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">Prereqs</div>
              <div className="flex flex-wrap gap-2">
                {selected.prerequisites.length === 0 ? (
                  <span className="text-xs text-gray-400">None - entry point pattern.</span>
                ) : (
                  selected.prerequisites.map((id) => {
                    const node = getPatternNode(id)
                    if (!node) return null
                    return (
                      <button
                        key={id}
                        onClick={() => setSelectedId(id)}
                        className="text-xs px-2 py-1 rounded border border-slate-600 text-gray-200 hover:border-cyan-400/50"
                      >
                        {node.label}
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">Unlocks next</div>
              <div className="flex flex-wrap gap-2">
                {selected.unlocks.length === 0 ? (
                  <span className="text-xs text-gray-400">Capstone node.</span>
                ) : (
                  selected.unlocks.map((id) => {
                    const node = getPatternNode(id)
                    if (!node) return null
                    return (
                      <button
                        key={id}
                        onClick={() => setSelectedId(id)}
                        className="text-xs px-2 py-1 rounded border border-slate-600 text-gray-200 hover:border-cyan-400/50"
                      >
                        {node.label}
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            <div className="mt-4">
              <Link
                href={`/phase-5/problems/${selected.id}`}
                className="inline-flex items-center px-3 py-2 rounded-md bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-500 transition-colors"
              >
                Open problems & completion page
              </Link>
              <p className="text-xs text-gray-400 mt-2">
                Progress status: {selectedProgress.completed ? "Completed" : isAvailable(selected) ? "Unlocked" : "Locked"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
