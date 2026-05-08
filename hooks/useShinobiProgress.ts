"use client"

import { useCallback, useEffect, useState } from "react"
import {
  addXp,
  emptyProgress,
  loadShinobiProgress,
  saveShinobiProgress,
  tryAwardSectionExploration,
  type ShinobiProgressState,
} from "@/lib/learning/shinobi-progress"
import { XP_PER_CORRECT_QUIZ } from "@/lib/learning/shinobi-quiz"
import type { ShinobiQuizQuestion } from "@/lib/learning/shinobi-quiz"

export function useShinobiProgress() {
  const [state, setState] = useState<ShinobiProgressState | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadShinobiProgress())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || !state) return
    saveShinobiProgress(state)
  }, [state, hydrated])

  const awardQuizAnswer = useCallback((question: ShinobiQuizQuestion, correct: boolean) => {
    if (!correct) return
    setState((prev) => {
      if (!prev) return prev
      return addXp(prev, { [question.attribute]: XP_PER_CORRECT_QUIZ })
    })
  }, [])

  const finishQuizRun = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev
      return { ...prev, quizRunsCompleted: prev.quizRunsCompleted + 1 }
    })
  }, [])

  const registerTabVisit = useCallback((categoryId: string, algorithmId: string, tab: string) => {
    if (tab !== "overview" && tab !== "visualizer" && tab !== "exercises" && tab !== "real-world" && tab !== "variations") {
      return
    }
    setState((prev) => {
      if (!prev) return prev
      return tryAwardSectionExploration(prev, categoryId, algorithmId, tab)
    })
  }, [])

  const resetProgress = useCallback(() => {
    const cleared = emptyProgress()
    setState(cleared)
    saveShinobiProgress(cleared)
  }, [])

  return {
    state,
    hydrated,
    awardQuizAnswer,
    finishQuizRun,
    registerTabVisit,
    resetProgress,
  }
}

export type ShinobiProgressApi = ReturnType<typeof useShinobiProgress>
export type { ShinobiAttributeId, ShinobiProgressState } from "@/lib/learning/shinobi-progress"
