"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, ClipboardCheck, RotateCcw, ShieldCheck } from "lucide-react"
import type { AwsReadinessRequirement } from "@/lib/learning/aws-certification-course"

const STORAGE_VERSION = "v1"

function storageKey(trackSlug: string) {
  return `aws-certification-readiness:${STORAGE_VERSION}:${trackSlug}`
}

export function AwsReadinessChecklist({
  trackSlug,
  requirements,
}: Readonly<{
  trackSlug: string
  requirements: AwsReadinessRequirement[]
}>) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const raw = globalThis.localStorage?.getItem(storageKey(trackSlug))
    if (raw) {
      try {
        setCompleted(JSON.parse(raw) as Record<string, boolean>)
      } catch {
        setCompleted({})
      }
    }
    setHydrated(true)
  }, [trackSlug])

  useEffect(() => {
    if (!hydrated) return
    globalThis.localStorage?.setItem(storageKey(trackSlug), JSON.stringify(completed))
  }, [completed, hydrated, trackSlug])

  const completedCount = useMemo(
    () => requirements.filter((requirement) => completed[requirement.id]).length,
    [completed, requirements],
  )
  const percent = requirements.length === 0 ? 0 : Math.round((completedCount / requirements.length) * 100)

  return (
    <section className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5 sm:p-6" aria-labelledby="readiness-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="h-fit rounded-xl bg-emerald-400/15 p-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">External readiness gate</p>
            <h2 id="readiness-title" className="mt-1 text-xl font-bold text-white">High-confidence exam readiness</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              These activities happen outside API Sandbox. Completion is evidence of preparation, not a guaranteed pass probability.
            </p>
          </div>
        </div>
        <div className="min-w-32 rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-right">
          <div className="text-2xl font-bold text-white">{completedCount}/{requirements.length}</div>
          <div className="text-xs text-slate-400">{percent}% complete</div>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-label="External readiness progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-[width]" style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-5 grid gap-3">
        {requirements.map((requirement) => {
          const checked = Boolean(completed[requirement.id])
          return (
            <label key={requirement.id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${checked ? "border-emerald-400/35 bg-emerald-400/10" : "border-slate-700 bg-slate-950/30 hover:border-slate-500"}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => setCompleted((current) => ({ ...current, [requirement.id]: event.target.checked }))}
                className="mt-1 h-4 w-4 shrink-0 accent-emerald-400"
              />
              <span>
                <span className="flex items-center gap-2 font-semibold text-white">
                  {checked ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <ClipboardCheck className="h-4 w-4 text-slate-400" />}
                  {requirement.label}
                </span>
                <span className="mt-1 block text-sm leading-5 text-slate-400">{requirement.detail}</span>
              </span>
            </label>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-500">
        <span>Checklist state is saved on this device. Assessment results are saved to your signed-in account.</span>
        <button type="button" onClick={() => setCompleted({})} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-slate-500 hover:text-white">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset checklist
        </button>
      </div>
    </section>
  )
}
