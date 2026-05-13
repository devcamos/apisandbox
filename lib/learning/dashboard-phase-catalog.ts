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
  title: "Fundamentals",
  description: "Essential building blocks: algorithms, data structures, callbacks, VMs, HTTP",
  topics: ["Callbacks & Async", "Data Structures", "VMs & EC2", "HTTP Basics", "Git", "Algorithms"],
  color: "from-green-500 to-emerald-500",
  href: "/phase-0",
  level: "Foundation",
  levelIcon: BookOpen,
  levelColor: "text-green-400",
  estimatedTime: "1-2 hours",
  skills: ["Callbacks", "Data Structures", "VMs", "HTTP", "Git Basics", "Algorithms"],
}

const corePhases: LearningPhase[] = [
  {
    id: 1,
    icon: Brain,
    title: "Integration Mindset",
    description: "Understand the 'why' behind integrations",
    topics: ["REST, GraphQL, gRPC", "OpenAPI & protobuf", "Loose coupling & idempotency"],
    color: "from-blue-500 to-cyan-500",
    href: "/phase-1",
    level: "Beginner",
    levelIcon: Star,
    levelColor: "text-green-400",
    estimatedTime: "2-3 hours",
    skills: ["API Fundamentals", "HTTP Methods", "JSON/XML", "Basic Authentication"],
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
  {
    id: 6,
    icon: Zap,
    title: "Algorithm Visualizer",
    description: "See algorithms in action with interactive 3D visualizations",
    topics: ["Sorting algorithms", "Search algorithms", "Graph traversals", "Decision checklists"],
    color: "from-indigo-500 to-purple-500",
    href: "/phase-6",
    level: "Practice",
    levelIcon: Target,
    levelColor: "text-indigo-400",
    estimatedTime: "2-3 hours",
    skills: ["Visual Reasoning", "Algorithm Selection", "Complexity Analysis", "Pattern Recognition"],
  },
  {
    id: 7,
    icon: Compass,
    title: "Monetisation",
    description: "Choose a path and start making money from software",
    topics: ["SaaS", "Digital products", "Freelancing", "API-as-a-product", "Marketplace", "Content"],
    color: "from-amber-500 to-orange-500",
    href: "/phase-7",
    level: "Applied",
    levelIcon: Target,
    levelColor: "text-amber-400",
    estimatedTime: "3-4 hours",
    skills: ["Business Models", "Stripe Integration", "Pricing Strategy", "MVP Scoping"],
  },
  {
    id: 8,
    icon: Brain,
    title: "Data Science in Production",
    description: "How ML models become production API features",
    topics: ["Model serving", "Data pipelines", "A/B testing", "Drift detection"],
    color: "from-purple-500 to-violet-500",
    href: "/phase-8",
    level: "Specialist",
    levelIcon: Target,
    levelColor: "text-violet-400",
    estimatedTime: "3-4 hours",
    skills: ["ML Serving", "Data Pipelines", "Experimentation", "ML Monitoring"],
  },
]

export function getLearningPhases(includeFundamentals: boolean): LearningPhase[] {
  return includeFundamentals ? [fundamentalsPhase, ...corePhases] : corePhases
}
