"use client";

import ConceptCard from "@/components/ConceptCard";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { ExpandableCodeBlock } from "@/components/HighlightedCodeBlock"
import Link from "next/link";
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle,
  Home,
  FileText,
  Globe,
  Cloud
} from "lucide-react";

export default function SecurityPage() {
  return (
    <SubscriptionGate phaseNumber="cloud" lockedContentName="Security">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 py-16">
          <div className="container mx-auto px-6">
            <nav className="flex items-center gap-2 mb-6 text-sm">
              <Link href="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <span className="text-white/50">/</span>
              <Link href="/cloud" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
                <Cloud className="w-4 h-4" />
                Cloud
              </Link>
              <span className="text-white/50">/</span>
              <span className="text-white font-semibold">Security</span>
            </nav>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Security</h1>
                <p className="text-xl text-white/90 mt-2">
                  Essential security practices for API integrations and applications
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Goal Section */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">🎯 Learning Goal</h2>
            <p className="text-gray-300 text-lg">
              Master essential security practices for API integrations. Learn encryption, security headers, 
              OWASP Top 10, and API security best practices. Focus on the 20% that prevents 80% of security issues.
            </p>
          </div>

          {/* Security Topics */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Security Fundamentals</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ConceptCard
                icon={Lock}
                title="Encryption"
                description="Protect data at rest and in transit"
                items={[
                  "HTTPS/TLS",
                  "Data encryption",
                  "Password hashing",
                  "Secrets management"
                ]}
                color="from-blue-500 to-cyan-500"
                documentation={{
                  overview: "Encryption protects data from unauthorized access. Use HTTPS for data in transit and encryption for sensitive data at rest.",
                  description: [
                    "HTTPS/TLS for data in transit (required for all APIs)",
                    "Password hashing (bcrypt, argon2) - never store plain text",
                    "Data encryption for sensitive fields (PII, payment data)",
                    "Secrets management (environment variables, secret managers)",
                    "API key encryption and rotation",
                    "Database encryption at rest"
                  ],
                  useCases: [
                    "API communications",
                    "User passwords",
                    "Payment information",
                    "Personal data (PII)",
                    "API keys and tokens",
                    "Database backups"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "HTTPS = required for all production APIs",
                      "bcrypt = standard for password hashing",
                      "Environment variables = never commit secrets",
                      "TLS 1.2+ = minimum for HTTPS",
                      "Encryption at rest = for sensitive databases"
                    ]
                  },
                  bestFor: [
                    "All production applications",
                    "User authentication",
                    "Payment processing",
                    "Sensitive data storage"
                  ],
                  notIdealFor: [
                    "Non-sensitive public data",
                    "Development-only applications",
                    "Internal-only APIs (still use HTTPS)"
                  ]
                }}
              />

              <ConceptCard
                icon={Globe}
                title="Security Headers"
                description="HTTP headers that protect against common attacks"
                items={[
                  "Content-Security-Policy",
                  "X-Frame-Options",
                  "Strict-Transport-Security",
                  "X-Content-Type-Options"
                ]}
                color="from-green-500 to-emerald-500"
                documentation={{
                  overview: "Security headers tell browsers how to handle your application securely. They protect against XSS, clickjacking, and other attacks.",
                  description: [
                    "Content-Security-Policy (CSP) - prevents XSS attacks",
                    "X-Frame-Options - prevents clickjacking",
                    "Strict-Transport-Security (HSTS) - forces HTTPS",
                    "X-Content-Type-Options - prevents MIME sniffing",
                    "Referrer-Policy - controls referrer information",
                    "Permissions-Policy - controls browser features"
                  ],
                  useCases: [
                    "All web applications",
                    "Public-facing APIs",
                    "Authentication pages",
                    "Payment forms",
                    "Admin dashboards"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "CSP = prevents XSS (most important)",
                      "HSTS = forces HTTPS (prevents downgrade attacks)",
                      "X-Frame-Options = prevents clickjacking",
                      "Next.js = automatically sets some headers",
                      "Middleware = add custom headers"
                    ]
                  },
                  bestFor: [
                    "All production applications",
                    "Public APIs",
                    "Web applications",
                    "When security is critical"
                  ],
                  notIdealFor: [
                    "Internal-only applications (still recommended)",
                    "Development environments (can be relaxed)"
                  ]
                }}
              />

              <ConceptCard
                icon={AlertTriangle}
                title="OWASP Top 10"
                description="Most critical web application security risks"
                items={[
                  "Injection attacks",
                  "Broken authentication",
                  "Sensitive data exposure",
                  "XML external entities"
                ]}
                color="from-red-500 to-orange-500"
                documentation={{
                  overview: "OWASP Top 10 lists the most critical security risks. Understanding these helps prevent the majority of security vulnerabilities.",
                  description: [
                    "A01: Broken Access Control - unauthorized access",
                    "A02: Cryptographic Failures - weak encryption",
                    "A03: Injection - SQL, NoSQL, command injection",
                    "A04: Insecure Design - security flaws in design",
                    "A05: Security Misconfiguration - default configs",
                    "A06: Vulnerable Components - outdated dependencies"
                  ],
                  useCases: [
                    "Security audits",
                    "Code reviews",
                    "Penetration testing",
                    "Security training",
                    "Compliance requirements"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "Injection = validate and sanitize all inputs",
                      "Broken Auth = use proven auth libraries",
                      "Sensitive Data = encrypt in transit and at rest",
                      "Security Config = remove defaults, update regularly",
                      "Vulnerable Components = keep dependencies updated"
                    ]
                  },
                  bestFor: [
                    "Security assessments",
                    "Understanding common vulnerabilities",
                    "Security training",
                    "Compliance"
                  ],
                  notIdealFor: [
                    "Replacing security audits",
                    "Complete security coverage"
                  ]
                }}
              />

              <ConceptCard
                icon={Key}
                title="API Security"
                description="Securing API endpoints and communications"
                items={[
                  "Authentication & Authorization",
                  "Rate limiting",
                  "Input validation",
                  "Error handling"
                ]}
                color="from-purple-500 to-pink-500"
                documentation={{
                  overview: "API security involves protecting endpoints from unauthorized access, abuse, and attacks. It's essential for all API integrations.",
                  description: [
                    "Authentication - verify who is making the request",
                    "Authorization - verify what they can access",
                    "Rate limiting - prevent abuse and DDoS",
                    "Input validation - prevent injection attacks",
                    "Error handling - don't leak sensitive information",
                    "API versioning - maintain backward compatibility"
                  ],
                  useCases: [
                    "All API endpoints",
                    "Third-party integrations",
                    "Public APIs",
                    "Internal APIs",
                    "Microservices"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "Always authenticate = use JWT, OAuth2, or API keys",
                      "Validate inputs = use Zod, Joi, or similar",
                      "Rate limit = prevent abuse",
                      "Error messages = don't leak system info",
                      "HTTPS only = never HTTP in production"
                    ]
                  },
                  bestFor: [
                    "All APIs",
                    "Public endpoints",
                    "Third-party integrations",
                    "Microservices"
                  ],
                  notIdealFor: [
                    "Internal-only development APIs (still recommended)"
                  ]
                }}
              />

              <ConceptCard
                icon={FileText}
                title="Secrets Management"
                description="Secure storage and access to sensitive credentials"
                items={[
                  "Environment variables",
                  "Secret managers",
                  "Key rotation",
                  "Access control"
                ]}
                color="from-indigo-500 to-blue-500"
                documentation={{
                  overview: "Secrets management ensures sensitive credentials are stored and accessed securely. Never commit secrets to version control.",
                  description: [
                    "Environment variables for local development",
                    "Secret managers (AWS Secrets Manager, Vercel, etc.)",
                    "Key rotation policies",
                    "Access control and auditing",
                    ".env files (never commit)",
                    ".gitignore for sensitive files"
                  ],
                  useCases: [
                    "API keys",
                    "Database credentials",
                    "OAuth secrets",
                    "Encryption keys",
                    "Third-party service tokens"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "Never commit secrets = use .gitignore",
                      "Environment variables = for local dev",
                      "Secret managers = for production",
                      "Rotate regularly = especially if exposed",
                      ".env.example = document required variables"
                    ]
                  },
                  bestFor: [
                    "All applications",
                    "Production deployments",
                    "Team development",
                    "CI/CD pipelines"
                  ],
                  notIdealFor: [
                    "Hardcoding secrets (never do this)",
                    "Committing .env files"
                  ]
                }}
              />

              <ConceptCard
                icon={Shield}
                title="Authentication Security"
                description="Secure user authentication and session management"
                items={[
                  "Password policies",
                  "Session management",
                  "Multi-factor authentication",
                  "Token security"
                ]}
                color="from-yellow-500 to-amber-500"
                documentation={{
                  overview: "Authentication security ensures only authorized users can access your application. Use proven libraries and follow best practices.",
                  description: [
                    "Strong password policies (length, complexity)",
                    "Password hashing (bcrypt, argon2)",
                    "Session management (secure cookies, expiration)",
                    "Multi-factor authentication (2FA, MFA)",
                    "Token security (JWT expiration, refresh tokens)",
                    "Account lockout after failed attempts"
                  ],
                  useCases: [
                    "User authentication",
                    "API authentication",
                    "Admin access",
                    "Sensitive operations",
                    "Payment processing"
                  ],
                  paretoKnowledge: {
                    title: "The 20% You Need to Know",
                    points: [
                      "bcrypt = standard password hashing",
                      "JWT expiration = short-lived access tokens",
                      "Refresh tokens = for long sessions",
                      "2FA = adds significant security",
                      "Use proven libraries = NextAuth, Auth0, etc."
                    ]
                  },
                  bestFor: [
                    "All user-facing applications",
                    "Sensitive data access",
                    "Payment systems",
                    "Admin panels"
                  ],
                  notIdealFor: [
                    "Public APIs without auth",
                    "Internal-only tools (still recommended)"
                  ]
                }}
              />
            </div>
          </section>

          {/* Security Best Practices */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Security Checklist</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">✅ Must Have</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>HTTPS for all API communications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Password hashing (bcrypt or better)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Input validation on all endpoints</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Environment variables for secrets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Security headers (CSP, HSTS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Rate limiting on public APIs</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">⚠️ Should Have</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">!</span>
                      <span>Multi-factor authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">!</span>
                      <span>Regular security audits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">!</span>
                      <span>Dependency vulnerability scanning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">!</span>
                      <span>Security monitoring and alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">!</span>
                      <span>Penetration testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">!</span>
                      <span>Security incident response plan</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Code Examples */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Security Implementation Examples</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h4 className="text-lg font-bold text-white mb-3">Security Headers (Next.js)</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  const response = NextResponse.next()
  
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'"
  )
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )
  
  return response
}`} />
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h4 className="text-lg font-bold text-white mb-3">Input Validation (Zod)</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`import { z } from 'zod'

// Define schema
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().min(18).max(120),
})

// Validate input
export async function POST(request: Request) {
  const body = await request.json()
  
  // Validation prevents injection attacks
  const validated = userSchema.parse(body)
  
  // Safe to use validated data
  return Response.json({ success: true })
}`} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </SubscriptionGate>
  );
}
