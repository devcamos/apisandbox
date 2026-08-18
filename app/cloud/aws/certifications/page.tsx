import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  GraduationCap,
  Route,
  ShieldCheck,
} from "lucide-react"
import { awsCertificationTracks } from "@/lib/learning/aws-certification-course"

export const metadata: Metadata = {
  title: "AWS Certification Journey | API Sandbox",
  description: "Prepare for AWS Cloud Practitioner, AI Practitioner, Solutions Architect Associate, and Solutions Architect Professional through one connected API Sandbox course.",
}

const trackStyles = {
  sky: { gradient: "from-sky-500 to-cyan-400", border: "hover:border-sky-400/60", text: "text-sky-300", soft: "bg-sky-400/10" },
  orange: { gradient: "from-orange-500 to-amber-400", border: "hover:border-orange-400/60", text: "text-orange-300", soft: "bg-orange-400/10" },
  violet: { gradient: "from-violet-500 to-fuchsia-400", border: "hover:border-violet-400/60", text: "text-violet-300", soft: "bg-violet-400/10" },
} as const

export default function AwsCertificationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_35%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_35%)]" />
        <div className="container relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <Link href="/cloud" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <Cloud className="h-4 w-4" />
            Cloud learning
          </Link>
          <div className="mt-7 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.17em] text-orange-200">
              <Award className="h-3.5 w-3.5" />
              Foundational paths → Associate → Professional
            </div>
            <h1 className="mt-5 text-5xl font-bold tracking-tight text-white sm:text-6xl">AWS Certification Journey</h1>
            <p className="mt-5 text-xl leading-8 text-slate-300">
              Choose a foundational path in cloud or AI, then progress into associate architecture and professional-level governance and transformation.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpenCheck, value: "20", label: "connected modules" },
              { icon: BrainCircuit, value: "60", label: "original assessment questions" },
              { icon: Route, value: "3", label: "architecture capstones" },
              { icon: ShieldCheck, value: "80%", label: "module mastery threshold" },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
                  <Icon className="h-5 w-5 text-orange-300" />
                  <div className="mt-3 text-3xl font-bold text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-6 py-12 sm:py-16" aria-labelledby="choose-track">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">Foundational paths, increasing responsibility</p>
          <h2 id="choose-track" className="mt-2 text-3xl font-bold text-white">Choose your certification path</h2>
          <p className="mt-3 leading-7 text-slate-400">Each level includes official domain weighting, original lessons, architecture decision labs, persistent signed-in assessments, a capstone, and external readiness requirements.</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {awsCertificationTracks.map((track) => {
            const style = trackStyles[track.accent]
            const progressionLabel = track.level === "Foundational" ? "Foundational path" : track.level === "Associate" ? "Step 1" : "Step 2"
            return (
              <article key={track.slug} className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/65 transition-all ${style.border}`}>
                <div className={`h-1.5 bg-gradient-to-r ${style.gradient}`} />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`rounded-xl p-3 ${style.soft}`}>
                      <GraduationCap className={`h-7 w-7 ${style.text}`} />
                    </div>
                    <span className={`rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold ${style.text}`}>{progressionLabel}</span>
                  </div>

                  <p className={`mt-5 text-xs font-semibold uppercase tracking-[0.16em] ${style.text}`}>{track.level} · {track.examCode}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{track.shortTitle}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{track.description}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                      <div className="font-semibold text-white">{track.course.units.length}</div>
                      <div className="mt-1 text-xs text-slate-500">modules</div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                      <div className="font-semibold text-white">{track.domains.length}</div>
                      <div className="mt-1 text-xs text-slate-500">exam domains</div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    {track.domains.map((domain) => (
                      <div key={domain.id} className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-400">{domain.title}</span>
                        <span className={`font-bold ${style.text}`}>{domain.weight}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <div className="flex gap-2 text-sm text-slate-300">
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${style.text}`} />
                      <span>{track.capstone}</span>
                    </div>
                  </div>

                  <Link href={`/cloud/aws/certifications/${track.slug}`} className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-3 text-sm font-bold text-white shadow-lg transition-transform group-hover:-translate-y-0.5 ${style.gradient}`}>
                    Start {track.examCode} course <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 sm:p-8">
          <div className="flex gap-4">
            <ShieldCheck className="h-7 w-7 shrink-0 text-emerald-300" />
            <div>
              <h2 className="text-xl font-bold text-white">Readiness is evidence, not a promise</h2>
              <p className="mt-2 max-w-4xl leading-7 text-slate-300">
                API Sandbox tracks mastery and supplies realistic projects. High-confidence readiness also requires official AWS preparation, fresh timed mocks, explained mistakes, broad hands-on work, and—at Professional—substantial architecture experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
