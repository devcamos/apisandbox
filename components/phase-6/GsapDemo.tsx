"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import gsap from "gsap"

const SORTED_ARRAY = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
const UNSORTED_ARRAY = [38, 12, 91, 5, 23, 72, 8, 56, 2, 16]
const DEFAULT_TARGET = 23

export type SearchAlgorithm = "binary" | "linear" | "jump"

interface SearchState {
  low: number
  high: number
  mid: number
  phase: "idle" | "narrowing" | "checking" | "found" | "not-found"
  explanation: string
}

function generateBinarySearchSteps(arr: number[], target: number): SearchState[] {
  const states: SearchState[] = []
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    states.push(
      { low, high, mid, phase: "narrowing", explanation: `Search window: indices ${low}–${high}. Middle = ⌊(${low}+${high})/2⌋ = ${mid}` },
      { low, high, mid, phase: "checking", explanation: `Compare arr[${mid}] = ${arr[mid]} with target ${target}` }
    )

    if (arr[mid] === target) {
      states.push({ low, high, mid, phase: "found", explanation: `${arr[mid]} === ${target} — found at index ${mid}!` })
      return states
    } else if (arr[mid] < target) {
      states.push({ low: mid + 1, high, mid, phase: "narrowing", explanation: `${arr[mid]} < ${target} — move low to ${mid + 1}` })
      low = mid + 1
    } else {
      states.push({ low, high: mid - 1, mid, phase: "narrowing", explanation: `${arr[mid]} > ${target} — move high to ${mid - 1}` })
      high = mid - 1
    }
  }
  states.push({ low, high, mid: -1, phase: "not-found", explanation: `low (${low}) > high (${high}) — ${target} is not in the array.` })
  return states
}

function generateLinearSearchSteps(arr: number[], target: number): SearchState[] {
  const states: SearchState[] = []
  for (let i = 0; i < arr.length; i++) {
    states.push({ low: 0, high: arr.length - 1, mid: i, phase: "checking", explanation: `Check index ${i}: arr[${i}] = ${arr[i]}` })
    if (arr[i] === target) {
      states.push({ low: 0, high: arr.length - 1, mid: i, phase: "found", explanation: `${arr[i]} === ${target} — found at index ${i}!` })
      return states
    }
    states.push({ low: 0, high: arr.length - 1, mid: i, phase: "narrowing", explanation: `${arr[i]} ≠ ${target} — move to next element` })
  }
  states.push({ low: 0, high: arr.length - 1, mid: -1, phase: "not-found", explanation: `Scanned all ${arr.length} elements — ${target} not found.` })
  return states
}

function generateJumpSearchSteps(arr: number[], target: number): SearchState[] {
  const states: SearchState[] = []
  const n = arr.length
  const step = Math.floor(Math.sqrt(n))
  let prev = 0
  let curr = step

  states.push({ low: 0, high: n - 1, mid: -1, phase: "narrowing", explanation: `Jump size = ⌊√${n}⌋ = ${step}. Start scanning in blocks.` })

  while (curr < n && arr[Math.min(curr, n - 1)] < target) {
    states.push({ low: prev, high: Math.min(curr, n - 1), mid: Math.min(curr, n - 1), phase: "checking", explanation: `Jump to index ${Math.min(curr, n - 1)}: arr[${Math.min(curr, n - 1)}] = ${arr[Math.min(curr, n - 1)]}` })
    states.push({ low: prev, high: Math.min(curr, n - 1), mid: Math.min(curr, n - 1), phase: "narrowing", explanation: `${arr[Math.min(curr, n - 1)]} < ${target} — jump forward another ${step}` })
    prev = curr
    curr += step
  }

  states.push({ low: prev, high: Math.min(curr, n - 1), mid: prev, phase: "narrowing", explanation: `Target is between indices ${prev}–${Math.min(curr, n - 1)}. Linear scan this block.` })

  for (let i = prev; i <= Math.min(curr, n - 1); i++) {
    states.push({ low: prev, high: Math.min(curr, n - 1), mid: i, phase: "checking", explanation: `Check index ${i}: arr[${i}] = ${arr[i]}` })
    if (arr[i] === target) {
      states.push({ low: prev, high: Math.min(curr, n - 1), mid: i, phase: "found", explanation: `${arr[i]} === ${target} — found at index ${i}!` })
      return states
    }
    if (arr[i] > target) {
      states.push({ low: prev, high: Math.min(curr, n - 1), mid: -1, phase: "not-found", explanation: `${arr[i]} > ${target} — overshot. ${target} is not in the array.` })
      return states
    }
  }

  states.push({ low: 0, high: n - 1, mid: -1, phase: "not-found", explanation: `Scanned entire block — ${target} not found.` })
  return states
}

