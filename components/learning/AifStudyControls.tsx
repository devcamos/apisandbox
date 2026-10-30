import Link from "next/link"
import type { AifC01DomainId } from "@/lib/learning/aws-ai-practitioner-mastery"

export type AifPracticeFilter = "all" | "metrics" | AifC01DomainId
export type AifStudyMode = "questions" | "flashcards"

const DOMAIN_FILTERS: Array<{ id: AifPracticeFilter; label: string }> = [
  { id: "all", label: "All domains" },
  { id: "metrics", label: "D1 metrics focus" },
  { id: "ai-ml-fundamentals", label: "Domain 1 · AI/ML" },
  { id: "genai-fundamentals", label: "Domain 2 · GenAI" },
  { id: "foundation-models", label: "Domain 3 · Foundation models" },
  { id: "responsible-ai", label: "Domain 4 · Responsible AI" },
  { id: "ai-security", label: "Domain 5 · Security" },
]

function studyHref(mode: AifStudyMode, filter: AifPracticeFilter): string {
  const params = new URLSearchParams()
  if (filter !== "all") params.set("filter", filter)
  if (mode === "flashcards") params.set("mode", mode)
  const query = params.toString()
  return `/cloud/aws/certifications/ai-practitioner/practice${query ? `?${query}` : ""}`
}

export function AifStudyControls({
  mode,
  initialFilter,
  onNavigate,
}: Readonly<{
  mode: AifStudyMode
  initialFilter: AifPracticeFilter
  onNavigate?: () => void
}>) {
  return (
    <section
      aria-label="AI Practitioner study controls"
      className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
          Study mode
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={studyHref("questions", initialFilter)}
            onClick={onNavigate}
            aria-current={mode === "questions" ? "page" : undefined}
            className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
              mode === "questions"
                ? "border-violet-300 bg-violet-400/15 text-white"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            Multiple-choice questions
          </Link>
          <Link
            href={studyHref("flashcards", initialFilter)}
            onClick={onNavigate}
            aria-current={mode === "flashcards" ? "page" : undefined}
            className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
              mode === "flashcards"
                ? "border-violet-300 bg-violet-400/15 text-white"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            Flashcards
          </Link>
        </div>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Choose a focus
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {DOMAIN_FILTERS.map((filter) => {
          const active = filter.id === initialFilter
          return (
            <Link
              key={filter.id}
              href={studyHref(mode, filter.id)}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                active
                  ? "border-violet-300 bg-violet-400/15 text-white"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {filter.label}
            </Link>
          )
        })}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        Use questions to practise choosing an answer. Use flashcards to retrieve the idea first,
        then flip the card to check the explanation.
      </p>
    </section>
  )
}
