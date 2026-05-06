"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Compass, ExternalLink, Filter, Target } from "lucide-react";

type TrackerStatus = "not-started" | "in-progress" | "completed";

interface TrackerItem {
  id: string;
  step: number;
  system: string;
  notes: string;
  whyItMatters: string;
  phaseHref?: string;
}

interface TrackerState {
  status: TrackerStatus;
  understood: number;
  builtIt: boolean;
}

const STORAGE_KEY = "system_design_tracker_v1";

const trackerItems: TrackerItem[] = [
  {
    id: "constraint-driven-thinking",
    step: 1,
    system: "Constraint-Driven System Design Thinking",
    notes: "Reasoning framework",
    whyItMatters: "Use this first to justify why any system should exist before choosing components."
  },
  {
    id: "caching-layer",
    step: 2,
    system: "Caching Layer",
    notes: "Performance",
    whyItMatters: "Reduces repeated expensive reads, lowers latency, and protects the database."
  },
  {
    id: "load-balancer",
    step: 3,
    system: "Load Balancer",
    notes: "Distribution",
    whyItMatters: "Spreads traffic, isolates failures, and enables horizontal scaling."
  },
  {
    id: "queue-async-processing",
    step: 4,
    system: "Queue / Async Processing",
    notes: "Scalability",
    whyItMatters: "Decouples slow work from request paths and absorbs bursts."
  },
  {
    id: "rate-limiter",
    step: 5,
    system: "Rate Limiter",
    notes: "Protection",
    whyItMatters: "Protects scarce capacity from abuse, spikes, and unfair usage."
  },
  {
    id: "database-replication",
    step: 6,
    system: "Database Replication",
    notes: "Reliability",
    whyItMatters: "Improves read scale and resilience, but introduces lag and consistency trade-offs."
  },
  {
    id: "notification-system",
    step: 7,
    system: "Notification System",
    notes: "Engagement",
    whyItMatters: "Moves system events to users asynchronously across multiple delivery channels."
  },
  {
    id: "url-shortener",
    step: 8,
    system: "URL Shortener",
    notes: "Interview prep",
    whyItMatters: "Good compact case study for keys, redirects, hot reads, abuse, and scale."
  }
];

const defaultState: Record<string, TrackerState> = trackerItems.reduce((acc, item) => {
  acc[item.id] = {
    status: "not-started",
    understood: 1,
    builtIt: false
  };
  return acc;
}, {} as Record<string, TrackerState>);

const statusOptions: { value: TrackerStatus; label: string; classes: string }[] = [
  { value: "not-started", label: "Not started", classes: "bg-slate-700 text-slate-200 border-slate-600" },
  { value: "in-progress", label: "In progress", classes: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40" },
  { value: "completed", label: "Completed", classes: "bg-green-500/15 text-green-300 border-green-500/40" }
];

export default function SystemDesignTracker() {
  const [trackerState, setTrackerState] = useState<Record<string, TrackerState>>(defaultState);
  const [statusFilter, setStatusFilter] = useState<TrackerStatus | "all">("all");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as Record<string, Partial<TrackerState>>;
      const hydrated = { ...defaultState };

      for (const item of trackerItems) {
        const saved = parsed[item.id];
        if (!saved) continue;

        hydrated[item.id] = {
          status: saved.status === "in-progress" || saved.status === "completed" ? saved.status : "not-started",
          understood: typeof saved.understood === "number" && saved.understood >= 1 && saved.understood <= 5 ? saved.understood : 1,
          builtIt: Boolean(saved.builtIt)
        };
      }

      setTrackerState(hydrated);
    } catch {
      setTrackerState(defaultState);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerState));
  }, [trackerState]);

  const visibleItems = useMemo(() => {
    return trackerItems.filter((item) => {
      if (statusFilter === "all") return true;
      return trackerState[item.id]?.status === statusFilter;
    });
  }, [statusFilter, trackerState]);

  const summary = useMemo(() => {
    const states = Object.values(trackerState);
    const completed = states.filter((item) => item.status === "completed").length;
    const inProgress = states.filter((item) => item.status === "in-progress").length;
    const built = states.filter((item) => item.builtIt).length;
    const averageUnderstanding = states.length
      ? (states.reduce((sum, item) => sum + item.understood, 0) / states.length).toFixed(1)
      : "0.0";

    return { completed, inProgress, built, averageUnderstanding };
  }, [trackerState]);

  const updateItem = (id: string, patch: Partial<TrackerState>) => {
    setTrackerState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch
      }
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-semibold mb-4">
              <Compass className="w-4 h-4" />
              System Design Progress Tracker
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Build system thinking in the right order</h2>
            <p className="text-gray-300">
              Track whether you understand each system, whether you have built it, and where it sits in the priority sequence.
              Constraint-driven thinking comes first because it decides whether the rest of the systems deserve to exist.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-full lg:min-w-[320px]">
            <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-4">
              <div className="text-sm text-gray-400">Completed</div>
              <div className="text-2xl font-bold text-white">{summary.completed}/{trackerItems.length}</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-4">
              <div className="text-sm text-gray-400">In progress</div>
              <div className="text-2xl font-bold text-white">{summary.inProgress}</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-4">
              <div className="text-sm text-gray-400">Built</div>
              <div className="text-2xl font-bold text-white">{summary.built}</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-4">
              <div className="text-sm text-gray-400">Avg understanding</div>
              <div className="text-2xl font-bold text-white">{summary.averageUnderstanding}/5</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Priority order</h3>
            <p className="text-gray-400 text-sm">Move from reasoning to systems. Do not treat the components as the design.</p>
          </div>
          <label htmlFor="system-design-status-filter" className="inline-flex items-center gap-3 text-sm text-gray-300">
            <Filter className="w-4 h-4 text-cyan-400" />
            Status
            <select
              id="system-design-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TrackerStatus | "all")}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">All</option>
              <option value="not-started">Not started</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {visibleItems.map((item) => {
          const state = trackerState[item.id];
          return (
            <div key={item.id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{item.system}</h3>
                        <p className="text-sm text-gray-400">{item.notes}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{item.whyItMatters}</p>
                    {item.id === "constraint-driven-thinking" && (
                      <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-emerald-300 font-semibold mb-2">
                          <Target className="w-4 h-4" />
                          Core framework
                        </div>
                        <p className="text-sm text-gray-300">
                          Existence, Mechanics, Stress, Failure, and Trade-offs should be answered before you decide to add
                          a cache, queue, rate limiter, or replica.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3 xl:min-w-[360px]">
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">Status</label>
                      <div className="flex flex-wrap gap-2">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateItem(item.id, { status: option.value })}
                            className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                              state.status === option.value
                                ? option.classes
                                : "bg-slate-900 text-gray-300 border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                        Understanding: {state.understood}/5
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={state.understood}
                        onChange={(e) => updateItem(item.id, { understood: Number(e.target.value) })}
                        className="w-full accent-cyan-500"
                      />
                    </div>

                    <label className="flex items-center justify-between gap-3 rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3">
                      <div className="flex items-center gap-3">
                        {state.builtIt ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-500" />
                        )}
                        <span className="text-gray-200 font-medium">Built it</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={state.builtIt}
                        onChange={() => updateItem(item.id, { builtIt: !state.builtIt })}
                        className="w-5 h-5 rounded border-slate-600"
                      />
                    </label>

                    {item.phaseHref && (
                      <Link
                        href={item.phaseHref}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all"
                      >
                        Open related lesson
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
