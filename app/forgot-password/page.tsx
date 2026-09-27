"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import AuthPageShell from "@/components/auth/AuthPageShell"
import { adoptAutofilledValue } from "@/lib/auth/autofill-sync"
import { validateEmailFormat } from "@/lib/validation/email"

/**
 * Minimal recovery page for the login "Forgot password?" link.
 * Full email-based reset is out of scope; the form still uses autofill-friendly
 * attributes so password managers recognize the page.
 */
export default function ForgotPasswordPage() {
  const emailInputRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [emailError, setEmailError] = useState("")

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      adoptAutofilledValue(emailInputRef.current, email, setEmail)
    })
    return () => window.cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- autofill sync on mount only
  }, [])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) setEmailError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateEmailFormat(email)
    if (validation) {
      setEmailError(validation)
      return
    }
    setSubmitted(true)
  }

  return (
    <AuthPageShell
      title="Reset password"
      subtitle="Email reset is not available yet — here is how to get back in"
    >
      <div className="space-y-5 text-sm text-gray-300" data-testid="forgot-password-page">
        <p>
          Automated password-reset email is not wired up on this deployment. Until
          it is, use one of these paths:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-gray-300">
          <li>
            If you signed up with <strong className="text-white">Google</strong>,
            return to sign-in and use Continue with Google — no password is required.
          </li>
          <li>
            If you only used the <strong className="text-white">demo</strong>, create a
            free account from inside the demo (or sign up fresh) to keep Phase 1
            progress when you claim the session.
          </li>
          <li>
            For an existing email/password account you cannot access, email{" "}
            <a
              href="mailto:support@apisandbox.dev"
              className="text-blue-400 hover:text-blue-300"
            >
              support@apisandbox.dev
            </a>{" "}
            from the address on the account and ask for a reset.
          </li>
        </ul>

        <form
          onSubmit={handleSubmit}
          method="post"
          autoComplete="on"
          className="space-y-3 rounded-lg border border-slate-700 bg-slate-900/40 p-4"
          data-testid="forgot-password-form"
        >
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Account email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              ref={emailInputRef}
              value={email}
              onChange={handleEmailChange}
              onInput={handleEmailChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900/50 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          {emailError ? <p className="text-xs text-red-400">{emailError}</p> : null}
          {submitted ? (
            <p className="text-xs text-emerald-300" role="status">
              Noted. Email reset is not automated yet — use Google sign-in, claim a demo
              account, or contact support@apisandbox.dev from this address.
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white hover:shadow-lg"
          >
            Continue
          </button>
        </form>

        <p className="text-xs text-gray-400">
          Tip: after 5 failed sign-in attempts an account locks for 30 minutes.
          Waiting out the lock is often enough if you then enter the correct password.
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white hover:shadow-lg"
          >
            Back to sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-600 bg-slate-900/40 px-4 py-3 text-center text-sm font-semibold text-slate-100 hover:bg-slate-800/60"
          >
            Create an account
          </Link>
        </div>
      </div>
    </AuthPageShell>
  )
}
