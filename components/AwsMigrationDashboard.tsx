"use client";

import { useState } from "react";
import { Cloud, Calculator, CheckCircle, Server, Database, Zap } from "lucide-react";

interface MigrationChecklistItem {
  id: number;
  task: string;
  completed: boolean;
}

export default function AwsMigrationDashboard() {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [checklist, setChecklist] = useState<MigrationChecklistItem[]>([
    { id: 1, task: "Assess current infrastructure", completed: false },
    { id: 2, task: "Choose migration strategy", completed: false },
    { id: 3, task: "Set up AWS account and IAM", completed: false },
    { id: 4, task: "Design target architecture", completed: false },
    { id: 5, task: "Create migration plan", completed: false },
    { id: 6, task: "Set up CI/CD pipeline", completed: false },
    { id: 7, task: "Migrate data and applications", completed: false },
    { id: 8, task: "Test and validate", completed: false },
    { id: 9, task: "Cutover to production", completed: false },
    { id: 10, task: "Monitor and optimize", completed: false },
  ]);

  const migrationStrategies = [
    {
      id: "lift-shift",
      name: "Lift & Shift",
      description: "Move applications to cloud with minimal changes",
    },
    {
      id: "replatform",
      name: "Re-platform",
      description: "Move to cloud with some optimizations",
    },
    {
      id: "refactor",
      name: "Refactor",
      description: "Redesign for cloud-native architecture",
    }
  ];

  const calculateCost = async () => {
    try {
      const response = await fetch("/api/aws/cost-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trafficGB: 1000,
          computeHours: 720,
          strategy: selectedStrategy
        })
      });
      const data = await response.json();
      setEstimatedCost(data.estimatedMonthlyCost);
    } catch (error) {
      console.error("Error calculating cost:", error);
    }
  };

  const toggleChecklistItem = (id: number) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Strategy Selector */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-4">Migration Strategy</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {migrationStrategies.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedStrategy === strategy.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <h4 className="font-bold text-white mb-1">{strategy.name}</h4>
              <p className="text-sm text-gray-400">{strategy.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cost Calculator */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Cost Calculator</h3>
        </div>
        <button
          onClick={calculateCost}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Calculate Estimated Cost
        </button>
        {estimatedCost > 0 && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 font-semibold">
              Estimated Monthly Cost: ${estimatedCost}
            </p>
          </div>
        )}
      </div>

      {/* Checklist */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-blue-400" />
          <h3 className="text-2xl font-bold text-white">Migration Checklist</h3>
        </div>
        <div className="space-y-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleChecklistItem(item.id)}
                className="w-5 h-5 rounded border-slate-600"
              />
              <span className={`flex-1 ${item.completed ? "line-through text-gray-500" : "text-gray-300"}`}>
                {item.task}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

