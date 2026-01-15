"use client";

import { useState } from "react";
import { Cloud, Calculator, CheckCircle, ArrowRight, Server, Database, Zap, Home } from "lucide-react";
import Link from "next/link";

export default function AwsMigrationPage() {
  const migrationStrategies = [
    {
      id: "lift-shift",
      name: "Lift & Shift",
      description: "Move applications to cloud with minimal changes",
      pros: ["Fastest migration", "Low risk", "Minimal code changes"],
      cons: ["May not optimize costs", "Limited cloud benefits"],
      bestFor: "Legacy applications, quick migrations"
    },
    {
      id: "replatform",
      name: "Re-platform",
      description: "Move to cloud with some optimizations",
      pros: ["Better performance", "Cost optimization", "Some cloud benefits"],
      cons: ["More time required", "Some code changes needed"],
      bestFor: "Applications needing optimization"
    },
    {
      id: "refactor",
      name: "Refactor",
      description: "Redesign for cloud-native architecture",
      pros: ["Maximum cloud benefits", "Best performance", "Scalability"],
      cons: ["Most time-consuming", "Requires significant changes"],
      bestFor: "Long-term cloud-native applications"
    }
  ];

  const initialChecklist = [
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
  ];

  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [trafficGB, setTrafficGB] = useState<number>(1000);
  const [computeHours, setComputeHours] = useState<number>(720);
  const [checklist, setChecklist] = useState(initialChecklist);

  const toggleChecklistItem = (id: number) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const calculateCost = async () => {
    try {
      const response = await fetch("/api/aws/cost-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trafficGB,
          computeHours,
          strategy: selectedStrategy || "lift-shift"
        })
      });
      const data = await response.json();
      setEstimatedCost(data.estimatedMonthlyCost);
    } catch (error) {
      console.error("Error calculating cost:", error);
      // Fallback calculation
      const baseCost = 100;
      const strategyMultiplier = selectedStrategy === "refactor" ? 0.7 : selectedStrategy === "replatform" ? 0.85 : 1;
      setEstimatedCost(Math.round(baseCost * strategyMultiplier));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 py-16">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <span className="text-white/50">/</span>
            <Link href="/cloud" className="text-white/70 hover:text-white transition-colors">Cloud</Link>
            <span className="text-white/50">/</span>
            <Link href="/cloud/aws" className="text-white/70 hover:text-white transition-colors">AWS</Link>
            <span className="text-white/50">/</span>
            <span className="text-white font-semibold">Migration</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <Cloud className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">AWS Migration Dashboard</h1>
              <p className="text-xl text-white/90 mt-2">Plan and execute your cloud migration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Migration Strategy Selector */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Choose Migration Strategy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {migrationStrategies.map((strategy) => (
              <div
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border-2 cursor-pointer transition-all ${
                  selectedStrategy === strategy.id
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-slate-700 hover:border-slate-600"
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">{strategy.name}</h3>
                <p className="text-gray-400 mb-4">{strategy.description}</p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-green-400 font-semibold">Pros:</span>
                    <ul className="text-gray-300 mt-1">
                      {strategy.pros.map((pro, idx) => (
                        <li key={idx}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm">
                    <span className="text-orange-400 font-semibold">Cons:</span>
                    <ul className="text-gray-300 mt-1">
                      {strategy.cons.map((con, idx) => (
                        <li key={idx}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Best for: {strategy.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Calculator */}
        <section className="mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">Cost Calculator</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
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
            </div>
            <button
              onClick={calculateCost}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Calculate Estimated Cost
            </button>
            {estimatedCost > 0 && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 font-semibold">
                  Estimated Monthly Cost: ${estimatedCost}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Migration Checklist */}
        <section className="mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">Migration Checklist</h2>
            </div>
            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700"
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
        </section>

        {/* Architecture Generator */}
        <section>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6">Architecture Generator</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <Server className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Compute</h3>
                <p className="text-gray-400 text-sm">EC2, Lambda, ECS</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <Database className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Database</h3>
                <p className="text-gray-400 text-sm">RDS, DynamoDB, ElastiCache</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Storage</h3>
                <p className="text-gray-400 text-sm">S3, EBS, EFS</p>
              </div>
            </div>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Generate Architecture Diagram
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

