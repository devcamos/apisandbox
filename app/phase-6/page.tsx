"use client"

import { Suspense, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  ArrowLeft,
  BookOpen,
  BarChart3,
  Search,
  GitBranch,
  X,
  ChevronLeft,
  Play,
  Brain,
  Globe,
  Layers,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import PhaseLayout from "@/components/PhaseLayout"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import FramerMotionDemo, { type SortAlgorithm } from "@/components/phase-6/FramerMotionDemo"
import GsapDemo, { type SearchAlgorithm } from "@/components/phase-6/GsapDemo"
import SearchDecisionChecklist from "@/components/phase-6/SearchDecisionChecklist"
import SearchMicroExercises from "@/components/phase-6/SearchMicroExercises"
import AlgorithmKnowledgePanel from "@/components/phase-6/AlgorithmKnowledgePanel"
import {
  algorithmKnowledgeCatalog,
  type AlgorithmKnowledge,
  type HaloDifficulty,
  type RealWorldMapping,
  type Variation,
} from "@/lib/learning/algorithm-knowledge"
import {
  getAlgorithmLayerTabs,
  layerTabTestId,
  type LayerTab,
} from "@/lib/phase-6/algorithm-layer-tabs"
import { useShinobiProgress } from "@/hooks/useShinobiProgress"
import ShinobiLearningBoard from "@/components/phase-6/ShinobiLearningBoard"
import Phase6ProgressNote from "@/components/phase-6/Phase6ProgressNote"
import AnimatedTabPanel from "@/components/phase-6/AnimatedTabPanel"

const LAYER_TAB_ICONS: Record<LayerTab, LucideIcon> = {
  overview: BookOpen,
  visualizer: Play,
  exercises: Brain,
  "real-world": Globe,
  variations: Layers,
}

const ThreeDemoLazy = dynamic(() => import("@/components/phase-6/ThreeDemo"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading 3D scene...</p>
    </div>
  ),
})

const difficultyStyle: Record<HaloDifficulty, { badge: string; dot: string; icon: string }> = {
  Easy:      { badge: "bg-sky-500/20 text-sky-300",    dot: "bg-sky-400",    icon: "🛡️" },
  Normal:    { badge: "bg-emerald-500/20 text-emerald-300", dot: "bg-emerald-400", icon: "⚔️" },
  Heroic:    { badge: "bg-amber-500/20 text-amber-300", dot: "bg-amber-400",  icon: "🔥" },
  Legendary: { badge: "bg-rose-500/20 text-rose-300",   dot: "bg-rose-400",   icon: "💀" },
}

interface Category {
  id: string
  label: string
  icon: LucideIcon
  color: string
  description: string
  algorithms: AlgorithmKnowledge[]
}

const categories: Category[] = [
  {
    id: "sorting",
    label: "Sorting",
    icon: BarChart3,
    color: "violet",
    description: "Reorder data efficiently — the building block behind search, ranking, and display.",
    algorithms: algorithmKnowledgeCatalog.filter((a) => a.categoryId === "sorting"),
  },
  {
    id: "searching",
    label: "Searching",
    icon: Search,
    color: "green",
    description: "Find values fast in structured data — the heart of indexes and lookups.",
    algorithms: algorithmKnowledgeCatalog.filter((a) => a.categoryId === "searching"),
  },
  {
    id: "graph-tree",
    label: "Graph & Tree",
    icon: GitBranch,
    color: "blue",
    description: "Traverse connected structures — from DOMs to social networks to file systems.",
    algorithms: algorithmKnowledgeCatalog.filter((a) => a.categoryId === "graph-tree"),
  },
]

const colorMap: Record<string, {
  bg: string; border: string; text: string; badge: string;
  ring: string; glow: string; activeBg: string; activeBorder: string
}> = {
  violet: { bg: "bg-violet-500/5", border: "border-violet-500/20", text: "text-violet-300", badge: "bg-violet-500/20 text-violet-300", ring: "ring-violet-500/60", glow: "shadow-violet-500/20", activeBg: "bg-violet-500/15", activeBorder: "border-violet-500/50" },
  green: { bg: "bg-green-500/5", border: "border-green-500/20", text: "text-green-300", badge: "bg-green-500/20 text-green-300", ring: "ring-green-500/60", glow: "shadow-green-500/20", activeBg: "bg-green-500/15", activeBorder: "border-green-500/50" },
  blue: { bg: "bg-blue-500/5", border: "border-blue-500/20", text: "text-blue-300", badge: "bg-blue-500/20 text-blue-300", ring: "ring-blue-500/60", glow: "shadow-blue-500/20", activeBg: "bg-blue-500/15", activeBorder: "border-blue-500/50" },
}

