"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Cloud,
  Compass,
  Database,
  Folder,
  History,
  Mail,
  Search,
  Shield,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: LucideIcon;
  keywords: string[];
  featured?: boolean;
}

const RECENT_SEARCHES_KEY = "api-training-recent-searches";
const MAX_RECENT_SEARCHES = 5;
const MAX_SEARCH_RESULTS = 8;

const searchData: SearchResult[] = [
  {
    title: "Dashboard",
    description: "Browse every phase, premium unlocks, and your learning path.",
    href: "/dashboard",
    category: "Main",
    icon: BookOpen,
    keywords: ["dashboard", "overview", "progress", "learning path"],
    featured: true,
  },
  {
    title: "Phase 0: Fundamentals",
    description: "Start with callbacks, HTTP, VMs, and core programming building blocks.",
    href: "/phase-0",
    category: "Phase 0",
    icon: Terminal,
    keywords: ["phase 0", "fundamentals", "http", "algorithms", "callbacks", "git"],
    featured: true,
  },
  {
    title: "Phase 1: Integration Mindset",
    description: "Learn API categories, contracts, and the integration mental model.",
    href: "/phase-1",
    category: "Phase 1",
    icon: Brain,
    keywords: ["phase 1", "rest", "graphql", "grpc", "contracts", "mindset"],
    featured: true,
  },
  {
    title: "Phase 1: Categories",
    description: "Compare REST, GraphQL, gRPC, and event-driven interfaces.",
    href: "/phase-1/categories",
    category: "Phase 1",
    icon: Workflow,
    keywords: ["categories", "rest", "graphql", "grpc", "websocket", "event driven"],
  },
  {
    title: "Phase 2: Third-Party Integrations",
    description: "Work through auth flows, resilience, and production integration patterns.",
    href: "/phase-2",
    category: "Phase 2",
    icon: Zap,
    keywords: ["phase 2", "oauth", "jwt", "api keys", "resilience", "retry"],
    featured: true,
  },
  {
    title: "API Keys Demo",
    description: "Practice basic third-party authentication with API keys.",
    href: "/phase-2/demos/api-keys",
    category: "Phase 2",
    icon: Shield,
    keywords: ["api keys", "authentication", "demo", "security", "headers"],
  },
  {
    title: "OAuth2 Demo",
    description: "Step through a practical OAuth2 flow and token exchange.",
    href: "/phase-2/demos/oauth2",
    category: "Phase 2",
    icon: Shield,
    keywords: ["oauth", "oauth2", "authorization code", "tokens", "demo"],
  },
  {
    title: "Retry Logic Demo",
    description: "Explore retries, backoff, and transient failure handling.",
    href: "/phase-2/demos/retry",
    category: "Phase 2",
    icon: Zap,
    keywords: ["retry", "backoff", "resilience", "timeouts", "transient failures"],
  },
  {
    title: "Circuit Breaker Demo",
    description: "Understand how circuit breakers protect failing integrations.",
    href: "/phase-2/demos/circuit-breaker",
    category: "Phase 2",
    icon: Zap,
    keywords: ["circuit breaker", "fault tolerance", "resilience", "demo"],
  },
  {
    title: "Databases Overview",
    description: "Compare database choices and data-integration tradeoffs.",
    href: "/phase-2/databases",
    category: "Databases",
    icon: Database,
    keywords: ["databases", "postgresql", "sql", "nosql", "integration"],
  },
  {
    title: "PostgreSQL + Prisma",
    description: "Learn PostgreSQL integration patterns with Prisma.",
    href: "/phase-2/databases/postgresql",
    category: "Databases",
    icon: Database,
    keywords: ["postgresql", "postgres", "prisma", "orm", "schema", "database"],
    featured: true,
  },
  {
    title: "Phase 3: Inter-Service Communication",
    description: "Study microservices, async workflows, and service-to-service contracts.",
    href: "/phase-3",
    category: "Phase 3",
    icon: Workflow,
    keywords: ["phase 3", "microservices", "grpc", "kafka", "event driven", "communication"],
  },
  {
    title: "ORM Comparison",
    description: "Compare Prisma, TypeORM, Sequelize, and raw SQL tradeoffs.",
    href: "/phase-3/orms",
    category: "Phase 3",
    icon: Database,
    keywords: ["orms", "prisma", "typeorm", "sequelize", "raw sql", "database"],
  },
  {
    title: "Phase 4: Principal-Level Architecture",
    description: "Move from implementation to architecture and systems design thinking.",
    href: "/phase-4",
    category: "Phase 4",
    icon: Compass,
    keywords: ["phase 4", "architecture", "principal", "anti patterns", "contracts"],
  },
  {
    title: "Cloud Migration",
    description: "Plan AWS migrations, costs, and service choices.",
    href: "/cloud",
    category: "Cloud",
    icon: Cloud,
    keywords: ["cloud", "aws", "migration", "platform", "deployment"],
    featured: true,
  },
  {
    title: "AWS Services",
    description: "Explore core AWS services used in modern integrations.",
    href: "/cloud/aws/services",
    category: "Cloud",
    icon: Cloud,
    keywords: ["aws services", "ec2", "s3", "lambda", "api gateway"],
  },
  {
    title: "Migration Strategies",
    description: "Choose between lift-and-shift, re-platform, and refactor.",
    href: "/cloud/aws/strategies",
    category: "Cloud",
    icon: Cloud,
    keywords: ["migration strategies", "lift and shift", "re-platform", "refactor"],
  },
  {
    title: "AWS Migration Dashboard",
    description: "Use the planning dashboard to model migration decisions.",
    href: "/cloud/aws/migration",
    category: "Cloud",
    icon: Cloud,
    keywords: ["migration dashboard", "planning", "aws", "assessment"],
  },
  {
    title: "Security",
    description: "Review core API security practices, threats, and defenses.",
    href: "/cloud/security",
    category: "Security",
    icon: Shield,
    keywords: ["security", "owasp", "authentication", "authorization", "secrets", "tls"],
  },
  {
    title: "Vercel Platform",
    description: "See how the stack fits together for deployment and hosting.",
    href: "/cloud/vercel",
    category: "Cloud",
    icon: Cloud,
    keywords: ["vercel", "deployment", "hosting", "supabase", "platform"],
  },
  {
    title: "AI Learning",
    description: "Browse AI-focused training and platform-specific content.",
    href: "/ai",
    category: "AI",
    icon: Sparkles,
    keywords: ["ai", "learning", "artificial intelligence", "automation"],
  },
  {
    title: "AI Components",
    description: "Inspect the app's AI-oriented component examples.",
    href: "/ai/components",
    category: "AI",
    icon: Sparkles,
    keywords: ["ai components", "components", "examples", "ui"],
  },
  {
    title: "Architecture Docs",
    description: "View the architecture documentation and diagrams in the app.",
    href: "/docs/architecture",
    category: "Docs",
    icon: Folder,
    keywords: ["architecture", "docs", "diagrams", "system design"],
  },
  {
    title: "Observability Dashboard",
    description: "Inspect traces, errors, and live integration metrics.",
    href: "/observability",
    category: "Observability",
    icon: Zap,
    keywords: ["observability", "dashboard", "metrics", "tracing", "monitoring"],
  },
  {
    title: "Upgrade",
    description: "See premium access details and unlock the full curriculum.",
    href: "/upgrade",
    category: "Main",
    icon: Mail,
    keywords: ["upgrade", "premium", "pricing", "subscription"],
  },
];

