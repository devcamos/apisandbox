"use client";

import { Server, RefreshCw, Code, ArrowRight, CheckCircle, AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function MigrationPage() {
  const strategies = [
    {
      id: "lift-shift",
      icon: Server,
      title: "Lift & Shift (Rehost)",
      description: "Move applications to cloud with minimal changes",
      color: "from-blue-500 to-cyan-500",
      timeline: "1-3 months",
      cost: "Low",
      risk: "Low",
      steps: [
        "Assess current infrastructure",
        "Choose target AWS services (EC2, RDS)",
        "Replicate infrastructure in AWS",
        "Migrate data and applications",
        "Test and validate",
        "Cutover to production"
      ],
      pros: [
        "Fastest migration approach",
        "Low risk - minimal changes",
        "Minimal code modifications",
        "Quick time to market"
      ],
      cons: [
        "May not optimize costs",
        "Limited cloud-native benefits",
        "May carry over technical debt",
        "Not fully optimized for cloud"
      ],
      bestFor: [
        "Legacy applications",
        "Quick migration needs",
        "When minimal changes are required",
        "Proof of concept migrations"
      ]
    },
    {
      id: "replatform",
      icon: RefreshCw,
      title: "Re-platform (Replatform)",
      description: "Move to cloud with some optimizations",
      color: "from-purple-500 to-pink-500",
      timeline: "3-6 months",
      cost: "Medium",
      risk: "Medium",
      steps: [
        "Assess and optimize current architecture",
        "Choose optimized AWS services",
        "Refactor database (if needed)",
        "Implement auto-scaling",
        "Add cloud-native features",
        "Migrate and optimize"
      ],
      pros: [
        "Better cost optimization",
        "Improved performance",
        "Some cloud-native benefits",
        "Better scalability"
      ],
      cons: [
        "More time required",
        "Some code changes needed",
        "Requires more planning",
        "Moderate risk"
      ],
      bestFor: [
        "Applications needing optimization",
        "When cost savings are important",
        "Moderate performance improvements needed",
        "Balanced approach"
      ]
    },
    {
      id: "refactor",
      icon: Code,
      title: "Refactor (Re-architect)",
      description: "Redesign for cloud-native architecture",
      color: "from-green-500 to-emerald-500",
      timeline: "6-12 months",
      cost: "High",
      risk: "High",
      steps: [
        "Analyze application architecture",
        "Design cloud-native solution",
        "Break into microservices (if applicable)",
        "Implement serverless components",
        "Use managed services",
        "Implement DevOps practices",
        "Gradual migration"
      ],
      pros: [
        "Maximum cloud benefits",
        "Best performance and scalability",
        "Optimal cost structure",
        "Cloud-native features",
        "Future-proof architecture"
      ],
      cons: [
        "Most time-consuming",
        "Requires significant changes",
        "Higher risk",
        "More complex",
        "Requires skilled team"
      ],
      bestFor: [
        "Long-term cloud strategy",
        "When maximum benefits needed",
        "Modern applications",
        "Greenfield projects"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 py-16">
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
            <span className="text-white font-semibold">Strategies</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <RefreshCw className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Migration Strategies</h1>
              <p className="text-xl text-white/90 mt-2">Choose the right approach for your cloud migration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Overview */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-bold text-white mb-3">🎯 Migration Strategy Overview</h2>
          <p className="text-gray-300 text-lg mb-4">
            AWS provides three main migration strategies. Choose based on your timeline, budget, risk tolerance, and long-term goals.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-2">Lift & Shift</div>
              <div className="text-gray-300 text-sm">Fast, low risk, minimal changes</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-2">Re-platform</div>
              <div className="text-gray-300 text-sm">Balanced approach with optimizations</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">Refactor</div>
              <div className="text-gray-300 text-sm">Maximum benefits, cloud-native</div>
            </div>
          </div>
        </div>

        {/* Migration Strategies */}
        <div className="space-y-12">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            return (
              <div key={strategy.id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                <div className="flex items-start gap-6 mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${strategy.color}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2">{strategy.title}</h2>
                    <p className="text-gray-300 text-lg mb-4">{strategy.description}</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-slate-900/50 rounded-lg px-4 py-2">
                        <span className="text-gray-400 text-sm">Timeline:</span>
                        <span className="text-white font-semibold ml-2">{strategy.timeline}</span>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg px-4 py-2">
                        <span className="text-gray-400 text-sm">Cost:</span>
                        <span className="text-white font-semibold ml-2">{strategy.cost}</span>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg px-4 py-2">
                        <span className="text-gray-400 text-sm">Risk:</span>
                        <span className="text-white font-semibold ml-2">{strategy.risk}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Steps */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Migration Steps
                    </h3>
                    <ol className="space-y-3">
                      {strategy.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <span className="flex-shrink-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-sm font-semibold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Pros and Cons */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Pros
                      </h3>
                      <ul className="space-y-2">
                        {strategy.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <span className="text-green-400 mt-1">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        Cons
                      </h3>
                      <ul className="space-y-2">
                        {strategy.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <span className="text-orange-400 mt-1">✗</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Best For */}
                <div className="mt-8 pt-8 border-t border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-4">Best For:</h3>
                  <div className="flex flex-wrap gap-2">
                    {strategy.bestFor.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-700/50 text-gray-300 rounded-lg text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decision Framework */}
        <section className="mt-12">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-600">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Decision Framework</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">Choose Lift & Shift If:</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Need quick migration (&lt; 3 months)</li>
                  <li>• Low risk tolerance</li>
                  <li>• Legacy applications</li>
                  <li>• Limited budget for changes</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">Choose Re-platform If:</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Want cost optimization</li>
                  <li>• Need better performance</li>
                  <li>• Can invest 3-6 months</li>
                  <li>• Moderate risk acceptable</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">Choose Refactor If:</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Long-term cloud strategy</li>
                  <li>• Need maximum benefits</li>
                  <li>• Can invest 6-12 months</li>
                  <li>• Modern application architecture</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/cloud/aws/migration"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
          >
            Use Migration Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

