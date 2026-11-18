import { questionReviewLink } from "@/lib/learning/capability-review"

export type CheckpointKind = "capability" | "domain-exam"
export type ReviewSchedule = Record<string, { label: string; href: string; interval: number; dueAt: number }>

const DAY_MS = 24 * 60 * 60 * 1000

export function updateReviewSchedule(
  previous: ReviewSchedule,
  kind: CheckpointKind,
  details: ReadonlyArray<{ questionId: string; correct: boolean; reviewLabel: string }>,
  answers: Record<string, string>,
  now: number,
) {
  const next = { ...previous }
  for (const { questionId, correct, reviewLabel } of details) {
    const existing = previous[questionId]
    if (correct) {
      if (!existing || existing.dueAt > now) continue
      const interval = existing.interval * 2
      if (interval > 8) {
        delete next[questionId]
      } else {
        next[questionId] = { ...existing, interval, dueAt: now + interval * DAY_MS }
      }
      continue
    }
    const href = questionReviewLink(kind, questionId, answers[questionId])
    if (href) next[questionId] = { label: reviewLabel, href, interval: 1, dueAt: now + DAY_MS }
  }
  return next
}
