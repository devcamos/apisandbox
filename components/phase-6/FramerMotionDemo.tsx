"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useCallback, useEffect } from "react"

interface BarState {
  id: number
  value: number
  status: "idle" | "comparing" | "swapping" | "sorted"
}

const INITIAL_VALUES = [38, 27, 43, 3, 9, 82, 10, 55, 19, 64]

function generateBars(values: number[]): BarState[] {
  return values.map((v, i) => ({ id: i, value: v, status: "idle" }))
}

interface SortStep {
  type: "compare" | "swap" | "sorted" | "done"
  indices: number[]
  explanation: string
}

export type SortAlgorithm = "bubble" | "selection" | "insertion" | "merge" | "quick"

function generateBubbleSortSteps(values: number[]): SortStep[] {
  const arr = [...values]
  const steps: SortStep[] = []
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ type: "compare", indices: [j, j + 1], explanation: `Compare ${arr[j]} and ${arr[j + 1]}` })
      if (arr[j] > arr[j + 1]) {
        steps.push({ type: "swap", indices: [j, j + 1], explanation: `${arr[j]} > ${arr[j + 1]} — swap them` })
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
    steps.push({ type: "sorted", indices: [n - i - 1], explanation: `Position ${n - i - 1} is final — largest unsorted element bubbled up` })
  }
  steps.push({ type: "sorted", indices: [0], explanation: "First position is sorted by elimination" })
  steps.push({ type: "done", indices: [], explanation: "Array is fully sorted" })
  return steps
}

function generateSelectionSortSteps(values: number[]): SortStep[] {
  const arr = [...values]
  const steps: SortStep[] = []
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    steps.push({ type: "compare", indices: [i], explanation: `Start pass ${i + 1}: assume index ${i} (value ${arr[i]}) is the minimum` })
    for (let j = i + 1; j < n; j++) {
      steps.push({ type: "compare", indices: [minIdx, j], explanation: `Compare current min ${arr[minIdx]} with ${arr[j]}` })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({ type: "compare", indices: [minIdx], explanation: `New minimum found: ${arr[minIdx]} at index ${minIdx}` })
      }
    }
    if (minIdx !== i) {
      steps.push({ type: "swap", indices: [i, minIdx], explanation: `Swap ${arr[i]} at index ${i} with minimum ${arr[minIdx]} at index ${minIdx}` })
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
    }
    steps.push({ type: "sorted", indices: [i], explanation: `Position ${i} is final — smallest remaining element placed` })
  }
  steps.push({ type: "sorted", indices: [n - 1], explanation: "Last position is sorted by elimination" })
  steps.push({ type: "done", indices: [], explanation: "Array is fully sorted" })
  return steps
}

function generateInsertionSortSteps(values: number[]): SortStep[] {
  const arr = [...values]
  const steps: SortStep[] = []
  const n = arr.length

  steps.push({ type: "sorted", indices: [0], explanation: "First element is trivially sorted" })
  for (let i = 1; i < n; i++) {
    const key = arr[i]
    steps.push({ type: "compare", indices: [i], explanation: `Pick element ${key} at index ${i} — insert it into the sorted portion` })
    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      steps.push({ type: "compare", indices: [j, j + 1], explanation: `${arr[j]} > ${key} — shift ${arr[j]} right` })
      steps.push({ type: "swap", indices: [j, j + 1], explanation: `Move ${arr[j]} from index ${j} to ${j + 1}` })
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = key
    steps.push({ type: "sorted", indices: [j + 1], explanation: `Insert ${key} at index ${j + 1} — sorted portion grows` })
  }
  steps.push({ type: "done", indices: [], explanation: "Array is fully sorted" })
  return steps
}

