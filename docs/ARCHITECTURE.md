# API Integration Training Platform - Architecture Documentation

## Overview

This document describes the architecture of the API Integration Training Platform, a Next.js-based educational application for teaching API integration patterns.

## System Architecture

```mermaid
graph TB
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
    NextAuth --> OAuth
```

## Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Middleware
    participant Page
    participant API
    participant NextAuth
    participant Prisma
    participant Database
    
    User->>Browser: Navigate to /phase-2
    Browser->>Middleware: Request /phase-2
    Middleware->>Middleware: Check session token
    alt No Session
        Middleware->>Browser: Redirect to /login
        Browser->>Page: Show login page
        User->>Browser: Enter credentials
        Browser->>API: POST /api/auth/signup or /api/auth/[...nextauth]
        API->>NextAuth: Authenticate
        NextAuth->>Prisma: Verify user
        Prisma->>Database: Query user
        Database-->>Prisma: User data
        Prisma-->>NextAuth: User verified
        NextAuth-->>API: Session token
        API-->>Browser: Set cookie, redirect
    else Has Session
        Middleware->>Page: Allow access
        Page->>API: GET /api/subscription/check
        API->>Prisma: Check subscription tier
        Prisma->>Database: Query user subscription
        Database-->>Prisma: Subscription data
        Prisma-->>API: Subscription tier
        API-->>Page: Access granted/denied
        Page->>Browser: Render content
    end
```

## Authentication Flow

```mermaid
graph LR
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
    end
    
    subgraph "OAuth Flow"
        C1[Click Sign in with Google] --> C2[Redirect to Google]
        C2 --> C3[User authorizes]
        C3 --> C4[Google redirects with code]
        C4 --> C5[NextAuth exchanges code]
        C5 --> C6[Create/link account]
        C6 --> C7[Create session]
        C7 --> C16[Redirect to /dashboard]
    end
```

## Database Schema

```mermaid
erDiagram
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
    }
```

## Component Structure

```mermaid
graph TD
    RootLayout[RootLayout] --> SessionProvider[SessionProvider]
    RootLayout --> Navigation[Navigation]
    RootLayout --> Main[Main Content]
    
    Main --> HomePage[Home Page<br/>Landing]
    Main --> LoginPage[Login Page]
    Main --> SignupPage[Signup Page]
    Main --> DashboardPage[Dashboard]
    Main --> PhasePages[Phase Pages<br/>1-4]
    Main --> CloudPages[Cloud Pages]
    
    PhasePages --> PhaseLayout[PhaseLayout]
    PhaseLayout --> ConceptCard[ConceptCard]
    PhaseLayout --> ProjectCard[ProjectCard]
    PhaseLayout --> SubscriptionGate[SubscriptionGate]
    
    SubscriptionGate --> UpgradePrompt[UpgradePrompt]
    
    CloudPages --> CloudContent[Cloud Content Pages]
    
    PhasePages --> InteractiveDemos[Interactive Demos]
    InteractiveDemos --> OAuth2Simulator[OAuth2Simulator]
    InteractiveDemos --> CircuitBreakerDemo[CircuitBreakerDemo]
    InteractiveDemos --> RetryDemo[RetryDemo]
    InteractiveDemos --> ApiEndpointTester[ApiEndpointTester]
    InteractiveDemos --> GraphQLTester[GraphQLTester]
    InteractiveDemos --> WebSocketTester[WebSocketTester]
```

## Subscription System Flow

```mermaid
graph TD
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
    M --> N[Redirect to content]
```

## Deployment Architecture

```mermaid
graph TB
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
    Other --> VercelPostgres
```

## Technology Stack

```mermaid
graph LR
    subgraph "Frontend"
        NextJS[Next.js 16<br/>App Router]
        React[React 19]
        TypeScript[TypeScript]
        Tailwind[Tailwind CSS]
        Lucide[Lucide Icons]
    end
    
    subgraph "Backend"
        APIRoutes[API Routes]
        NextAuth[NextAuth.js v5]
        PrismaORM[Prisma ORM]
    end
    
    subgraph "Database"
        SQLite[SQLite<br/>Development]
        PostgreSQL[PostgreSQL<br/>Production]
    end
    
    subgraph "Testing"
        Playwright[Playwright]
    end
    
    NextJS --> React
    NextJS --> APIRoutes
    APIRoutes --> NextAuth
    APIRoutes --> PrismaORM
    PrismaORM --> SQLite
    PrismaORM --> PostgreSQL
