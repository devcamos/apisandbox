"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

interface Flashcard {
  prompt: string
  answer: string[]
}

export function CapabilityFlashcards({ cards }: Readonly<{ cards: readonly Flashcard[] }>) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const card = cards[index]
  if (!card) return null

  function goTo(position: number) {
    setIndex(position)
    setRevealed(false)
  }

  return (
    <div className="space-y-3" aria-label="Quick recall flashcards" role="group">
      <div className="min-h-44 rounded-xl border border-violet-400/25 bg-slate-950/50 p-5">
        <div aria-live="polite" aria-atomic="true">
          <p className="text-xs font-semibold text-violet-200">Card {index + 1} of {cards.length}</p>
          <p className="mt-2 text-base font-semibold text-white">{card.prompt}</p>
        </div>
        <div aria-live="polite">
          {revealed ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-200">
              {card.answer.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
        </div>
        <button type="button" onClick={() => setRevealed(!revealed)} aria-expanded={revealed} className="mt-4 rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">
          {revealed ? "Hide answer" : "Show answer"}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-violet-400 disabled:opacity-50">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous card
        </button>
        {index === cards.length - 1 ? (
          <button type="button" onClick={() => goTo(0)} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-violet-400">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Start again
          </button>
        ) : (
          <button type="button" onClick={() => goTo(index + 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-violet-400">
            Next card <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
