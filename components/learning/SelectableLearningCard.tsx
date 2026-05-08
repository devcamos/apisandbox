"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface SelectableLearningCardProps {
  icon: string;
  title: string;
  tagline: string;
  isSelected: boolean;
  onSelect: () => void;
  children?: ReactNode;
}

export default function SelectableLearningCard({
  icon,
  title,
  tagline,
  isSelected,
  onSelect,
  children,
}: Readonly<SelectableLearningCardProps>) {
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
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-xs text-gray-400">{tagline}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform shrink-0 mt-1 ${
            isSelected ? "rotate-180" : ""
          }`}
        />
      </div>
      {children}
    </button>
  );
}
