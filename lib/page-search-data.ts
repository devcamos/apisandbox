import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Brain,
  Cloud,
  Code,
  Compass,
  CreditCard,
  Database,
  Lock,
  LogIn,
  Shield,
  UserPlus,
  Zap,
} from "lucide-react";

export interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: LucideIcon;
  keywords: string[];
  featured?: boolean;
}

type SearchSeed = Omit<SearchResult, "category" | "icon">;

const MAIN_ICON = BookOpen;
const PHASE_ICON = Brain;
const CLOUD_ICON = Cloud;
const ACCOUNT_ICON = CreditCard;

const createSearchResults = (
  category: string,
  icon: LucideIcon,
  entries: SearchSeed[],
): SearchResult[] => entries.map((entry) => ({ ...entry, category, icon }));

const mainResults = createSearchResults("Main", MAIN_ICON, [
  {
    title: "Home",
    description: "Public landing page and course overview",
    href: "/",
    keywords: ["home", "landing", "overview", "welcome"],
    featured: true,
  },
  {
    title: "Start Learning",
    description: "Choose a learning path to begin exploring the platform",
    href: "/start",
    keywords: ["start", "learning path", "begin", "journey"],
    featured: true,
  },
  {
    title: "Dashboard",
    description: "Track learning progress and jump into each phase",
    href: "/dashboard",
    keywords: ["dashboard", "progress", "overview", "learning"],
    featured: true,
  },
]).concat(
  createSearchResults("Main", BarChart3, [
    {
      title: "Observability Dashboard",
      description: "View live metrics and platform observability examples",
      href: "/observability",
      keywords: ["observability", "metrics", "monitoring", "dashboard"],
    },
  ]),
);

const accountResults = createSearchResults("Account", ACCOUNT_ICON, [
  {
    title: "Upgrade",
    description: "Compare free and premium access",
    href: "/upgrade",
    keywords: ["upgrade", "premium", "pricing", "plan"],
    featured: true,
  },
]).concat(
  createSearchResults("Account", LogIn, [
    {
      title: "Sign In",
      description: "Access your saved account and progress",
      href: "/login",
      keywords: ["login", "sign in", "account", "auth"],
    },
  ]),
  createSearchResults("Account", UserPlus, [
    {
      title: "Sign Up",
      description: "Create a new account to save learning progress",
      href: "/signup",
      keywords: ["signup", "sign up", "register", "create account"],
    },
  ]),
);

const phaseResults = createSearchResults("Phase 0", MAIN_ICON, [
  {
    title: "Phase 0: Getting Started",
    description: "Introduction to API integration fundamentals",
    href: "/phase-0",
    keywords: ["phase 0", "fundamentals", "basics", "getting started"],
    featured: true,
  },
]).concat(
  createSearchResults("Phase 1", PHASE_ICON, [
    {
      title: "Phase 1: Integration Mindset",
      description: "Understand API categories, contracts, and core tradeoffs",
      href: "/phase-1",
      keywords: ["phase 1", "mindset", "rest", "graphql", "contracts"],
      featured: true,
    },
    {
      title: "Phase 1: Categories",
      description: "Explore different API styles and communication patterns",
      href: "/phase-1/categories",
      keywords: ["categories", "protocols", "api types", "phase 1"],
    },
  ]),
  createSearchResults("Phase 2", Zap, [
    {
      title: "Phase 2: Third-Party Integrations",
      description: "Authentication flows and resilience for external APIs",
      href: "/phase-2",
      keywords: ["phase 2", "third party", "oauth", "api keys", "retry"],
      featured: true,
    },
    {
      title: "Circuit Breaker Demo",
      description: "See the circuit breaker pattern in action",
      href: "/phase-2/demos/circuit-breaker",
      keywords: ["circuit breaker", "resilience", "fault tolerance", "demo"],
    },
    {
      title: "Retry Logic Demo",
      description: "Explore retry strategies for unreliable APIs",
      href: "/phase-2/demos/retry",
      keywords: ["retry", "resilience", "backoff", "demo"],
    },
  ]),
  createSearchResults("Phase 2", Lock, [
    {
      title: "API Keys Demo",
      description: "Learn API key authentication and secure usage patterns",
      href: "/phase-2/demos/api-keys",
      keywords: ["api keys", "authentication", "demo", "security"],
    },
    {
      title: "OAuth2 Demo",
      description: "Walk through an OAuth2 flow with interactive examples",
      href: "/phase-2/demos/oauth2",
      keywords: ["oauth", "oauth2", "authentication", "authorization", "demo"],
      featured: true,
    },
  ]),
  createSearchResults("Phase 2", Database, [
    {
      title: "Phase 2: Databases",
      description: "Compare database technologies used in integration work",
      href: "/phase-2/databases",
      keywords: ["databases", "postgresql", "storage", "phase 2"],
    },
  ]),
  createSearchResults("Databases", Database, [
    {
      title: "PostgreSQL + Prisma",
      description: "Learn how PostgreSQL and Prisma fit into the stack",
      href: "/phase-2/databases/postgresql",
      keywords: ["postgresql", "postgres", "prisma", "orm", "sql"],
      featured: true,
    },
  ]),
  createSearchResults("Phase 3", Code, [
    {
      title: "Phase 3: Inter-Service Communication",
      description: "Microservices, gRPC, and event-driven communication",
      href: "/phase-3",
      keywords: ["phase 3", "microservices", "grpc", "events"],
      featured: true,
    },
    {
      title: "Phase 3: ORMs",
      description: "Review ORM tradeoffs and data access patterns",
      href: "/phase-3/orms",
      keywords: ["orm", "prisma", "typeorm", "sequelize", "sql"],
    },
  ]),
  createSearchResults("Phase 4", PHASE_ICON, [
    {
      title: "Phase 4: Principal-Level Architecture",
      description: "Advanced patterns, scaling concerns, and design tradeoffs",
      href: "/phase-4",
      keywords: ["phase 4", "architecture", "principal", "advanced"],
      featured: true,
    },
  ]),
);

