"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, BookOpen, Cloud, Brain, Database, Zap, Code, CreditCard, Mail, Folder } from 'lucide-react';

interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: any;
  keywords: string[];
}

const searchData: SearchResult[] = [
  // Main Pages
  {
    title: "Home",
    description: "Welcome to API Integration Training",
    href: "/",
    category: "Main",
    icon: BookOpen,
    keywords: ["home", "welcome", "start", "getting started"]
  },
  {
    title: "Dashboard",
    description: "Your learning progress and achievements",
    href: "/dashboard",
    category: "Main",
    icon: BookOpen,
    keywords: ["dashboard", "progress", "achievements", "overview"]
  },

  // Phases
  {
    title: "Phase 0: Getting Started",
    description: "Introduction to API integration fundamentals",
    href: "/phase-0",
    category: "Phase 0",
    icon: BookOpen,
    keywords: ["phase 0", "getting started", "introduction", "basics", "fundamentals"]
  },
  {
    title: "Phase 1: Integration Mindset",
    description: "Understanding API categories and contract styles",
    href: "/phase-1",
    category: "Phase 1",
    icon: Brain,
    keywords: ["phase 1", "mindset", "categories", "rest", "graphql", "contract", "styles"]
  },
  {
    title: "Phase 1: Categories",
    description: "Explore different API categories",
    href: "/phase-1/categories",
    category: "Phase 1",
    icon: Brain,
    keywords: ["phase 1", "categories", "api types", "protocols"]
  },
  {
    title: "Phase 2: Third-Party Integrations",
    description: "Authentication flows and resilience patterns",
    href: "/phase-2",
    category: "Phase 2",
    icon: Zap,
    keywords: ["phase 2", "integrations", "third party", "authentication", "oauth", "jwt", "resilience", "circuit breaker", "retry"]
  },
  {
    title: "Phase 2: API Keys",
    description: "Learn about API key authentication",
    href: "/phase-2/demos/api-keys",
    category: "Phase 2",
    icon: Zap,
    keywords: ["api keys", "authentication", "security", "keys", "demo"]
  },
  {
    title: "Phase 2: Circuit Breaker",
    description: "Implement circuit breaker pattern for resilience",
    href: "/phase-2/demos/circuit-breaker",
    category: "Phase 2",
    icon: Zap,
    keywords: ["circuit breaker", "resilience", "fault tolerance", "pattern", "demo"]
  },
  {
    title: "Phase 2: OAuth2",
    description: "OAuth2 authentication flow implementation",
    href: "/phase-2/demos/oauth2",
    category: "Phase 2",
    icon: Zap,
    keywords: ["oauth", "oauth2", "authentication", "flow", "demo"]
  },
  {
    title: "Phase 2: JWT",
    description: "Decode and explore JSON Web Tokens",
    href: "/phase-2/demos/jwt",
    category: "Phase 2",
    icon: Zap,
    keywords: ["jwt", "token", "json web token", "authentication", "bearer", "demo"]
  },
  {
    title: "Phase 2: Retry Logic",
    description: "Implement retry patterns for API calls",
    href: "/phase-2/demos/retry",
    category: "Phase 2",
    icon: Zap,
    keywords: ["retry", "logic", "patterns", "resilience", "demo"]
  },
  {
    title: "Phase 2: Databases",
    description: "Database technologies and integration",
    href: "/phase-2/databases",
    category: "Phase 2",
    icon: Database,
    keywords: ["databases", "postgresql", "mongodb", "redis", "sqlite"]
  },
  {
    title: "PostgreSQL + Prisma",
    description: "Learn PostgreSQL with Prisma ORM",
    href: "/phase-2/databases/postgresql",
    category: "Databases",
    icon: Database,
    keywords: ["postgresql", "postgres", "prisma", "orm", "sql", "relational"]
  },
  {
    title: "MongoDB",
    description: "Document database for modern applications",
    href: "/phase-2/databases/mongodb",
    category: "Databases",
    icon: Database,
    keywords: ["mongodb", "mongo", "nosql", "document", "database"]
  },
  {
    title: "Redis",
    description: "In-memory data structure store",
    href: "/phase-2/databases/redis",
    category: "Databases",
    icon: Database,
    keywords: ["redis", "cache", "memory", "data structure", "pubsub"]
  },
  {
    title: "SQLite",
    description: "Self-contained SQL database",
    href: "/phase-2/databases/sqlite",
    category: "Databases",
    icon: Database,
    keywords: ["sqlite", "embedded", "sql", "lightweight"]
  },
  {
    title: "Phase 3: Inter-Service Communication",
    description: "Microservices, gRPC, and event-driven architecture",
    href: "/phase-3",
    category: "Phase 3",
    icon: Code,
    keywords: ["phase 3", "microservices", "grpc", "kafka", "event driven", "communication"]
  },
  {
    title: "Phase 3: ORMs",
    description: "Object-Relational Mapping frameworks",
    href: "/phase-3/orms",
    category: "Phase 3",
    icon: Code,
    keywords: ["orm", "prisma", "typeorm", "sequelize", "raw sql", "database"]
  },
  {
    title: "Prisma ORM",
    description: "Next-generation type-safe ORM",
    href: "/phase-3/orms/prisma",
    category: "ORMs",
    icon: Code,
    keywords: ["prisma", "orm", "typescript", "type safe", "schema"]
  },
  {
    title: "TypeORM",
    description: "Feature-rich ORM with decorators",
    href: "/phase-3/orms/typeorm",
    category: "ORMs",
    icon: Code,
    keywords: ["typeorm", "orm", "decorators", "enterprise"]
  },
  {
    title: "Sequelize",
    description: "Promise-based ORM for Node.js",
    href: "/phase-3/orms/sequelize",
    category: "ORMs",
    icon: Code,
    keywords: ["sequelize", "orm", "promise", "node"]
  },
  {
    title: "Raw SQL",
    description: "Direct SQL queries without ORM abstraction",
    href: "/phase-3/orms/raw-sql",
    category: "ORMs",
    icon: Code,
    keywords: ["raw sql", "direct", "queries", "performance", "control"]
  },
  {
    title: "Phase 4: Principal-Level Architecture",
    description: "Advanced patterns and anti-patterns",
    href: "/phase-4",
    category: "Phase 4",
    icon: Brain,
    keywords: ["phase 4", "architecture", "patterns", "anti-patterns", "principal", "advanced"]
  },
  {
    title: "Phase 5: API Algorithms",
    description: "LeetCode concepts mapped to production API system design",
    href: "/phase-5",
    category: "Phase 5",
    icon: Brain,
    keywords: ["phase 5", "api algorithms", "leetcode", "theory", "caching", "rate limiter", "idempotency", "queue", "trade-offs"]
  },

  // Cloud Section
  {
    title: "Cloud Migration",
    description: "AWS cloud migration strategies and tools",
    href: "/cloud",
    category: "Cloud",
    icon: Cloud,
    keywords: ["cloud", "aws", "migration", "deployment", "infrastructure"]
  },
  {
    title: "AWS Services",
    description: "Overview of AWS services for integration",
    href: "/cloud/aws/services",
    category: "Cloud",
    icon: Cloud,
    keywords: ["aws", "services", "ec2", "s3", "lambda", "api gateway"]
  },
  {
    title: "Migration Strategies",
    description: "Lift-and-shift, re-platform, and refactor approaches",
    href: "/cloud/aws/strategies",
    category: "Cloud",
    icon: Cloud,
    keywords: ["migration", "strategies", "lift shift", "replatform", "refactor"]
  },
  {
    title: "AWS Migration Dashboard",
    description: "Interactive tools for migration planning",
    href: "/cloud/aws/migration",
    category: "Cloud",
    icon: Cloud,
    keywords: ["migration", "dashboard", "planning", "tools", "interactive"]
  },

  // AI Section
  {
    title: "AI Learning",
    description: "AI-powered learning and assistance",
    href: "/ai",
    category: "AI",
    icon: Brain,
    keywords: ["ai", "artificial intelligence", "learning", "assistance", "automation"]
  },
  {
    title: "AI Components",
    description: "Explore AI-powered components",
    href: "/ai/components",
    category: "AI",
    icon: Brain,
    keywords: ["ai", "components", "powered", "features"]
  },

  // Vercel Platform
  {
    title: "Vercel Platform",
    description: "Modern deployment with Vercel, Supabase, and Prisma",
    href: "/cloud/vercel",
    category: "Cloud",
    icon: Zap,
    keywords: ["vercel", "supabase", "prisma", "deployment", "serverless", "database", "orm", "connection pooling"]
  },

  // Payment Integration
  {
    title: "Stripe Payments",
    description: "Payment processing integration with Stripe",
    href: "/phase-2",
    category: "Phase 2",
    icon: CreditCard,
    keywords: ["stripe", "payments", "checkout", "subscriptions", "webhooks", "billing"]
  },

  // Email Integration
  {
    title: "Resend Email",
    description: "Email integration with Resend",
    href: "/phase-2",
    category: "Phase 2",
    icon: Mail,
    keywords: ["resend", "email", "transactional", "templates", "smtp"]
  },

  // File Storage
  {
    title: "File Storage",
    description: "File storage integration (S3, R2, Vercel Blob)",
    href: "/phase-2",
    category: "Phase 2",
    icon: Folder,
    keywords: ["storage", "s3", "r2", "vercel blob", "file upload", "object storage"]
  }
];

