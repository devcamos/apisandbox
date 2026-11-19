import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, expect, it } from "vitest"
import { CapabilityModuleProgress, CapabilityStageCheckbox } from "@/components/learning/CapabilityModuleProgress"

beforeEach(() => localStorage.clear())

function moduleProgress(unitId: string) {
  return (
    <CapabilityModuleProgress courseId="aif" unitId={unitId}>
      <CapabilityStageCheckbox id="problem" title="Problem" />
    </CapabilityModuleProgress>
  )
}

it("shows and restores stage progress independently for each module", () => {
  const { unmount } = render(moduleProgress("first"))
  expect(screen.getByText("0 of 10 stages checked")).toBeVisible()
  fireEvent.click(screen.getByRole("checkbox", { name: "Mark Problem complete" }))
  expect(screen.getByText("1 of 10 stages checked")).toBeVisible()
  expect(screen.getByRole("link", { name: "Continue with Predict" })).toHaveAttribute("href", "#stage-predict")
  unmount()

  const { rerender } = render(moduleProgress("first"))
  expect(screen.getByRole("checkbox", { name: "Mark Problem complete" })).toBeChecked()
  rerender(moduleProgress("second"))
  expect(screen.getByText("0 of 10 stages checked")).toBeVisible()
  rerender(moduleProgress("first"))
  fireEvent.click(screen.getByRole("checkbox", { name: "Mark Problem complete" }))
  expect(screen.getByText("0 of 10 stages checked")).toBeVisible()
})
