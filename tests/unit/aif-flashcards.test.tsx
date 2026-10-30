import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { AifFlashcards } from "@/components/learning/AifFlashcards"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}))

const summary = {
  version: "1.0.0" as const,
  totalQuestions: 200,
  singleChoiceCount: 151,
  multiResponseCount: 49,
  metricsTopicCount: 26,
  byDomain: {
    "ai-ml-fundamentals": { count: 40, percent: 20 },
    "genai-fundamentals": { count: 48, percent: 24 },
    "foundation-models": { count: 56, percent: 28 },
    "responsible-ai": { count: 28, percent: 14 },
    "ai-security": { count: 28, percent: 14 },
  },
}

describe("AifFlashcards", () => {
  it("reveals the answer and supports marking a card known", () => {
    render(
      <AifFlashcards
        summary={summary}
        initialFilter="all"
        cards={[
          {
            id: "aif-d1-001",
            domainId: "ai-ml-fundamentals",
            taskStatement: "1.1",
            topic: "classification",
            difficulty: "easy",
            front: "What does classification predict?",
            answers: [
              {
                optionId: "A",
                text: "A category",
                explanation: "Classification assigns an input to one of the known classes.",
              },
            ],
          },
        ]}
      />,
    )

    expect(screen.getByText("What does classification predict?")).toBeInTheDocument()
    expect(screen.queryByText("Classification assigns an input to one of the known classes.")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /What does classification predict/i }))

    expect(screen.getByText("A. A category")).toBeInTheDocument()
    expect(screen.getByText("Classification assigns an input to one of the known classes.")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /I know this/i }))
    expect(screen.getByRole("button", { name: /I know this/i })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("1 marked as known")).toBeInTheDocument()
  })
})
