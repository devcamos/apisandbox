"use client";

import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface InteractiveCategoryProps {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  color: string;
  demoContent: React.ReactNode;
}

export default function InteractiveCategory({
  icon: Icon,
  title,
  description,
  items,
  color,
  demoContent,
}: InteractiveCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-slate-600 transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-slate-800/30 transition-all rounded-xl"
      >
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <span className="text-gray-400 text-2xl transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </div>
        <p className="text-gray-400 mb-4">{description}</p>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-300">
              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} mr-2 mt-2`}></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-blue-400 font-semibold flex items-center">
          {isExpanded ? 'Hide' : 'View'} Demo & Examples
          <span className="ml-2">→</span>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-700 p-6 animate-slideDown">
          {demoContent}
        </div>
      )}
    </div>
  );
}

