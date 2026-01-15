"use client";

import { useState } from "react";
import { Calculator, DollarSign } from "lucide-react";

export default function CostCalculator() {
  const [trafficGB, setTrafficGB] = useState<number>(1000);
  const [computeHours, setComputeHours] = useState<number>(720);
  const [strategy, setStrategy] = useState<string>("lift-shift");
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateCost = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/aws/cost-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trafficGB,
          computeHours,
          strategy
        })
      });
      const data = await response.json();
      setEstimatedCost(data.estimatedMonthlyCost);
    } catch (error) {
      console.error("Error calculating cost:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-purple-400" />
        <h3 className="text-2xl font-bold text-white">AWS Cost Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Monthly Traffic (GB)</label>
          <input
            type="number"
            value={trafficGB}
            onChange={(e) => setTrafficGB(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Compute Hours/Month</label>
          <input
            type="number"
            value={computeHours}
            onChange={(e) => setComputeHours(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
            placeholder="720"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Migration Strategy</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="lift-shift">Lift & Shift</option>
            <option value="replatform">Re-platform</option>
            <option value="refactor">Refactor</option>
          </select>
        </div>

        <button
          onClick={calculateCost}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? "Calculating..." : "Calculate Estimated Cost"}
        </button>

        {estimatedCost !== null && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h4 className="text-green-400 font-semibold">Estimated Monthly Cost</h4>
            </div>
            <p className="text-3xl font-bold text-green-400">${estimatedCost}</p>
            <p className="text-xs text-gray-400 mt-2">
              This is an estimate. Actual costs may vary based on usage patterns and AWS pricing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

