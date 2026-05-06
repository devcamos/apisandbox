"use client"

import { useEffect, useState } from "react"
import {
  PATTERN_PROGRESS_STORAGE_KEY,
  type PatternProgressState,
} from "@/lib/learning/leetcode-pattern-graph"

export function usePatternProgress() {
  const [progress, setProgress] = useState<PatternProgressState>({})

  useEffect(() => {
    if (globalThis.window === undefined) return
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
    if (globalThis.window === undefined) return
    localStorage.setItem(PATTERN_PROGRESS_STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  return { progress, setProgress }
}
