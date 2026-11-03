import Link from "next/link"
import { ArrowRight, Clock, Lock } from "lucide-react"
import type { PageAccessDecision } from "@/lib/access/page-access"
import type { PhasePreviewContent } from "@/lib/access/phase-preview-content"

interface PhasePreviewProps {
  content: PhasePreviewContent
  decision: Exclude<PageAccessDecision, "granted">
  returnTo: string
}

/** Server-rendered preview for a locked phase. Contains catalog metadata only. */
export function PhasePreview({ content, decision, returnTo }: Readonly<PhasePreviewProps>) {
  const callback = encodeURIComponent(returnTo)
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <section
          data-testid="phase-preview"
          className="rounded-2xl border border-purple-500/30 bg-slate-800/50 p-8 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">
              Premium preview
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">{content.title}</h1>
          <p className="text-gray-300 mt-3">{content.summary}</p>
          {content.estimatedTime ? (
            <p className="flex items-center gap-2 text-sm text-gray-400 mt-3">
              <Clock className="w-4 h-4" /> Estimated time: {content.estimatedTime}
            </p>
          ) : null}

          {content.outcomes.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white mb-2">What you will learn</h2>
              <ul className="space-y-1 text-gray-300 text-sm list-disc pl-5">
                {content.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {content.topics.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white mb-2">Topics covered</h2>
              <ul className="flex flex-wrap gap-2">
                {content.topics.map((t) => (
                  <li key={t} className="text-xs rounded-full bg-slate-700 px-3 py-1 text-gray-200">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {decision === "signin" ? (
              <>
                <Link
                  href={`/signup?callbackUrl=${callback}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm"
                >
                  Create a free account <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/login?callbackUrl=${callback}`}
                  className="inline-flex items-center px-5 py-2.5 border border-slate-600 text-white rounded-lg text-sm"
                >
                  Sign in
                </Link>
              </>
            ) : decision === "demo-locked" ? (
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm"
              >
                Create a free account to keep going <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/upgrade"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm"
              >
                Upgrade to Premium <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
