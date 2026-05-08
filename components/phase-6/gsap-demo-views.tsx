"use client"

import { type MutableRefObject, type RefObject } from "react"
import {
  type GsapAlgorithmMeta,
  type SearchAlgorithm,
  type SearchState,
  usesWindowHighlight,
  visualizerSubtitle,
} from "./gsap-demo-model"

function searchPhaseDotClass(phase: SearchState["phase"]): string {
  if (phase === "found") return "bg-emerald-400"
  if (phase === "not-found") return "bg-red-400"
  if (phase === "checking") return "bg-amber-400"
  return "bg-green-400"
}

function comparisonWord(count: number): string {
  if (count === 1) return "comparison"
  return "comparisons"
}

export function GsapToolbar(props: Readonly<{
  meta: GsapAlgorithmMeta
  algorithm: SearchAlgorithm
  target: number
  arr: number[]
  onTargetChange: (v: number) => void
}>) {
  const { meta, algorithm, target, arr, onTargetChange } = props
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div>
        <h3 className="text-lg font-semibold text-white">{meta.label} Visualizer</h3>
        <p className="text-xs text-green-300/70 mt-0.5">
          The visualizer shows the {visualizerSubtitle(algorithm)} step by step
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500">Target:</span>
          <select
            value={target}
            onChange={(e) => onTargetChange(Number(e.target.value))}
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
  )
}

export function GsapStatsRow(props: Readonly<{
  current: SearchState
  algorithm: SearchAlgorithm
  comparisonCount: number
}>) {
  const { current, algorithm, comparisonCount } = props
  const windowed = usesWindowHighlight(algorithm)
  return (
    <div className="flex items-center justify-center gap-4 text-[10px] font-mono">
      {windowed && (
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
  )
}

export function GsapGridSection(props: Readonly<{
  arr: number[]
  algorithm: SearchAlgorithm
  current: SearchState | null
  cellRefs: MutableRefObject<(HTMLDivElement | null)[]>
  pointerRef: RefObject<HTMLDivElement | null>
}>) {
  const { arr, algorithm, current, cellRefs, pointerRef } = props
  const windowed = current !== null && usesWindowHighlight(algorithm)

  return (
    <div className="relative">
      {current && windowed && (
        <div className="flex items-center justify-center gap-2 mb-1">
          {arr.map((_, i) => {
            const inWindow = i >= current.low && i <= current.high
            return (
              <div key={`bracket-${algorithm}-${i}`} className="w-12 flex justify-center">
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
            key={`${algorithm}-cell-${val}-${i}`}
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
  )
}

export function GsapTransport(props: Readonly<{
  onReset: () => void
  onStep: () => void
  onTogglePlay: () => void
  isPlaying: boolean
  currentPhase: SearchState["phase"] | undefined
}>) {
  const { onReset, onStep, onTogglePlay, isPlaying, currentPhase } = props
  const terminal = currentPhase === "found" || currentPhase === "not-found"
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button type="button" onClick={onReset} className="px-3 py-1.5 text-xs font-medium bg-slate-700 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-600 transition-colors">Reset</button>
      <button type="button" onClick={onStep} disabled={isPlaying || terminal} className="px-3 py-1.5 text-xs font-medium bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors disabled:opacity-40">Step</button>
      <button
        type="button"
        onClick={onTogglePlay}
        disabled={terminal}
        className="px-4 py-1.5 text-xs font-medium bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors disabled:opacity-40"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  )
}

export function GsapNarration(props: Readonly<{
  current: SearchState | null
  stepIdx: number
  stepsLength: number
  meta: GsapAlgorithmMeta
  comparisonCount: number
}>) {
  const { current, stepIdx, stepsLength, meta, comparisonCount } = props
  if (current) {
    return (
      <div className="min-h-[56px] bg-slate-800/60 border border-slate-700 rounded-xl p-3">
        <div className="flex items-start gap-3">
          <span className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${searchPhaseDotClass(current.phase)}`} />
          <div className="flex-1">
            <p className="text-sm text-gray-200">{current.explanation}</p>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
              <span>Step {stepIdx + 1} of {stepsLength}</span>
              <span>{meta.complexity}</span>
              <span>{comparisonCount} {comparisonWord(comparisonCount)} so far</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-[56px] bg-slate-800/60 border border-slate-700 rounded-xl p-3">
      <p className="text-sm text-gray-500">Press Play or Step. {meta.description}</p>
    </div>
  )
}

export function GsapTerminalSummary(props: Readonly<{
  phase: "found" | "not-found"
  comparisonCount: number
  arrLength: number
  algorithm: SearchAlgorithm
}>) {
  const { phase, comparisonCount, arrLength, algorithm } = props
  const found = phase === "found"
  const boxClass = found ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300" : "border-rose-500/30 bg-rose-500/5 text-rose-300"
  const title = found ? "Found!" : "Not Found"
  let theory = ""
  if (algorithm === "binary") theory = ` (theoretical max: ${Math.ceil(Math.log2(arrLength))})`
  if (algorithm === "jump") theory = ` (theoretical: ~${Math.ceil(2 * Math.sqrt(arrLength))} for √n blocks)`
  if (algorithm === "linear") theory = ` (worst case: ${arrLength})`

  return (
    <div className={`rounded-xl border p-3 text-xs ${boxClass}`}>
      <span className="font-bold">{title}</span>
      {" · "}
      {comparisonCount} total {comparisonWord(comparisonCount)} on {arrLength} elements
      {theory}
    </div>
  )
}