```

## File Structure

```mermaid
graph TD
    Root[apisandbox/] --> App[app/]
    Root --> Components[components/]
    Root --> Lib[lib/]
    Root --> Prisma[prisma/]
    Root --> Docs[docs/]
    Root --> Tests[tests/]
    
    App --> Pages[Pages<br/>page.tsx, phase-*/]
    App --> API[api/<br/>API Routes]
    App --> Layout[layout.tsx]
    
    API --> AuthAPI[auth/<br/>NextAuth routes]
    API --> SubAPI[subscription/<br/>Subscription API]
    API --> AWSAPI[aws/<br/>AWS API]
    
    Components --> UI[UI Components]
    Components --> Demos[Interactive Demos]
    Components --> Providers[Providers]
    
    Lib --> AuthLib[auth.ts<br/>auth-config.ts]
    Lib --> PrismaLib[prisma.ts]
    Lib --> SubLib[subscription.ts]
    
    Prisma --> Schema[schema.prisma]
    Prisma --> Migrations[migrations/]
```

## Key Architectural Decisions

### 1. **Full-Stack Next.js**
- **Decision**: Use Next.js App Router for both frontend and backend
- **Rationale**: Simplifies deployment, reduces complexity, ideal for educational content with some interactive features
- **Trade-off**: Less separation of concerns, but acceptable for this use case

### 2. **NextAuth.js v5**
- **Decision**: Use NextAuth.js for authentication
- **Rationale**: Industry-standard, handles OAuth, sessions, and security best practices
- **Trade-off**: Learning curve, but provides robust auth out of the box

### 3. **Prisma ORM**
- **Decision**: Use Prisma with SQLite (dev) and PostgreSQL (prod)
- **Rationale**: Type-safe queries, easy database switching, great DX
- **Trade-off**: Migration overhead, but worth it for type safety

### 4. **Freemium Model**
- **Decision**: Implement subscription tiers (FREE/PREMIUM)
- **Rationale**: Allows free access to Phase 1, monetizes advanced content
- **Trade-off**: Adds complexity, but enables sustainable business model

### 5. **Client-Side Components**
- **Decision**: Use "use client" for interactive features
- **Rationale**: Needed for hooks, state management, and interactivity
- **Trade-off**: Larger bundle size, but necessary for demos

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        Middleware[Middleware<br/>Route Protection]
        NextAuth[NextAuth<br/>Session Management]
        RateLimit[Rate Limiting<br/>In-memory/Redis]
        PasswordHash[Password Hashing<br/>bcrypt 12 rounds]
        AccountLock[Account Lockout<br/>5 failed attempts]
    end
    
    subgraph "Protected Routes"
        Dashboard[/dashboard]
        Phases[/phase-*]
        Cloud[/cloud]
    end
    
    subgraph "Public Routes"
        Home[/]
        Login[/login]
        Signup[/signup]
    end
    
    Middleware --> Dashboard
    Middleware --> Phases
    Middleware --> Cloud
    NextAuth --> Middleware
    RateLimit --> NextAuth
    PasswordHash --> NextAuth
    AccountLock --> NextAuth
```

## Performance Considerations

1. **Static Generation**: Content pages (phases) can be statically generated
2. **API Routes**: Serverless functions scale automatically on Vercel
3. **Database**: Connection pooling via Prisma
4. **Caching**: Next.js automatic caching for static content
5. **Code Splitting**: Automatic via Next.js App Router

## Future Enhancements

- [ ] Add Redis for production rate limiting
- [ ] Implement email verification
- [ ] Add password reset flow
- [ ] Implement 2FA/MFA
- [ ] Add analytics tracking
- [ ] Implement search functionality
- [ ] Add progress tracking
- [ ] Implement certificate generation
