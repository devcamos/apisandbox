import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import AuthPageShell from "@/components/auth/AuthPageShell"

describe("AuthPageShell", () => {
  it("shows a loading state over auth content", () => {
    render(
      <AuthPageShell title="Welcome" subtitle="Sign in" isLoading loadingMessage="Signing you in securely…">
        <button type="button">Sign In</button>
      </AuthPageShell>,
    )

    expect(screen.getByRole("status")).toHaveTextContent("Signing you in securely…")
    expect(screen.getByRole("status")).toHaveTextContent("This may take a moment.")
  })
})
