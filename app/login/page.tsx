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

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Mail, Lock, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react"

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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<ErrorInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  
  // MENTOR NOTE: Get callbackUrl from query params
  // This is set by middleware when user tries to access protected route
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

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
  const parseError = (errorMessage: string): ErrorInfo => {
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
      // Add timeout for the request
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout. Please try again.")), 30000) // 30 second timeout
      })

      const signInPromise = signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      const result = await Promise.race([signInPromise, timeoutPromise]) as any

      if (result?.error) {
        const errorInfo = parseError(result.error)
        setError(errorInfo)
        setIsLoading(false)
        return
      }

      // Success - redirect to callbackUrl (defaults to dashboard)
      // MENTOR NOTE: Using window.location.href ensures a full page reload
      // which allows the middleware to see the new session cookie immediately
      window.location.href = callbackUrl
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

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsLoading(true)
    try {
      // MENTOR NOTE: Use callbackUrl from query params or default to dashboard
      await signIn("google", { callbackUrl })
    } catch (err) {
      const errorInfo = parseError(
        err instanceof Error ? err.message : "Failed to sign in with Google. Please try again."
      )
      setError(errorInfo)
      setIsLoading(false)
    }
  }

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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 bg-slate-900/50 border border-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign in with Google
          </button>

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

