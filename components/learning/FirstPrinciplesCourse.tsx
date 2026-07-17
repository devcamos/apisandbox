"use client"

import Link from "next/link"
import { useMemo } from "react"
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Network, PackageCheck } from "lucide-react"
import { ApiJourneySimulator } from "@/components/learning/ApiJourneySimulator"
import { CourseAssessment } from "@/components/learning/CourseAssessment"
import { API_FOUNDATIONS_COURSE_ID } from "@/lib/learning/course-ids"
import type { SanitizedLearningCourse } from "@/lib/learning/api-foundations-course"

function UnitLink({ unit, active }: Readonly<{ unit: SanitizedLearningCourse["units"][number]; active: boolean }>) {
  return (
    <Link
      href={`/learn/api-foundations/${unit.id}`}
      className={`block rounded-xl border p-4 transition-colors ${active ? "border-cyan-300 bg-cyan-400/10" : "border-slate-700 bg-slate-900/50 hover:border-slate-500"}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-300">
        <span>Phase {unit.phase}</span>
        <span aria-hidden="true">·</span>
        <span>{unit.id.replaceAll("-", " ")}</span>
      </div>
      <h2 className="mt-2 text-base font-bold text-white">{unit.title}</h2>
      <p className="mt-1 text-sm leading-5 text-slate-400">{unit.subtitle}</p>
    </Link>
  )
}

export function FirstPrinciplesCourse({
  course,
  unitId,
}: Readonly<{
  course: SanitizedLearningCourse
  unitId?: string
}>) {
  const activeUnit = useMemo(
    () => course.units.find((unit) => unit.id === unitId) ?? course.units[0],
    [course.units, unitId],
  )
  const activeIndex = course.units.findIndex((unit) => unit.id === activeUnit.id)
  const previous = activeIndex > 0 ? course.units[activeIndex - 1] : null
  const next = activeIndex < course.units.length - 1 ? course.units[activeIndex + 1] : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40">
      <section className="border-b border-slate-800 bg-slate-950/45">
        <div className="container mx-auto max-w-6xl px-6 py-10 sm:py-14">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to learning dashboard
          </Link>
          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-200">
                <Network className="h-3.5 w-3.5" />
                Free foundation · Phases 0–1
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">{course.title}</h1>
              <p className="mt-4 text-lg leading-8 text-slate-300">{course.description}</p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-300 md:max-w-xs">
              <div className="flex items-center gap-2 font-semibold text-white"><PackageCheck className="h-5 w-5 text-cyan-300" /> One evolving system</div>
              <p className="mt-2 leading-5">Every unit follows the same package-tracking request as it moves from code to a dependable external integration.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-6 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside aria-label="Course units" className="lg:sticky lg:top-24 lg:h-fit">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200"><BookOpen className="h-4 w-4 text-cyan-300" /> Six connected units</div>
            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {course.units.map((unit) => <UnitLink key={unit.id} unit={unit} active={unit.id === activeUnit.id} />)}
            </nav>
          </aside>

          <article className="min-w-0">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Unit {activeIndex + 1} of {course.units.length} · Phase {activeUnit.phase}</p>
              <h2 className="mt-3 text-3xl font-bold text-white">{activeUnit.title}</h2>
              <p className="mt-3 text-lg text-slate-300">{activeUnit.subtitle}</p>

              <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <div className="text-sm font-semibold text-cyan-100">First principle</div>
                <p className="mt-1 text-base leading-6 text-white">{activeUnit.principle}</p>
                <div className="mt-3 text-sm text-slate-300"><span className="font-semibold text-cyan-100">By the end:</span> {activeUnit.goal}</div>
              </div>

              <div className="mt-8 grid gap-5">
                {activeUnit.sections.map((section) => (
                  <section key={section.title}>
                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    <p className="mt-2 leading-7 text-slate-300">{section.body}</p>
                  </section>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Vocabulary to carry forward</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeUnit.concepts.map((concept) => <span key={concept} className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-sm text-slate-200">{concept}</span>)}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <ApiJourneySimulator scenario={activeUnit.scenario} />
            </div>

            <div className="mt-6">
              <CourseAssessment courseId={API_FOUNDATIONS_COURSE_ID} unitId={activeUnit.id} assessment={activeUnit.assessment} />
            </div>

            <nav aria-label="Adjacent units" className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              {previous ? (
                <Link href={`/learn/api-foundations/${previous.id}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 hover:border-slate-500"><ArrowLeft className="h-4 w-4" /> {previous.title}</Link>
              ) : <span />}
              {next ? (
                <Link href={`/learn/api-foundations/${next.id}`} className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/15">{next.title} <ArrowRight className="h-4 w-4" /></Link>
              ) : <Link href="/phase-2" className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15">Continue to third-party integrations <CheckCircle2 className="h-4 w-4" /></Link>}
            </nav>
          </article>
        </div>
      </div>
    </main>
  )
}
