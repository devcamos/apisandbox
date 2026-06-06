import {
  BrainCircuit,
  Cloud,
  DollarSign,
  Database,
  Plug,
  Network,
  Compass,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { getLearningPhases, type LearningPhase } from "@/lib/learning/dashboard-phase-catalog"

export interface PremiumFeatureHighlight {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

export interface PremiumSectionHighlight {
  id: string
  title: string
  description: string
  href: string
  topics: string[]
  icon: LucideIcon
  color: string
}

const extendedPhases: LearningPhase[] = [
  {
    id: 6,
    icon: Sparkles,
    title: "Algorithm Visualizer",
    description: "Interactive study guides for sorting, search, and graph algorithms",
    topics: ["Framer Motion demos", "GSAP animations", "Pattern constraints"],
    color: "from-fuchsia-500 to-violet-600",
    href: "/phase-6",
    level: "Practice",
    levelIcon: Sparkles,
    levelColor: "text-fuchsia-400",
    estimatedTime: "3-4 hours",
    skills: ["Visual learning", "Complexity intuition", "Algorithm patterns"],
  },
  {
    id: 7,
    icon: DollarSign,
    title: "Monetisation Paths",
    description: "Turn APIs into revenue with SaaS, usage billing, and platform models",
    topics: ["SaaS subscriptions", "Usage-based billing", "API marketplaces"],
    color: "from-amber-500 to-orange-500",
    href: "/phase-7",
    level: "Business",
    levelIcon: DollarSign,
    levelColor: "text-amber-400",
    estimatedTime: "2-3 hours",
    skills: ["Pricing", "Stripe", "Freemium"],
  },
  {
    id: 8,
    icon: Database,
    title: "Data Science in Production",
    description: "Ship ML and data pipelines with the same rigor as production APIs",
    topics: ["Feature stores", "Model serving", "Experimentation"],
    color: "from-indigo-500 to-violet-500",
    href: "/phase-8",
    level: "Advanced",
    levelIcon: Database,
    levelColor: "text-indigo-400",
    estimatedTime: "3-4 hours",
    skills: ["ML Ops", "Pipelines", "Monitoring"],
  },
  {
    id: 9,
    icon: Database,
    title: "Database Fundamentals",
    description: "SQL vs NoSQL, ACID, joins, indexes, transactions, pooling, migrations, and replicas",
    topics: ["ACID / BASE", "Joins & indexes", "Transactions", "Connection pooling", "Read replicas"],
    color: "from-teal-500 to-cyan-600",
    href: "/phase-9",
    level: "Foundation+",
    levelIcon: Database,
    levelColor: "text-teal-400",
    estimatedTime: "3-4 hours",
    skills: ["Schema design", "Query tuning", "Migrations", "Replication"],
  },
]

/** Phases that require Premium (2–9). */
export function getPremiumLearningPhases(): LearningPhase[] {
  const all = getLearningPhases(true)
  return all.filter((p) => p.id >= 2)
}

export function getPremiumCatalogPhases(): LearningPhase[] {
  const core = getLearningPhases(false).filter((p) => p.id >= 2)
  return [...core, ...extendedPhases]
}

export function getPhaseCatalogEntry(
  phaseNumber: number,
): LearningPhase | undefined {
  return getPremiumCatalogPhases().find((p) => p.id === phaseNumber)
}

export const premiumAppSections: PremiumSectionHighlight[] = [
  {
    id: "cloud",
    title: "Cloud & migration",
    description: "AWS, Vercel, and security guides for production deployments",
    href: "/cloud/aws/services",
    topics: ["AWS services", "Vercel platform", "Security hardening"],
    icon: Cloud,
    color: "from-sky-500 to-blue-500",
  },
  {
    id: "ai",
    title: "AI learning",
    description: "LLM patterns, components, and integration architecture",
    href: "/ai",
    topics: ["AI components", "Prompt design", "Production guardrails"],
    icon: BrainCircuit,
    color: "from-violet-500 to-fuchsia-500",
  },
]

export const premiumFeatureHighlights: PremiumFeatureHighlight[] = [
  {
    id: "visualisers",
    title: "Interactive visualisers",
    description: "Step-through algorithm and integration demos",
    icon: Sparkles,
  },
  {
    id: "progress",
    title: "Shinobi progress board",
    description: "XP, quizzes, and phase completion tracking",
    icon: Compass,
  },
  {
    id: "assistant",
    title: "Learning assistant",
    description: "Context-aware help on premium learning routes",
    icon: BrainCircuit,
  },
]

export const premiumPhaseIcons: Record<number, LucideIcon> = {
  2: Plug,
  3: Network,
  4: Compass,
  5: BrainCircuit,
  7: DollarSign,
  8: Database,
}