function renderDemo(categoryId: string, algorithmId: string) {
  if (categoryId === "sorting") {
    return <FramerMotionDemo algorithm={algorithmId as SortAlgorithm} />
  }
  if (categoryId === "searching") {
    return <GsapDemo algorithm={algorithmId as SearchAlgorithm} />
  }
  if (categoryId === "graph-tree") {
    return (
      <Suspense fallback={<p className="text-gray-400 text-sm p-4">Loading 3D scene...</p>}>
        <ThreeDemoLazy algorithm={algorithmId as "bfs" | "dfs-preorder" | "dfs-inorder" | "dfs-postorder"} />
      </Suspense>
    )
  }
  return null
}

export default function Phase6Page() {
  const shinobi = useShinobiProgress()
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [activeAlgorithmId, setActiveAlgorithmId] = useState<string | null>(null)

  const activeCategory = activeCategoryId ? categories.find((c) => c.id === activeCategoryId) ?? null : null
  const activeAlgorithm = activeCategory && activeAlgorithmId
    ? activeCategory.algorithms.find((a) => a.id === activeAlgorithmId) ?? null
    : null

  function selectCategory(id: string) {
    if (activeCategoryId === id) {
      setActiveCategoryId(null)
      setActiveAlgorithmId(null)
    } else {
      setActiveCategoryId(id)
      setActiveAlgorithmId(null)
    }
  }

  function selectAlgorithm(id: string) {
    setActiveAlgorithmId(activeAlgorithmId === id ? null : id)
  }

  function closeAll() {
    setActiveCategoryId(null)
    setActiveAlgorithmId(null)
  }

  function backToList() {
    setActiveAlgorithmId(null)
  }

  return (
    <SubscriptionGate phaseNumber={6} lockedContentName="Phase 6: Algorithm Visualizer">
    <PhaseLayout
      phaseNumber={6}
      title="Algorithm Visualizer"
      description="See algorithms in action — interactive study guides for patterns and constraints"
      icon={Sparkles}
      color="from-fuchsia-500 to-violet-600"
    >
      <Phase6ProgressNote />

      {/* Hero */}
      <section className="mb-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm">
          <Link href="/phase-5" className="inline-flex items-center gap-2 text-fuchsia-300 hover:text-fuchsia-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Phase 5
          </Link>
          <Link href="/phase-5/concepts/big-o" className="text-violet-400 hover:text-violet-300 transition-colors">
            Big O (concept 101)
          </Link>
          <span className="text-gray-600">·</span>
          <Link href="/phase-5/concepts" className="text-violet-400/90 hover:text-violet-300 transition-colors">
            All concept side quests
          </Link>
        </div>
        <div className="bg-fuchsia-500/10 border border-fuchsia-500/25 rounded-2xl p-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300 text-sm font-semibold mb-3">
            <BookOpen className="w-4 h-4" />
            Study Guides
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Learn Algorithms by Watching Them Run</h2>
          <p className="text-gray-300 mb-3">
            Each algorithm is a knowledge object: family, problem, constraints, trade-offs, complexity, when to use, and common mistakes — then a visualizer to see it move.
            Main path: master algorithms. Pair with Phase 5 concept side quests to master vocabulary.
          </p>
          <p className="text-gray-400 text-sm">
            3 categories &middot; 12 algorithms &middot; 4 difficulty tiers
          </p>
        </div>
      </section>

      <ShinobiLearningBoard shinobi={shinobi} />

      {/* Category selector */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Choose a Category</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const c = colorMap[cat.color]
            const Icon = cat.icon
            const isActive = activeCategoryId === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                data-testid={`phase-6-category-${cat.id}`}
                onClick={() => selectCategory(cat.id)}
                className={`relative text-left rounded-xl p-5 border-2 transition-all duration-200 ${
                  isActive
                    ? `${c.activeBg} ${c.activeBorder} shadow-lg ${c.glow} ring-1 ${c.ring}`
                    : `${c.bg} ${c.border} hover:shadow-md hover:scale-[1.01]`
                } active:scale-[0.98]`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${isActive ? c.activeBg : c.bg} border ${isActive ? c.activeBorder : c.border}`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${c.text}`}>{cat.label}</h3>
                    <p className="text-[10px] text-gray-500">{cat.algorithms.length} algorithm{cat.algorithms.length > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{cat.description}</p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Decision checklist — searching only */}
      <AnimatePresence>
        {activeCategory?.id === "searching" && !activeAlgorithm && (
          <motion.section
            key="decision-checklist"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mb-6 bg-green-500/5 border-2 border-green-500/20 rounded-2xl p-5"
          >
            <SearchDecisionChecklist onSelectAlgorithm={selectAlgorithm} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Algorithm list + interactive layer */}
      <AnimatePresence mode="wait">
        {activeCategory && !activeAlgorithm && (
          <AlgorithmList
            key={`list-${activeCategory.id}`}
            category={activeCategory}
            onSelect={selectAlgorithm}
            onClose={closeAll}
          />
        )}

        {activeCategory && activeAlgorithm && (
          <InteractiveLayer
            key={`demo-${activeCategory.id}-${activeAlgorithm.id}`}
            category={activeCategory}
            algorithm={activeAlgorithm}
            onBack={backToList}
            onClose={closeAll}
            onRegisterTabVisit={shinobi.registerTabVisit}
          />
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!activeCategory && (
        <div className="text-center py-16 border border-dashed border-slate-700 rounded-2xl">
          <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Select a category above to see its algorithms</p>
        </div>
      )}
    </PhaseLayout>
    </SubscriptionGate>
  )
}

function AlgorithmList({
  category,
  onSelect,
  onClose,
}: Readonly<{
  category: Category
  onSelect: (id: string) => void
  onClose: () => void
}>) {
  const c = colorMap[category.color]
  const Icon = category.icon

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`${c.bg} border-2 ${c.activeBorder} rounded-2xl overflow-hidden shadow-lg ${c.glow}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${c.border} ${c.activeBg}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${c.bg} border ${c.border}`}>
            <Icon className={`w-5 h-5 ${c.text}`} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${c.text}`}>{category.label}</h2>
            <p className="text-xs text-gray-400">Select an algorithm — start from Overview, then Visualizer</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Algorithm cards */}
      <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {category.algorithms.map((algo) => {
          const ds = difficultyStyle[algo.difficulty]
          return (
            <button
              key={algo.id}
              type="button"
              data-testid={`phase-6-algorithm-card-${algo.id}`}
              onClick={() => onSelect(algo.id)}
              className={`text-left p-4 rounded-xl border-2 ${c.border} ${c.bg} hover:${c.activeBg} hover:${c.activeBorder} hover:shadow-md transition-all active:scale-[0.98] group`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold ${c.text}`}>{algo.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${ds.badge}`}>
                  <span className="text-xs">{ds.icon}</span>
                  {algo.difficulty}
                </span>
              </div>

              {/* Constraints — prominent for searching algorithms */}
              {algo.constraintBadges && algo.constraintBadges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {algo.constraintBadges.map((con) => (
                    <span
                      key={con.label}
                      className={`text-[9px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${
                        con.met
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                          : "bg-slate-700/60 text-gray-500 border border-slate-600/40 line-through"
                      }`}
                    >
                      {con.met ? "✓" : "✗"} {con.label}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.badge}`}>
                  Avg {algo.complexity.average}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3 text-[9px] text-gray-500">
                <span>Best: {algo.complexity.best}</span>
                <span>Avg: {algo.complexity.average}</span>
                <span>Worst: {algo.complexity.worst}</span>
              </div>
              <p className="text-[10px] text-gray-500 mb-1 font-medium">{algo.family}</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">{algo.summary}</p>

              {/* Variation count hint */}
              {algo.variations && algo.variations.length > 0 && (
                <p className="text-[9px] text-gray-600 mt-2">
                  + {algo.variations.length} variation{algo.variations.length > 1 ? "s" : ""} to explore
                </p>
              )}
            </button>
          )
        })}
      </div>
    </motion.section>
  )
}

