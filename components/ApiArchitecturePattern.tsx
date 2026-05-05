"use client";

import { useState } from "react";
import { getPatternsByCategory, type FrameworkPattern, type ArchitectureLayer } from "@/lib/learning/api-architecture-patterns";

interface ApiArchitecturePatternProps {
  categoryId: string;
  accentColor: string;
}

function LayerRow({ layer, isLast, accentColor }: { layer: ArchitectureLayer; isLast: boolean; accentColor: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-stretch gap-3">
        <div className="flex flex-col items-center w-6 shrink-0">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${accentColor} shrink-0 mt-3`} />
          {!isLast && <div className="w-px flex-1 bg-slate-600 my-0.5" />}
        </div>

        <div className="flex-1 mb-1">
          <button
            onClick={() => setOpen(!open)}
            className={`w-full text-left rounded-lg px-3 py-2.5 border transition-all ${
              open
                ? "bg-slate-900/80 border-slate-600"
                : "bg-slate-900/60 border-slate-700 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white">{layer.name}</span>
              {layer.annotation && (
                <code className={`text-xs px-1.5 py-0.5 rounded bg-gradient-to-r ${accentColor} bg-opacity-20 text-white/90`}>
                  {layer.annotation}
                </code>
              )}
              <span className="text-xs text-gray-500 ml-auto font-mono">{layer.file}</span>
              <span className={`text-gray-500 text-xs transition-transform ${open ? "rotate-90" : ""}`}>▶</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{layer.responsibility}</p>
          </button>

          {open && (
            <pre className="mt-1 bg-slate-950/80 border border-slate-700 rounded-lg p-3 text-xs text-gray-300 overflow-x-auto whitespace-pre leading-relaxed max-h-72 overflow-y-auto">
              <code>{layer.code}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

function LayerDiagram({ pattern, accentColor }: { pattern: FrameworkPattern; accentColor: string }) {
  return (
    <div className="space-y-1">
      {pattern.layers.map((layer, i) => (
        <LayerRow
          key={layer.name}
          layer={layer}
          isLast={i === pattern.layers.length - 1}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}

export default function ApiArchitecturePattern({ categoryId, accentColor }: ApiArchitecturePatternProps) {
  const patterns = getPatternsByCategory(categoryId);
  const [activeFramework, setActiveFramework] = useState(0);

  if (patterns.length === 0) return null;

  const active = patterns[activeFramework];

  return (
    <div className="mt-6 bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h5 className="font-bold text-white text-sm flex items-center gap-2">
            <span className="text-base">🏗️</span>
            Architecture Pattern
          </h5>
          <div className="flex items-center gap-1">
            {patterns.map((p, i) => (
              <button
                key={p.framework}
                onClick={() => setActiveFramework(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeFramework === i
                    ? `bg-gradient-to-r ${accentColor} text-white`
                    : "text-gray-400 hover:text-gray-200 hover:bg-slate-700/60"
                }`}
              >
                <span>{p.icon}</span>
                {p.framework}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Best-practice layered architecture for {active.framework} ({active.language}) — click a layer to see code
        </p>
      </div>

      <div className="px-5 pb-4">
        <LayerDiagram key={active.framework} pattern={active} accentColor={accentColor} />

        <div className="mt-3 bg-slate-900/40 border border-slate-700/60 rounded-lg p-3">
          <h6 className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Best Practices</h6>
          <ul className="space-y-1">
            {active.bestPractices.map((tip) => (
              <li key={tip} className="text-xs text-gray-400 flex items-start gap-1.5">
                <span className="text-emerald-400 shrink-0 mt-px">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
