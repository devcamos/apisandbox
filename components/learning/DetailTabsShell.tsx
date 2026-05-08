"use client";

import type { ReactNode } from "react";

interface DetailTab {
  id: string;
  label: string;
}

interface DetailTabsShellProps {
  color: string;
  icon: string;
  title: string;
  tagline: string;
  tabs: readonly DetailTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
}

export default function DetailTabsShell({
  color,
  icon,
  title,
  tagline,
  tabs,
  activeTab,
  onTabChange,
  children,
}: Readonly<DetailTabsShellProps>) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden animate-slideDown">
      <div className={`bg-gradient-to-r ${color} px-6 py-4`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-white/80 text-sm">{tagline}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-700 px-4">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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

      <div className="p-6">{children}</div>
    </div>
  );
}
