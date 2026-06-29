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

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react"
import { useAuthSessionWriter } from "@/components/providers/SessionProvider"
import { useGoogleSignInButton } from "@/hooks/useGoogleSignInButton"
import AuthPageShell from "@/components/auth/AuthPageShell"
import AuthSocialSection from "@/components/auth/AuthSocialSection"
import { authApiPostJson } from "@/lib/auth/client-fetch"
import { completeClientAuthSession, type ClientAuthSessionPayload } from "@/lib/auth/client-session"
import { getPasswordRequirements } from "@/lib/password-validation"

function SignupForm({ googleClientId }: Readonly<{ googleClientId: string }>) {
  const { setSessionFromAuthResponse } = useAuthSessionWriter()
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

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
      const { ok, payload } = await authApiPostJson<ClientAuthSessionPayload>("/api/auth/register", {
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
      })

      if (!ok || !payload.data) {
        const details = payload?.error?.details
        const message = payload?.error?.message || "Signup failed"
        setErrors(Array.isArray(details) ? details : [message])
        setIsLoading(false)
        return
      }

      await completeClientAuthSession({
        authData: payload.data,
        redirectTo: "/dashboard",
        setSession: setSessionFromAuthResponse,
        savePassword: { email: formData.email, password: formData.password },
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
          redirectTo: "/dashboard",
          setSession: setSessionFromAuthResponse,
        })
        return
      } catch {
        setErrors(["Failed to sign up with Google. Please try again."])
      } finally {
        setIsLoading(false)
      }
    },
    [setSessionFromAuthResponse]
  )

  useGoogleSignInButton({
    googleClientId,
    buttonRef: googleButtonRef,
    buttonText: "signup_with",
    onCredential: (cred) => {
      void handleGoogleCredential(cred)
    },
  })

  return (
    <AuthPageShell
      title="Create Account"
      subtitle="Free access to Phases 0 & 1 — upgrade anytime for full access"
    >
          <AuthSocialSection
            googleClientId={googleClientId}
            googleButtonRef={googleButtonRef}
            fallbackLabel="Continue with Google"
          >
          <form onSubmit={handleSubmit} method="post" autoComplete="on" className="space-y-6">
            {/* Name Field */}
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
                  name="email"
                  type="email"
                  autoComplete="email"
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
                  name="password"
                  type="password"
                  autoComplete="new-password"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
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
          {/* Login Link */}
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

export default SignupForm
