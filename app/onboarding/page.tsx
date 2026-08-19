"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Cloud,
  Code2,
  Gauge,
  Loader2,
  Target,
} from "lucide-react"
import { useSession } from "@/components/providers/SessionProvider"
import { authApiJsonInit, authApiRequestInit } from "@/lib/auth/client-fetch"
import {
  CLOUD_PROVIDER_OPTIONS,
  ENGINEERING_ROLE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  getFrameworkOptions,
  getPersonalizedLearningPath,
  LANGUAGE_OPTIONS,
  LEARNING_GOAL_OPTIONS,
  RUNTIME_ENVIRONMENT_OPTIONS,
  type LearnerProfileSelection,
} from "@/lib/learning/learner-profile"

type OnboardingForm = {
  engineeringRole: string
  experienceLevel: string
  primaryLanguage: string
  primaryFramework: string
  runtimeEnvironment: string
  cloudProvider: string
  learningGoal: string
}

type ProfileResponse = {
  success?: boolean
  data?: {
    profile?: Partial<OnboardingForm> & { onboardingCompletedAt?: string | null }
  }
  error?: { message?: string }
}

const initialForm: OnboardingForm = {
  engineeringRole: "",
  experienceLevel: "",
  primaryLanguage: "",
  primaryFramework: "",
  runtimeEnvironment: "undecided",
  cloudProvider: "undecided",
  learningGoal: "",
}

const steps = [
  { title: "Your role", description: "Set the expected depth and decision scope." },
  { title: "Your stack", description: "Translate universal concepts into familiar tools." },
  { title: "Your outcome", description: "Build a path around the capability you need." },
] as const