function generateMergeSortSteps(values: number[]): SortStep[] {
  const arr = [...values]
  const steps: SortStep[] = []

  function merge(lo: number, mid: number, hi: number) {
    const left = arr.slice(lo, mid + 1)
    const right = arr.slice(mid + 1, hi + 1)
    let i = 0, j = 0, k = lo

    while (i < left.length && j < right.length) {
      steps.push({ type: "compare", indices: [lo + i, mid + 1 + j], explanation: `Compare ${left[i]} (left) and ${right[j]} (right)` })
      if (left[i] <= right[j]) {
        arr[k] = left[i]
        steps.push({ type: "swap", indices: [k, lo + i], explanation: `Place ${left[i]} at position ${k}` })
        i++
      } else {
        arr[k] = right[j]
        steps.push({ type: "swap", indices: [k, mid + 1 + j], explanation: `Place ${right[j]} at position ${k} — it was smaller` })
        j++
      }
      k++
    }
    while (i < left.length) { arr[k] = left[i]; steps.push({ type: "sorted", indices: [k], explanation: `Remaining left element ${left[i]} placed at ${k}` }); i++; k++ }
    while (j < right.length) { arr[k] = right[j]; steps.push({ type: "sorted", indices: [k], explanation: `Remaining right element ${right[j]} placed at ${k}` }); j++; k++ }
  }

  function mergeSort(lo: number, hi: number) {
    if (lo >= hi) return
    const mid = Math.floor((lo + hi) / 2)
    steps.push({ type: "compare", indices: [lo, hi], explanation: `Divide: split indices ${lo}–${hi} at midpoint ${mid}` })
    mergeSort(lo, mid)
    mergeSort(mid + 1, hi)
    steps.push({ type: "compare", indices: [lo, hi], explanation: `Merge: combine halves [${lo}–${mid}] and [${mid + 1}–${hi}]` })
    merge(lo, mid, hi)
  }

  mergeSort(0, arr.length - 1)
  steps.push({ type: "done", indices: [], explanation: "Array is fully sorted" })
  return steps
}

function generateQuickSortSteps(values: number[]): SortStep[] {
  const arr = [...values]
  const steps: SortStep[] = []

  function partition(lo: number, hi: number): number {
    const pivot = arr[hi]
    steps.push({ type: "compare", indices: [hi], explanation: `Choose pivot: ${pivot} at index ${hi}` })
    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      steps.push({ type: "compare", indices: [j, hi], explanation: `Compare ${arr[j]} with pivot ${pivot}` })
      if (arr[j] < pivot) {
        i++
        if (i !== j) {
          steps.push({ type: "swap", indices: [i, j], explanation: `${arr[j]} < ${pivot} — swap ${arr[i]} and ${arr[j]}` })
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
      }
    }
    if (i + 1 !== hi) {
      steps.push({ type: "swap", indices: [i + 1, hi], explanation: `Place pivot ${pivot} at its final position ${i + 1}` })
      ;[arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]
    }
    steps.push({ type: "sorted", indices: [i + 1], explanation: `Pivot ${pivot} is now in its correct sorted position` })
    return i + 1
  }

  function quickSort(lo: number, hi: number) {
    if (lo >= hi) {
      if (lo === hi) steps.push({ type: "sorted", indices: [lo], explanation: `Single element ${arr[lo]} is trivially sorted` })
      return
    }
    const p = partition(lo, hi)
    quickSort(lo, p - 1)
    quickSort(p + 1, hi)
  }

  quickSort(0, arr.length - 1)
  steps.push({ type: "done", indices: [], explanation: "Array is fully sorted" })
  return steps
}

const stepGenerators: Record<SortAlgorithm, (v: number[]) => SortStep[]> = {
  bubble: generateBubbleSortSteps,
  selection: generateSelectionSortSteps,
  insertion: generateInsertionSortSteps,
  merge: generateMergeSortSteps,
  quick: generateQuickSortSteps,
}

const algorithmDescriptions: Record<SortAlgorithm, string> = {
  bubble: "Bubble sort repeatedly walks the array, swapping adjacent elements that are out of order.",
  selection: "Selection sort finds the smallest unsorted element and places it at the next sorted position.",
  insertion: "Insertion sort picks each element and inserts it into its correct position in the sorted portion.",
  merge: "Merge sort divides the array in half, recursively sorts each half, then merges them back in order.",
  quick: "Quick sort picks a pivot, partitions elements around it, then recursively sorts each side.",
}

const barColors: Record<BarState["status"], string> = {
  idle: "from-violet-500 to-purple-600",
  comparing: "from-amber-400 to-orange-500",
  swapping: "from-rose-500 to-pink-600",
  sorted: "from-emerald-500 to-teal-600",
}

