import { render } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { useRef } from "react"
import { useGoogleSignInButton } from "@/hooks/useGoogleSignInButton"

const initialize = vi.fn()
const renderButton = vi.fn()

function GoogleButtonHarness({ onCredential }: Readonly<{ onCredential: (credential: string) => void }>) {
  const buttonRef = useRef<HTMLDivElement>(null)
  useGoogleSignInButton({
    googleClientId: "test-client-id",
    buttonRef,
    buttonText: "signin_with",
    onCredential,
  })
  return <div ref={buttonRef} />
}

describe("useGoogleSignInButton", () => {
  beforeEach(() => {
    initialize.mockReset()
    renderButton.mockReset()
    window.google = {
      accounts: { id: { initialize, renderButton } },
    }
    delete window.apiSandboxGoogleIdentity
  })

  afterEach(() => {
    delete window.google
    delete window.apiSandboxGoogleIdentity
  })

  it("initializes Google Identity once when the credential handler changes", () => {
    const firstHandler = vi.fn()
    const secondHandler = vi.fn()
    const view = render(<GoogleButtonHarness onCredential={firstHandler} />)

    view.rerender(<GoogleButtonHarness onCredential={secondHandler} />)

    expect(initialize).toHaveBeenCalledTimes(1)
    expect(renderButton).toHaveBeenCalledTimes(1)
  })

  it("does not reinitialize Google Identity after the button remounts", () => {
    const firstView = render(<GoogleButtonHarness onCredential={vi.fn()} />)
    firstView.unmount()
    render(<GoogleButtonHarness onCredential={vi.fn()} />)

    expect(initialize).toHaveBeenCalledTimes(1)
    expect(renderButton).toHaveBeenCalledTimes(2)
  })

  it("uses the latest credential handler without reinitializing Google Identity", () => {
    const firstHandler = vi.fn()
    const secondHandler = vi.fn()
    const view = render(<GoogleButtonHarness onCredential={firstHandler} />)
    const initializeConfig = initialize.mock.calls[0][0]

    view.rerender(<GoogleButtonHarness onCredential={secondHandler} />)
    initializeConfig.callback({ credential: "google-id-token" })

    expect(firstHandler).not.toHaveBeenCalled()
    expect(secondHandler).toHaveBeenCalledWith("google-id-token")
    expect(initialize).toHaveBeenCalledTimes(1)
  })
})
