"use client"

import { motion } from "framer-motion"

interface PatternArchitectureAnimatorProps {
  lessonId: string
  title: string
}

function paletteForLesson(lessonId: string) {
  if (lessonId.includes("idempotency") || lessonId.includes("dedup")) {
    return {
      accent: "from-emerald-400 to-cyan-400",
      node: "bg-emerald-500/20 border-emerald-400/40 text-emerald-200",
      lane: "bg-emerald-500/10 border-emerald-500/20",
      labels: ["Client", "Idempotency Store", "Handler", "Side Effect"],
    }
  }
  if (lessonId.includes("priority") || lessonId.includes("scheduling")) {
    return {
      accent: "from-amber-400 to-orange-400",
      node: "bg-amber-500/20 border-amber-400/40 text-amber-200",
      lane: "bg-amber-500/10 border-amber-500/20",
      labels: ["Producer", "Priority Queue", "Scheduler", "Workers"],
    }
  }
  if (lessonId.includes("rate")) {
    return {
      accent: "from-fuchsia-400 to-violet-400",
      node: "bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-200",
      lane: "bg-fuchsia-500/10 border-fuchsia-500/20",
      labels: ["Client", "Limiter", "Gateway", "Service"],
    }
  }
  if (lessonId.includes("binary") || lessonId.includes("capacity")) {
    return {
      accent: "from-sky-400 to-blue-400",
      node: "bg-sky-500/20 border-sky-400/40 text-sky-200",
      lane: "bg-sky-500/10 border-sky-500/20",
      labels: ["Load Test", "Tuner", "Candidate Value", "SLO Gate"],
    }
  }
  return {
    accent: "from-cyan-400 to-blue-400",
    node: "bg-cyan-500/20 border-cyan-400/40 text-cyan-200",
    lane: "bg-cyan-500/10 border-cyan-500/20",
    labels: ["Metrics Stream", "Top-K Engine", "Dashboard", "Decision Loop"],
  }
}

export default function PatternArchitectureAnimator({ lessonId, title }: Readonly<PatternArchitectureAnimatorProps>) {
  const palette = paletteForLesson(lessonId)
  const delayBase = (lessonId.length % 5) * 0.2

  return (
    <div className={`rounded-xl border p-4 mb-4 ${palette.lane}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-wide text-gray-300">Animated pattern view</div>
        <div className={`text-[11px] px-2 py-1 rounded border border-slate-600 bg-gradient-to-r ${palette.accent} text-slate-900 font-semibold`}>
          {title}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {palette.labels.map((label, index) => (
          <motion.div
            key={label}
            className={`rounded-lg border px-2 py-2 text-[11px] text-center ${palette.node}`}
            animate={{ y: [0, -4, 0], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: delayBase + index * 0.18 }}
          >
            {label}
          </motion.div>
        ))}
      </div>

      <div className="relative h-8 rounded-lg border border-slate-700 bg-slate-900/70 overflow-hidden">
        <motion.div
          className={`absolute top-1/2 -translate-y-1/2 h-2 w-24 rounded-full bg-gradient-to-r ${palette.accent}`}
          initial={{ x: -120 }}
          animate={{ x: ["0%", "85%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: delayBase }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 right-2 h-3 w-3 rounded-full bg-rose-400/90"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: delayBase + 0.8 }}
        />
      </div>

      <div className="mt-3 grid md:grid-cols-3 gap-2 text-[11px]">
        <div className="rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1 text-gray-300">
          Normal path: signal flows left to right through the critical path.
        </div>
        <div className="rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1 text-gray-300">
          Stress: pulse rate increases, queueing pressure appears at the gate.
        </div>
        <div className="rounded-md border border-slate-700 bg-slate-900/60 px-2 py-1 text-gray-300">
          Failure mode: red pulse indicates partial failure and fallback decision point.
        </div>
      </div>
    </div>
  )
}
