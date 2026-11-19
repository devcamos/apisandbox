export const RUN_MODES = ["build", "fault", "recovery"] as const
export type RunMode = typeof RUN_MODES[number]
export type LabRun = { output: string; passed?: boolean }
export type RubricFeedback = { criterion: string; status: "covered" | "partial" | "missing"; feedback: string; href?: string }
export type RubricReview = { draft: string; feedback: RubricFeedback[] }
export type CheckpointEvidence = { correctAnswers: number; totalQuestions: number; mastered: boolean }

export function evidenceKey(courseId: string, unitId: string, item: string) {
  return `aws-capability-evidence:v1:${courseId}:${unitId}:${item}`
}

export function explanationKey(courseId: string, unitId: string) {
  return `aws-capability-explanation:v1:${courseId}:${unitId}`
}

export function readLocal(key: string) {
  try {
    return globalThis.localStorage?.getItem(key) ?? ""
  } catch {
    return ""
  }
}

export function writeLocal(key: string, value: string) {
  try {
    globalThis.localStorage?.setItem(key, value)
  } catch {
    // The current session can still be used with storage disabled.
  }
}

export function readEvidence<T>(key: string): T | undefined {
  try {
    return JSON.parse(readLocal(key)) as T
  } catch {
    return undefined
  }
}

function block(value: string) {
  const fence = "`".repeat(Math.max(2, ...Array.from(value.matchAll(/`+/g), (match) => match[0].length)) + 1)
  return value.trim() ? `${fence}\n${value}\n${fence}` : "_No evidence recorded._"
}

export function formatCapabilityEvidence(input: {
  title: string
  prediction: string
  takeaway: string
  runs: Partial<Record<RunMode, LabRun>>
  explanation: string
  review?: RubricReview
  checkpoint?: CheckpointEvidence
}) {
  const { title, prediction, takeaway, runs, explanation, review, checkpoint } = input
  const recoveryStatus = runs.recovery?.passed ? "Passed" : "Failed"
  const checkpointStatus = checkpoint?.mastered ? "Passed" : "Below passing threshold"
  return [
    `# ${title} — Capability Evidence`,
    "## 2. Prediction and takeaway",
    `### Initial prediction\n\n${block(prediction)}`,
    `### Final takeaway\n\n${block(takeaway)}`,
    "## 6. Build",
    block(runs.build?.output ?? ""),
    "## 7. Fault and recovery",
    `### Fault output\n\n${block(runs.fault?.output ?? "")}`,
    `### Recovery assertions\n\n${runs.recovery?.passed === undefined ? "Pending" : recoveryStatus}\n\n${block(runs.recovery?.output ?? "")}`,
    "## 8. Explain it back",
    block(explanation),
    review && review.draft === explanation
      ? review.feedback.map(({ criterion, status, feedback }) => `### ${criterion} — ${status}\n\n${block(feedback)}`).join("\n\n")
      : "_Current explanation awaits a rubric check._",
    "## 10. Scored checkpoint",
    checkpoint && checkpoint.totalQuestions > 0
      ? `${checkpoint.correctAnswers}/${checkpoint.totalQuestions} correct (${Math.round(100 * checkpoint.correctAnswers / checkpoint.totalQuestions)}%) · ${checkpointStatus}`
      : "_No checkpoint score recorded._",
  ].join("\n\n") + "\n"
}
