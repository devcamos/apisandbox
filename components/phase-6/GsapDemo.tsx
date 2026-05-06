"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import gsap from "gsap"
import {
  algorithmMeta,
  DEFAULT_TARGET,
  generateSteps,
  runSearchStepCellAnimations,
  type SearchAlgorithm,
  type SearchState,
} from "./gsap-demo-model"
import {
  GsapGridSection,
  GsapNarration,
  GsapStatsRow,
  GsapTerminalSummary,
  GsapToolbar,
  GsapTransport,
} from "./gsap-demo-views"

export type { SearchAlgorithm } from "./gsap-demo-model"

export default function GsapDemo({ algorithm = "binary" }: Readonly<{ algorithm?: SearchAlgorithm }>) {
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
      runSearchStepCellAnimations(cellRefs.current, algorithm, arr.length, state, animatePointer)
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

  const togglePlay = useCallback(() => {
    if (stepIdx < 0) {
      applyStep(0)
    }
    setIsPlaying((p) => !p)
  }, [applyStep, stepIdx])

  return (
    <div className="space-y-5">
      <GsapToolbar meta={meta} algorithm={algorithm} target={target} arr={arr} onTargetChange={changeTarget} />
      {current && <GsapStatsRow current={current} algorithm={algorithm} comparisonCount={comparisonCount} />}
      <GsapGridSection arr={arr} algorithm={algorithm} current={current} cellRefs={cellRefs} pointerRef={pointerRef} />
      <GsapTransport
        onReset={reset}
        onStep={() => applyStep(stepIdx + 1)}
        onTogglePlay={togglePlay}
        isPlaying={isPlaying}
        currentPhase={current?.phase}
      />
      <GsapNarration current={current} stepIdx={stepIdx} stepsLength={steps.length} meta={meta} comparisonCount={comparisonCount} />
      {current && (current.phase === "found" || current.phase === "not-found") && (
        <GsapTerminalSummary
          phase={current.phase}
          comparisonCount={comparisonCount}
          arrLength={arr.length}
          algorithm={algorithm}
        />
      )}
    </div>
  )
}
