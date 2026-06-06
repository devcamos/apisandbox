"use client"

import { useState } from "react"
import PhaseLayout from "@/components/PhaseLayout"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import PhaseQuiz from "@/components/PhaseQuiz"
import { Database, ArrowRight, Layers } from "lucide-react"
import { databaseFundamentalsTopics, type DbTopic } from "@/lib/learning/database-fundamentals"

function TopicCard({
  topic,
  isSelected,
  onSelect,
}: Readonly<{
  topic: DbTopic
  isSelected: boolean
  onSelect: () => void
}>) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-xl border p-4 transition-all ${
        isSelected
          ? "bg-teal-500/10 border-teal-500/50 ring-1 ring-teal-500/30"
          : "bg-slate-800/40 border-slate-700 hover:border-slate-600"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-sm font-bold text-teal-300">
          {topic.number}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-white">{topic.title}</h3>
          <p className="text-xs text-teal-200/70 mt-0.5">{topic.subtitle}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {topic.keywords.slice(0, 4).map((kw) => (
              <span
                key={kw}
                className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-900/80 text-gray-400 border border-slate-700"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}

function TopicDetail({ topic }: Readonly<{ topic: DbTopic }>) {
  return (
    <div className="bg-slate-800/60 border border-teal-500/30 rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-lg font-bold text-teal-300">
          {topic.number}
        </span>
        <div>
          <h3 className="text-xl font-bold text-white">{topic.title}</h3>
          <p className="text-sm text-teal-200/80">{topic.subtitle}</p>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">{topic.summary}</p>

      <div>
        <h4 className="text-sm font-bold text-white mb-2">Why it matters</h4>
        <p className="text-sm text-gray-400">{topic.whyItMatters}</p>
      </div>

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <h4 className="text-sm font-bold text-cyan-300 mb-2">API engineer lens</h4>
        <p className="text-sm text-gray-300">{topic.apiEngineerAngle}</p>
      </div>

      {topic.tools && topic.tools.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-white mb-2">Tools &amp; examples</h4>
          <div className="flex flex-wrap gap-2">
            {topic.tools.map((tool) => (
              <span
                key={tool}
                className="text-xs px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-gray-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-bold text-white mb-3">Common pitfalls</h4>
        <ul className="space-y-2">
          {topic.pitfalls.map((p) => (
            <li key={p.mistake} className="text-sm bg-slate-900/50 border border-slate-700 rounded-lg p-3">
              <span className="text-amber-300 font-medium">{p.mistake}</span>
              <span className="text-gray-500"> → </span>
              <span className="text-gray-300">{p.fix}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Phase9() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const active = databaseFundamentalsTopics.find((t) => t.id === selectedId)

  return (
    <SubscriptionGate phaseNumber={9} lockedContentName="Phase 9: Database Fundamentals">
      <PhaseLayout
        phaseNumber={9}
        title="Database Fundamentals"
        description="The mastery map every API engineer needs before scaling data"
        icon={Database}
        color="from-teal-500 to-cyan-600"
      >
        <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
            <Layers className="w-6 h-6 text-teal-400" />
            Software engineer skills: database mastery map
          </h2>
          <p className="text-gray-300 mb-3">
            APIs are only as reliable as the data layer underneath them. This phase walks through eleven
            fundamentals — from choosing SQL vs NoSQL through transactions, pooling, migrations, and read
            replicas — so you can design endpoints that stay fast and consistent under load.
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Built from the same progression as production Postgres + Prisma workflows in this app: schema
            migrations, pooled connections, and subscription state that must commit atomically.
          </p>
          <div className="flex items-center gap-2 text-sm text-teal-300">
            <ArrowRight className="w-4 h-4 shrink-0" />
            <span>Tap a numbered card to expand the full breakdown</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {databaseFundamentalsTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isSelected={selectedId === topic.id}
              onSelect={() => setSelectedId(selectedId === topic.id ? null : topic.id)}
            />
          ))}
        </div>

        {active && (
          <div className="mb-8">
            <TopicDetail topic={active} />
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-3">Connects to your API learning path</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <a
              href="/phase-2"
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 hover:border-teal-500/40 transition-colors"
            >
              <span className="font-bold text-white">Phase 2</span>
              <p className="text-gray-400 mt-1">Retries, idempotency, and external API resilience sit on top of solid transactions.</p>
            </a>
            <a
              href="/phase-3"
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 hover:border-teal-500/40 transition-colors"
            >
              <span className="font-bold text-white">Phase 3</span>
              <p className="text-gray-400 mt-1">Event-driven patterns need clear write paths and replica lag awareness.</p>
            </a>
            <a
              href="/docs/architecture"
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 hover:border-teal-500/40 transition-colors"
            >
              <span className="font-bold text-white">Architecture docs</span>
              <p className="text-gray-400 mt-1">See how Postgres and Prisma fit the platform diagram.</p>
            </a>
            <a
              href="/observability"
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 hover:border-teal-500/40 transition-colors"
            >
              <span className="font-bold text-white">Observability</span>
              <p className="text-gray-400 mt-1">Slow queries show up as HTTP latency — measure both layers.</p>
            </a>
          </div>
        </div>

        <PhaseQuiz phaseNumber={9} accentClass="from-teal-500 to-cyan-500" />
      </PhaseLayout>
    </SubscriptionGate>
  )
}
