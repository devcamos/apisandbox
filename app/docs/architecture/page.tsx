"use client";

import { useEffect, useRef, useState } from "react";

export default function ArchitecturePage() {
  const [mounted, setMounted] = useState(false);
  const diagramRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== "undefined") {
      import("mermaid").then((mermaid) => {
        mermaid.default.initialize({ 
          startOnLoad: true,
          theme: "dark",
          themeVariables: {
            primaryColor: "#3b82f6",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#1e40af",
            lineColor: "#60a5fa",
            secondaryColor: "#1e293b",
            tertiaryColor: "#0f172a",
            background: "#0f172a",
            mainBkg: "#1e293b",
            secondBkg: "#334155",
            textColor: "#f1f5f9",
          }
        });

        // Render all diagrams
        diagramRefs.current.forEach(async (ref, index) => {
          if (ref && !ref.hasAttribute("data-rendered")) {
            const diagram = ref.textContent || "";
            if (diagram.trim()) {
              ref.setAttribute("data-rendered", "true");
              try {
                const { svg } = await mermaid.default.render(`mermaid-${index}`, diagram);
                ref.innerHTML = svg;
              } catch (error) {
                console.error(`Error rendering diagram ${index}:`, error);
                ref.innerHTML = `<div class="text-red-400">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
              }
            }
          }
        });
      });
    }
  }, [mounted]);

  const diagrams = [
    {
      title: "System Architecture",
      diagram: `graph TB
    subgraph "Client Layer"
        Browser[Browser]
        Mobile[Mobile App<br/>React Native]
    end
    
    subgraph "Next.js Application"
        subgraph "Frontend - App Router"
            Pages[Pages<br/>phase-1, phase-2, etc.]
            Components[React Components]
            Layout[Root Layout]
        end
        
        subgraph "Backend - API Routes"
            AuthAPI[Auth API<br/>/api/auth/*]
            SubAPI[Subscription API<br/>/api/subscription/*]
            AWSAPI[AWS API<br/>/api/aws/*]
        end
        
        Middleware[Middleware<br/>Route Protection]
    end
    
    subgraph "Authentication"
        NextAuth[NextAuth.js v5]
        PrismaAdapter[Prisma Adapter]
    end
    
    subgraph "Data Layer"
        Prisma[Prisma ORM]
        DB[(Database<br/>SQLite/PostgreSQL)]
    end
    
    subgraph "External Services"
        OAuth[OAuth Providers<br/>Google, GitHub]
    end
    
    Browser --> Pages
    Browser --> Components
    Mobile --> Pages
    Pages --> Middleware
    Middleware --> AuthAPI
    Middleware --> SubAPI
    Middleware --> AWSAPI
    AuthAPI --> NextAuth
    NextAuth --> PrismaAdapter
    PrismaAdapter --> Prisma
    SubAPI --> Prisma
    AWSAPI --> Prisma
    Prisma --> DB
    NextAuth --> OAuth`
    },
    {
      title: "Authentication Flow",
      diagram: `graph LR
    subgraph "Sign Up Flow"
        A1[User visits /signup] --> A2[Fill form]
        A2 --> A3[POST /api/auth/signup]
        A3 --> A4[Validate with Zod]
        A4 --> A5[Hash password<br/>bcrypt]
        A5 --> A6[Create user in DB]
        A6 --> A7[Redirect to /login]
    end
    
    subgraph "Sign In Flow"
        B1[User visits /login] --> B2[Enter credentials]
        B2 --> B3[NextAuth Credentials Provider]
        B3 --> B4[Find user in DB]
        B4 --> B5{User exists?}
        B5 -->|No| B6[Error: Invalid credentials]
        B5 -->|Yes| B7{Account locked?}
        B7 -->|Yes| B8[Error: Account locked]
        B7 -->|No| B9[Verify password]
        B9 --> B10{Password valid?}
        B10 -->|No| B11[Increment login attempts]
        B11 --> B12{Attempts >= 5?}
        B12 -->|Yes| B13[Lock account 30 min]
        B12 -->|No| B6
        B10 -->|Yes| B14[Reset login attempts]
        B14 --> B15[Create JWT session]
        B15 --> B16[Redirect to /dashboard]
    end`
    },
    {
      title: "Database Schema",
      diagram: `erDiagram
    User ||--o{ Account : has
    User ||--o{ Session : has
    User ||--o{ VerificationToken : has
    
    User {
        string id PK
        string email UK
        string name
        string passwordHash
        int loginAttempts
        datetime lockedUntil
        boolean isActive
        enum subscriptionTier
        datetime subscriptionExpiresAt
        datetime createdAt
        datetime updatedAt
    }
    
    Account {
        string id PK
        string userId FK
        string type
        string provider
        string providerAccountId
        string refresh_token
        string access_token
        int expires_at
    }
    
    Session {
        string id PK
        string sessionToken UK
        string userId FK
        datetime expires
    }
    
    VerificationToken {
        string id PK
        string identifier
        string token UK
        datetime expires
    }`
    },
    {
      title: "Subscription System Flow",
      diagram: `graph TD
    A[User accesses protected content] --> B[SubscriptionGate component]
    B --> C{User authenticated?}
    C -->|No| D[Redirect to /login]
    C -->|Yes| E[Check subscription tier]
    E --> F{Phase number?}
    F -->|Phase 0 or 1| G[Allow access - FREE]
    F -->|Phase 2-4 or Cloud| H{Subscription tier?}
    H -->|FREE| I[Show UpgradePrompt]
    H -->|PREMIUM| J[Allow access]
    I --> K[User clicks Upgrade]
    K --> L[POST /api/subscription/upgrade]
    L --> M[Update user tier in DB]
    M --> N[Redirect to content]`
    },
    {
      title: "Deployment Architecture",
      diagram: `graph TB
    subgraph "Development"
        DevLocal[Local Development<br/>localhost:4000]
        DevDB[(SQLite<br/>dev.db)]
    end
    
    subgraph "Production - Vercel"
        VercelCDN[Vercel CDN]
        VercelFunctions[Serverless Functions]
        VercelPostgres[(Vercel Postgres)]
    end
    
    subgraph "Alternative Deployments"
        AWS[AWS<br/>Lambda/ECS/EC2]
        Docker[Docker Containers]
        Other[Other Platforms]
    end
    
    DevLocal --> DevDB
    VercelCDN --> VercelFunctions
    VercelFunctions --> VercelPostgres
    AWS --> VercelPostgres
    Docker --> VercelPostgres
    Other --> VercelPostgres`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">System Architecture</h1>
          <p className="text-gray-300 text-lg">
            Visual documentation of the API Integration Training Platform architecture.
            See <a href="/docs/ARCHITECTURE.md" className="text-blue-400 hover:underline">ARCHITECTURE.md</a> for detailed documentation.
          </p>
        </div>

        <div className="space-y-12">
          {diagrams.map((item, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">{item.title}</h2>
              <div className="bg-slate-900/50 p-6 rounded-lg overflow-x-auto">
                <div 
                  ref={(el) => { diagramRefs.current[index] = el; }}
                  className="mermaid"
                >
                  {item.diagram}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📚 Full Documentation</h2>
          <p className="text-gray-300 mb-4">
            For complete architecture documentation including request flows, component structures, and technology decisions, see:
          </p>
          <a 
            href="/docs/ARCHITECTURE.md" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            View Full Architecture Docs
          </a>
        </div>
      </div>
    </div>
  );
}
