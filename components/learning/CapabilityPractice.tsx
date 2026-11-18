"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CheckCircle2, RotateCcw } from "lucide-react"
import { evidenceKey, readEvidence, readLocal, writeLocal } from "@/lib/learning/capability-evidence"
import type { InteractiveScenario } from "@/lib/learning/api-foundations-course"

export function CapabilityPrediction({ scenario, courseId, unitId }: Readonly<{
  scenario: InteractiveScenario
  courseId: string
  unitId: string
}>) {
  const predictionKey = evidenceKey(courseId, unitId, "prediction")
  const takeawayKey = evidenceKey(courseId, unitId, "takeaway")
  const [selectedId, setSelectedId] = useState("")
  const [committedId, setCommittedId] = useState("")
  const [takeaway, setTakeaway] = useState("")

  useEffect(() => {
    const saved = readEvidence<{ id: string }>(predictionKey)
    setSelectedId(saved?.id ?? "")
    setCommittedId(saved?.id ?? "")
    setTakeaway(readLocal(takeawayKey))
  }, [predictionKey, takeawayKey])

  const selected = scenario.options.find((option) => option.id === committedId)

  function commit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const option = scenario.options.find(({ id }) => id === selectedId)
    if (!option) return
    setCommittedId(option.id)
    if (!readLocal(predictionKey)) writeLocal(predictionKey, JSON.stringify({ id: option.id, label: option.label, prompt: scenario.prompt }))
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
            Try another prediction
          </button>
        </div>
      ) : null}
      <label htmlFor={`${unitId}-takeaway`} className="mt-5 block text-sm font-semibold text-white">Final takeaway</label>
      <textarea id={`${unitId}-takeaway`} value={takeaway} maxLength={4000} rows={3} onChange={(event) => {
        setTakeaway(event.target.value)
        writeLocal(takeawayKey, event.target.value)
      }} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/40 p-3 text-sm text-slate-200" placeholder="After the lab, explain what changed in your thinking." />
    </div>
  )
}
