/**
 * Signup Page
 *
 * MENTOR NOTE: Registration UX Best Practices
 *
 * 1. Show password strength in real-time
 * 2. Clear validation messages
 * 3. OAuth options for quick signup
 * 4. Terms of service / Privacy policy
 * 5. Email verification flow
 */

"use client"

import { Suspense, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react"
import { useAuthSessionWriter, useSession } from "@/components/providers/SessionProvider"
import { useGoogleSignInButton } from "@/hooks/useGoogleSignInButton"
import AuthPageShell from "@/components/auth/AuthPageShell"
import AuthSocialSection from "@/components/auth/AuthSocialSection"
import { authApiPostJson } from "@/lib/auth/client-fetch"
import { completeClientAuthSession, type ClientAuthSessionPayload } from "@/lib/auth/client-session"
import {
  syncValueFromDom,
  syncValueFromEvent,
  useAutofillSync,
  useLatestRef,
} from "@/lib/auth/autofill-sync"
import { getPasswordRequirements } from "@/lib/password-validation"

function SignupFormInner({ googleClientId }: Readonly<{ googleClientId: string }>) {
  const { setSessionFromAuthResponse } = useAuthSessionWriter()
  const { data: session, status: sessionStatus } = useSession()
  const searchParams = useSearchParams()
  const fromDemo = searchParams.get("fromDemo") === "1"
  const plan = searchParams.get("plan") === "pro" ? "pro" : "free"
  const claimingDemo = fromDemo && Boolean(session?.isDemo)

  const googleButtonRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const formDataRef = useLatestRef(formData)
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const setField = useCallback((field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  useAutofillSync([
    {
      ref: nameInputRef,
      getCurrent: () => formDataRef.current.name,
      setValue: (name) => setField("name", name),
    },
    {
      ref: emailInputRef,
      getCurrent: () => formDataRef.current.email,
      setValue: (email) => setField("email", email),
    },
    {
      ref: passwordInputRef,
      getCurrent: () => formDataRef.current.password,
      setValue: (password) => setField("password", password),
    },
    {
      ref: confirmPasswordInputRef,
      getCurrent: () => formDataRef.current.confirmPassword,
      setValue: (confirmPassword) => setField("confirmPassword", confirmPassword),
    },
  ])

  const updateField = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    syncValueFromEvent(e, (value) => setField(field, value))
  }

  const passwordRequirements = formData.password
    ? getPasswordRequirements(formData.password)
    : []
  const passwordErrors = passwordRequirements.filter((requirement) => !requirement.met)
  const passwordStrength = formData.password
    ? Math.max(0, 5 - passwordErrors.length)
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    const next = {
      name: syncValueFromDom(nameInputRef.current, formData.name, (name) => setField("name", name)),
      email: syncValueFromDom(emailInputRef.current, formData.email, (email) =>
        setField("email", email),
      ),
      password: syncValueFromDom(passwordInputRef.current, formData.password, (password) =>
        setField("password", password),
      ),
      confirmPassword: syncValueFromDom(
        confirmPasswordInputRef.current,
        formData.confirmPassword,
        (confirmPassword) => setField("confirmPassword", confirmPassword),
      ),
    }

    const livePasswordErrors = getPasswordRequirements(next.password).filter((r) => !r.met)

    const newErrors: string[] = []
    if (!next.email) newErrors.push("Email is required")
    if (!next.password) newErrors.push("Password is required")
    if (next.password !== next.confirmPassword) {
      newErrors.push("Passwords do not match")
    }
    if (livePasswordErrors.length > 0) {
      newErrors.push("Password does not meet requirements")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const endpoint = claimingDemo ? "/api/auth/demo/claim" : "/api/auth/register"
      const body = claimingDemo
        ? {
            email: next.email,
            password: next.password,
            name: next.name || undefined,
            plan,
          }
        : {
            email: next.email,
            password: next.password,
            name: next.name || undefined,
          }

      const { ok, payload } = await authApiPostJson<ClientAuthSessionPayload & { plan?: string }>(
        endpoint,
        body,
      )

      if (!ok || !payload.data) {
        const details = payload?.error?.details
        const message = payload?.error?.message || "Signup failed"
        setErrors(Array.isArray(details) ? details : [message])
        setIsLoading(false)
        return
      }

      const redirectTo =
        plan === "pro" || (claimingDemo && payload.data.plan === "pro")
          ? "/upgrade?checkout=1"
          : "/onboarding"

      await completeClientAuthSession({
        authData: payload.data,
        redirectTo,
        setSession: setSessionFromAuthResponse,
        savePassword: { email: next.email, password: next.password },
      })
      return
    } catch {
      setErrors(["An unexpected error occurred. Please try again."])
      setIsLoading(false)
    }
  }

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setErrors([])
      setIsLoading(true)
      try {
        const { ok, payload } = await authApiPostJson<ClientAuthSessionPayload>("/api/auth/google", {
          idToken: credential,
        })
        if (!ok || !payload.data) {
          setErrors([payload?.error?.message || "Google signup failed"])
          setIsLoading(false)
          return
        }
        await completeClientAuthSession({
          authData: payload.data,
          redirectTo: plan === "pro" ? "/upgrade?checkout=1" : "/onboarding",
          setSession: setSessionFromAuthResponse,
        })
        return
      } catch {
        setErrors(["Failed to sign up with Google. Please try again."])
      } finally {
        setIsLoading(false)
      }
    },
    [setSessionFromAuthResponse, plan],
  )

  useGoogleSignInButton({
    googleClientId: claimingDemo ? "" : googleClientId,
    buttonRef: googleButtonRef,
    buttonText: "signup_with",
    onCredential: (cred) => {
      void handleGoogleCredential(cred)
    },
  })

  const title = claimingDemo
    ? plan === "pro"
      ? "Keep progress · then Pro"
      : "Keep your demo progress"
    : "Create Account"
  const subtitle = claimingDemo
    ? plan === "pro"
      ? "Convert this demo into your account, then continue to Stripe checkout for Pro."
      : "Convert this demo into a Free account. Your Phase 1 progress stays with you."
    : "Free access to API Foundations — upgrade anytime for full access"

  return (
    <AuthPageShell
      title={title}
      subtitle={subtitle}
      isLoading={isLoading || (fromDemo && sessionStatus === "loading")}
      loadingMessage={
        claimingDemo ? "Saving your progress to a real account…" : "Creating your account securely…"
      }
    >
      {claimingDemo ? (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
          You are converting a Phase 1 demo session. Email/password keeps your quiz and lesson
          progress. Google sign-up creates a separate account and does not claim demo progress yet.
        </div>
      ) : null}

      {fromDemo && sessionStatus === "authenticated" && !session?.isDemo ? (
        <div className="mb-6 rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-3 text-sm text-gray-300">
          You are already signed in with a real account.{" "}
          <Link href={plan === "pro" ? "/upgrade?checkout=1" : "/dashboard"} className="text-blue-400 font-semibold">
            Continue
          </Link>
        </div>
      ) : null}

      <AuthSocialSection
        googleClientId={claimingDemo ? "" : googleClientId}
        googleButtonRef={googleButtonRef}
        fallbackLabel="Continue with Google"
      >
        <form onSubmit={(e) => void handleSubmit(e)} method="post" autoComplete="on" className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                ref={nameInputRef}
                value={formData.name}
                onChange={updateField("name")}
                onInput={updateField("name")}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                ref={emailInputRef}
                value={formData.email}
                onChange={updateField("email")}
                onInput={updateField("email")}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                ref={passwordInputRef}
                value={formData.password}
                onChange={updateField("password")}
                onInput={updateField("password")}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Create a strong password"
              />
            </div>

            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded ${
                        level <= passwordStrength ? "bg-green-500" : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  {passwordErrors.length > 0 ? (
                    passwordErrors.map((requirement) => (
                      <div key={requirement.id} className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span>{requirement.label}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>Password meets all requirements</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                ref={confirmPasswordInputRef}
                value={formData.confirmPassword}
                onChange={updateField("confirmPassword")}
                onInput={updateField("confirmPassword")}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
            )}
          </div>

          {errors.length > 0 && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              {errors.map((error, idx) => (
                <div key={idx} className="flex items-center gap-2 text-red-400 text-sm mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || passwordErrors.length > 0}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              claimingDemo ? "Saving account…" : "Creating account..."
            ) : (
              <>
                {claimingDemo
                  ? plan === "pro"
                    ? "Save Free account · continue to Pro"
                    : "Save Free account"
                  : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
            Sign in
          </Link>
        </div>
      </AuthSocialSection>
    </AuthPageShell>
  )
}

function SignupForm({ googleClientId }: Readonly<{ googleClientId: string }>) {
  return (
    <Suspense
      fallback={
        <AuthPageShell title="Create Account" subtitle="Loading…" isLoading loadingMessage="Loading signup…">
          <div />
        </AuthPageShell>
      }
    >
      <SignupFormInner googleClientId={googleClientId} />
    </Suspense>
  )
}

export default SignupForm
