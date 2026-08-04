import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SignOutProgressOverlay } from "@/components/auth/SignOutProgressOverlay"

describe("SignOutProgressOverlay", () => {
  it("announces progress while signing out", () => {
    render(<SignOutProgressOverlay visible />)

    expect(screen.getByRole("status")).toHaveTextContent("Signing you out securely…")
    expect(screen.getByRole("status")).toHaveTextContent("Just a moment.")
  })
})
