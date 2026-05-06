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

import { useState, useEffect, useRef, useCallback } from "react"
import Script from "next/script"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react"
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

export default function SignupPage() {
  const router = useRouter()
  const { setSessionFromAuthResponse } = useAuthSessionWriter()
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    if (password.length < 8) errors.push("At least 8 characters")
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter")
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter")
    if (!/[0-9]/.test(password)) errors.push("One number")
    if (!/[@$!%*#?&]/.test(password)) errors.push("One special character (@$!%*#?&)")
    return errors
  }

  const passwordErrors = formData.password ? validatePassword(formData.password) : []
  const passwordStrength = formData.password
    ? Math.max(0, 5 - passwordErrors.length)
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    // Validation
    const newErrors: string[] = []
    if (!formData.email) newErrors.push("Email is required")
    if (!formData.password) newErrors.push("Password is required")
    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match")
    }
    if (passwordErrors.length > 0) {
      newErrors.push("Password does not meet requirements")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const details = data?.error?.details
        const message = data?.error?.message || "Signup failed"
        setErrors(Array.isArray(details) ? details : [message])
        setIsLoading(false)
        return
      }

      setSessionFromAuthResponse(data.data)
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setErrors(["An unexpected error occurred. Please try again."])
      setIsLoading(false)
    }
  }

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setErrors([])
      setIsLoading(true)
      try {
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: credential }),
        })
        const data = await response.json()
        if (!response.ok) {
          setErrors([data?.error?.message || "Google signup failed"])
          setIsLoading(false)
          return
        }
        setSessionFromAuthResponse(data.data)
        router.push("/dashboard")
        router.refresh()
      } catch {
        setErrors(["Failed to sign up with Google. Please try again."])
        setIsLoading(false)
      }
    },
    [router, setSessionFromAuthResponse]
  )

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return
    const init = () => {
      if (globalThis.window !== undefined && window.google?.accounts?.id && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: { credential: string }) => {
            if (response.credential) handleGoogleCredential(response.credential)
          },
        })
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signup_with",
          width: "100%",
        })
      }
    }
    if (globalThis.window !== undefined && window.google?.accounts?.id) {
      init()
    } else {
      const t = setInterval(() => {
        if (globalThis.window !== undefined && window.google?.accounts?.id) {
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
            Create Account
          </h1>
          <p className="text-gray-400">
            Start your API integration learning journey
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a strong password"
                />
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= passwordStrength
                            ? "bg-green-500"
                            : "bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    {passwordErrors.length > 0 ? (
                      passwordErrors.map((error, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-400" />
                          <span>{error}</span>
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
              )}
            </div>

            {/* Error Messages */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || passwordErrors.length > 0}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Google Sign-Up – always show the option; use official button when configured */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-gray-400">Or sign up with</span>
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
              aria-label="Sign up with Google (not configured)"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
              <span className="text-xs text-gray-500">(not configured)</span>
            </button>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

