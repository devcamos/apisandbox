"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, GitBranch, Layers3, Route, Target } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MermaidDiagram from "./MermaidDiagram";
import { getConceptVisual } from "@/lib/learning/concept-visuals";

interface ConceptVisualsProps {
  conceptId: string;
}

export default function ConceptVisuals({ conceptId }: ConceptVisualsProps) {
  const visual = useMemo(() => getConceptVisual(conceptId), [conceptId]);
  const [activeStageId, setActiveStageId] = useState(visual?.stages[0]?.id ?? "");
  const [activeDiagramId, setActiveDiagramId] = useState<"use-case" | "sequence" | "c4">("use-case");

  useEffect(() => {
    if (!visual?.stages.length) return;
    const stillValid = visual.stages.some((stage) => stage.id === activeStageId);
    if (!stillValid) setActiveStageId(visual.stages[0].id);
  }, [visual, activeStageId]);

  const activeStage =
    visual?.stages.find((stage) => stage.id === activeStageId) ?? visual?.stages[0];
  const activeStageIndex = visual ? visual.stages.findIndex((stage) => stage.id === activeStage?.id) : -1;
  const activeDiagram =
    activeStage?.diagrams.find((diagram) => diagram.id === activeDiagramId) ?? activeStage?.diagrams[0];

  useEffect(() => {
    if (!activeStage?.diagrams.length) return;
    if (!activeStage.diagrams.some((diagram) => diagram.id === activeDiagramId)) {
      setActiveDiagramId(activeStage.diagrams[0].id);
    }
  }, [activeDiagramId, activeStage]);

  if (!visual || !activeStage || !activeDiagram) return null;

  const diagramIcon = {
    "use-case": Target,
    sequence: Route,
    c4: GitBranch,
  };

  return (
    <section className="mb-12">
      <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-2xl p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-cyan-300 mb-4">
              <Eye className="w-4 h-4" />
              Concept Visuals
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">{visual.concept}: visual system reasoning</h2>
            <p className="text-gray-300">{visual.summary}</p>
          </div>
          <div className="w-full lg:w-auto lg:min-w-[260px]">
            <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Manual navigation</div>
              <div className="text-sm font-semibold text-white mb-3">
                Stage {activeStageIndex + 1} of {visual.stages.length}
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  key={activeStage.id}
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((activeStageIndex + 1) / visual.stages.length) * 100}%` }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {visual.stages.map((stage) => (
            <motion.button
              key={stage.id}
              onClick={() => {
                setActiveStageId(stage.id);
              }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                activeStage.id === stage.id
                  ? "bg-cyan-500/15 border-cyan-400/40 text-cyan-200"
                  : "bg-slate-900/60 border-slate-700 text-gray-300 hover:border-slate-600"
              }`}
            >
              {stage.label}
            </motion.button>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {activeStage.diagrams.map((diagram) => {
              const Icon = diagramIcon[diagram.id];
              return (
                <motion.button
                  key={`${activeStage.id}-${diagram.id}`}
                  onClick={() => setActiveDiagramId(diagram.id)}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                    activeDiagram.id === diagram.id
                      ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                      : "bg-slate-900/60 border-slate-700 text-gray-300 hover:border-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {diagram.label}
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${activeStage.id}-${activeDiagram.id}-desc`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="text-sm text-gray-400"
            >
              Pareto diagram set: use case for intent, sequence for exact flow, C4-style for structure.
              Current view: {activeDiagram.description}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeStage.id}-${activeDiagram.id}`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5"
            >
              <motion.h3
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08, duration: 0.25 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {activeStage.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.14, duration: 0.25 }}
                className="text-gray-300 mb-5"
              >
                {activeStage.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.3 }}
              >
                <MermaidDiagram chart={activeDiagram.diagram} />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="space-y-4">
            <motion.div
              key={`bullets-${activeStage.id}`}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-4">
                <Layers3 className="w-4 h-4" />
                What to notice
              </div>
              <ul className="space-y-3">
                {activeStage.bullets.map((bullet, index) => (
                  <motion.li
                    key={bullet}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * index, duration: 0.25 }}
                    className="text-sm text-gray-300 flex items-start gap-2"
                  >
                    <motion.span
                      className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-400"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.75, 1, 0.75] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.15 }}
                    />
                    <span>{bullet}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
              className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5"
            >
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Current scope</div>
              <p className="text-sm text-gray-300">
                This is the first concept visual. Add load balancer, queue, rate limiter, and replication next using the same stage model.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
