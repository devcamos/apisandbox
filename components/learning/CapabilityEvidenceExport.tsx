"use client"

import { evidenceKey, explanationKey, formatCapabilityEvidence, readEvidence, readLocal, RUN_MODES, type CheckpointEvidence, type LabRun, type RubricReview } from "@/lib/learning/capability-evidence"

export function CapabilityEvidenceExport({ courseId, unitId, title, checkpoint }: Readonly<{
  courseId: string
  unitId: string
  title: string
  checkpoint?: CheckpointEvidence
}>) {
  function download() {
    const key = (item: string) => evidenceKey(courseId, unitId, item)
    const prediction = readEvidence<{ prompt: string; label: string }>(key("prediction"))
    const markdown = formatCapabilityEvidence({
      title,
      prediction: prediction ? `${prediction.prompt}\n${prediction.label}` : "",
      takeaway: readLocal(key("takeaway")),
      runs: Object.fromEntries(RUN_MODES.map((mode) => [mode, readEvidence<LabRun>(key(mode))])),
      explanation: readLocal(explanationKey(courseId, unitId)),
      review: readEvidence<RubricReview>(key("rubric")),
      checkpoint,
    })
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `${unitId}-capability-evidence.md`
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <button type="button" onClick={download} className="mt-5 rounded-lg border border-violet-400/40 px-4 py-2 text-sm font-semibold text-violet-100 hover:bg-violet-400/15">
      Export Capability Evidence
    </button>
  )
}
