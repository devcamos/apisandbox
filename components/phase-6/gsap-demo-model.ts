import gsap from "gsap"

const SORTED_ARRAY = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
const UNSORTED_ARRAY = [38, 12, 91, 5, 23, 72, 8, 56, 2, 16]

export const DEFAULT_TARGET = 23

export type SearchAlgorithm = "binary" | "linear" | "jump"

export interface SearchState {
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
    const hi = Math.min(curr, n - 1)
    states.push(
      { low: prev, high: hi, mid: hi, phase: "checking", explanation: `Jump to index ${hi}: arr[${hi}] = ${arr[hi]}` },
      { low: prev, high: hi, mid: hi, phase: "narrowing", explanation: `${arr[hi]} < ${target} — jump forward another ${step}` }
    )
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

export function generateSteps(algo: SearchAlgorithm, arr: number[], target: number): SearchState[] {
  if (algo === "binary") return generateBinarySearchSteps(arr, target)
  if (algo === "jump") return generateJumpSearchSteps(arr, target)
  return generateLinearSearchSteps(arr, target)
}

export function usesWindowHighlight(algorithm: SearchAlgorithm): boolean {
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
    if (state.phase === "found") return "#34d399"
    return "#fbbf24"
  }
  if (isJumpBoundary && isInRange) {
    return "#a78bfa"
  }
  if (isInRange) {
    if (usesWindowHighlight(algorithm)) return "#4ade80"
    return "#475569"
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
    if (state.phase === "found") return "rgba(52, 211, 153, 0.25)"
    return "rgba(251, 191, 36, 0.2)"
  }
  if (isJumpBoundary && isInRange) {
    return "rgba(167, 139, 250, 0.1)"
  }
  if (isInRange) {
    if (usesWindowHighlight(algorithm)) return "rgba(34, 197, 94, 0.1)"
    return "rgba(51, 65, 85, 1)"
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

export function visualizerSubtitle(algorithm: SearchAlgorithm): string {
  if (algorithm === "binary") return "narrowing search window"
  if (algorithm === "jump") return "block jumps and linear scan"
  return "sequential scan"
}

export function runSearchStepCellAnimations(
  cells: (HTMLDivElement | null)[],
  algorithm: SearchAlgorithm,
  arrLength: number,
  state: SearchState,
  animatePointer: (midIndex: number) => void
): void {
  const jumpBlockSize = algorithm === "jump" ? Math.floor(Math.sqrt(arrLength)) : 0

  cells.forEach((cell, i) => {
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
}

export const algorithmMeta = {
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
} as const satisfies Record<
  SearchAlgorithm,
  { label: string; complexity: string; description: string; array: number[] }
>

export type GsapAlgorithmMeta = (typeof algorithmMeta)[SearchAlgorithm]
