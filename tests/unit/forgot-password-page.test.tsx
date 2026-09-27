import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ForgotPasswordPage from "@/app/forgot-password/page"

describe("ForgotPasswordPage", () => {
  it("explains recovery options and links back to login", () => {
    render(<ForgotPasswordPage />)

    expect(screen.getByTestId("forgot-password-page")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /reset password/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /back to sign in/i })).toHaveAttribute(
      "href",
      "/login",
    )
    expect(screen.getByRole("link", { name: /create an account/i })).toHaveAttribute(
      "href",
      "/signup",
    )
    expect(screen.getByRole("link", { name: /support@apisandbox\.dev/i })).toHaveAttribute(
      "href",
      "mailto:support@apisandbox.dev",
    )
    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument()
    expect(screen.getByLabelText(/account email/i)).toHaveAttribute("autocomplete", "email")
  })
})