function generateSteps(algo: SearchAlgorithm, arr: number[], target: number): SearchState[] {
  if (algo === "binary") return generateBinarySearchSteps(arr, target)
  if (algo === "jump") return generateJumpSearchSteps(arr, target)
  return generateLinearSearchSteps(arr, target)
}

function usesWindowHighlight(algorithm: SearchAlgorithm): boolean {
  return algorithm === "binary" || algorithm === "jump"
}

function computeCellBorderColor(
  algorithm: SearchAlgorithm,
  state: SearchState,
  isInRange: boolean,
  isMid: boolean,
  isJumpBoundary: boolean
): string {
  if (isMid) {
    return state.phase === "found" ? "#34d399" : "#fbbf24"
  }
  if (isJumpBoundary && isInRange) {
    return "#a78bfa"
  }
  if (isInRange) {
    return usesWindowHighlight(algorithm) ? "#4ade80" : "#475569"
  }
  return "#1e293b"
}

function computeCellBackgroundColor(
  algorithm: SearchAlgorithm,
  state: SearchState,
  isInRange: boolean,
  isMid: boolean,
  isJumpBoundary: boolean
): string {
  if (isMid) {
    return state.phase === "found" ? "rgba(52, 211, 153, 0.25)" : "rgba(251, 191, 36, 0.2)"
  }
  if (isJumpBoundary && isInRange) {
    return "rgba(167, 139, 250, 0.1)"
  }
  if (isInRange) {
    return usesWindowHighlight(algorithm) ? "rgba(34, 197, 94, 0.1)" : "rgba(51, 65, 85, 1)"
  }
  return "rgba(15, 23, 42, 0.3)"
}

function computeCellScale(isMid: boolean, isInRange: boolean): number {
  if (isMid) return 1.15
  if (isInRange) return 1
  return 0.85
}

function computeCellOpacity(isPast: boolean, isInRange: boolean): number {
  if (isPast) return 0.3
  if (isInRange) return 1
  return 0.3
}

const algorithmMeta: Record<SearchAlgorithm, { label: string; complexity: string; description: string; array: number[] }> = {
  binary: {
    label: "Binary Search",
    complexity: "O(log n)",
    description: "Binary search halves the search space each iteration, giving O(log n) on sorted data.",
    array: SORTED_ARRAY,
  },
  linear: {
    label: "Linear Search",
    complexity: "O(n)",
    description: "Linear search checks every element one by one. Works on unsorted data but scales poorly.",
    array: UNSORTED_ARRAY,
  },
  jump: {
    label: "Jump Search",
    complexity: "O(√n)",
    description: "Jump search skips ahead in √n blocks on sorted data, then linear scans the matching block.",
    array: SORTED_ARRAY,
  },
}

