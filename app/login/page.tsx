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

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import Script from "next/script"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Mail, Lock, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useAuthSessionWriter } from "@/components/providers/SessionProvider"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void
          renderButton: (el: HTMLElement, options: { type?: string; theme?: string; size?: string; text?: string; width?: string }) => void
        }
      }
    }
  }
}

// Error types for better categorization
type ErrorType = "validation" | "authentication" | "network" | "account" | "unknown"

interface ErrorInfo {
  message: string
  type: ErrorType
  recoverable: boolean
  suggestion?: string
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setSessionFromAuthResponse } = useAuthSessionWriter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<ErrorInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""

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

  // Client-side email validation
  const validateEmail = (emailValue: string): string => {
    if (!emailValue) {
      return "Email is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailValue)) {
      return "Please enter a valid email address"
    }
    return ""
  }

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

  // Parse error message and categorize it
  const parseError = useCallback((errorMessage: string): ErrorInfo => {
    // Account locked errors (with time remaining)
    if (errorMessage.startsWith("ACCOUNT_LOCKED")) {
      const minutesMatch = errorMessage.match(/:(\d+)/)
      const minutes = minutesMatch ? minutesMatch[1] : "30"
      return {
        message: "Account temporarily locked",
        type: "account",
        recoverable: true,
        suggestion: `Your account has been temporarily locked due to multiple failed login attempts. Please wait ${minutes} minute${minutes !== "1" ? "s" : ""} before trying again, or contact support if you need immediate access.`
      }
    }

    // Password incorrect (user exists, but password wrong)
    if (errorMessage.startsWith("PASSWORD_INCORRECT")) {
      const attemptsMatch = errorMessage.match(/:(\d+)/)
      const attemptsRemaining = attemptsMatch ? attemptsMatch[1] : "0"
      return {
        message: "Incorrect password",
        type: "authentication",
        recoverable: true,
        suggestion: `The password you entered is incorrect. ${attemptsRemaining !== "0" ? `You have ${attemptsRemaining} attempt${attemptsRemaining !== "1" ? "s" : ""} remaining before your account is locked. ` : ""}Please check your password or use "Forgot password" to reset it.`
      }
    }

    // Credentials invalid (could be email not found OR password wrong - we don't reveal which)
    if (errorMessage === "CREDENTIALS_INVALID") {
      return {
        message: "Invalid login credentials",
        type: "authentication",
        recoverable: true,
        suggestion: "The email address or password you entered is incorrect. Please check both and try again. If you've forgotten your password, use the 'Forgot password' link below. If you don't have an account, please sign up."
      }
    }

    // Account deactivated
    if (errorMessage.includes("deactivated")) {
      return {
        message: "Account deactivated",
        type: "account",
        recoverable: false,
        suggestion: "Your account has been deactivated. Please contact support to reactivate your account."
      }
    }

    // OAuth account error
    if (errorMessage.includes("OAuth") || errorMessage.includes("Google")) {
      return {
        message: "Account created with Google",
        type: "authentication",
        recoverable: true,
        suggestion: "This account was created using Google sign-in. Please use the 'Sign in with Google' button below instead of email and password."
      }
    }

    // Legacy error format support (for backward compatibility)
    if (errorMessage.includes("Invalid email or password") || errorMessage.includes("invalid")) {
      const attemptsMatch = errorMessage.match(/(\d+)\s*attempt/i)
      if (attemptsMatch) {
        const attempts = attemptsMatch[1]
        return {
          message: "Invalid login credentials",
          type: "authentication",
          recoverable: true,
          suggestion: `${attempts} attempt${attempts !== "1" ? "s" : ""} remaining. The email address or password may be incorrect. Please check both, or use "Forgot password" to reset.`
        }
      }
      return {
        message: "Invalid login credentials",
        type: "authentication",
        recoverable: true,
        suggestion: "The email address or password you entered may be incorrect. Please check both and try again, or use 'Forgot password' to reset your password."
      }
    }

    // Legacy locked error format
    if (errorMessage.includes("locked") || errorMessage.includes("lockout")) {
      const minutesMatch = errorMessage.match(/(\d+)\s*minute/i)
      const minutes = minutesMatch ? minutesMatch[1] : "30"
      return {
        message: "Account temporarily locked",
        type: "account",
        recoverable: true,
        suggestion: `Your account is temporarily locked. Please wait ${minutes} minutes or contact support if you need immediate access.`
      }
    }

    // Required fields
    if (errorMessage.includes("required")) {
      return {
        message: errorMessage,
        type: "validation",
        recoverable: true,
        suggestion: "Please fill in all required fields."
      }
    }

    // Network errors
    if (errorMessage.includes("network") || errorMessage.includes("fetch") || errorMessage.includes("timeout")) {
      return {
        message: "Network error. Please check your connection.",
        type: "network",
        recoverable: true,
        suggestion: "Check your internet connection and try again. If the problem persists, please try again in a few moments."
      }
    }

    // Unknown errors
    return {
      message: errorMessage || "An unexpected error occurred",
      type: "unknown",
      recoverable: true,
      suggestion: "Please try again. If the problem continues, contact support."
    }
  }, [])

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })
      const payload = await response.json()
      if (!response.ok) {
        const errorInfo = parseError(payload?.error?.message || "Login failed")
        setError(errorInfo)
        setIsLoading(false)
        return
      }
      setSessionFromAuthResponse(payload.data)

      router.push(callbackUrl)
      router.refresh()
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

      const errorInfo = parseError(errorMessage)
      setError(errorInfo)
      setIsLoading(false)
    }
  }

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: credential }),
        })
        const payload = await response.json()
        if (!response.ok) {
          const errorInfo = parseError(payload?.error?.message || "Google sign-in failed")
          setError(errorInfo)
          setIsLoading(false)
          return
        }
        setSessionFromAuthResponse(payload.data)
        router.push(callbackUrl)
        router.refresh()
      } catch (err) {
        const errorInfo = parseError(
          err instanceof Error ? err.message : "Failed to sign in with Google. Please try again."
        )
        setError(errorInfo)
        setIsLoading(false)
      }
    },
    [callbackUrl, parseError, router, setSessionFromAuthResponse]
  )

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return
    const init = () => {
      if (
        typeof globalThis.window !== "undefined" &&
        globalThis.window.google?.accounts?.id &&
        googleButtonRef.current
      ) {
        globalThis.window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: { credential: string }) => {
            if (response.credential) handleGoogleCredential(response.credential)
          },
        })
        globalThis.window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          width: "100%",
        })
      }
    }
    if (globalThis.window.google?.accounts?.id) {
      init()
    } else {
      const t = setInterval(() => {
        if (globalThis.window.google?.accounts?.id) {
          clearInterval(t)
          init()
        }
      }, 100)
      setTimeout(() => clearInterval(t), 10000)
    }
  }, [googleClientId, handleGoogleCredential])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to continue your API integration journey
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
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
                  type="password"
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

          {/* Google Sign-In – always show the option; use official button when configured */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-gray-400">Or continue with</span>
            </div>
          </div>
          {googleClientId ? (
            <>
              <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
              />
              <div ref={googleButtonRef} className="w-full flex justify-center [&_.g_id_signin]:!w-full [&_.g_id_signin]>div:!w-full" />
            </>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3 bg-slate-900/50 border border-slate-700 text-gray-500 rounded-lg font-semibold flex items-center justify-center gap-3 cursor-not-allowed"
              aria-label="Sign in with Google (not configured)"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
              <span className="text-xs text-gray-500">(not configured)</span>
            </button>
          )}

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
