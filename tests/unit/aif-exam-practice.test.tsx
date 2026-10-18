import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { AifExamPractice } from "@/components/learning/AifExamPractice"
import type { SanitizedAifExamQuestion } from "@/lib/learning/aif-c01-question-bank"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}))

const sampleQuestions: SanitizedAifExamQuestion[] = [
  {
    id: "aif-d1-001",
    format: "single-choice",
    domainId: "ai-ml-fundamentals",
    taskStatement: "1.3",
    topic: "precision",
    difficulty: "easy",
    stem: "What does precision measure?",
    options: [
      { id: "A", text: "True positives among predicted positives" },
      { id: "B", text: "True positives among actual positives" },
      { id: "C", text: "All correct predictions" },
      { id: "D", text: "Balance of precision and recall" },
    ],
    selectCount: 1,
  },
  {
    id: "aif-d3-001",
    format: "multi-response",
    domainId: "foundation-models",
    taskStatement: "3.1",
    topic: "rag",
    difficulty: "medium",
    stem: "Which practices improve grounded answers?",
    options: [
      { id: "A", text: "Retrieve trusted documents" },
      { id: "B", text: "Cite sources in the answer" },
      { id: "C", text: "Raise temperature to 2.0" },
      { id: "D", text: "Filter low-relevance chunks" },
      { id: "E", text: "Disable all logging" },
    ],
    selectCount: 3,
  },
]

describe("AifExamPractice", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("requires a full set of answers before submit and shows explanations after grading", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          correctCount: 1,
          totalQuestions: 2,
          scorePercent: 50,
          details: [
            {
              questionId: "aif-d1-001",
              correct: true,
              selectedOptionIds: ["A"],
              correctOptionIds: ["A"],
              options: [
                {
                  optionId: "A",
                  text: "True positives among predicted positives",
                  correct: true,
                  selected: true,
                  explanation: "Precision looks at the positive predictions.",
                },
                {
                  optionId: "B",
                  text: "True positives among actual positives",
                  correct: false,
                  selected: false,
                  explanation: "That is recall.",
                },
                {
                  optionId: "C",
                  text: "All correct predictions",
                  correct: false,
                  selected: false,
                  explanation: "That is accuracy.",
                },
                {
                  optionId: "D",
                  text: "Balance of precision and recall",
                  correct: false,
                  selected: false,
                  explanation: "That is the F1 score idea.",
                },
              ],
            },
            {
              questionId: "aif-d3-001",
              correct: false,
              selectedOptionIds: ["A", "B", "C"],
              correctOptionIds: ["A", "B", "D"],
              options: sampleQuestions[1].options.map((option) => ({
                optionId: option.id,
                text: option.text,
                correct: ["A", "B", "D"].includes(option.id),
                selected: ["A", "B", "C"].includes(option.id),
                explanation: `Why ${option.id} is ${["A", "B", "D"].includes(option.id) ? "right" : "wrong"}.`,
              })),
            },
          ],
        },
      }),
    })
    vi.stubGlobal("fetch", fetchMock)

    render(
      <AifExamPractice
        questions={sampleQuestions}
        summary={{
          version: "1.0.0",
          totalQuestions: 160,
          singleChoiceCount: 120,
          multiResponseCount: 40,
          metricsTopicCount: 26,
          byDomain: {
            "ai-ml-fundamentals": { count: 32, percent: 20 },
            "genai-fundamentals": { count: 38, percent: 23.75 },
            "foundation-models": { count: 45, percent: 28.125 },
            "responsible-ai": { count: 22, percent: 13.75 },
            "ai-security": { count: 23, percent: 14.375 },
          },
        }}
        initialFilter="all"
      />,
    )

    expect(screen.getByRole("heading", { name: "Exam-style practice" })).toBeInTheDocument()
    const submit = screen.getByRole("button", { name: "Submit practice set" })
    expect(submit).toBeDisabled()

    fireEvent.click(screen.getByLabelText(/True positives among predicted positives/i))
    fireEvent.click(screen.getByLabelText(/Retrieve trusted documents/i))
    fireEvent.click(screen.getByLabelText(/Cite sources in the answer/i))
    fireEvent.click(screen.getByLabelText(/Raise temperature to 2.0/i))

    expect(submit).not.toBeDisabled()
    fireEvent.click(submit)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/learning/aif-c01-practice/grade",
        expect.objectContaining({ method: "POST" }),
      )
      expect(screen.getByText("Practice result")).toBeInTheDocument()
      expect(screen.getByText(/Precision looks at the positive predictions/i)).toBeInTheDocument()
    })
  })
})
