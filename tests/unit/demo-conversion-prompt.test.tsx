import { cleanup, render, within } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { DemoConversionPrompt } from "@/components/demo/DemoConversionPrompt"

describe("DemoConversionPrompt", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders Free and Pro CTAs for completion variant", () => {
    const { container } = render(<DemoConversionPrompt variant="completion" />)
    const prompt = within(container).getByTestId("demo-conversion-prompt")

    expect(prompt).toHaveAttribute("data-variant", "completion")
    expect(within(prompt).getByRole("heading", { name: /Phase 1 complete/i })).toBeInTheDocument()
    expect(within(prompt).getByTestId("demo-convert-free")).toHaveAttribute(
      "href",
      "/signup?fromDemo=1",
    )
    expect(within(prompt).getByTestId("demo-convert-pro")).toHaveAttribute(
      "href",
      "/signup?fromDemo=1&plan=pro",
    )
  })

  it("renders locked variant with Free/Pro and back link", () => {
    const { container } = render(
      <DemoConversionPrompt variant="locked" lockedContentName="Phase 2" />,
    )
    const prompt = within(container).getByTestId("demo-conversion-prompt")

    expect(prompt).toHaveAttribute("data-variant", "locked")
    expect(
      within(prompt).getByRole("heading", { name: /Phase 2 is locked in the demo/i }),
    ).toBeInTheDocument()
    expect(within(prompt).getByTestId("demo-convert-free")).toHaveAttribute(
      "href",
      "/signup?fromDemo=1",
    )
    expect(within(prompt).getByTestId("demo-convert-pro")).toHaveAttribute(
      "href",
      "/signup?fromDemo=1&plan=pro",
    )
    expect(within(prompt).getByRole("link", { name: /Back to Phase 1/i })).toHaveAttribute(
      "href",
      "/phase-1",
    )
  })
})
