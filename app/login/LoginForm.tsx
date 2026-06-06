/**
 * Login Page
 * 
 * MENTOR NOTE: Authentication UX Best Practices
 * 
 * 1. Clear error messages (but don't reveal too much)
 * 2. Show password strength requirements
 * 3. Provide OAuth options for quick sign-in
 * 4. Remember user preference (email vs OAuth)
 * 5. Link to signup page
 * 6. Forgot password link
 */

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Mail, Lock, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useAuthSessionWriter } from "@/components/providers/SessionProvider"
import { useGoogleSignInButton } from "@/hooks/useGoogleSignInButton"
import { parseLoginErrorMessage, type LoginErrorInfo } from "@/lib/login-error-parser"
import { authApiPostJson } from "@/lib/auth/client-fetch"
import { completeClientAuthSession, type ClientAuthSessionPayload } from "@/lib/auth/client-session"
import { validateEmailFormat } from "@/lib/validation/email"
import AuthPageShell from "@/components/auth/AuthPageShell"
import AuthSocialSection from "@/components/auth/AuthSocialSection"
import { TryDemoButton } from "@/components/auth/TryDemoButton"

function LoginForm({ googleClientId }: Readonly<{ googleClientId: string }>) {
  const searchParams = useSearchParams()
  const { setSessionFromAuthResponse } = useAuthSessionWriter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<LoginErrorInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const googleButtonRef = useRef<HTMLDivElement>(null)

  // MENTOR NOTE: Get callbackUrl from query params
  // This is set by middleware when user tries to access protected route
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  // Show friendly message when NextAuth returns error=Configuration (e.g. AUTH_URL mismatch)
  useEffect(() => {
    const err = searchParams.get("error")
    if (err === "Configuration") {
      setError({
        message: "Auth configuration error",
        type: "unknown",
        recoverable: true,
        suggestion:
          "If you're on staging, open the app using the same URL as AUTH_URL (e.g. http://localhost:4000 or http://0.0.0.0:4000). Set AUTH_URL and NEXTAUTH_URL in your .env to match.",
      })
    }
  }, [searchParams])

  const validateEmail = (emailValue: string) => validateEmailFormat(emailValue)

  // Client-side password validation
  const validatePassword = (passwordValue: string): string => {
    if (!passwordValue) {
      return "Password is required"
    }
    if (passwordValue.length < 6) {
      return "Password must be at least 6 characters"
    }
    return ""
  }

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (emailTouched) {
      setEmailError(validateEmail(value))
    }
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  // Handle password change with validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (passwordTouched) {
      setPasswordError(validatePassword(value))
    }
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setEmailError("")
    setPasswordError("")
    setEmailTouched(true)
    setPasswordTouched(true)

    // Client-side validation
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation)
      setPasswordError(passwordValidation)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const { ok, payload } = await authApiPostJson<ClientAuthSessionPayload>("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      })
      if (!ok || !payload.data) {
        const errorInfo = parseLoginErrorMessage(payload?.error?.message ?? "Login failed")
        setError(errorInfo)
        setIsLoading(false)
        return
      }
      await completeClientAuthSession({
        authData: payload.data,
        redirectTo: callbackUrl,
        setSession: setSessionFromAuthResponse,
        savePassword: { email, password },
      })
      return
    } catch (err) {
      // Handle timeout and network errors
      let errorMessage = "An unexpected error occurred. Please try again."
      
      if (err instanceof Error) {
        if (err.message.includes("timeout")) {
          errorMessage = "Request timed out. Please check your connection and try again."
        } else if (err.message.includes("fetch") || err.message.includes("network")) {
          errorMessage = "Network error. Please check your internet connection."
        } else {
          errorMessage = err.message
        }
      }

      const errorInfo = parseLoginErrorMessage(errorMessage)
      setError(errorInfo)
      setIsLoading(false)
    }
  }

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const { ok, payload } = await authApiPostJson<ClientAuthSessionPayload>("/api/auth/google", {
          idToken: credential,
        })
        if (!ok || !payload.data) {
          const errorInfo = parseLoginErrorMessage(payload?.error?.message ?? "Google sign-in failed")
          setError(errorInfo)
          setIsLoading(false)
          return
        }
        await completeClientAuthSession({
          authData: payload.data,
          redirectTo: callbackUrl,
          setSession: setSessionFromAuthResponse,
        })
        return
      } catch (err) {
        const errorInfo = parseLoginErrorMessage(
          err instanceof Error ? err.message : "Failed to sign in with Google. Please try again."
        )
        setError(errorInfo)
      } finally {
        setIsLoading(false)
      }
    },
    [callbackUrl, setSessionFromAuthResponse]
  )

  useGoogleSignInButton({
    googleClientId,
    buttonRef: googleButtonRef,
    buttonText: "signin_with",
    onCredential: (cred) => {
      void handleGoogleCredential(cred)
    },
  })

  return (
    <AuthPageShell
      title="Welcome Back"
      subtitle="Sign in to continue your API integration journey"
    >
          <AuthSocialSection
            googleClientId={googleClientId}
            googleButtonRef={googleButtonRef}
            fallbackLabel="Continue with Google"
          >
          <form onSubmit={handleSubmit} method="post" className="space-y-6">
            {/* Email Field */}
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
                  autoComplete="username"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => {
                    setEmailTouched(true)
                    setEmailError(validateEmail(email))
                  }}
                  required
                  className={`w-full pl-10 pr-10 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    emailError
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : emailTouched && !emailError
                      ? "border-green-500/50 focus:ring-green-500"
                      : "border-slate-700 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={emailError ? "true" : "false"}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
                {emailTouched && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {emailError ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : email && !emailError ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : null}
                  </div>
                )}
              </div>
              {emailError && (
                <p id="email-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
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
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => {
                    setPasswordTouched(true)
                    setPasswordError(validatePassword(password))
                  }}
                  required
                  className={`w-full pl-10 pr-10 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    passwordError
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : passwordTouched && !passwordError
                      ? "border-green-500/50 focus:ring-green-500"
                      : "border-slate-700 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  placeholder="Enter your password"
                  aria-invalid={passwordError ? "true" : "false"}
                  aria-describedby={passwordError ? "password-error" : undefined}
                />
                {passwordTouched && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {passwordError ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : password && !passwordError ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : null}
                  </div>
                )}
              </div>
              {passwordError && (
                <p id="password-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className={`p-4 rounded-lg border ${
                error.type === "account" 
                  ? "bg-orange-500/10 border-orange-500/20"
                  : error.type === "network"
                  ? "bg-yellow-500/10 border-yellow-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    error.type === "account"
                      ? "text-orange-400"
                      : error.type === "network"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium mb-1 ${
                      error.type === "account"
                        ? "text-orange-300"
                        : error.type === "network"
                        ? "text-yellow-300"
                        : "text-red-300"
                    }`}>
                      {error.message}
                    </p>
                    {error.suggestion && (
                      <p className="text-xs text-gray-400 mt-2">
                        {error.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!emailError || !!passwordError}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <TryDemoButton nextPath={callbackUrl} />
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign up
            </Link>
          </div>
          </AuthSocialSection>
    </AuthPageShell>
  )
}

export default LoginForm
