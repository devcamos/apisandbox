import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock("@/components/providers/SessionProvider", () => ({
  useAuthSessionWriter: () => ({ setSessionFromAuthResponse: vi.fn() }),
  useSession: () => ({ data: null, status: "unauthenticated" }),
}))

vi.mock("@/hooks/useGoogleSignInButton", () => ({
  useGoogleSignInButton: () => undefined,
}))

vi.mock("@/lib/demo-login", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/demo-login")>()
  return {
    ...actual,
    isDemoLoginRouteEnabled: () => true,
  }
})

import LoginForm from "@/app/login/LoginForm"
import SignupForm from "@/app/signup/SignupForm"
import ForgotPasswordPage from "@/app/forgot-password/page"

describe("auth form autofill attributes", () => {
  it("login uses email/password fields password managers recognize", () => {
    render(<LoginForm googleClientId="" demoEnabled />)

    const email = screen.getByLabelText(/email address/i)
    const password = screen.getByLabelText(/^password$/i)

    expect(email).toHaveAttribute("id", "email")
    expect(email).toHaveAttribute("name", "email")
    expect(email).toHaveAttribute("type", "email")
    expect(email).toHaveAttribute("autocomplete", "username")
    expect(password).toHaveAttribute("id", "password")
    expect(password).toHaveAttribute("name", "password")
    expect(password).toHaveAttribute("type", "password")
    expect(password).toHaveAttribute("autocomplete", "current-password")
    expect(email).not.toHaveAttribute("autocomplete", "off")
    expect(password).not.toHaveAttribute("autocomplete", "off")
  })

  it("signup uses new-password autocomplete on both password fields", () => {
    render(<SignupForm googleClientId="" />)

    const email = screen.getByLabelText(/email address/i)
    const password = screen.getByLabelText(/^password$/i)
    const confirm = screen.getByLabelText(/confirm password/i)

    expect(email).toHaveAttribute("type", "email")
    expect(email).toHaveAttribute("name", "email")
    expect(email).toHaveAttribute("autocomplete", "email")
    expect(password).toHaveAttribute("autocomplete", "new-password")
    expect(password).toHaveAttribute("name", "password")
    expect(confirm).toHaveAttribute("autocomplete", "new-password")
    expect(confirm).toHaveAttribute("name", "confirmPassword")
    expect(confirm).toHaveAttribute("id", "confirmPassword")
  })

  it("forgot-password exposes an email form for autofill", () => {
    render(<ForgotPasswordPage />)

    const email = screen.getByLabelText(/account email/i)
    expect(email).toHaveAttribute("id", "email")
    expect(email).toHaveAttribute("name", "email")
    expect(email).toHaveAttribute("type", "email")
    expect(email).toHaveAttribute("autocomplete", "email")
    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument()
  })
})