export default function FramerMotionDemo({ algorithm = "bubble" }: { algorithm?: SortAlgorithm }) {
  const generate = stepGenerators[algorithm]
  const [bars, setBars] = useState<BarState[]>(() => generateBars(INITIAL_VALUES))
  const [steps, setSteps] = useState<SortStep[]>(() => generate(INITIAL_VALUES))
  const [stepIndex, setStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setIsPlaying(false)
    setStepIndex(-1)
    setSortedIndices(new Set())
    setBars(generateBars(INITIAL_VALUES))
    setSteps(stepGenerators[algorithm](INITIAL_VALUES))
  }, [algorithm])

  const currentStep = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null

  const applyStep = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= steps.length) return
      const step = steps[idx]

      setBars((prev) => {
        const next: BarState[] = prev.map((b) => ({ ...b, status: "idle" as BarState["status"] }))
        sortedIndices.forEach((si) => {
          if (next[si]) next[si].status = "sorted"
        })

        if (step.type === "compare") {
          step.indices.forEach((i) => {
            if (next[i]) next[i].status = "comparing"
          })
        } else if (step.type === "swap") {
          const [a, b] = step.indices
          ;[next[a], next[b]] = [next[b], next[a]]
          next[a].status = "swapping"
          next[b].status = "swapping"
        } else if (step.type === "sorted") {
          const newSorted = new Set(sortedIndices)
          step.indices.forEach((i) => newSorted.add(i))
          setSortedIndices(newSorted)
          newSorted.forEach((si) => {
            if (next[si]) next[si].status = "sorted"
          })
        }
        return next
      })
      setStepIndex(idx)
    },
    [steps, sortedIndices]
  )

  useEffect(() => {
    if (!isPlaying) return
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false)
      return
    }
    timerRef.current = setTimeout(() => applyStep(stepIndex + 1), speed)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [isPlaying, stepIndex, speed, applyStep, steps.length])

  function reset() {
    setIsPlaying(false)
    setStepIndex(-1)
    setSortedIndices(new Set())
    setBars(generateBars(INITIAL_VALUES))
  }

  function stepForward() {
    if (stepIndex < steps.length - 1) applyStep(stepIndex + 1)
  }

  const maxValue = Math.max(...INITIAL_VALUES)
  const isDone = currentStep?.type === "done"
  const algoLabels: Record<SortAlgorithm, string> = { bubble: "Bubble Sort", selection: "Selection Sort", insertion: "Insertion Sort", merge: "Merge Sort", quick: "Quick Sort" }
  const algoLabel = algoLabels[algorithm]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{algoLabel} Visualizer</h3>
          <p className="text-xs text-violet-300/70 mt-0.5">
            Layout animations show elements swapping positions
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[300, 500, 800].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-[10px] rounded border transition-colors ${
                speed === s
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-slate-800 border-slate-700 text-gray-500 hover:text-gray-300"
              }`}
            >
              {s === 300 ? "Fast" : s === 500 ? "Normal" : "Slow"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-center gap-1.5 h-[180px] px-2">
        <AnimatePresence mode="popLayout">
          {bars.map((bar) => (
            <motion.div
              key={bar.id}
              layout
              className={`relative rounded-t-lg bg-gradient-to-t ${barColors[bar.status]} min-w-[28px] flex-1`}
              style={{ height: `${(bar.value / maxValue) * 100}%` }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 28 }}
            >
              <motion.span
                className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {bar.value}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button onClick={reset} className="px-3 py-1.5 text-xs font-medium bg-slate-700 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-600 transition-colors">
          Reset
        </button>
        <button onClick={stepForward} disabled={isPlaying || isDone} className="px-3 py-1.5 text-xs font-medium bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-300 hover:bg-violet-500/30 transition-colors disabled:opacity-40">
          Step
        </button>
        <button
          onClick={() => {
            if (stepIndex < 0) {
              applyStep(0)
            }
            setIsPlaying(!isPlaying)
          }}
          disabled={isDone}
          className="px-4 py-1.5 text-xs font-medium bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-300 hover:bg-violet-500/30 transition-colors disabled:opacity-40"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className="min-h-[56px] bg-slate-800/60 border border-slate-700 rounded-xl p-3">
        {currentStep ? (
          <div className="flex items-start gap-3">
            <span className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${
              currentStep.type === "compare" ? "bg-amber-400" : currentStep.type === "swap" ? "bg-rose-500" : currentStep.type === "sorted" ? "bg-emerald-500" : "bg-violet-400"
            }`} />
            <div>
              <p className="text-sm text-gray-200">{currentStep.explanation}</p>
              <p className="text-[10px] text-gray-500 mt-1">
                Step {stepIndex + 1} of {steps.length}
                {" · "}<span className="text-amber-400/70">Compare</span>
                {" · "}<span className="text-rose-400/70">Swap</span>
                {" · "}<span className="text-emerald-400/70">Sorted</span>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Press Play or Step to begin. {algorithmDescriptions[algorithm]}
          </p>
        )}
      </div>
    </div>
  )
}