function scoreResult(item: SearchResult, normalizedQuery: string) {
  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  const category = item.category.toLowerCase();
  const keywords = item.keywords.map((keyword) => keyword.toLowerCase());

  let score = 0;

  if (title === normalizedQuery) score += 120;
  if (title.startsWith(normalizedQuery)) score += 90;
  if (title.includes(normalizedQuery)) score += 55;
  if (category.includes(normalizedQuery)) score += 25;
  if (description.includes(normalizedQuery)) score += 20;

  for (const keyword of keywords) {
    if (keyword === normalizedQuery) score += 70;
    else if (keyword.startsWith(normalizedQuery)) score += 45;
    else if (keyword.includes(normalizedQuery)) score += 25;
  }

  if (item.featured) score += 5;

  return score;
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    Main: "bg-blue-500/10 text-blue-200 border-blue-500/20",
    "Phase 0": "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
    "Phase 1": "bg-cyan-500/10 text-cyan-200 border-cyan-500/20",
    "Phase 2": "bg-purple-500/10 text-purple-200 border-purple-500/20",
    "Phase 3": "bg-orange-500/10 text-orange-200 border-orange-500/20",
    "Phase 4": "bg-pink-500/10 text-pink-200 border-pink-500/20",
    Databases: "bg-amber-500/10 text-amber-200 border-amber-500/20",
    Cloud: "bg-sky-500/10 text-sky-200 border-sky-500/20",
    Security: "bg-rose-500/10 text-rose-200 border-rose-500/20",
    Docs: "bg-slate-500/10 text-slate-200 border-slate-500/20",
    AI: "bg-fuchsia-500/10 text-fuchsia-200 border-fuchsia-500/20",
    Observability: "bg-lime-500/10 text-lime-200 border-lime-500/20",
  };

  return colors[category] || "bg-slate-500/10 text-slate-200 border-slate-500/20";
}

