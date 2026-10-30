"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, Layers3, RotateCcw } from "lucide-react"
import { AifStudyControls, type AifPracticeFilter } from "@/components/learning/AifStudyControls"
import type { AifFlashcard, AifQuestionBankSummary } from "@/lib/learning/aif-c01-question-bank"

export function AifFlashcards({
  cards,
  summary,
  initialFilter,
}: Readonly<{
  cards: AifFlashcard[]
  summary: AifQuestionBankSummary
  initialFilter: AifPracticeFilter
}>) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [marked, setMarked] = useState<Record<string, "know" | "review">>({})

  const card = cards[currentIndex]
  const knownCount = Object.values(marked).filter((value) => value === "know").length

  function goTo(index: number) {
    setCurrentIndex(index)
    setRevealed(false)
  }

  function startNewSet() {
    const set = String(Date.now())
    const filterQuery = initialFilter === "all" ? "" : `&filter=${encodeURIComponent(initialFilter)}`
    router.push(
      `/cloud/aws/certifications/ai-practitioner/practice?mode=flashcards${filterQuery}&set=${set}`,
    )
  }

  if (!card) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto max-w-5xl px-6 py-10">
          <AifStudyControls mode="flashcards" initialFilter={initialFilter} />
          <p className="mt-8 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            No flashcards matched that filter. Try another domain.
          </p>
        </div>
      </main>
    )
  }

  const markedCard = marked[card.id]

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-500 to-fuchsia-400" />
        <div className="container mx-auto max-w-5xl px-6 py-10 sm:py-12">
          <Link
            href="/cloud/aws/certifications/ai-practitioner"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            AI Practitioner track
          </Link>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200">
            <Layers3 className="h-3.5 w-3.5" />
            AIF-C01 flashcards · bank v{summary.version}
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Recall with flashcards
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Say the answer before you reveal it. Each card comes from the original AIF-C01 question
            bank and includes the explanation behind the correct answer.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5">
              {summary.totalQuestions} questions available
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5">
              {cards.length} cards in this set
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5">
              {knownCount} marked as known
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-6 py-8 sm:py-10">
        <AifStudyControls mode="flashcards" initialFilter={initialFilter} />

        <section className="mt-8" aria-label="Flashcard study area">
          <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
            <span>
              Card {currentIndex + 1} of {cards.length}
            </span>
            <span>{card.domainId} · Task {card.taskStatement}</span>
          </div>

          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            aria-expanded={revealed}
            className="min-h-80 w-full rounded-3xl border border-violet-400/30 bg-linear-to-br from-violet-400/10 via-slate-900/80 to-fuchsia-400/10 p-7 text-left shadow-2xl shadow-violet-950/20 transition hover:border-violet-300/60 sm:min-h-96 sm:p-10"
          >
            <span className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              <span>{revealed ? "Answer" : "Recall"}</span>
              <Eye className="h-5 w-5" />
            </span>
            {revealed ? (
              <span className="mt-8 block">
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  Correct answer{card.answers.length > 1 ? "s" : ""}
                </span>
                <span className="mt-4 grid gap-4">
                  {card.answers.map((answer) => (
                    <span key={answer.optionId} className="block rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                      <span className="block font-semibold text-white">{answer.optionId}. {answer.text}</span>
                      <span className="mt-2 block text-sm leading-6 text-slate-300">{answer.explanation}</span>
                    </span>
                  ))}
                </span>
              </span>
            ) : (
              <span className="mt-8 block">
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {card.topic} · {card.difficulty}
                </span>
                <span className="mt-4 block text-2xl font-bold leading-10 text-white sm:text-3xl">
                  {card.front}
                </span>
                <span className="mt-8 block text-sm text-slate-400">Tap to reveal the answer</span>
              </span>
            )}
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMarked((current) => ({ ...current, [card.id]: "review" }))}
                aria-pressed={markedCard === "review"}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${markedCard === "review" ? "border-amber-300 bg-amber-400/15 text-amber-100" : "border-slate-700 text-slate-300 hover:border-slate-500"}`}
              >
                Review again
              </button>
              <button
                type="button"
                onClick={() => setMarked((current) => ({ ...current, [card.id]: "know" }))}
                aria-pressed={markedCard === "know"}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${markedCard === "know" ? "border-emerald-300 bg-emerald-400/15 text-emerald-100" : "border-slate-700 text-slate-300 hover:border-slate-500"}`}
              >
                <CheckCircle2 className="h-4 w-4" />
                I know this
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => goTo(Math.min(cards.length - 1, currentIndex + 1))}
                disabled={currentIndex === cards.length - 1}
                className="inline-flex items-center gap-2 rounded-lg border border-violet-400/40 px-3 py-2 text-sm font-semibold text-violet-100 hover:border-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={startNewSet}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            New card set
          </button>
        </section>

        <p className="mt-10 text-xs leading-5 text-slate-500">
          API Sandbox (NEXUS MOTIVUS LTD) provides original preparation content and does not issue
          AWS certifications or guarantee exam outcomes.
        </p>
      </div>
    </main>
  )
}
