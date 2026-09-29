"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CheckCircle2, RotateCcw } from "lucide-react"
import type { InteractiveScenario } from "@/lib/learning/api-foundations-course"

function readExplanationDraft(storageKey: string) {
  try {
    return globalThis.localStorage?.getItem(storageKey) ?? ""
  } catch {
    return ""
  }
}

function writeExplanationDraft(storageKey: string, value: string) {
  try {
    globalThis.localStorage?.setItem(storageKey, value)
  } catch {
    return
  }
}

export function CapabilityPrediction({ scenario }: Readonly<{ scenario: InteractiveScenario }>) {
  const [selectedId, setSelectedId] = useState("")
  const [committedId, setCommittedId] = useState("")
  const selected = scenario.options.find((option) => option.id === committedId)

  function commit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (selectedId) setCommittedId(selectedId)
  }

  function reset() {
    setSelectedId("")
    setCommittedId("")
  }

  return (
    <div>
      <form onSubmit={commit}>
        <fieldset disabled={Boolean(committedId)}>
          <legend className="text-base font-semibold leading-7 text-white">{scenario.prompt}</legend>
          <div className="mt-4 grid gap-3">
            {scenario.options.map((option) => (
              <label
                key={option.id}
                className={
                  "flex cursor-pointer gap-3 rounded-xl border p-4 text-sm transition-colors " +
                  (selectedId === option.id
                    ? "border-violet-300 bg-violet-400/10 text-white"
                    : "border-slate-700 bg-slate-950/30 text-slate-300 hover:border-slate-500")
                }
              >
                <input
                  type="radio"
                  name="capability-prediction"
                  value={option.id}
                  checked={selectedId === option.id}
                  onChange={() => setSelectedId(option.id)}
                  className="mt-0.5 accent-violet-400"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {!committedId ? (
          <button
            type="submit"
            disabled={!selectedId}
            className="mt-4 rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Commit prediction
          </button>
        ) : null}
      </form>

      {selected ? (
        <div className="mt-5 rounded-xl border border-violet-400/25 bg-violet-400/10 p-4" aria-live="polite">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-200" />
            <div>
              <p className="font-semibold text-white">Prediction committed</p>
              <p className="mt-1 text-sm leading-6 text-slate-200">{selected.consequence}</p>
            </div>
          </div>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {scenario.trace.map((step) => (
              <li key={step.id} className="rounded-lg border border-slate-700 bg-slate-950/35 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-200">{step.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">{step.detail}</p>
              </li>
            ))}
          </ol>
          <button type="button" onClick={reset} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset prediction
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function CapabilityExplanationDraft({
  courseId,
  capabilityId,
  prompt,
  evidenceCriteria,
}: Readonly<{
  courseId: string
  capabilityId: string
  prompt: string
  evidenceCriteria: string[]
}>) {
  const storageKey = "aws-capability-explanation:v1:" + courseId + ":" + capabilityId
  const [draft, setDraft] = useState("")

  useEffect(() => {
    setDraft(readExplanationDraft(storageKey))
  }, [storageKey])

  function updateDraft(value: string) {
    setDraft(value)
    writeExplanationDraft(storageKey, value)
  }

  const readyForReview = draft.trim().length >= 120

  return (
    <div>
      <label htmlFor={capabilityId + "-explanation"} className="text-base font-semibold leading-7 text-white">
        {prompt}
      </label>
      <textarea
        id={capabilityId + "-explanation"}
        value={draft}
        onChange={(event) => updateDraft(event.target.value)}
        rows={6}
        placeholder="Teach the mechanism, decision boundary, and failure mode back in your own words…"
        className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950/40 p-4 text-sm leading-6 text-white placeholder:text-slate-600 focus:border-violet-300 focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className={readyForReview ? "text-emerald-300" : "text-slate-400"}>
          {draft.trim().length} characters · {readyForReview ? "ready for peer review" : "aim for at least 120"}
        </span>
        <span className="text-slate-500">Browser draft only · never include secrets or learner data</span>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {evidenceCriteria.map((criterion) => (
          <li key={criterion} className="flex items-start gap-2 rounded-lg border border-slate-700 bg-slate-950/30 p-3 text-xs text-slate-300">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
            {criterion}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        This draft is practice evidence, not automatic mastery. Keep the Java output, failure observation, peer explanation, and scored exam result together.
      </p>
    </div>
  )
}