function toSelection(form: OnboardingForm): LearnerProfileSelection {
  return {
    engineeringRole: form.engineeringRole || null,
    experienceLevel: form.experienceLevel || null,
    primaryLanguage: form.primaryLanguage || null,
    primaryFramework: form.primaryFramework || null,
    runtimeEnvironment: form.runtimeEnvironment || null,
    cloudProvider: form.cloudProvider || null,
    learningGoal: form.learningGoal || null,
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { status } = useSession()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<OnboardingForm>(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false)
      return
    }
    if (status !== "authenticated") return

    async function loadProfile() {
      const response = await fetch("/api/profile", authApiRequestInit())
      const payload = (await response.json().catch(() => ({}))) as ProfileResponse
      if (!response.ok) {
        setError(payload.error?.message ?? "Could not load your learning profile")
        setLoading(false)
        return
      }

      const profile = payload.data?.profile
      if (profile) {
        setForm({
          engineeringRole: profile.engineeringRole ?? "",
          experienceLevel: profile.experienceLevel ?? "",
          primaryLanguage: profile.primaryLanguage ?? "",
          primaryFramework: profile.primaryFramework ?? "",
          runtimeEnvironment: profile.runtimeEnvironment ?? "undecided",
          cloudProvider: profile.cloudProvider ?? "undecided",
          learningGoal: profile.learningGoal ?? "",
        })
        setIsEditing(Boolean(profile.onboardingCompletedAt))
      }
      setLoading(false)
    }

    void loadProfile()
  }, [status])

  const frameworks = useMemo(
    () => getFrameworkOptions(form.primaryLanguage),
    [form.primaryLanguage],
  )
  const path = useMemo(() => getPersonalizedLearningPath(toSelection(form)), [form])

  const canContinue = step === 0
    ? Boolean(form.engineeringRole && form.experienceLevel)
    : step === 1
      ? Boolean(form.primaryLanguage && form.primaryFramework)
      : Boolean(form.learningGoal)

  function updateField(field: keyof OnboardingForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setError(null)
  }

  function updateLanguage(value: string) {
    const nextFrameworks = getFrameworkOptions(value)
    setForm((current) => ({
      ...current,
      primaryLanguage: value,
      primaryFramework: nextFrameworks.length === 1 ? nextFrameworks[0]?.id ?? "" : "",
    }))
    setError(null)
  }

  async function saveProfile() {
    if (!canContinue) return
    setSaving(true)
    setError(null)

    const response = await fetch(
      "/api/profile",
      authApiJsonInit(toSelection(form), { method: "PATCH" }),
    )
    const payload = (await response.json().catch(() => ({}))) as ProfileResponse
    if (!response.ok) {
      setError(payload.error?.message ?? "Could not save your learning profile")
      setSaving(false)
      return
    }

    router.replace("/dashboard?onboarding=complete")
  }

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
          Preparing your engineering profile
        </div>
      </main>
    )
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <section className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="text-3xl font-bold">Sign in to build your learning path</h1>
          <p className="mt-3 text-slate-300">Your stack and progress are stored securely with your account.</p>
          <Link href="/login?callbackUrl=/onboarding" className="mt-6 inline-flex rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950">
            Sign in
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-100">
            <Gauge className="h-4 w-4" />
            Enterprise learning profile
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            {isEditing ? "Tune your engineering path" : "Build your engineering path"}
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            We keep the fundamentals universal, then translate them into your language, framework,
            runtime, and production goals.
          </p>
        </header>

        <ol className="mt-10 grid gap-3 md:grid-cols-3" aria-label="Onboarding progress">
          {steps.map((item, index) => {
            const active = index === step
            const complete = index < step
            return (
              <li
                key={item.title}
                aria-current={active ? "step" : undefined}
                className={`rounded-xl border p-4 ${active ? "border-cyan-400/50 bg-cyan-400/10" : "border-slate-800 bg-slate-900/60"}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${complete ? "bg-emerald-400 text-slate-950" : active ? "bg-cyan-400 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                    {complete ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.description}</div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-8">
          {step === 0 && (
            <div className="space-y-8">
              <fieldset>
                <legend className="text-xl font-bold">Which role best matches your work?</legend>
                <p className="mt-1 text-sm text-slate-400">This changes the decision scope of later scenarios.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {ENGINEERING_ROLE_OPTIONS.map((option) => (
                    <label key={option.id} className={`cursor-pointer rounded-xl border p-4 transition-colors ${form.engineeringRole === option.id ? "border-cyan-400 bg-cyan-400/10" : "border-slate-700 bg-slate-950 hover:border-slate-500"}`}>
                      <input
                        type="radio"
                        name="engineeringRole"
                        value={option.id}
                        checked={form.engineeringRole === option.id}
                        onChange={() => updateField("engineeringRole", option.id)}
                        className="sr-only"
                      />
                      <span className="font-semibold text-white">{option.label}</span>
                      <span className="mt-1 block text-sm text-slate-400">{option.description}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xl font-bold">What depth should we assume?</legend>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                    <label key={option.id} className={`cursor-pointer rounded-xl border p-4 transition-colors ${form.experienceLevel === option.id ? "border-violet-400 bg-violet-400/10" : "border-slate-700 bg-slate-950 hover:border-slate-500"}`}>
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={option.id}
                        checked={form.experienceLevel === option.id}
                        onChange={() => updateField("experienceLevel", option.id)}
                        className="sr-only"
                      />
                      <span className="font-semibold text-white">{option.label}</span>
                      <span className="mt-1 block text-sm text-slate-400">{option.description}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="flex items-center gap-3">
                <Code2 className="h-6 w-6 text-cyan-300" />
                <div>
                  <h2 className="text-xl font-bold">Choose your implementation context</h2>
                  <p className="text-sm text-slate-400">The concepts stay portable; examples and vocabulary match your stack.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-200">
                  Primary language
                  <select
                    value={form.primaryLanguage}
                    onChange={(event) => updateLanguage(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="">Select a language</option>
                    {LANGUAGE_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>

                <label className="text-sm font-semibold text-slate-200">
                  Primary framework
                  <select
                    value={form.primaryFramework}
                    onChange={(event) => updateField("primaryFramework", event.target.value)}
                    disabled={!form.primaryLanguage}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a framework</option>
                    {frameworks.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>

                <label className="text-sm font-semibold text-slate-200">
                  Runtime environment
                  <select
                    value={form.runtimeEnvironment}
                    onChange={(event) => updateField("runtimeEnvironment", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  >
                    {RUNTIME_ENVIRONMENT_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>

                <label className="text-sm font-semibold text-slate-200">
                  Cloud context
                  <select
                    value={form.cloudProvider}
                    onChange={(event) => updateField("cloudProvider", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  >
                    {CLOUD_PROVIDER_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-cyan-300" />
                <div>
                  <h2 className="text-xl font-bold">What should this path help you achieve?</h2>
                  <p className="text-sm text-slate-400">This determines the emphasis after your stack foundation.</p>
                </div>
              </div>

              <fieldset className="mt-6 grid gap-3 md:grid-cols-2">
                <legend className="sr-only">Learning goal</legend>
                {LEARNING_GOAL_OPTIONS.map((option) => (
                  <label key={option.id} className={`cursor-pointer rounded-xl border p-4 transition-colors ${form.learningGoal === option.id ? "border-emerald-400 bg-emerald-400/10" : "border-slate-700 bg-slate-950 hover:border-slate-500"}`}>
                    <input
                      type="radio"
                      name="learningGoal"
                      value={option.id}
                      checked={form.learningGoal === option.id}
                      onChange={() => updateField("learningGoal", option.id)}
                      className="sr-only"
                    />
                    <span className="font-semibold text-white">{option.label}</span>
                    <span className="mt-1 block text-sm text-slate-400">{option.description}</span>
                  </label>
                ))}
              </fieldset>

              <div className="mt-8 rounded-xl border border-cyan-400/25 bg-gradient-to-r from-cyan-400/10 to-violet-400/10 p-5">
                <h3 className="font-bold text-cyan-100">Your first learning path</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {path.map((item) => (
                    <div key={item.id} className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-cyan-200">{item.label}</div>
                      <div className="mt-2 font-bold">{item.title}</div>
                      <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="mt-6 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0 || saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}
                disabled={!canContinue}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void saveProfile()}
                disabled={!canContinue || saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {saving ? "Saving profile" : "Save and open my path"}
              </button>
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
          <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-cyan-300" /> Universal concepts remain portable</div>
          <div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-violet-300" /> Examples match your framework</div>
          <div className="flex items-center gap-2"><Cloud className="h-4 w-4 text-emerald-300" /> Production context grows with you</div>
        </div>
      </div>
    </main>
  )
}
