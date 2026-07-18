export const APP_GUIDE_STEP_IDS = [
  "pareto_methodology",
  "read_docs",
  "try_demos",
  "track_progress",
] as const

export type AppGuideStepId = (typeof APP_GUIDE_STEP_IDS)[number]

export type AppGuideStepState = {
  completedAt: string | null
  understood: boolean
}

export type AppGuideStepsRecord = Record<AppGuideStepId, AppGuideStepState>

export const APP_GUIDE_STEP_META: Record<
  AppGuideStepId,
  { title: string; description: string; href: string; linkLabel: string }
> = {
  pareto_methodology: {
    title: "How training works (first principles)",
    description:
      "We build a causal model from program state to dependable integrations before introducing advanced tools.",
    href: "/dashboard#app-guide-pareto",
    linkLabel: "Review methodology",
  },
  read_docs: {
    title: "Build the mental model",
    description: "Start with the program-to-network foundation and follow one API request end to end.",
    href: "/learn/api-foundations",
    linkLabel: "Start foundation",
  },
  try_demos: {
    title: "Trace a request",
    description: "Predict how the package-tracking request moves through each system boundary.",
    href: "/learn/api-foundations/network-path",
    linkLabel: "Trace the network",
  },
  track_progress: {
    title: "Monitor progress",
    description: "Use the dashboard and observability views to see how you are doing.",
    href: "/observability",
    linkLabel: "View Dashboard",
  },
}

export function createEmptyGuideSteps(): AppGuideStepsRecord {
  return Object.fromEntries(
    APP_GUIDE_STEP_IDS.map((id) => [id, { completedAt: null, understood: false }]),
  ) as AppGuideStepsRecord
}

export function parseGuideSteps(raw: unknown): AppGuideStepsRecord {
  const base = createEmptyGuideSteps()
  if (!raw || typeof raw !== "object") return base
  for (const id of APP_GUIDE_STEP_IDS) {
    const entry = (raw as Record<string, unknown>)[id]
    if (!entry || typeof entry !== "object") continue
    const row = entry as Record<string, unknown>
    base[id] = {
      completedAt: typeof row.completedAt === "string" ? row.completedAt : null,
      understood: row.understood === true,
    }
  }
  return base
}

/** 0–100 score from steps marked understood. */
export function computeGuideUnderstandingPercent(steps: AppGuideStepsRecord): number {
  const total = APP_GUIDE_STEP_IDS.length
  const understood = APP_GUIDE_STEP_IDS.filter((id) => steps[id].understood).length
  return Math.round((understood / total) * 100)
}

export function isGuideComplete(steps: AppGuideStepsRecord, completedAt: Date | null): boolean {
  if (completedAt) return true
  return APP_GUIDE_STEP_IDS.every((id) => steps[id].understood)
}
