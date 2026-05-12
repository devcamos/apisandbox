import Link from "next/link"
import type React from "react"

function AnchorLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-sky-300 hover:text-sky-200 underline underline-offset-2">
      {children}
    </a>
  )
}

export function LearningMap() {
  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Learning Map (APIs with Java)</h2>
          <p className="mt-2 text-sm text-slate-300">
            A good way to master Java for APIs is to treat it like layers: semantics first, then
            wrappers, then production discipline.
          </p>
        </div>
        <div className="hidden sm:flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/30 px-3 py-1 text-xs text-slate-200">
            Beginner to Principal
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/30 px-3 py-1 text-xs text-slate-200">
            Skimmable, then deep
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/30 p-5">
          <div className="text-xs font-semibold text-slate-200">1) Semantics</div>
          <div className="mt-2 text-sm text-slate-300">
            Learn the invariant rules that apply in every stack: HTTP, auth, failures, and testing.
          </div>
          <ul className="mt-3 space-y-1 text-sm text-slate-300 list-disc pl-5">
            <li>
              <AnchorLink href="#what-to-master">What to Master</AnchorLink>
            </li>
            <li>
              <AnchorLink href="#java-pareto">Java features you’ll use most</AnchorLink>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/30 p-5">
          <div className="text-xs font-semibold text-slate-200">2) Wrappers</div>
          <div className="mt-2 text-sm text-slate-300">
            Understand what frameworks wrap (and what they don’t): routing, binding, validation, errors.
          </div>
          <ul className="mt-3 space-y-1 text-sm text-slate-300 list-disc pl-5">
            <li>
              <AnchorLink href="#wrapper-stack">Client vs Backend wrapper stack</AnchorLink>
            </li>
            <li>
              <AnchorLink href="#framework-ontology">Framework ontology explorer</AnchorLink>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/30 p-5">
          <div className="text-xs font-semibold text-slate-200">3) Production discipline</div>
          <div className="mt-2 text-sm text-slate-300">
            Turn knowledge into repeatable practice: run labs, then apply security and observability
            habits.
          </div>
          <ul className="mt-3 space-y-1 text-sm text-slate-300 list-disc pl-5">
            <li>
              <AnchorLink href="#quick-start">Quick Start</AnchorLink> and{" "}
              <AnchorLink href="#labs">Labs</AnchorLink>
            </li>
            <li>
              <AnchorLink href="#dependency-radar">Dependency + security radar</AnchorLink>
            </li>
            <li>
              <Link
                href="/observability"
                className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
              >
                Observability dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
