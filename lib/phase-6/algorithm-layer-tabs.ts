/**
 * Contract for algorithm interactive layer tabs (Phase 6).
 * All categories get Overview + Visualizer; searching adds exercises and optional real-world / variations.
 */

export type LayerTab = "overview" | "visualizer" | "exercises" | "real-world" | "variations"

export interface AlgorithmTabContext {
  realWorld?: unknown[] | undefined
  variations?: unknown[] | undefined
}

export interface AlgorithmLayerTabMeta {
  id: LayerTab
  label: string
}

/**
 * Ordered tabs for the algorithm detail layer. Extensible: new categories can branch here
 * without changing the tab strip UI — add cases and optional content panels.
 */
export function getAlgorithmLayerTabs(
  categoryId: string,
  algorithm: AlgorithmTabContext
): AlgorithmLayerTabMeta[] {
  const tabs: AlgorithmLayerTabMeta[] = [
    { id: "overview", label: "Overview" },
    { id: "visualizer", label: "Visualizer" },
  ]
  if (categoryId === "searching") {
    tabs.push({ id: "exercises", label: "Exercises" })
    if (algorithm.realWorld?.length) {
      tabs.push({ id: "real-world", label: "Real Systems" })
    }
    if (algorithm.variations?.length) {
      tabs.push({ id: "variations", label: "Variations" })
    }
  }
  return tabs
}

/** Stable test id for Playwright / RTL */
export function layerTabTestId(tab: LayerTab): string {
  return `algorithm-layer-tab-${tab}`
}
