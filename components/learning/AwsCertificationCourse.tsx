import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Target,
} from "lucide-react"
import { AwsCertificationProgress } from "@/components/learning/AwsCertificationProgress"
import { CourseAssessment } from "@/components/learning/CourseAssessment"
import type { SanitizedLearningCourse } from "@/lib/learning/api-foundations-course"
import type { AwsCertificationTrack } from "@/lib/learning/aws-certification-course"

const accentClasses = {
  sky: {
    gradient: "from-sky-500 to-cyan-400",
    border: "border-sky-400/30",
    soft: "bg-sky-400/10",
    text: "text-sky-200",
  },
  orange: {
    gradient: "from-orange-500 to-amber-400",
    border: "border-orange-400/30",
    soft: "bg-orange-400/10",
    text: "text-orange-200",
  },
  violet: {
    gradient: "from-violet-500 to-fuchsia-400",
    border: "border-violet-400/30",
    soft: "bg-violet-400/10",
    text: "text-violet-200",
  },
} as const

const difficultyClasses = {
  Easy: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  Medium: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  Hard: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  Expert: "border-rose-400/30 bg-rose-400/10 text-rose-200",
} as const

function CourseUnitLink({
  track,
  unit,
  active,
  index,
}: Readonly<{
  track: AwsCertificationTrack
  unit: SanitizedLearningCourse["units"][number]
  active: boolean
  index: number
}>) {
  const accent = accentClasses[track.accent]
  return (
    <Link
      href={`/cloud/aws/certifications/${track.slug}/${unit.id}`}
      className={`block rounded-xl border p-4 transition-colors ${active ? `${accent.border} ${accent.soft}` : "border-slate-700 bg-slate-900/50 hover:border-slate-500"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${active ? accent.text : "text-slate-500"}`}>Question set {index + 1}</div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${difficultyClasses[unit.difficulty ?? "Medium"]}`}>{unit.difficulty ?? "Medium"}</span>
      </div>
      <h2 className="mt-2 text-sm font-bold text-white">{unit.title}</h2>
      <p className="mt-1 text-xs leading-5 text-slate-400">{unit.assessment.questions.length} questions</p>
    </Link>
  )
}

export function AwsCertificationCourse({
  track,
  course,
  unitId,
}: Readonly<{
  track: AwsCertificationTrack
  course: SanitizedLearningCourse
  unitId?: string
}>) {
  const activeUnit = course.units.find((unit) => unit.id === unitId) ?? course.units[0]
  const activeIndex = course.units.findIndex((unit) => unit.id === activeUnit.id)
  const previous = activeIndex > 0 ? course.units[activeIndex - 1] : null
  const next = activeIndex < course.units.length - 1 ? course.units[activeIndex + 1] : null
  const accent = accentClasses[track.accent]
  const difficulty = activeUnit.difficulty ?? "Medium"

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.gradient}`} />
        <div className="container mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <Link href="/cloud/aws/certifications" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            AWS certification journey
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${accent.border} ${accent.soft} ${accent.text}`}>
                <Award className="h-3.5 w-3.5" />
                {track.level} · {track.examCode}
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">{course.title}</h1>
              <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">{course.description}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5">{track.examFormat}</span>
                <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5">{course.units.length} modules</span>
                <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5">80% module mastery</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Target className={`h-5 w-5 ${accent.text}`} />
                Experience guidance
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{track.experienceGuidance}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <a href={track.officialExamGuideUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 font-semibold ${accent.text} hover:text-white`}>
                  Official exam guide <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a href={track.officialPrepUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 font-semibold ${accent.text} hover:text-white`}>
                  Official preparation <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {track.domains.map((domain) => (
              <div key={domain.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white">{domain.title}</h2>
                  <span className={`shrink-0 text-lg font-bold ${accent.text}`}>{domain.weight}%</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{domain.focus.join(" · ")}</p>
              </div>
            ))}
          </div>

          <AwsCertificationProgress courseId={course.id} course={course} accent={track.accent} />
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-6 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside aria-label="Certification course modules" className="lg:sticky lg:top-24 lg:h-fit">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <CheckCircle2 className={`h-4 w-4 ${accent.text}`} />
              Question path
            </div>
            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {course.units.map((unit, index) => (
                <CourseUnitLink key={unit.id} track={track} unit={unit} active={unit.id === activeUnit.id} index={index} />
              ))}
            </nav>
          </aside>

          <article className="min-w-0">
            <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${accent.text}`}>Question set {activeIndex + 1} of {course.units.length}</p>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${difficultyClasses[difficulty]}`}>{difficulty} difficulty</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold text-white">{activeUnit.title}</h2>
              <p className="mt-3 text-lg leading-7 text-slate-300">Answer {activeUnit.assessment.questions.length} questions to test this certification domain. You can retry the set and keep your best score.</p>
            </section>

            <div className="mt-6">
              <CourseAssessment
                courseId={course.id}
                unitId={activeUnit.id}
                assessment={activeUnit.assessment}
                loginCallbackUrl={`/cloud/aws/certifications/${track.slug}/${activeUnit.id}`}
                showReflection={false}
              />
            </div>

            <nav aria-label="Adjacent certification modules" className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              {previous ? (
                <Link href={`/cloud/aws/certifications/${track.slug}/${previous.id}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 hover:border-slate-500">
                  <ArrowLeft className="h-4 w-4" /> {previous.title}
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/cloud/aws/certifications/${track.slug}/${next.id}`} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-800 ${accent.border} ${accent.soft} ${accent.text}`}>
                  {next.title} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link href="/cloud/aws/certifications" className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/15">
                  Review certification journey <CheckCircle2 className="h-4 w-4" />
                </Link>
              )}
            </nav>

            <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
              <GraduationCap className="h-4 w-4" />
              API Sandbox provides original preparation content and does not issue AWS certifications or guarantee exam outcomes.
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}