export default function GsapDemo({ algorithm = "binary" }: { algorithm?: SearchAlgorithm }) {
  const meta = algorithmMeta[algorithm]
  const arr = meta.array
  const [target, setTarget] = useState(DEFAULT_TARGET)
  const [steps, setSteps] = useState(() => generateSteps(algorithm, arr, DEFAULT_TARGET))
  const [stepIdx, setStepIdx] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [comparisonCount, setComparisonCount] = useState(0)
  const cellRefs = useRef<(HTMLDivElement | null)[]>([])
  const pointerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function resetCellStyles() {
    gsap.to(cellRefs.current, { scale: 1, opacity: 1, duration: 0.3, borderColor: "#475569", backgroundColor: "rgba(51, 65, 85, 1)" })
    if (pointerRef.current) gsap.to(pointerRef.current, { opacity: 0, duration: 0.2 })
  }

  useEffect(() => {
    setIsPlaying(false)
    setStepIdx(-1)
    setTarget(DEFAULT_TARGET)
    setComparisonCount(0)
    setSteps(generateSteps(algorithm, algorithmMeta[algorithm].array, DEFAULT_TARGET))
    resetCellStyles()
  }, [algorithm])

  const current = stepIdx >= 0 && stepIdx < steps.length ? steps[stepIdx] : null

  const animatePointer = useCallback((midIndex: number) => {
    if (!pointerRef.current || midIndex < 0) return
    const cell = cellRefs.current[midIndex]
    if (!cell) return
    const offset = cell.offsetLeft + cell.offsetWidth / 2 - 6
    gsap.to(pointerRef.current, { x: offset, duration: 0.4, ease: "power3.out", opacity: 1 })
  }, [])

  const animateCells = useCallback(
    (state: SearchState) => {
      const jumpBlockSize = algorithm === "jump" ? Math.floor(Math.sqrt(arr.length)) : 0

      cellRefs.current.forEach((cell, i) => {
        if (!cell) return
        const isInRange = i >= state.low && i <= state.high
        const isMid = i === state.mid

        let isPast = false
        if (algorithm === "linear") isPast = i < state.mid
        if (algorithm === "jump" && state.phase === "narrowing" && state.mid >= 0) {
          isPast = i < state.low
        }

        const isJumpBoundary = algorithm === "jump" && jumpBlockSize > 0 && i % jumpBlockSize === 0 && i <= state.high

        const borderColor = computeCellBorderColor(algorithm, state, isInRange, isMid, isJumpBoundary)
        const backgroundColor = computeCellBackgroundColor(algorithm, state, isInRange, isMid, isJumpBoundary)
        const scale = computeCellScale(isMid, isInRange)
        const opacity = computeCellOpacity(isPast, isInRange)

        gsap.to(cell, {
          scale,
          opacity,
          duration: 0.35,
          ease: "back.out(1.4)",
          borderColor,
          backgroundColor,
        })
      })
      if (state.mid >= 0) animatePointer(state.mid)
    },
    [animatePointer, algorithm, arr.length]
  )

  const applyStep = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= steps.length) return
      setStepIdx(idx)
      animateCells(steps[idx])
      if (steps[idx].phase === "checking") {
        setComparisonCount((c) => c + 1)
      }
    },
    [animateCells, steps]
  )

  useEffect(() => {
    if (!isPlaying) return
    if (stepIdx >= steps.length - 1) { setIsPlaying(false); return }
    timerRef.current = setTimeout(() => applyStep(stepIdx + 1), algorithm === "linear" ? 600 : 900)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [applyStep, algorithm, isPlaying, stepIdx, steps.length])

  function reset() {
    setIsPlaying(false)
    setStepIdx(-1)
    setComparisonCount(0)
    resetCellStyles()
  }

  function changeTarget(val: number) {
    reset()
    setTarget(val)
    setSteps(generateSteps(algorithm, arr, val))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{meta.label} Visualizer</h3>
          <p className="text-xs text-green-300/70 mt-0.5">
            The visualizer shows the {algorithm === "binary" ? "narrowing search window" : algorithm === "jump" ? "block jumps and linear scan" : "sequential scan"} step by step
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500">Target:</span>
            <select
              value={target}
              onChange={(e) => changeTarget(Number(e.target.value))}
              className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-green-300 focus:outline-none focus:border-green-500/50"
            >
              {arr.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
              <option value={50}>50 (not found)</option>
            </select>
          </div>
        </div>
      </div>

      {/* State indicators — low / mid / high + comparison counter */}
      {current && (
        <div className="flex items-center justify-center gap-4 text-[10px] font-mono">
          {(algorithm === "binary" || algorithm === "jump") && (
            <>
              <span className="text-green-400">low: {current.low}</span>
              <span className="text-amber-400">mid: {current.mid >= 0 ? current.mid : "—"}</span>
              <span className="text-green-400">high: {current.high}</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">window: {current.high - current.low + 1} cells</span>
            </>
          )}
          {algorithm === "linear" && (
            <span className="text-amber-400">scanning: [{Math.max(current.mid, 0)}]</span>
          )}
          <span className="text-gray-500">|</span>
          <span className="text-cyan-400">comparisons: {comparisonCount}</span>
        </div>
      )}

      <div className="relative">
        {/* Window bracket for binary/jump */}
        {current && (algorithm === "binary" || algorithm === "jump") && (
          <div className="flex items-center justify-center gap-2 mb-1">
            {arr.map((_, i) => {
              const inWindow = i >= current.low && i <= current.high
              return (
                <div key={`bracket-${i}`} className="w-12 flex justify-center">
                  {inWindow && i === current.low && <span className="text-[9px] text-green-400 font-mono">L</span>}
                  {inWindow && i === current.high && i !== current.low && <span className="text-[9px] text-green-400 font-mono">H</span>}
                  {inWindow && i === current.mid && i !== current.low && i !== current.high && <span className="text-[9px] text-amber-400 font-mono">M</span>}
                </div>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          {arr.map((val, i) => (
            <div
              key={`${algorithm}-${i}`}
              ref={(el) => { cellRefs.current[i] = el }}
              className="relative w-12 h-14 rounded-xl border-2 border-slate-600 bg-slate-700 flex flex-col items-center justify-center transition-colors"
            >
              <span className="text-sm font-mono font-bold text-white">{val}</span>
              <span className="text-[9px] text-gray-500 font-mono">[{i}]</span>
            </div>
          ))}
        </div>
        <div ref={pointerRef} className="absolute -bottom-5 w-3 h-3 opacity-0" style={{ left: 0 }}>
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-amber-400" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        <button onClick={reset} className="px-3 py-1.5 text-xs font-medium bg-slate-700 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-600 transition-colors">Reset</button>
        <button onClick={() => applyStep(stepIdx + 1)} disabled={isPlaying || current?.phase === "found" || current?.phase === "not-found"} className="px-3 py-1.5 text-xs font-medium bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors disabled:opacity-40">Step</button>
        <button
          onClick={() => {
            if (stepIdx < 0) {
              applyStep(0)
            }
            setIsPlaying(!isPlaying)
          }}
          disabled={current?.phase === "found" || current?.phase === "not-found"}
          className="px-4 py-1.5 text-xs font-medium bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors disabled:opacity-40"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className="min-h-[56px] bg-slate-800/60 border border-slate-700 rounded-xl p-3">
        {current ? (
          <div className="flex items-start gap-3">
            <span className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${
              current.phase === "found" ? "bg-emerald-400" : current.phase === "not-found" ? "bg-red-400" : current.phase === "checking" ? "bg-amber-400" : "bg-green-400"
            }`} />
            <div className="flex-1">
              <p className="text-sm text-gray-200">{current.explanation}</p>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                <span>Step {stepIdx + 1} of {steps.length}</span>
                <span>{meta.complexity}</span>
                <span>{comparisonCount} comparison{comparisonCount !== 1 ? "s" : ""} so far</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Press Play or Step. {meta.description}</p>
        )}
      </div>

      {/* Final summary */}
      {current && (current.phase === "found" || current.phase === "not-found") && (
        <div className={`rounded-xl border p-3 text-xs ${
          current.phase === "found" ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300" : "border-rose-500/30 bg-rose-500/5 text-rose-300"
        }`}>
          <span className="font-bold">{current.phase === "found" ? "Found!" : "Not Found"}</span>
          {" · "}
          {comparisonCount} total comparison{comparisonCount !== 1 ? "s" : ""} on {arr.length} elements
          {algorithm === "binary" && ` (theoretical max: ${Math.ceil(Math.log2(arr.length))})`}
          {algorithm === "jump" && ` (theoretical: ~${Math.ceil(2 * Math.sqrt(arr.length))} for √n blocks)`}
          {algorithm === "linear" && ` (worst case: ${arr.length})`}
        </div>
      )}
    </div>
  )
}
