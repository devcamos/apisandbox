"use client"

import { useState } from "react"
import { ChevronRight, Eye, Route, Sparkles } from "lucide-react"
import type { InteractiveScenario } from "@/lib/learning/api-foundations-course"

export function ApiJourneySimulator({ scenario }: Readonly<{ scenario: InteractiveScenario }>) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const option = scenario.options.find((item) => item.id === selectedOption)

  return (
    <section className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-5 sm:p-6" aria-labelledby="simulator-title">
      <div className="flex gap-3">
        <div className="rounded-xl bg-cyan-400/15 p-2.5 h-fit">
          <Route className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Interactive system model</p>
          <h2 id="simulator-title" className="mt-1 text-xl font-bold text-white">{scenario.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">{scenario.prompt}</p>
        </div>
      </div>

      <fieldset className="mt-5 grid gap-3" aria-label="Choose your prediction">
        <legend className="text-sm font-medium text-slate-200">Choose a prediction, then reveal the trace.</legend>
        {scenario.options.map((item) => (
          <label
            key={item.id}
            className={`cursor-pointer rounded-xl border p-4 transition-colors ${
              selectedOption === item.id
                ? "border-cyan-300 bg-cyan-400/10"
                : "border-slate-700 bg-slate-950/30 hover:border-slate-500"
            }`}
          >
            <input
              type="radio"
              name={scenario.title}
              value={item.id}
              checked={selectedOption === item.id}
              onChange={() => setSelectedOption(item.id)}
              className="sr-only"
            />
            <span className="font-medium text-white">{item.label}</span>
          </label>
        ))}
      </fieldset>

      {option ? (
        <div className="mt-5 space-y-4">
          <div className="flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-100">
            <Sparkles className="h-5 w-5 shrink-0 text-emerald-300" />
            <p>{option.consequence}</p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <Eye className="h-4 w-4 text-cyan-300" />
              Request trace
            </div>
            <ol className="space-y-3">
              {scenario.trace.map((step, index) => (
                <li key={step.id} className="flex gap-3">
                  <div className="flex flex-col items-center" aria-hidden="true">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/15 text-xs font-bold text-cyan-200">{index + 1}</span>
                    {index < scenario.trace.length - 1 ? <span className="mt-1 h-7 w-px bg-slate-700" /> : null}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-semibold text-white">{step.label}</p>
                    <p className="text-xs font-medium text-cyan-300">{step.system}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-300">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
          <ChevronRight className="h-4 w-4" />
          Pick a prediction to inspect the system trace.
        </div>
      )}
    </section>
  )
}
