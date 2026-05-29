"use client"

import { useEffect, type RefObject } from "react"

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
  useEffect(() => {
    if (!googleClientId || !buttonRef.current) return

    const init = () => {
      const gsi = globalThis.window?.google?.accounts?.id
      const el = buttonRef.current
      if (!gsi || !el) return
      gsi.initialize({
        client_id: googleClientId,
        callback: (response: { credential: string }) => {
          if (response.credential) {
            onCredential(response.credential)
          }
        },
      })
      gsi.renderButton(el, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: buttonText,
        width: "400",
      })
    }

    if (globalThis.window?.google?.accounts?.id) {
      init()
      return
    }

    const interval = setInterval(() => {
      if (globalThis.window?.google?.accounts?.id) {
        clearInterval(interval)
        init()
      }
    }, 100)
    const timeout = setTimeout(() => clearInterval(interval), 10_000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [googleClientId, buttonRef, buttonText, onCredential])
}
