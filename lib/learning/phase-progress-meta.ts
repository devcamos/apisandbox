export interface PhaseProgressMeta {
  phaseNumber: number
  title: string
  href: string
  color: string
}

export const phaseProgressMeta: PhaseProgressMeta[] = [
  { phaseNumber: 0, title: "Getting Started", href: "/phase-0", color: "from-green-500 to-emerald-500" },
  { phaseNumber: 1, title: "Integration Mindset", href: "/phase-1", color: "from-blue-500 to-cyan-500" },
  { phaseNumber: 2, title: "Third-Party Integrations", href: "/phase-2", color: "from-purple-500 to-pink-500" },
  { phaseNumber: 3, title: "Inter-Service Communication", href: "/phase-3", color: "from-orange-500 to-red-500" },
  { phaseNumber: 4, title: "Principal Architecture", href: "/phase-4", color: "from-emerald-500 to-cyan-500" },
  { phaseNumber: 5, title: "API Algorithms", href: "/phase-5", color: "from-cyan-500 to-blue-500" },
  { phaseNumber: 6, title: "Algorithm Visualizer", href: "/phase-6", color: "from-fuchsia-500 to-violet-600" },
  { phaseNumber: 7, title: "Monetisation Paths", href: "/phase-7", color: "from-amber-500 to-orange-500" },
  { phaseNumber: 8, title: "Data Science in Production", href: "/phase-8", color: "from-indigo-500 to-violet-500" },
  { phaseNumber: 9, title: "Database Fundamentals", href: "/phase-9", color: "from-teal-500 to-cyan-600" },
]
