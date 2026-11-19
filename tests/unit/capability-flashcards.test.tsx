import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it } from "vitest"
import { CapabilityFlashcards } from "@/components/learning/CapabilityFlashcards"

it("reveals answers on demand and resets the reveal when navigating", () => {
  render(<CapabilityFlashcards cards={[
    { prompt: "How does it work?", answer: ["Learned weights score the input."] },
    { prompt: "When should you avoid it?", answer: ["When a fixed rule covers the policy."] },
  ]} />)
  expect(screen.getByText("Card 1 of 2")).toBeVisible()
  expect(screen.queryByText("Learned weights score the input.")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: "Show answer" }))
  expect(screen.getByText("Learned weights score the input.")).toBeVisible()
  fireEvent.click(screen.getByRole("button", { name: "Next card" }))
  expect(screen.getByText("Card 2 of 2")).toBeVisible()
  expect(screen.queryByText("When a fixed rule covers the policy.")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: "Start again" }))
  expect(screen.getByText("Card 1 of 2")).toBeVisible()
  expect(screen.queryByText("Learned weights score the input.")).toBeNull()
})
