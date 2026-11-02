import { getPhaseCatalogEntry, premiumAppSections } from "@/lib/learning/premium-catalog"
import type { PhaseId } from "@/lib/subscription-access"

export interface PhasePreviewContent {
  title: string
  summary: string
  outcomes: string[]
  topics: string[]
  estimatedTime: string | null
  /** Where to send the learner back after sign-in. */
  href: string
}

/** Preview copy comes only from the existing catalog metadata (no invented claims). */
export function getPhasePreviewContent(
  phase: PhaseId,
  lockedContentName?: string,
): PhasePreviewContent {
  if (phase === "cloud" || phase === "ai") {
    const section = premiumAppSections.find((s) => s.id === phase)
    return {
      title: lockedContentName ?? section?.title ?? "Premium section",
      summary: section?.description ?? "Premium learning content",
      outcomes: [],
      topics: section?.topics ?? [],
      estimatedTime: null,
      href: section?.href ?? "/dashboard",
    }
  }
  const entry = getPhaseCatalogEntry(phase)
  return {
    title: lockedContentName ?? (entry ? `Phase ${phase}: ${entry.title}` : `Phase ${phase}`),
    summary: entry?.description ?? "Premium learning content",
    outcomes: (entry?.skills ?? []).slice(0, 5),
    topics: (entry?.topics ?? []).slice(0, 5),
    estimatedTime: entry?.estimatedTime ?? null,
    href: entry?.href ?? `/phase-${phase}`,
  }
}