const cloudResults = createSearchResults("Cloud", CLOUD_ICON, [
  {
    title: "Cloud Migration",
    description: "AWS migration strategies, tooling, and planning",
    href: "/cloud",
    keywords: ["cloud", "aws", "migration", "infrastructure"],
    featured: true,
  },
  {
    title: "AWS Services",
    description: "Overview of key AWS services used in integrations",
    href: "/cloud/aws/services",
    keywords: ["aws", "services", "ec2", "s3", "lambda"],
  },
  {
    title: "Migration Strategies",
    description: "Compare lift-and-shift, re-platform, and refactor paths",
    href: "/cloud/aws/strategies",
    keywords: ["migration", "strategies", "lift and shift", "refactor"],
  },
  {
    title: "AWS Migration Dashboard",
    description: "Use interactive migration planning tools",
    href: "/cloud/aws/migration",
    keywords: ["migration", "dashboard", "planning", "aws"],
  },
]).concat(
  createSearchResults("Cloud", Zap, [
    {
      title: "Vercel Platform",
      description: "Deployment guidance for Vercel, Prisma, and serverless apps",
      href: "/cloud/vercel",
      keywords: ["vercel", "deployment", "serverless", "prisma"],
    },
  ]),
  createSearchResults("Security", Shield, [
    {
      title: "Security",
      description: "Security practices for modern API integrations",
      href: "/cloud/security",
      keywords: ["security", "owasp", "tls", "headers", "secrets"],
      featured: true,
    },
  ]),
);

const aiAndDocsResults = createSearchResults("AI", PHASE_ICON, [
  {
    title: "AI Learning",
    description: "AI-powered learning content and guided exploration",
    href: "/ai",
    keywords: ["ai", "learning", "automation", "assistance"],
    featured: true,
  },
  {
    title: "AI Components",
    description: "Explore AI-focused components and examples",
    href: "/ai/components",
    keywords: ["ai", "components", "examples", "features"],
  },
]).concat(
  createSearchResults("Docs", Code, [
    {
      title: "Architecture Documentation",
      description: "Interactive architecture diagrams for the platform",
      href: "/docs/architecture",
      keywords: ["architecture", "docs", "diagrams", "system design"],
    },
  ]),
);

export const searchData: SearchResult[] = [
  ...mainResults,
  ...accountResults,
  ...phaseResults,
  ...cloudResults,
  ...aiAndDocsResults,
];

const normalize = (value: string) => value.trim().toLowerCase();

export function getFeaturedResults(limit = 6): SearchResult[] {
  return searchData.filter((item) => item.featured).slice(0, limit);
}

export function findSearchResultByHref(href: string): SearchResult | undefined {
  return searchData.find((item) => item.href === href);
}

export function searchPages(query: string, limit = 8): SearchResult[] {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [];
  }

  return searchData
    .map((item) => {
      const haystack = [
        item.title.toLowerCase(),
        item.description.toLowerCase(),
        item.category.toLowerCase(),
        ...item.keywords.map((keyword) => keyword.toLowerCase()),
      ];

      let score = 0;

      if (item.title.toLowerCase() === normalizedQuery) {
        score += 100;
      }
      if (item.title.toLowerCase().startsWith(normalizedQuery)) {
        score += 40;
      }
      if (item.title.toLowerCase().includes(normalizedQuery)) {
        score += 20;
      }
      if (item.keywords.some((keyword) => keyword.toLowerCase() === normalizedQuery)) {
        score += 30;
      }
      if (item.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery))) {
        score += 15;
      }
      if (item.description.toLowerCase().includes(normalizedQuery)) {
        score += 10;
      }
      if (item.category.toLowerCase().includes(normalizedQuery)) {
        score += 5;
      }

      return {
        item,
        score,
        matched: haystack.some((value) => value.includes(normalizedQuery)),
      };
    })
    .filter((entry) => entry.matched)
    .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title))
    .slice(0, limit)
    .map((entry) => entry.item);
}
