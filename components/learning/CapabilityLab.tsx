"use client"

import { useEffect, useRef, useState } from "react"
import { capabilitySandboxDocument } from "@/lib/learning/capability-sandbox-document"
import { capabilityLabs } from "@/lib/learning/capability-labs"
import { evidenceKey, readEvidence, writeLocal, type LabRun, type RunMode } from "@/lib/learning/capability-evidence"

export function CapabilityLab({ courseId, unitId, stage }: Readonly<{
  courseId: string
  unitId: string
  stage: "build" | "break"
}>) {
  const lab = capabilityLabs[unitId]
  const codeKey = evidenceKey(courseId, unitId, "code")
  const [code, setCode] = useState(lab.code)
  const [results, setResults] = useState<Partial<Record<RunMode, LabRun>>>({})
  const [running, setRunning] = useState<RunMode>()
  const dispose = useRef<() => void>(undefined)
  const currentCode = useRef(lab.code)
  const modes: RunMode[] = stage === "build" ? ["build"] : ["fault", "recovery"]

  useEffect(() => {
    currentCode.current = readEvidence<string>(codeKey) ?? lab.code
    setCode(currentCode.current)
    setResults({
      build: readEvidence(evidenceKey(courseId, unitId, "build")),
      fault: readEvidence(evidenceKey(courseId, unitId, "fault")),
      recovery: readEvidence(evidenceKey(courseId, unitId, "recovery")),
    })

    function sync(event: Event) {
      const { detail } = event as CustomEvent<string>
      currentCode.current = detail
      setCode(detail)
      setResults((previous) => ({ ...previous, recovery: undefined }))
    }

    window.addEventListener(codeKey, sync)
    return () => {
      window.removeEventListener(codeKey, sync)
      dispose.current?.()
    }
  }, [codeKey, courseId, lab.code, unitId])

  function updateCode(value: string) {
    writeLocal(codeKey, JSON.stringify(value))
    writeLocal(evidenceKey(courseId, unitId, "recovery"), "")
    window.dispatchEvent(new CustomEvent(codeKey, { detail: value }))
  }

  function run(mode: RunMode) {
    if (dispose.current) return
    setRunning(mode)
    const fixtures = mode === "recovery" ? lab.checks : mode === "fault" ? [lab.baseline, lab.fault] : [lab.baseline]
    const frame = document.createElement("iframe")
    frame.hidden = true
    frame.title = "Isolated code runner"
    frame.sandbox.add("allow-scripts")
    frame.srcdoc = capabilitySandboxDocument

    function finish(result: LabRun) {
      dispose.current?.()
      setRunning(undefined)
      if (mode !== "recovery" || currentCode.current === code) {
        writeLocal(evidenceKey(courseId, unitId, mode), JSON.stringify(result))
        setResults((previous) => ({ ...previous, [mode]: result }))
      }
    }

    function receive(event: MessageEvent) {
      if (event.source !== frame.contentWindow || event.origin !== "null" || event.data?.capabilitySandbox !== true) return
      if (typeof event.data.error === "string") {
        finish({ output: event.data.error, passed: mode === "recovery" ? false : undefined })
        return
      }
      try {
        const values: unknown = JSON.parse(event.data.output)
        if (!Array.isArray(values) || values.length !== fixtures.length) throw new Error("Return one value per fixture.")
        const checks = mode === "recovery" ? lab.checks : []
        const logs = fixtures.map(({ label }, index) => {
          const expected = checks[index]?.expected
          const output = JSON.stringify(values[index])
          if (mode === "fault" && index === 1) return `${label}: ${output}\nRecovered behavior: ${JSON.stringify(lab.checks[0].expected)}`
          if (expected === undefined) return `${label}: ${output}`
          const passed = JSON.stringify(expected) === output
          return `${passed ? "PASS" : "FAIL"} — ${label}: ${output} (expected ${JSON.stringify(expected)})`
        })
        finish({ output: logs.join("\n"), passed: mode === "recovery" ? logs.every((line) => line.startsWith("PASS")) : undefined })
      } catch {
        finish({ output: "The program must return a JSON value for each fixture.", passed: mode === "recovery" ? false : undefined })
      }
    }

    const timeout = window.setTimeout(() => finish({
      output: "The code runner did not respond. Try again.",
      passed: mode === "recovery" ? false : undefined,
    }), 3500)
    dispose.current = () => {
      window.clearTimeout(timeout)
      window.removeEventListener("message", receive)
      frame.remove()
      dispose.current = undefined
    }
    window.addEventListener("message", receive)
    frame.addEventListener("load", () => frame.contentWindow?.postMessage({ code, inputs: fixtures.map(({ input }) => input) }, "*"), { once: true })
    document.body.append(frame)
  }

  return (
    <div className="mt-5 space-y-3">
      <label htmlFor={`${unitId}-${stage}-code`} className="block font-semibold text-white">
        {stage === "build" ? "Runnable JavaScript companion" : "Edit your recovery"}
      </label>
      <textarea id={`${unitId}-${stage}-code`} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs leading-6 text-emerald-100" rows={8} value={code} maxLength={8000} spellCheck={false} disabled={Boolean(running)} onChange={(event) => updateCode(event.target.value)} />
      {stage === "break" ? <p className="text-sm text-slate-400">Your function receives the fixture below. Return the expected value for each recovery case while preserving the baseline behavior.</p> : null}
      <details className="text-sm text-slate-300">
        <summary className="cursor-pointer">View {stage === "build" ? "starter input" : "fault and recovery fixtures"}</summary>
        <pre className="mt-2 overflow-auto rounded-lg bg-slate-950 p-3 text-xs">{JSON.stringify(stage === "build" ? lab.baseline : lab.checks, null, 2)}</pre>
      </details>
      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => (
          <button key={mode} type="button" disabled={Boolean(running)} onClick={() => run(mode)} className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-50">
            {running === mode ? "Running…" : { build: "Run starter", fault: "Run Fault", recovery: "Check recovery" }[mode]}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="space-y-2">
        {modes.map((mode) => results[mode] ? (
          <div key={mode} className="rounded-lg border border-slate-700 bg-slate-950 p-3">
            <p className="text-sm font-semibold text-slate-200">
              {{ build: "Build output", fault: "Fault output", recovery: results.recovery?.passed ? "Recovery passed" : "Recovery failed" }[mode]}
            </p>
            <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-300">{results[mode].output}</pre>
          </div>
        ) : null)}
      </div>
    </div>
  )
}
