"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { CAPABILITY_MASTERY_STAGES, type CapabilityMasteryStageId } from "@/lib/learning/course-types"
import { evidenceKey, readEvidence, writeLocal } from "@/lib/learning/capability-evidence"

const ProgressContext = createContext<{
  completed: CapabilityMasteryStageId[]
  setComplete: (id: CapabilityMasteryStageId, checked: boolean) => void
  ready: boolean
}>({ completed: [], setComplete: () => {}, ready: false })

export function CapabilityModuleProgress({ courseId, unitId, children }: Readonly<{
  courseId: string
  unitId: string
  children: ReactNode
}>) {
  const key = evidenceKey(courseId, unitId, "completed-stages")
  const [progress, setProgress] = useState<{ key: string; completed: CapabilityMasteryStageId[] }>()
  const ready = progress?.key === key
  const completed = ready ? progress.completed : []
  const total = CAPABILITY_MASTERY_STAGES.length
  const next = CAPABILITY_MASTERY_STAGES.find(({ id }) => !completed.includes(id))

  useEffect(() => {
    function load() {
      const saved = readEvidence<unknown>(key)
      setProgress({
        key,
        completed: CAPABILITY_MASTERY_STAGES.map(({ id }) => id).filter((id) => Array.isArray(saved) && saved.includes(id)),
      })
    }

    function sync(event: StorageEvent) {
      if (event.key === key || event.key === null) load()
    }

    load()
    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [key])

  function setComplete(id: CapabilityMasteryStageId, checked: boolean) {
    const stages = completed.filter((stage) => stage !== id)
    if (checked) stages.push(id)
    writeLocal(key, JSON.stringify(stages))
    setProgress({ key, completed: stages })
  }

  return (
    <ProgressContext.Provider value={{ completed, setComplete, ready }}>
      <section aria-label="Module progress" className="mt-6 rounded-2xl border border-violet-400/25 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-white">Module progress</h3>
          <span aria-live="polite" className="text-sm text-violet-200">{completed.length} of {total} stages checked</span>
        </div>
        <progress aria-label="Stages checked" value={completed.length} max={total} className="mt-3 h-2 w-full accent-violet-400" />
        <p className="mt-2 text-sm text-slate-400">Your stage checklist is saved in this browser. Checkpoint results are recorded with your account.</p>
        {next ? <a href={`#stage-${next.id}`} className="mt-2 inline-block text-sm font-semibold text-violet-200 underline">Continue with {next.label}</a> : null}
      </section>

      <nav aria-label="Capability mastery stages" className="mt-4 overflow-x-auto pb-2">
        <ol className="flex min-w-max gap-2">
          {CAPABILITY_MASTERY_STAGES.map((stage, index) => (
            <li key={stage.id}>
              <a href={`#stage-${stage.id}`} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-violet-400/50 hover:text-white">
                <span className={completed.includes(stage.id) ? "text-emerald-300" : "text-violet-300"} aria-hidden="true">{completed.includes(stage.id) ? "✓" : index + 1}</span>
                {stage.label}
                {completed.includes(stage.id) ? <span className="sr-only">checked</span> : null}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-4 space-y-5">{children}</div>
    </ProgressContext.Provider>
  )
}

export function CapabilityStageCheckbox({ id, title }: Readonly<{ id: CapabilityMasteryStageId; title: string }>) {
  const { completed, setComplete, ready } = useContext(ProgressContext)
  return (
    <label className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-200">
      <input type="checkbox" className="h-4 w-4 accent-violet-400" disabled={!ready} checked={completed.includes(id)} onChange={(event) => setComplete(id, event.target.checked)} />
      Mark {title} complete
    </label>
  )
}
