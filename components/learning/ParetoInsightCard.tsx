"use client";

import { Flame } from "lucide-react";

interface ParetoInsightCardProps {
  insight: string;
}

export default function ParetoInsightCard({ insight }: Readonly<ParetoInsightCardProps>) {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <Flame className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-amber-300 mb-1">Pareto Insight (80/20)</h4>
          <p className="text-sm text-gray-300">{insight}</p>
        </div>
      </div>
    </div>
  );
}
