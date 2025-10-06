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
        </div>
      </div>
    </div>
  );
}

