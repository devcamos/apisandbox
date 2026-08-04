"use client"

import { useEffect, useRef, type RefObject } from "react"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void
          renderButton: (
            el: HTMLElement,
            options: { type?: string; theme?: string; size?: string; text?: string; width?: string | number },
          ) => void
        }
      }
    }
    apiSandboxGoogleIdentity?: {
      clientId: string
      onCredential: (credential: string) => void
    }
  }
}

type GoogleButtonText = "signin_with" | "signup_with"

interface UseGoogleSignInButtonOptions {
  googleClientId: string
  buttonRef: RefObject<HTMLDivElement | null>
  buttonText: GoogleButtonText
  onCredential: (credential: string) => void
}

/** Renders Google Identity Services button when the GSI script is available. */
export function useGoogleSignInButton({
  googleClientId,
  buttonRef,
  buttonText,
  onCredential,
}: UseGoogleSignInButtonOptions) {
  const credentialHandlerRef = useRef(onCredential)

  useEffect(() => {
    credentialHandlerRef.current = onCredential
  }, [onCredential])

  useEffect(() => {
    if (!googleClientId || !buttonRef.current) return

    const init = () => {
      const gsi = globalThis.window?.google?.accounts?.id
      const el = buttonRef.current
      if (!gsi || !el) return

      const existingIdentity = globalThis.window.apiSandboxGoogleIdentity
      if (existingIdentity?.clientId === googleClientId) {
        existingIdentity.onCredential = (credential) => credentialHandlerRef.current(credential)
      } else {
        const identity = {
          clientId: googleClientId,
          onCredential: (credential: string) => credentialHandlerRef.current(credential),
        }
        globalThis.window.apiSandboxGoogleIdentity = identity
        gsi.initialize({
          client_id: googleClientId,
          callback: (response: { credential: string }) => {
            if (response.credential) {
              identity.onCredential(response.credential)
            }
          },
        })
      }

      let renderedWidth = 0
      const renderButton = () => {
        const containerWidth = Math.floor(el.getBoundingClientRect().width)
        const width = Math.min(400, containerWidth || 400)
        if (renderedWidth === width && el.childElementCount > 0) return

        renderedWidth = width
        el.replaceChildren()
        gsi.renderButton(el, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: buttonText,
          width,
        })
      }

      renderButton()
      if (typeof ResizeObserver === "undefined") return

      const resizeObserver = new ResizeObserver(renderButton)
      resizeObserver.observe(el)

      return () => resizeObserver.disconnect()
    }

    if (globalThis.window?.google?.accounts?.id) {
      return init()
    }

    let cleanup: (() => void) | undefined
    const interval = setInterval(() => {
      if (globalThis.window?.google?.accounts?.id) {
        clearInterval(interval)
        cleanup = init()
      }
    }, 100)
    const timeout = setTimeout(() => clearInterval(interval), 10_000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      cleanup?.()
    }
  }, [googleClientId, buttonRef, buttonText])
}