export function PageSearch() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(RECENT_SEARCHES_KEY);
      if (!stored) return;

      const recentHrefs: string[] = JSON.parse(stored);
      const items = recentHrefs
        .map((href) => searchData.find((item) => item.href === href))
        .filter((item): item is SearchResult => Boolean(item));

      setRecentSearches(items);
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }

      if (!isEditable && event.key === "/") {
        event.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
        return;
      }

      if (!isOpen) return;

      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(-1);
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return searchData
      .map((item) => ({ item, score: scoreResult(item, normalizedQuery) }))
      .filter(({ score }) => score > 0)
      .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title))
      .slice(0, MAX_SEARCH_RESULTS)
      .map(({ item }) => item);
  }, [query]);

  const featuredResults = useMemo(
    () => searchData.filter((item) => item.featured).slice(0, 6),
    []
  );

  const visibleResults = query.trim() ? filteredResults : [...recentSearches, ...featuredResults.filter(
    (item) => !recentSearches.some((recent) => recent.href === item.href)
  )].slice(0, MAX_SEARCH_RESULTS);

  useEffect(() => {
    setSelectedIndex(visibleResults.length > 0 ? 0 : -1);
  }, [query, isOpen, visibleResults.length]);

  const persistRecentSearch = (href: string) => {
    const nextRecentHrefs = [href, ...recentSearches.map((item) => item.href).filter((itemHref) => itemHref !== href)]
      .slice(0, MAX_RECENT_SEARCHES);
    const nextRecentItems = nextRecentHrefs
      .map((itemHref) => searchData.find((item) => item.href === itemHref))
      .filter((item): item is SearchResult => Boolean(item));

    setRecentSearches(nextRecentItems);
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(nextRecentHrefs));
  };

  const handleSelect = (result: SearchResult) => {
    persistRecentSearch(result.href);
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
    router.push(result.href);
  };

  const handleResultKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || visibleResults.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((current) => (current < visibleResults.length - 1 ? current + 1 : current));
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((current) => (current > 0 ? current - 1 : 0));
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(visibleResults[selectedIndex]);
        }
        break;
      default:
        break;
    }
  };

  const hasRecentSearches = !query.trim() && recentSearches.length > 0;
  const hasFeaturedResults = !query.trim() && featuredResults.length > 0;

  return (
    <div className="relative w-full md:w-80" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search pages, phases, topics..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleResultKeyDown}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search pages, phases, topics"
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[11px] text-gray-500">
          <span className="hidden rounded border border-slate-600 px-1.5 py-0.5 md:inline">
            /
          </span>
          {(query || isOpen) && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
                setSelectedIndex(-1);
              }}
              className="text-gray-400 hover:text-white"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 max-h-[28rem] w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur">
          {visibleResults.length > 0 ? (
            <div className="py-2">
              {hasRecentSearches && (
                <div className="px-4 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Recent
                </div>
              )}

              {visibleResults.map((result, index) => {
                const Icon = result.icon;
                const isRecent = recentSearches.some((item) => item.href === result.href) && !query.trim();
                const showFeaturedDivider =
                  hasRecentSearches &&
                  !query.trim() &&
                  index === recentSearches.length &&
                  hasFeaturedResults;

                return (
                  <div key={result.href}>
                    {showFeaturedDivider && (
                      <div className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Featured Pages
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSelect(result)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                        index === selectedIndex ? "bg-slate-800" : "hover:bg-slate-800/70"
                      }`}
                    >
                      <div className="mt-0.5 rounded-lg bg-slate-800 p-2 text-blue-300">
                        {isRecent ? <History className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="truncate font-medium text-white">{result.title}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${getCategoryColor(result.category)}`}>
                            {result.category}
                          </span>
                          {isRecent && (
                            <span className="rounded-full border border-slate-600 px-2 py-0.5 text-[11px] text-slate-300">
                              Recent
                            </span>
                          )}
                        </div>
                        <p className="truncate text-sm text-gray-400">{result.description}</p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <ArrowRight className="mr-1 h-3 w-3" />
                          {result.href}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="px-4 py-8 text-center text-gray-400">
              <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="mt-1 text-sm">Try a phase name, topic, or integration pattern.</p>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              <BookOpen className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p className="font-medium">Quick Navigation</p>
              <p className="mt-1 text-sm">Use / or Cmd/Ctrl+K to jump anywhere in the app.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
