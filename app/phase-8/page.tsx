"use client";

import { useState } from "react";
import PhaseLayout from "@/components/PhaseLayout";
import { Database, ArrowRight, Flame, ChevronDown, ExternalLink, AlertTriangle } from "lucide-react";
import { dsCategories, type DSCategory } from "@/lib/learning/data-science-production";

function CategoryCard({ cat, isSelected, onSelect }: Readonly<{ cat: DSCategory; isSelected: boolean; onSelect: () => void }>) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border p-5 transition-all ${
        isSelected
          ? "bg-slate-800/80 border-slate-500 ring-1 ring-slate-500/50"
          : "bg-slate-800/40 border-slate-700 hover:border-slate-600 hover:bg-slate-800/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cat.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{cat.name}</h3>
            <p className="text-xs text-gray-400">{cat.tagline}</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform shrink-0 mt-1 ${isSelected ? "rotate-180" : ""}`} />
      </div>
    </button>
  );
}

function CategoryDetail({ cat }: Readonly<{ cat: DSCategory }>) {
  const [activeTab, setActiveTab] = useState<"overview" | "pipeline" | "tech" | "pitfalls">("overview");

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "pipeline" as const, label: "Pipeline" },
    { id: "tech" as const, label: "Tech Stack" },
    { id: "pitfalls" as const, label: "Pitfalls" },
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden animate-slideDown">
      <div className={`bg-gradient-to-r ${cat.color} px-6 py-4`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{cat.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{cat.name}</h3>
            <p className="text-white/80 text-sm">{cat.tagline}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-700 px-4">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 shrink-0 ${
                activeTab === tab.id
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Flame className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300 mb-1">Pareto Insight (80/20)</h4>
                  <p className="text-sm text-gray-300">{cat.paretoInsight}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Why it matters</h4>
              <p className="text-sm text-gray-300">{cat.why}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">How it fits into what you&apos;ve learned</h4>
              <p className="text-sm text-gray-300 mb-3">{cat.howItFits}</p>
              <div className="flex flex-wrap gap-2">
                {cat.connectedPhases.map((cp) => (
                  <a
                    key={cp.phase}
                    href={cp.link}
                    className="inline-flex items-center gap-1.5 text-xs bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 text-gray-300 hover:border-slate-500 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="font-bold">Phase {cp.phase}:</span> {cp.title}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Core Concepts</h4>
              <div className="grid gap-2">
                {cat.coreConcepts.map((c) => (
                  <div key={c.term} className="bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3">
                    <span className="text-sm font-bold text-white">{c.term}</span>
                    <p className="text-xs text-gray-400 mt-1">{c.definition}</p>
                  </div>
                ))}
              </div>
            </div>

            <details className="group border-2 border-green-500/20 rounded-xl overflow-hidden bg-gradient-to-br from-green-900/20 to-emerald-900/10 hover:border-green-500/30 transition-colors">
              <summary className="flex items-center gap-2.5 px-5 py-3 cursor-pointer select-none">
                <span className="text-base">☕</span>
                <span className="text-xs uppercase tracking-wide text-green-400 font-bold">Spring Perspective</span>
                <span className="text-sm text-green-200/80 flex-1 truncate">{cat.springContext.headline}</span>
                <span className="text-green-500 text-xs group-open:rotate-90 transition-transform">▶</span>
              </summary>
              <div className="px-5 pb-4 pt-1 border-t border-green-500/10 space-y-3">
                <ul className="space-y-1.5 text-sm text-gray-300">
                  {cat.springContext.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5 shrink-0">▸</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <pre className="bg-slate-950 border border-green-500/20 rounded-lg p-4 overflow-x-auto text-xs text-green-300 font-mono leading-relaxed">
                  <code>{cat.springContext.codeSketch}</code>
                </pre>
              </div>
            </details>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">Follow these steps in order. Each builds on the previous one.</p>
            {cat.pipeline.map((step, i) => (
              <div key={step.step} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                  {i + 1}
                </div>
                <div className="flex-1 pb-4 border-b border-slate-700/50 last:border-0">
                  <h4 className="text-sm font-bold text-white mb-1">{step.step}</h4>
                  <p className="text-xs text-gray-400">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tech" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-4">Pick one tool per category to start. Master it before adding complexity.</p>
            {cat.techStack.map((ts) => (
              <div key={ts.category} className="bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3">
                <h4 className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">{ts.category}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {ts.tools.map((tool) => (
                    <span key={tool} className="text-xs bg-slate-800 text-gray-300 px-2.5 py-1 rounded-md border border-slate-700">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "pitfalls" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-4">These mistakes cost teams months. Learn them before you make them.</p>
            {cat.antiPatterns.map((ap) => (
              <div key={ap.mistake} className="bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <span className="text-sm font-bold text-rose-300">{ap.mistake}</span>
                </div>
                <p className="text-xs text-gray-300 pl-6">{ap.fix}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Phase8() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const activeCat = dsCategories.find((c) => c.id === selectedCat);

  return (
    <PhaseLayout
      phaseNumber={8}
      title="Data Science in Production"
      description="How ML models become production API features"
      icon={Database}
      color="from-purple-500 to-violet-500"
    >
      <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
          <Flame className="w-6 h-6 text-purple-400" />
          The Bridge Between Notebooks and Revenue
        </h2>
        <p className="text-gray-300 mb-3">
          A model in a Jupyter notebook generates zero revenue. A model behind an API endpoint
          generates revenue 24/7. This phase teaches you how to cross that bridge — from data pipelines
          that feed models, to serving predictions at scale, to monitoring when the world changes
          and your model needs retraining.
        </p>
        <p className="text-gray-400 text-sm mb-4">
          Every topic connects back to what you&apos;ve already learned. REST APIs (Phase 1), event-driven
          architecture (Phase 3), system design (Phase 4), algorithms (Phase 5) — data science in production
          uses all of them. The difference is the <strong className="text-white">intent</strong>: instead of
          hand-written business logic, your API serves a trained model.
        </p>
        <div className="flex items-center gap-2 text-sm text-purple-300">
          <ArrowRight className="w-4 h-4" />
          <span>Click any category below to see the full breakdown</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-3 mb-6">
        {dsCategories.map((cat) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            isSelected={selectedCat === cat.id}
            onSelect={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
          />
        ))}
      </div>

      {activeCat && (
        <div className="mb-8">
          <CategoryDetail cat={activeCat} />
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">How It All Connects</h3>
        <p className="text-sm text-gray-400 mb-4">
          Data science doesn&apos;t live in isolation — it touches every phase you&apos;ve studied. Here&apos;s the map:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { phase: 1, title: "API Styles", ds: "Model endpoints use REST or gRPC" },
            { phase: 3, title: "Event-Driven", ds: "Kafka feeds data pipelines and features" },
            { phase: 4, title: "Architecture", ds: "ML system design, scaling inference" },
            { phase: 5, title: "Algorithms", ds: "Top-K, hashing, sliding windows in ML infra" },
            { phase: 6, title: "Visualizer", ds: "Search/sort algorithms power ranking" },
            { phase: 7, title: "Monetisation", ds: "ML features drive retention and revenue" },
          ].map((conn) => (
            <a
              key={conn.phase}
              href={`/phase-${conn.phase}`}
              className="bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3 hover:border-purple-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                  Phase {conn.phase}
                </span>
                <span className="text-sm font-bold text-white">{conn.title}</span>
              </div>
              <p className="text-xs text-gray-400">{conn.ds}</p>
            </a>
          ))}
        </div>
      </div>
    </PhaseLayout>
  );
}
