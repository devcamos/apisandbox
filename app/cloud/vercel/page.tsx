"use client";

import ConceptCard from "@/components/ConceptCard";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { ExpandableCodeBlock } from "@/components/HighlightedCodeBlock"
import Link from "next/link";
import { 
  Zap, 
  Database, 
  Code, 
  Globe, 
  BarChart3, 
  Shield,
  Home,
  ArrowRight 
} from "lucide-react";

export default function VercelPage() {
  return (
    <SubscriptionGate phaseNumber="cloud" lockedContentName="Vercel Platform">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-gray-900 py-16">
          <div className="container mx-auto px-6">
            <nav className="flex items-center gap-2 mb-6 text-sm">
              <Link href="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <span className="text-white/50">/</span>
              <Link href="/cloud" className="text-white/70 hover:text-white transition-colors">Cloud</Link>
              <span className="text-white/50">/</span>
              <span className="text-white font-semibold">Vercel Platform</span>
            </nav>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Vercel Platform</h1>
                <p className="text-xl text-white/90 mt-2">
                  Modern deployment platform for Next.js and serverless applications
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Goal Section */}
          <div className="bg-black/50 border border-gray-700 rounded-xl p-6 mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">🎯 Learning Goal</h2>
            <p className="text-gray-300 text-lg">
              Master Vercel deployment platform and understand how it integrates with Supabase (database) 
              and Prisma (ORM) to build modern, scalable applications. Learn the 20% that covers 80% of use cases.
            </p>
          </div>

          {/* Core Stack */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">The Modern Stack: Vercel + Supabase + Prisma</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Vercel */}
              <ConceptCard
                icon={Zap}
                title="Vercel"
                description="Deployment platform for Next.js and serverless functions"
                items={[
                  "Zero-config deployments",
                  "Automatic scaling",
                  "Global CDN",
                  "Preview deployments"
                ]}
                color="from-black to-gray-800"
                documentation={{
                  overview: "Vercel is the platform for frontend developers. It provides the best developer experience for deploying Next.js applications with zero configuration.",
                  description: [
                    "Automatic deployments from Git (GitHub, GitLab, Bitbucket)",
                    "Preview deployments for every pull request",
                    "Global edge network (CDN) for fast content delivery",
                    "Serverless functions for API routes",
                    "Built-in analytics and monitoring",
                    "Automatic HTTPS/SSL certificates"
                  ],
                  useCases: [
                    "Next.js applications",
                    "React applications",
                    "Static websites",
                    "Serverless APIs",
                    "Full-stack applications",
                    "Jamstack sites"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "Free tier: 100GB bandwidth, 1M function invocations/month",
                      "Automatic deployments on git push",
                      "Preview URLs for every PR",
                      "Environment variables in dashboard",
                      "Serverless functions = API routes in Next.js"
                    ]
                  },
                  bestFor: [
                    "Next.js applications",
                    "Modern React apps",
                    "Static site generation",
                    "Serverless backends"
                  ],
                  notIdealFor: [
                    "Long-running processes (>5 min free, >13 min pro)",
                    "Persistent connections (use connection pooling)",
                    "Traditional server applications",
                    "When you need full server control"
                  ]
                }}
              />

              {/* Supabase */}
              <ConceptCard
                icon={Database}
                title="Supabase"
                description="Open-source Firebase alternative with PostgreSQL database"
                items={[
                  "PostgreSQL database",
                  "Real-time subscriptions",
                  "Authentication",
                  "Storage and Edge Functions"
                ]}
                color="from-green-500 to-emerald-600"
                documentation={{
                  overview: "Supabase is an open-source Firebase alternative. It provides a PostgreSQL database, authentication, real-time subscriptions, and storage.",
                  description: [
                    "PostgreSQL database (managed)",
                    "Built-in authentication (email, OAuth, magic links)",
                    "Real-time subscriptions (listen to database changes)",
                    "Storage (file uploads)",
                    "Edge Functions (serverless functions)",
                    "Auto-generated REST and GraphQL APIs"
                  ],
                  useCases: [
                    "Full-stack applications",
                    "Real-time applications",
                    "SaaS applications",
                    "Mobile app backends",
                    "Authentication systems",
                    "File storage"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "Free tier: 500MB database, unlimited API requests",
                      "Connection pooling: Use port 6543 (pgbouncer)",
                      "Real-time: Subscribe to database changes",
                      "Auth: Built-in user management",
                      "Storage: S3-compatible object storage"
                    ]
                  },
                  bestFor: [
                    "PostgreSQL databases",
                    "Real-time features",
                    "Authentication needs",
                    "Rapid prototyping"
                  ],
                  notIdealFor: [
                    "NoSQL databases (use MongoDB Atlas)",
                    "Complex enterprise requirements",
                    "When you need full database control",
                    "Very large scale (consider AWS RDS)"
                  ]
                }}
              />

              {/* Prisma */}
              <ConceptCard
                icon={Code}
                title="Prisma"
                description="Next-generation ORM for TypeScript and Node.js"
                items={[
                  "Type-safe database access",
                  "Auto-generated types",
                  "Migration management",
                  "Connection pooling"
                ]}
                color="from-blue-500 to-cyan-600"
                documentation={{
                  overview: "Prisma is a next-generation ORM that makes database access easy and type-safe. It provides an intuitive API and generates TypeScript types automatically.",
                  description: [
                    "Type-safe database queries (TypeScript)",
                    "Auto-generated types from schema",
                    "Migration management (version control for database)",
                    "Connection pooling (essential for serverless)",
                    "Query builder (Prisma Client)",
                    "Database introspection (reverse engineering)"
                  ],
                  useCases: [
                    "TypeScript/Node.js applications",
                    "Next.js applications",
                    "Serverless functions",
                    "API backends",
                    "Full-stack applications",
                    "When you want type safety"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "Schema = database structure (prisma/schema.prisma)",
                      "Client = database access (prisma.user.findMany())",
                      "Migrations = database changes (npx prisma migrate)",
                      "Connection pooling = automatic with Prisma",
                      "Types = auto-generated from schema"
                    ]
                  },
                  bestFor: [
                    "TypeScript projects",
                    "Type-safe database access",
                    "Rapid development",
                    "Serverless architectures"
                  ],
                  notIdealFor: [
                    "Complex raw SQL queries",
                    "When you need full SQL control",
                    "Very simple projects (use raw SQL)",
                    "Non-TypeScript projects"
                  ]
                }}
              />
            </div>
          </section>

          {/* Integration Guide */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">How They Work Together</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">1. Vercel (Deployment)</h3>
                  <p className="text-gray-300 mb-2">
                    Deploys your Next.js application with serverless functions for API routes.
                  </p>
                  <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
                    <ExpandableCodeBlock code={`// app/api/users/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json(users)
}`} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">2. Supabase (Database)</h3>
                  <p className="text-gray-300 mb-2">
                    Provides PostgreSQL database with connection pooling for serverless functions.
                  </p>
                  <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
                    <ExpandableCodeBlock code={`// .env
DATABASE_URL="postgresql://user:pass@db.xxx.supabase.co:6543/db?pgbouncer=true"
// Port 6543 = connection pooler (essential for serverless)`} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3">3. Prisma (ORM)</h3>
                  <p className="text-gray-300 mb-2">
                    Provides type-safe database access with automatic connection pooling.
                  </p>
                  <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
                    <ExpandableCodeBlock code={`// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  // Automatically uses connection pooling
  // Multiple serverless functions share the pool
})`} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Connection Pooling Explanation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Why Connection Pooling Matters</h2>
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-8 border border-slate-600">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">The Problem</h3>
                  <div className="space-y-3 text-gray-300">
                    <p>Serverless functions are stateless - each invocation can create a new database connection.</p>
                    <p>Databases have connection limits (PostgreSQL: ~100-200 connections).</p>
                    <p className="text-red-400 font-semibold">Without pooling: 1000 requests = 1000 connections (exhausts database)</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">The Solution</h3>
                  <div className="space-y-3 text-gray-300">
                    <p>Connection pooling reuses database connections efficiently.</p>
                    <p>Prisma automatically manages the connection pool.</p>
                    <p className="text-green-400 font-semibold">With pooling: 1000 requests = ~10-20 connections (reused efficiently)</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-slate-900/50 p-4 rounded-lg">
                <h4 className="text-lg font-bold text-white mb-2">How Prisma + Supabase Work Together</h4>
                <div className="text-gray-300 text-sm space-y-2">
                  <p>1. Supabase provides pooled connection URL (port 6543 = pgbouncer)</p>
                  <p>2. Prisma Client uses this URL and manages connection pool internally</p>
                  <p>3. Multiple serverless function invocations share the same pool</p>
                  <p>4. Prevents connection exhaustion and improves performance</p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Technology Benefits */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">💡 Key Technology Benefits for Local Development</h2>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-8">
              <p className="text-white mb-6 font-semibold text-lg">
                One of the major benefits of using modern, standardized technologies: <strong>your application code doesn't care where services live.</strong> This makes local development seamless and deployment flexible.
              </p>
              
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-3">🔷 Prisma with PostgreSQL</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>✅ Your application code doesn't care where the database lives</li>
                    <li>✅ Works identically with SQLite locally (`file:./dev.db`) and PostgreSQL in production</li>
                    <li>✅ Only the `DATABASE_URL` connection string changes between environments</li>
                    <li>✅ Same Prisma schema, same queries, same code - zero application changes needed</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-3">⚛️ Next.js</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>✅ Framework-agnostic deployment options</li>
                    <li>✅ Runs identically on local dev server, Vercel, AWS, Docker, or any Node.js platform</li>
                    <li>✅ Same codebase, same behavior - just different deployment targets</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-3">☕ Spring Boot (Java)</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>✅ Platform-independent Java applications</li>
                    <li>✅ Deploy anywhere Java runs: local, Docker, AWS, Azure, GCP, or on-premise</li>
                    <li>✅ Same Spring Boot app works everywhere - just configure environment variables</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30">
                  <p className="text-white text-sm">
                    <strong>Why This Matters:</strong> Use SQLite locally, PostgreSQL in production - same code. 
                    Deploy to any platform without code changes. Configure through environment variables, not code changes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Complete Example */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Complete SaaS Stack Example</h2>
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-8 border border-slate-600">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Architecture</h3>
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-yellow-400 mt-1" />
                      <div>
                        <p className="font-semibold">Vercel</p>
                        <p className="text-sm">Hosts Next.js app + API routes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 text-green-400 mt-1" />
                      <div>
                        <p className="font-semibold">Supabase</p>
                        <p className="text-sm">PostgreSQL database + Auth + Storage</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Code className="w-5 h-5 text-blue-400 mt-1" />
                      <div>
                        <p className="font-semibold">Prisma</p>
                        <p className="text-sm">Type-safe database access</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Cost (Free Tier)</h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span>Vercel:</span>
                      <span className="text-green-400 font-semibold">$0/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Supabase:</span>
                      <span className="text-green-400 font-semibold">$0/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prisma:</span>
                      <span className="text-green-400 font-semibold">$0/month</span>
                    </div>
                    <div className="border-t border-slate-600 pt-3 mt-3">
                      <div className="flex justify-between text-white font-bold">
                        <span>Total:</span>
                        <span className="text-green-400">$0/month</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-4">
                      Perfect for building and testing SaaS applications before scaling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section>
            <div className="bg-gradient-to-r from-black/50 to-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-3">🚀 Quick Start</h3>
              <p className="text-gray-300 mb-4">
                Ready to build? Here's how to set up the complete stack:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">1. Create Next.js App</h4>
                  <code className="text-sm text-gray-300">npx create-next-app@latest my-saas</code>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">2. Set Up Supabase</h4>
                  <code className="text-sm text-gray-300">Get connection string from Supabase dashboard</code>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">3. Install Prisma</h4>
                  <code className="text-sm text-gray-300">npm install prisma @prisma/client</code>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">4. Deploy to Vercel</h4>
                  <code className="text-sm text-gray-300">Push to GitHub → Import on Vercel</code>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </SubscriptionGate>
  );
}
