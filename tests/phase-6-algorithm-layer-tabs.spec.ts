import { test, expect } from "@playwright/test"
import { getAlgorithmLayerTabs } from "../lib/phase-6/algorithm-layer-tabs"

/**
 * Locks in the tabbed algorithm layer: contract (pure) + E2E (UI).
 * New tabs should extend getAlgorithmLayerTabs and add matching panels + tests.
 */

test.describe("Phase 6 — algorithm layer tabs (contract)", () => {
  test("sorting & graph-tree: Overview + Visualizer only", () => {
    for (const id of ["sorting", "graph-tree"] as const) {
      const tabs = getAlgorithmLayerTabs(id, { realWorld: [{ x: 1 }], variations: [{ x: 1 }] })
      expect(tabs.map((t) => t.id), `${id} tab ids`).toEqual(["overview", "visualizer"])
    }
  })

  test("searching: base tabs + exercises; real-world & variations when data present", () => {
    const minimal = getAlgorithmLayerTabs("searching", {})
    expect(minimal.map((t) => t.id)).toEqual(["overview", "visualizer", "exercises"])

    const full = getAlgorithmLayerTabs("searching", {
      realWorld: [{ system: "a", explanation: "b" }],
      variations: [{ name: "v", description: "d", difficulty: "Easy" }],
    })
    expect(full.map((t) => t.id)).toEqual([
      "overview",
      "visualizer",
      "exercises",
      "real-world",
      "variations",
    ])
  })

  test("searching: omits real-world / variations when arrays empty", () => {
    const tabs = getAlgorithmLayerTabs("searching", { realWorld: [], variations: [] })
    expect(tabs.map((t) => t.id)).toEqual(["overview", "visualizer", "exercises"])
  })
})

test.describe("Phase 6 — algorithm layer tabs (E2E)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/phase-6")
  })

  test("sorting algorithm shows Overview + Visualizer tabs and switches panels", async ({ page }) => {
    await page.getByTestId("phase-6-category-sorting").click()
    await page.getByTestId("phase-6-algorithm-card-bubble").click()

    await expect(page.getByTestId("phase-6-interactive-layer")).toBeVisible()

    await expect(page.getByTestId("algorithm-layer-tab-overview")).toBeVisible()
    await expect(page.getByTestId("algorithm-layer-tab-visualizer")).toBeVisible()
    await expect(page.getByTestId("algorithm-layer-tab-exercises")).toHaveCount(0)

    await expect(page.getByTestId("algorithm-layer-panel-overview")).toBeVisible()
    await expect(page.getByRole("heading", { name: /What is this algorithm/i })).toBeVisible()

    await page.getByTestId("algorithm-layer-tab-visualizer").click()
    await expect(page.getByTestId("algorithm-layer-panel-visualizer")).toBeVisible()
    await expect(page.getByTestId("algorithm-layer-panel-overview")).toHaveCount(0)
  })

  test("searching algorithm shows extended tabs and each panel mounts", async ({ page }) => {
    await page.getByTestId("phase-6-category-searching").click()
    await page.getByTestId("phase-6-algorithm-card-binary").click()

    await expect(page.getByTestId("phase-6-interactive-layer")).toBeVisible()

    for (const id of ["overview", "visualizer", "exercises", "real-world", "variations"] as const) {
      await expect(page.getByTestId(`algorithm-layer-tab-${id}`)).toBeVisible()
    }

    await expect(page.getByTestId("algorithm-layer-panel-overview")).toBeVisible()

    await page.getByTestId("algorithm-layer-tab-exercises").click()
    await expect(page.getByTestId("algorithm-layer-panel-exercises")).toBeVisible()

    await page.getByTestId("algorithm-layer-tab-real-world").click()
    await expect(page.getByTestId("algorithm-layer-panel-real-world")).toBeVisible()

    await page.getByTestId("algorithm-layer-tab-variations").click()
    await expect(page.getByTestId("algorithm-layer-panel-variations")).toBeVisible()

    await page.getByTestId("algorithm-layer-tab-overview").click()
    await expect(page.getByTestId("algorithm-layer-panel-overview")).toBeVisible()
  })
})
