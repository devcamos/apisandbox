import { fireEvent, render, screen, waitFor } from "@testing-library/react"
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

/** Set the native input value the way Chrome autofill does (no React onChange). */
function setNativeValue(el: HTMLInputElement, value: string) {
  const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")
  proto?.set?.call(el, value)
}

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

describe("auth form autofill state sync", () => {
  it("login adopts a Chrome autofill pick on blur and clears Email is required", async () => {
    render(<LoginForm googleClientId="" demoEnabled />)

    const email = screen.getByLabelText(/email address/i) as HTMLInputElement
    const password = screen.getByLabelText(/^password$/i) as HTMLInputElement
    const submit = screen.getByRole("button", { name: /^Sign In$/i })

    // Provoke the stale-state bug path: touch/validate empty, then autofill fills DOM.
    fireEvent.focus(email)
    fireEvent.blur(email)
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(submit).toBeDisabled()

    // Chrome dropdown pick: DOM value updates, then blur — often without a prior React onChange.
    fireEvent.focus(email)
    setNativeValue(email, "devonteyeah@gmail.com")
    fireEvent.blur(email)

    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument()
    })
    expect(email).toHaveValue("devonteyeah@gmail.com")

    setNativeValue(password, "Test1234!@#$")
    fireEvent.blur(password)

    await waitFor(() => {
      expect(submit).toBeEnabled()
    })
  })

  it("login input/change still syncs typed values", () => {
    render(<LoginForm googleClientId="" demoEnabled />)
    const email = screen.getByLabelText(/email address/i)
    fireEvent.change(email, { target: { value: "typed@example.com" } })
    expect(email).toHaveValue("typed@example.com")
  })

  it("signup submit reads autofilled DOM values instead of empty React state", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: "Signup failed" } }),
    })
    vi.stubGlobal("fetch", fetchMock)

    render(<SignupForm googleClientId="" />)

    const email = screen.getByLabelText(/email address/i) as HTMLInputElement
    const password = screen.getByLabelText(/^password$/i) as HTMLInputElement
    const confirm = screen.getByLabelText(/confirm password/i) as HTMLInputElement

    // Silent autofill into the DOM (no React change events).
    setNativeValue(email, "newuser@example.com")
    setNativeValue(password, "Test1234!@#$")
    setNativeValue(confirm, "Test1234!@#$")

    fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form")!)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(String(init.body)) as { email: string; password: string }
    expect(body.email).toBe("newuser@example.com")
    expect(body.password).toBe("Test1234!@#$")

    vi.unstubAllGlobals()
  })
})
