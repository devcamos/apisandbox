"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import DocumentationModal from "./DocumentationModal";

interface ConceptCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  items?: string[];
  color?: string;
  demoLink?: string;
  documentation?: {
    overview: string;
    description: string[];
    useCases: string[];
    paretoKnowledge: {
      title: string;
      points: string[];
    };
    bestFor: string[];
    notIdealFor: string[];
  };
}

export default function ConceptCard({ 
  icon: Icon, 
  title, 
  description, 
  items,
  color = "from-blue-500 to-cyan-500",
  demoLink,
  documentation
}: ConceptCardProps) {
  const [showDocs, setShowDocs] = useState(false);

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all flex flex-col h-full">
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        {items && items.length > 0 && (
          <ul className="space-y-2 mb-4 flex-grow">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-300">
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} mr-2 mt-2`}></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {documentation && (
            <button
              onClick={() => setShowDocs(true)}
              className="py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Docs
            </button>
          )}
          {demoLink && (
            <Link 
              href={demoLink}
              className={`py-3 bg-gradient-to-r ${color} text-white rounded-lg font-semibold text-center hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2`}
            >
              🎮 Try Demo
            </Link>
          )}
        </div>
      </div>

      {documentation && (
        <DocumentationModal
          isOpen={showDocs}
          onClose={() => setShowDocs(false)}
          title={title}
          color={color}
          documentation={documentation}
        />
      )}
    </>
  );
}

