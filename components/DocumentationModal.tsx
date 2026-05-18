"use client";

import { X, BookOpen, CheckCircle, Lightbulb, Target } from "lucide-react";
import { useEffect } from "react";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  color: string;
  documentation: {
    overview: string;
    description: string[];
    useCases: string[];
    transientFailureCauses?: {
      title: string;
      points: string[];
    };
    retryConfigs?: {
      title: string;
      profiles: {
        label: string;
        config: string;
        why: string;
      }[];
      rules: string[];
    };
    corePrinciples?: {
      title: string;
      points: string[];
    };
    contractStyles?: {
      title: string;
      points: string[];
    };
    paretoKnowledge: {
      title: string;
      points: string[];
    };
    bestFor: string[];
    notIdealFor: string[];
    notableTechnologies?: {
      title: string;
      technologies: {
        name: string;
        description: string;
        category?: string;
      }[];
    };
  };
}

export default function DocumentationModal({
  isOpen,
  onClose,
  title,
  color,
  documentation,
}: DocumentationModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideDown">
        {/* Header */}
        <div className={`bg-gradient-to-r ${color} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-white" />
            <h2 className="text-3xl font-bold text-white">{title} Documentation</h2>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8 space-y-8">
          {/* Overview */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              What is {title}?
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {documentation.overview}
            </p>
          </section>

          {/* Key Characteristics */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Key Characteristics
            </h3>
            <div className="space-y-3">
              {documentation.description.map((desc, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} mt-2 flex-shrink-0`}></span>
                  <p className="text-gray-300">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Real-World Use Cases
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {documentation.useCases.map((useCase, idx) => (
                <div key={idx} className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                  <p className="text-gray-300 text-sm">{useCase}</p>
                </div>
              ))}
            </div>
          </section>

          {documentation.transientFailureCauses && (
            <section className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-amber-400" />
                {documentation.transientFailureCauses.title}
              </h3>
              <div className="space-y-3">
                {documentation.transientFailureCauses.points.map((point, idx) => (
                  <div key={idx} className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {documentation.retryConfigs && (
            <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-cyan-400" />
                {documentation.retryConfigs.title}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {documentation.retryConfigs.profiles.map((profile, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">{profile.label}</h4>
                    <p className="text-cyan-100 text-sm font-mono mb-3">{profile.config}</p>
                    <p className="text-gray-300 text-sm">{profile.why}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2">
                {documentation.retryConfigs.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="bg-cyan-500/20 text-cyan-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                      {idx + 1}
                    </span>
                    <p className="text-gray-200 text-sm">{rule}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Core Principles */}
          {documentation.corePrinciples && (
            <section className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                {documentation.corePrinciples.title}
              </h3>
              <div className="space-y-3">
                {documentation.corePrinciples.points.map((principle, idx) => (
                  <div key={idx} className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm">{principle}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contract Styles */}
          {documentation.contractStyles && (
            <section className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-green-400" />
                {documentation.contractStyles.title}
              </h3>
              <div className="space-y-3">
                {documentation.contractStyles.points.map((style, idx) => (
                  <div key={idx} className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm">{style}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pareto Knowledge (80/20 Rule) */}
          <section className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              {documentation.paretoKnowledge.title}
            </h3>
            <p className="text-gray-300 mb-4 text-sm italic">
              Focus on these essential concepts that cover 80% of use cases
            </p>
            <div className="space-y-3">
              {documentation.paretoKnowledge.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="bg-yellow-500/20 text-yellow-400 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                    {idx + 1}
                  </span>
                  <p className="text-gray-200 font-medium">{point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* When to Use / Not Use */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
              <h4 className="text-lg font-bold text-green-400 mb-4">✅ Best For:</h4>
              <ul className="space-y-2">
                {documentation.bestFor.map((item, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <h4 className="text-lg font-bold text-red-400 mb-4">⚠️ Not Ideal For:</h4>
              <ul className="space-y-2">
                {documentation.notIdealFor.map((item, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Notable Technologies */}
          {documentation.notableTechnologies && (
            <section>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                Notable Technologies Using {title}
              </h3>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                <h4 className="text-lg font-bold text-purple-400 mb-4">
                  {documentation.notableTechnologies.title}
                </h4>
                <div className="grid gap-4">
                  {documentation.notableTechnologies.technologies.map((tech, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-white font-semibold">{tech.name}</h5>
                        {tech.category && (
                          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                            {tech.category}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
