import {
  Brain,
  Plug,
  Network,
  Compass,
  Star,
  Shield,
  Zap,
  Target,
  GraduationCap,
  BookOpen,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react"

export interface LearningPhase {
  id: number
  icon: LucideIcon
  title: string
  description: string
  topics: string[]
  color: string
  href: string
  level: string
  levelIcon: LucideIcon
  levelColor: string
  estimatedTime: string
  skills: string[]
}

const fundamentalsPhase: LearningPhase = {
  id: 0,
  icon: GraduationCap,
  title: "First Principles: Program to Network",
  description: "Build the causal model from code and state to machines, ports, DNS, TCP, and TLS.",
  topics: ["Programs & Async", "Processes & Ports", "DNS & IP", "TCP & TLS"],
  color: "from-green-500 to-emerald-500",
  href: "/learn/api-foundations/programs-and-state",
  level: "Foundation",
  levelIcon: BookOpen,
  levelColor: "text-green-400",
  estimatedTime: "2-3 hours",
  skills: ["Program State", "Async Work", "Processes", "Network Path"],
}

const corePhases: LearningPhase[] = [
  {
    id: 1,
    icon: Brain,
    title: "First Principles: HTTP to Integration",
    description: "Turn the network path into clear HTTP messages, contracts, and dependable integrations.",
    topics: ["HTTP Messages", "JSON Contracts", "Validation", "Timeouts & Retries"],
    color: "from-blue-500 to-cyan-500",
    href: "/learn/api-foundations/http-messages",
    level: "Beginner",
    levelIcon: Star,
    levelColor: "text-green-400",
    estimatedTime: "2-3 hours",
    skills: ["HTTP Semantics", "API Contracts", "Authentication", "Observability"],
  },
  {
    id: 2,
    icon: Plug,
    title: "Third-Party Integrations",
    description: "Safely connect and maintain external APIs",
    topics: ["OAuth2 & JWTs", "Resilience patterns", "Data transformation"],
    color: "from-purple-500 to-pink-500",
    href: "/phase-2",
    level: "Intermediate",
    levelIcon: Shield,
    levelColor: "text-blue-400",
    estimatedTime: "3-4 hours",
    skills: ["OAuth2", "JWT Tokens", "Rate Limiting", "Error Handling"],
  },
  {
    id: 3,
    icon: Network,
    title: "Inter-Service Communication",
    description: "Master service-to-service patterns",
    topics: ["Sync vs async", "Event-driven with Kafka", "Distributed tracing"],
    color: "from-orange-500 to-red-500",
    href: "/phase-3",
    level: "Advanced",
    levelIcon: Zap,
    levelColor: "text-orange-400",
    estimatedTime: "4-5 hours",
    skills: ["Microservices", "Event Streaming", "Circuit Breakers", "Distributed Tracing"],
  },
  {
    id: 4,
    icon: Compass,
    title: "Principal-Level Architecture",
    description: "Think like an integration architect",
    topics: ["Constraint-driven design", "API algorithmic thinking", "Anti-patterns", "Contract testing"],
    color: "from-green-500 to-emerald-500",
    href: "/phase-4",
    level: "Expert",
    levelIcon: Target,
    levelColor: "text-purple-400",
    estimatedTime: "5-6 hours",
    skills: ["Constraint Analysis", "System Design", "Algorithmic Reasoning", "Trade-off Reasoning", "Legacy Migration"],
  },
  {
    id: 5,
    icon: BrainCircuit,
    title: "API Algorithms",
    description: "Master theory by mapping algorithmic thinking to production system design",
    topics: ["Idempotency & hash maps", "Priority queues", "Rate limiting windows", "Trade-off analysis"],
    color: "from-cyan-500 to-blue-500",
    href: "/phase-5",
    level: "Architect",
    levelIcon: Target,
    levelColor: "text-cyan-300",
    estimatedTime: "4-5 hours",
    skills: ["Algorithmic Reasoning", "Failure Modeling", "Performance Trade-offs", "Architecture Decisions"],
  },
]

export function getLearningPhases(includeFundamentals: boolean): LearningPhase[] {
  return includeFundamentals ? [fundamentalsPhase, ...corePhases] : corePhases
}
