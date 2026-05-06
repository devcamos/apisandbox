"use client";

import { useState } from "react";
import PhaseLayout from "@/components/PhaseLayout";
import { DollarSign, ArrowRight, Clock, Flame, TrendingUp, ChevronDown } from "lucide-react";
import { monetisationPaths, type MonetisationPath } from "@/lib/learning/monetisation-paths";

function EffortBadge({ level }: Readonly<{ level: MonetisationPath["effortLevel"] }>) {
  const styles = {
    Low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    Medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    High: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[level]}`}>
      {level} effort
    </span>
  );
}

function PathCard({ path, isSelected, onSelect }: Readonly<{ path: MonetisationPath; isSelected: boolean; onSelect: () => void }>) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border p-5 transition-all ${
        isSelected
          ? "bg-slate-800/80 border-slate-500 ring-1 ring-slate-500/50"
          : "bg-slate-800/40 border-slate-700 hover:border-slate-600 hover:bg-slate-800/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{path.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{path.name}</h3>
            <p className="text-xs text-gray-400">{path.tagline}</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform shrink-0 mt-1 ${isSelected ? "rotate-180" : ""}`} />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <EffortBadge level={path.effortLevel} />
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {path.timeToFirstDollar}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> {path.monthlyRevenueRange}
        </span>
      </div>
    </button>
  );
}