export function PageSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setQuery('');
      setIsOpen(false);
      router.push(result.href);
    },
    [router],
  );

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase())) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8); // Limit to 8 results

    setResults(filtered);
    setSelectedIndex(-1);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => prev < results.length - 1 ? prev + 1 : prev);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSelect, isOpen, results, selectedIndex]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Main': 'bg-blue-100 text-blue-800',
      'Phase 0': 'bg-green-100 text-green-800',
      'Phase 1': 'bg-purple-100 text-purple-800',
      'Phase 2': 'bg-yellow-100 text-yellow-800',
      'Phase 3': 'bg-red-100 text-red-800',
      'Phase 4': 'bg-indigo-100 text-indigo-800',
      'Phase 5': 'bg-sky-100 text-sky-800',
      'Cloud': 'bg-cyan-100 text-cyan-800',
      'AI': 'bg-pink-100 text-pink-800',
      'Databases': 'bg-orange-100 text-orange-800',
      'ORMs': 'bg-teal-100 text-teal-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search pages, phases, topics..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full max-w-sm pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.href}
                  onClick={() => handleSelect(result)}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-700 flex items-start space-x-3 transition-colors ${
                    index === selectedIndex ? 'bg-slate-700' : ''
                  }`}
                >
                  <result.icon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-medium truncate">{result.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}>
                        {result.category}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">{result.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <ArrowRight className="w-3 h-3 mr-1" />
                      {result.href}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="px-4 py-8 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for phases, topics, or page names</p>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium">Quick Navigation</p>
              <p className="text-sm mt-1">Search for phases, topics, or specific pages</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
