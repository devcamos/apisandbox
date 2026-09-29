"use client"

import Link from "next/link"
import { ArrowRight, Check, Lock, Sparkles, Trophy } from "lucide-react"

export type DemoConversionVariant = "completion" | "locked"

interface DemoConversionPromptProps {
  variant: DemoConversionVariant
  /** Shown for locked variant, e.g. "Phase 2". */
  lockedContentName?: string
  className?: string
}

function signupHref(plan: "free" | "pro") {
  const params = new URLSearchParams({ fromDemo: "1" })
  if (plan === "pro") params.set("plan", "pro")
  return `/signup?${params.toString()}`
}

/**
 * Shared Free / Pro conversion prompt for demo sessions.
 * Used after Phase 1 completion and when opening locked phases.
 */
export function DemoConversionPrompt({
  variant,
  lockedContentName = "This phase",
  className,
}: Readonly<DemoConversionPromptProps>) {
  const isCompletion = variant === "completion"

  return (
    <section
      data-testid="demo-conversion-prompt"
      data-variant={variant}
      className={
        className ??
        "rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-slate-900/50 p-8 md:p-10"
      }
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-amber-500/20 rounded-lg shrink-0">
          {isCompletion ? (
            <Trophy className="w-8 h-8 text-amber-300" aria-hidden />
          ) : (
            <Lock className="w-8 h-8 text-amber-300" aria-hidden />
          )}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {isCompletion
              ? "Phase 1 complete — nice work"
              : `${lockedContentName} is locked in the demo`}
          </h2>
          <p className="text-gray-300 max-w-2xl">
            {isCompletion
              ? "Create an account to keep your Phase 1 progress. Choose Free to stay on the foundation track, or Pro to unlock later phases through checkout."
              : "This demo includes Phase 1 only. Create an account to keep your progress — Free for Phases 0–1, or Pro for the full curriculum."}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
        <div className="rounded-xl border border-slate-600/80 bg-slate-900/50 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-1">Free</h3>
          <p className="text-sm text-gray-400 mb-4">Keep Phase 0 &amp; 1 · £0</p>
          <ul className="space-y-2 text-sm text-gray-300 mb-6 flex-1">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              Keep your demo Phase 1 progress
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              Continue learning on the free track
            </li>
          </ul>
          <Link
            href={signupHref("free")}
            data-testid="demo-convert-free"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/50 bg-amber-950/40 px-5 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-900/50 transition-colors"
          >
            Continue with Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-xl border border-violet-500/40 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-300" />
            Pro
          </h3>
          <p className="text-sm text-gray-400 mb-4">All phases · Stripe checkout</p>
          <ul className="space-y-2 text-sm text-gray-300 mb-6 flex-1">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-violet-300 mt-0.5 shrink-0" />
              Keep Phase 1 progress, then unlock Phase 2+
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-violet-300 mt-0.5 shrink-0" />
              Uses the existing pricing / Checkout flow
            </li>
          </ul>
          <Link
            href={signupHref("pro")}
            data-testid="demo-convert-pro"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            Continue with Pro
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {!isCompletion ? (
        <div className="mt-6">
          <Link
            href="/phase-1"
            className="text-sm text-amber-200/90 underline-offset-2 hover:underline"
          >
            Back to Phase 1
          </Link>
        </div>
      ) : null}
    </section>
  )
}