function PathDetail({ path }: Readonly<{ path: MonetisationPath }>) {
  const [activeTab, setActiveTab] = useState<"overview" | "start" | "tech" | "examples">("overview");

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "start" as const, label: "Start Here" },
    { id: "tech" as const, label: "Tech Stack" },
    { id: "examples" as const, label: "Examples" },
  ];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden animate-slideDown">
      <div className={`bg-gradient-to-r ${path.color} px-6 py-4`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{path.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{path.name}</h3>
            <p className="text-white/80 text-sm">{path.tagline}</p>
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
                  <p className="text-sm text-gray-300">{path.paretoInsight}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">What is it?</h4>
              <p className="text-sm text-gray-300">{path.what}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Why this path?</h4>
              <p className="text-sm text-gray-300">{path.why}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Revenue Models</h4>
              <div className="space-y-2">
                {path.revenueModels.map((rm) => (
                  <div key={rm.type} className="bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">{rm.type}</span>
                      <code className="text-xs text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">{rm.example}</code>
                    </div>
                    <p className="text-xs text-gray-400">{rm.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">Key Metrics to Track</h4>
              <ul className="space-y-1.5">
                {path.keyMetrics.map((m) => (
                  <li key={m} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 mt-px">✓</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <details className="group border-2 border-green-500/20 rounded-xl overflow-hidden bg-gradient-to-br from-green-900/20 to-emerald-900/10 hover:border-green-500/30 transition-colors">
              <summary className="flex items-center gap-2.5 px-5 py-3 cursor-pointer select-none">
                <span className="text-base">☕</span>
                <span className="text-xs uppercase tracking-wide text-green-400 font-bold">Spring Perspective</span>
                <span className="text-sm text-green-200/80 flex-1 truncate">{path.springContext.headline}</span>
                <span className="text-green-500 text-xs group-open:rotate-90 transition-transform">▶</span>
              </summary>
              <div className="px-5 pb-4 pt-1 border-t border-green-500/10">
                <ul className="space-y-1.5 text-sm text-gray-300">
                  {path.springContext.stack.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5 shrink-0">▸</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        )}

        {activeTab === "start" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">Follow these steps in order. Each one is designed to validate before you invest more time.</p>
            {path.startHere.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${path.color} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                  {step.step}
                </div>
                <div className="flex-1 pb-4 border-b border-slate-700/50 last:border-0">
                  <h4 className="text-sm font-bold text-white mb-1">{step.action}</h4>
                  <p className="text-xs text-gray-400">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tech" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-4">Recommended stack — pick one tool per category, don&apos;t over-engineer.</p>
            {path.techStack.map((ts) => (
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

        {activeTab === "examples" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-4">Real companies making real money with this model.</p>
            {path.realExamples.map((ex) => (
              <div key={ex.name} className="bg-slate-900/60 border border-slate-700 rounded-lg px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                  <span className="text-xs text-emerald-300 font-mono">{ex.revenue}</span>
                </div>
                <p className="text-xs text-gray-400">{ex.lesson}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type SortKey = "default" | "time" | "effort";

const TIME_ORDER: Record<string, number> = {
  "1–2 weeks": 1,
  "2–6 weeks": 2,
  "1–3 months": 3,
  "2–4 months": 4,
  "3–6 months": 5,
};

const EFFORT_ORDER: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

function sortPaths(paths: MonetisationPath[], key: SortKey) {
  if (key === "default") return paths;
  const sorted = [...paths];
  if (key === "time") sorted.sort((a, b) => (TIME_ORDER[a.timeToFirstDollar] ?? 9) - (TIME_ORDER[b.timeToFirstDollar] ?? 9));
  if (key === "effort") sorted.sort((a, b) => (EFFORT_ORDER[a.effortLevel] ?? 9) - (EFFORT_ORDER[b.effortLevel] ?? 9));
  return sorted;
}

export default function Phase7() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const activePath = monetisationPaths.find((p) => p.id === selectedPath);

  return (
    <PhaseLayout
      phaseNumber={7}
      title="Monetisation"
      description="Choose one path and start making money from software"
      icon={DollarSign}
      color="from-amber-500 to-orange-500"
    >
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
          <Flame className="w-6 h-6 text-amber-400" />
          The 80/20 of Making Money with Software
        </h2>
        <p className="text-gray-300 mb-4">
          You don&apos;t need to master all of these. <strong className="text-white">Pick one path</strong> that matches
          your current skills and time budget, then execute the &ldquo;Start Here&rdquo; steps in order.
          Most developers fail because they research forever instead of shipping.
        </p>
        <div className="flex items-center gap-2 text-sm text-amber-300">
          <ArrowRight className="w-4 h-4" />
          <span>Click any path below to see the full breakdown</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-3 mb-6">
        {monetisationPaths.map((path) => (
          <PathCard
            key={path.id}
            path={path}
            isSelected={selectedPath === path.id}
            onSelect={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
          />
        ))}
      </div>

      {activePath && (
        <div className="mb-8">
          <PathDetail path={activePath} />
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-lg font-bold text-white">Quick Comparison</h3>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 mr-1">Sort by</span>
            {([["default", "Default"], ["time", "Fastest first"], ["effort", "Easiest first"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  sortKey === key
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                    : "bg-slate-900/60 border-slate-700 text-gray-400 hover:text-gray-200 hover:border-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 pr-4 text-gray-400 font-medium">Path</th>
                <th
                  className={`text-left py-2 pr-4 font-medium cursor-pointer transition-colors ${sortKey === "time" ? "text-amber-300" : "text-gray-400 hover:text-gray-200"}`}
                  onClick={() => setSortKey(sortKey === "time" ? "default" : "time")}
                >
                  Time to $ {sortKey === "time" && "↑"}
                </th>
                <th
                  className={`text-left py-2 pr-4 font-medium cursor-pointer transition-colors ${sortKey === "effort" ? "text-amber-300" : "text-gray-400 hover:text-gray-200"}`}
                  onClick={() => setSortKey(sortKey === "effort" ? "default" : "effort")}
                >
                  Effort {sortKey === "effort" && "↑"}
                </th>
                <th className="text-left py-2 text-gray-400 font-medium">Revenue Range</th>
              </tr>
            </thead>
            <tbody>
              {sortPaths(monetisationPaths, sortKey).map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-700/50 hover:bg-slate-800/40 cursor-pointer"
                  onClick={() => setSelectedPath(p.id)}
                >
                  <td className="py-2.5 pr-4">
                    <span className="flex items-center gap-2 text-white font-medium">
                      <span>{p.icon}</span> {p.name}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-300">{p.timeToFirstDollar}</td>
                  <td className="py-2.5 pr-4"><EffortBadge level={p.effortLevel} /></td>
                  <td className="py-2.5 text-gray-300 font-mono text-xs">{p.monthlyRevenueRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PhaseLayout>
  );
}
