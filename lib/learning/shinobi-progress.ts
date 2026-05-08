/**
 * Phase 6 "Shinobi path" — five learning layers mapped to ranks from Genin → Hokage.
 * Progress persists in localStorage (per browser).
 */

export type ShinobiAttributeId = "thinking" | "speed" | "accuracy" | "confidence" | "transfer"

export interface ShinobiAttributeDef {
  id: ShinobiAttributeId
  /** UI label */
  layer: string
  /** What improves when this attribute ranks up */
  improves: string
}

export const SHINOBI_ATTRIBUTES: ShinobiAttributeDef[] = [
  { id: "thinking", layer: "Thinking", improves: "Structured problem solving" },
  { id: "speed", layer: "Speed", improves: "Faster decisions" },
  { id: "accuracy", layer: "Accuracy", improves: "Fewer wrong approaches" },
  { id: "confidence", layer: "Confidence", improves: "Less panic under pressure" },
  { id: "transfer", layer: "Transfer", improves: "Ability to solve new problems" },
]

/** Naruto-style progression (Leaf-focused naming) */
export interface ShinobiRankTier {
  id: string
  label: string
  /** Minimum total XP in this attribute to reach this tier */
  minXp: number
}

export const SHINOBI_RANK_TIERS: ShinobiRankTier[] = [
  { id: "genin", label: "Genin", minXp: 0 },
  { id: "chuunin", label: "Chūnin", minXp: 45 },
  { id: "jounin", label: "Jōnin", minXp: 120 },
  { id: "hokage", label: "Hokage", minXp: 260 },
]

const MAX_TIER_XP = 400

export interface ShinobiProgressState {
  xp: Record<ShinobiAttributeId, number>
  /** Keys like "sorting:bubble:overview" — section exploration bonuses */
  exploredSections: string[]
  quizRunsCompleted: number
}

export const SHINOBI_STORAGE_KEY = "apisandbox:shinobi-progress:v1"

export function emptyProgress(): ShinobiProgressState {
  return {
    xp: {
      thinking: 0,
      speed: 0,
      accuracy: 0,
      confidence: 0,
      transfer: 0,
    },
    exploredSections: [],
    quizRunsCompleted: 0,
  }
}

export function loadShinobiProgress(): ShinobiProgressState {
  if (typeof window === "undefined") return emptyProgress()
  try {
    const raw = localStorage.getItem(SHINOBI_STORAGE_KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw) as Partial<ShinobiProgressState>
    const base = emptyProgress()
    if (parsed.xp && typeof parsed.xp === "object") {
      for (const id of Object.keys(base.xp) as ShinobiAttributeId[]) {
        const v = parsed.xp[id]
        if (typeof v === "number" && v >= 0) base.xp[id] = Math.min(MAX_TIER_XP, v)
      }
    }
    if (Array.isArray(parsed.exploredSections)) {
      base.exploredSections = parsed.exploredSections.filter((s) => typeof s === "string")
    }
    if (typeof parsed.quizRunsCompleted === "number") base.quizRunsCompleted = parsed.quizRunsCompleted
    return base
  } catch {
    return emptyProgress()
  }
}

export function saveShinobiProgress(state: ShinobiProgressState): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(SHINOBI_STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota */
  }
}

export function getRankForXp(xp: number): { tier: ShinobiRankTier; next: ShinobiRankTier | null; progress: number } {
  let tier = SHINOBI_RANK_TIERS[0]
  let nextIdx = 1
  for (let i = SHINOBI_RANK_TIERS.length - 1; i >= 0; i--) {
    if (xp >= SHINOBI_RANK_TIERS[i].minXp) {
      tier = SHINOBI_RANK_TIERS[i]
      nextIdx = i + 1
      break
    }
  }
  const next = nextIdx < SHINOBI_RANK_TIERS.length ? SHINOBI_RANK_TIERS[nextIdx] : null
  let progress = 1
  if (next) {
    const span = next.minXp - tier.minXp
    progress = span > 0 ? Math.min(1, (xp - tier.minXp) / span) : 1
  }
  return { tier, next, progress }
}

/** Overall title: average tier index */
export function getOverallShinobiTitle(xp: Record<ShinobiAttributeId, number>): { label: string; tier: ShinobiRankTier } {
  let sumIdx = 0
  for (const id of Object.keys(xp) as ShinobiAttributeId[]) {
    const { tier } = getRankForXp(xp[id])
    const idx = SHINOBI_RANK_TIERS.findIndex((t) => t.id === tier.id)
    sumIdx += Math.max(0, idx)
  }
  const avg = sumIdx / SHINOBI_ATTRIBUTES.length
  const tierIndex = Math.min(SHINOBI_RANK_TIERS.length - 1, Math.floor(avg + 0.25))
  return { label: SHINOBI_RANK_TIERS[tierIndex].label, tier: SHINOBI_RANK_TIERS[tierIndex] }
}

export function addXp(
  state: ShinobiProgressState,
  gains: Partial<Record<ShinobiAttributeId, number>>
): ShinobiProgressState {
  const next = { ...state, xp: { ...state.xp } }
  for (const id of Object.keys(gains) as ShinobiAttributeId[]) {
    const add = gains[id] ?? 0
    if (add <= 0) continue
    next.xp[id] = Math.min(MAX_TIER_XP, next.xp[id] + add)
  }
  return next
}

/** First-time exploration of a Phase 6 tab per algorithm */
export function tryAwardSectionExploration(
  state: ShinobiProgressState,
  categoryId: string,
  algorithmId: string,
  tab: "overview" | "visualizer" | "exercises" | "real-world" | "variations"
): ShinobiProgressState {
  const key = `${categoryId}:${algorithmId}:${tab}`
  if (state.exploredSections.includes(key)) return state

  let gains: Partial<Record<ShinobiAttributeId, number>> = {}

  if (tab === "overview") {
    if (categoryId === "sorting") gains = { thinking: 6, accuracy: 2 }
    else if (categoryId === "searching") gains = { speed: 5, accuracy: 3 }
    else if (categoryId === "graph-tree") gains = { transfer: 6, thinking: 2 }
  } else if (tab === "visualizer") {
    gains = { accuracy: 5, confidence: 2 }
  } else if (tab === "exercises") {
    gains = { confidence: 6, speed: 3 }
  } else if (tab === "real-world") {
    gains = { transfer: 5, thinking: 3 }
  } else if (tab === "variations") {
    gains = { thinking: 4, transfer: 4 }
  }

  if (Object.keys(gains).length === 0) {
    return state
  }

  const exploredSections = [...state.exploredSections, key]
  return addXp({ ...state, exploredSections }, gains)
}