function InteractiveLayer({
  category,
  algorithm,
  onBack,
  onClose,
  onRegisterTabVisit,
}: Readonly<{
  category: Category
  algorithm: AlgorithmKnowledge
  onBack: () => void
  onClose: () => void
  onRegisterTabVisit?: (categoryId: string, algorithmId: string, tab: string) => void
}>) {
  const c = colorMap[category.color]
  const Icon = category.icon
  const isSearching = category.id === "searching"
  const [activeTab, setActiveTab] = useState<LayerTab>("overview")
  const tabs = getAlgorithmLayerTabs(category.id, algorithm).map((t) => ({
    ...t,
    icon: LAYER_TAB_ICONS[t.id],
  }))

  useEffect(() => {
    onRegisterTabVisit?.(category.id, algorithm.id, activeTab)
  }, [activeTab, category.id, algorithm.id, onRegisterTabVisit])

  return (
    <motion.section
      data-testid="phase-6-interactive-layer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`${c.bg} border-2 ${c.activeBorder} rounded-2xl overflow-hidden shadow-xl ${c.glow}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${c.border} ${c.activeBg}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg ${c.bg} border ${c.border} ${c.text} hover:${c.activeBg} transition-colors`}
            aria-label="Back to algorithm list"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className={`p-2 rounded-xl ${c.bg} border ${c.border}`}>
            <Icon className={`w-4 h-4 ${c.text}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{category.label}</span>
              <span className="text-gray-600">/</span>
              <h2 className={`text-lg font-bold ${c.text}`}>{algorithm.name}</h2>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${difficultyStyle[algorithm.difficulty].badge}`}>
                <span className="text-xs">{difficultyStyle[algorithm.difficulty].icon}</span>
                {algorithm.difficulty}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${c.badge}`}>
                Avg {algorithm.complexity.average}
              </span>

              {/* Constraints inline */}
              {algorithm.constraintBadges?.filter((cn) => cn.met).map((cn) => (
                <span key={cn.label} className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {cn.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Context bar */}
      <div className={`px-6 py-3 border-b ${c.border} bg-slate-900/40`}>
        <p className="text-[10px] text-gray-500 mb-1">{algorithm.family}</p>
        <p className="text-xs text-gray-300 mb-2">{algorithm.summary}</p>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="text-emerald-400">Best: {algorithm.complexity.best}</span>
          <span className="text-amber-400">Average: {algorithm.complexity.average}</span>
          <span className="text-rose-400">Worst: {algorithm.complexity.worst}</span>
        </div>
      </div>

      {/* Tabs — Overview + Visualizer for all; searching adds exercises / real systems / variations */}
      <div className={`flex items-center gap-1 px-6 py-2 border-b ${c.border} bg-slate-900/20 overflow-x-auto`}>
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              data-testid={layerTabTestId(tab.id)}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                isActive
                  ? `${c.activeBg} ${c.text} border ${c.activeBorder}`
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              <TabIcon className="w-3 h-3" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <AnimatedTabPanel tabKey="overview" testId="algorithm-layer-panel-overview">
              <AlgorithmKnowledgePanel knowledge={algorithm} accentClass={c.text} />
            </AnimatedTabPanel>
          )}

          {activeTab === "visualizer" && (
            <AnimatedTabPanel tabKey="visualizer" testId="algorithm-layer-panel-visualizer">
              {renderDemo(category.id, algorithm.id)}
            </AnimatedTabPanel>
          )}

          {isSearching && activeTab === "exercises" && (
            <AnimatedTabPanel tabKey="exercises" testId="algorithm-layer-panel-exercises">
              <SearchMicroExercises />
            </AnimatedTabPanel>
          )}

          {isSearching && activeTab === "real-world" && algorithm.realWorld && (
            <AnimatedTabPanel tabKey="real-world" testId="algorithm-layer-panel-real-world">
              <RealWorldPanel mappings={algorithm.realWorld} algorithmName={algorithm.name} />
            </AnimatedTabPanel>
          )}

          {isSearching && activeTab === "variations" && algorithm.variations && (
            <AnimatedTabPanel tabKey="variations" testId="algorithm-layer-panel-variations">
              <VariationsPanel variations={algorithm.variations} algorithmName={algorithm.name} color={c} />
            </AnimatedTabPanel>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

function RealWorldPanel({ mappings, algorithmName }: Readonly<{ mappings: RealWorldMapping[]; algorithmName: string }>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Globe className="w-4 h-4 text-green-400" />
        <h3 className="text-sm font-bold text-white">Where {algorithmName} Lives in Real Systems</h3>
      </div>
      <p className="text-[11px] text-gray-400">
        Every algorithm maps to real infrastructure. Knowing where you&apos;ve already used it (even unknowingly) builds transferable intuition.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mappings.map((m) => (
          <div key={m.system} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <h4 className="text-xs font-bold text-green-300 mb-1.5">{m.system}</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">{m.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function VariationsPanel({
  variations,
  algorithmName,
  color,
}: Readonly<{
  variations: Variation[]
  algorithmName: string
  color: { bg: string; border: string; text: string; badge: string; activeBg: string; activeBorder: string; ring: string; glow: string }
}>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Layers className="w-4 h-4 text-green-400" />
        <h3 className="text-sm font-bold text-white">{algorithmName} Variations</h3>
      </div>
      <p className="text-[11px] text-gray-400">
        Master the base algorithm, then level up with these variations. Each builds a different muscle.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {variations.map((v) => {
          const ds = difficultyStyle[v.difficulty]
          return (
            <div key={v.name} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-xs font-bold ${color.text}`}>{v.name}</h4>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${ds.badge}`}>
                  <span className="text-[10px]">{ds.icon}</span>
                  {v.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">{v.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
