import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import DocumentationModal from "../../components/DocumentationModal"

describe("DocumentationModal", () => {
  it("shows the configured phase keywords beneath the document title", () => {
    render(
      <DocumentationModal
        isOpen
        onClose={vi.fn()}
        title="OAuth2"
        color="from-blue-500 to-purple-500"
        documentation={{
          overview: "Delegated authorization.",
          description: [],
          useCases: [],
          paretoKnowledge: { title: "Core knowledge", points: [] },
          bestFor: [],
          notIdealFor: [],
        }}
      />,
    )

    expect(screen.getByRole("heading", { name: "OAuth2 Documentation" })).toBeInTheDocument()
    const keywords = screen.getByLabelText("OAuth2 keywords")
    expect(keywords).toHaveTextContent("authorization code")
    expect(keywords).toHaveTextContent("refresh token")
    expect(keywords).toHaveTextContent("scopes")
  })
})
