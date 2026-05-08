"use client"

import type { AlgorithmKnowledge } from "@/lib/learning/algorithm-knowledge"
import { AlertTriangle, BookMarked, CheckCircle2, GitBranch, HelpCircle, Scale, Target, Zap } from "lucide-react"

interface Props {
  knowledge: AlgorithmKnowledge
  accentClass: string
}

export default function AlgorithmKnowledgePanel({ knowledge: k, accentClass }: Props) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border border-slate-600 text-gray-300`}>
            {k.family}
          </span>
        </div>
        <h3 className={`text-sm font-bold text-white mb-2 flex items-center gap-2`}>
          <BookMarked className={`w-4 h-4 ${accentClass}`} />
          What is this algorithm?
        </h3>
        <p className="text-[13px] text-gray-300 leading-relaxed">{k.definition}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            What problem does it solve?
          </h4>
          <p className="text-[12px] text-gray-400 leading-relaxed">{k.problem}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-violet-400" />
            Preconditions (must be true)
          </h4>
          <ul className="space-y-1.5">
            {k.constraintsMustHold.map((c) => (
              <li key={c} className="text-[12px] text-gray-400 flex gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80 shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
          <Scale className="w-3.5 h-3.5 text-amber-400" />
          Trade-offs
        </h4>
        <ul className="space-y-1.5">
          {k.tradeoffs.map((t) => (
            <li key={t} className="text-[12px] text-gray-400 flex gap-2">
              <span className="text-amber-500/60 shrink-0">•</span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          Complexity
        </h4>
        <div className="flex flex-wrap gap-4 text-[12px]">
          <span className="text-emerald-400">Best: {k.complexity.best}</span>
          <span className="text-amber-400">Average: {k.complexity.average}</span>
          <span className="text-rose-400">Worst: {k.complexity.worst}</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
        <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-fuchsia-400" />
          When should I use it?
        </h4>
        <ul className="space-y-1.5">
          {k.whenToUse.map((w) => (
            <li key={w} className="text-[12px] text-gray-400 flex gap-2">
              <span className="text-fuchsia-500/50 shrink-0">→</span>
              {w}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
        <h4 className="text-xs font-bold text-rose-200 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          Common mistakes
        </h4>
        <ul className="space-y-3">
          {k.commonMistakes.map((m) => (
            <li key={m.mistake} className="text-[12px]">
              <p className="text-rose-200/90 mb-1"><span className="text-rose-400/80 font-medium">Mistake:</span> {m.mistake}</p>
              <p className="text-gray-400"><span className="text-emerald-400/90 font-medium">Instead:</span> {m.instead}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
