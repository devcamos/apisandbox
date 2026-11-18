"use client"

import { useEffect, useState } from "react"
import { authApiJsonInit, type AuthApiEnvelope } from "@/lib/auth/client-fetch"
import { evidenceKey, explanationKey, readEvidence, readLocal, writeLocal, type RubricFeedback, type RubricReview } from "@/lib/learning/capability-evidence"

export function CapabilityExplanation({ courseId, unitId, prompt, criteria }: Readonly<{
  courseId: string
  unitId: string
  prompt: string
  criteria: string[]
}>) {
  const storageKey = explanationKey(courseId, unitId)
  const reviewKey = evidenceKey(courseId, unitId, "rubric")
  const [draft, setDraft] = useState("")
  const [review, setReview] = useState<RubricReview>()
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState("")
  const currentReview = review?.draft === draft ? review : undefined

  useEffect(() => {
    setDraft(readLocal(storageKey))
    setReview(readEvidence(reviewKey))
  }, [storageKey, reviewKey])

  async function check() {
    setChecking(true)
    setError("")
    try {
      const response = await fetch("/api/learning/capability-explanations", authApiJsonInit({ unitId, draft }))
      const payload = await response.json() as AuthApiEnvelope<RubricFeedback[]>
      if (!response.ok || !payload.data) throw new Error(payload.error?.message ?? "Unable to check this explanation.")
      const checked = { draft, feedback: payload.data }
      setReview(checked)
      writeLocal(reviewKey, JSON.stringify(checked))
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to check this explanation.")
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="space-y-3">
      <label htmlFor={`${unitId}-explanation`} className="block font-semibold text-white">{prompt}</label>
      <textarea id={`${unitId}-explanation`} value={draft} maxLength={4000} rows={6} onChange={(event) => {
        setDraft(event.target.value)
        writeLocal(storageKey, event.target.value)
      }} className="w-full rounded-xl border border-slate-700 bg-slate-950/40 p-4 text-sm leading-6 text-white" />
      <p className="text-xs text-slate-400">Drafts are saved in this browser. Checking sends your draft to the AI grader. Use synthetic examples.</p>
      <ul className="grid gap-2 sm:grid-cols-3">
        {criteria.map((criterion, index) => {
          const item = currentReview?.feedback[index]
          return (
            <li key={criterion} className="rounded-lg border border-slate-700 bg-slate-950/30 p-3 text-sm text-slate-300">
              <strong className="text-white">{criterion}</strong>
              {item ? <>
                <p className="mt-1 capitalize text-violet-200">{item.status}</p>
                <p className="mt-1">{item.feedback}</p>
                {item.status !== "covered" && item.href ? <a href={item.href} className="mt-2 inline-block text-violet-200 underline">Review this concept</a> : null}
              </> : null}
            </li>
          )
        })}
      </ul>
      <button type="button" disabled={checking || draft.trim().length < 20} onClick={() => void check()} className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400 disabled:opacity-50">
        {checking ? "Checking…" : "Check explanation"}
      </button>
      <p role="status" className="text-xs text-slate-400">
        {currentReview ? `Rubric checked · ${currentReview.feedback.filter((item) => item.status === "covered").length}/${criteria.length} criteria covered` : "Enter at least 20 characters to get rubric feedback."}
      </p>
      {error ? <p role="alert" className="text-sm text-amber-200">{error}</p> : null}
    </div>
  )
}
