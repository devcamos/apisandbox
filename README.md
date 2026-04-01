# API Integration Training Platform

A comprehensive Next.js application for learning API integrations from fundamentals to principal-level architecture.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker (optional, for local PostgreSQL)
- Or PostgreSQL installed locally

### Installation

```bash
# Install dependencies
npm install

# Setup local PostgreSQL (choose one option):

# Option 1: Docker PostgreSQL (Recommended)
npm run db:up              # Start PostgreSQL container
npm run env:local          # Copy environment template
# Edit .env.local with your settings

# Option 2: Local PostgreSQL
# Install: brew install postgresql@15 (macOS)
# Create DB: createdb apisandbox_dev
# Edit .env.local with your DATABASE_URL

# Run migrations
npm run db:migrate

# Create default test users (only if DB is empty)
npm run db:ensure-test-users

# Run development server
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## 📚 Learning Path

### Phase 1: Integration Mindset
- API categories (REST, GraphQL, gRPC, WebSocket, Event-driven)
- Contract styles (OpenAPI, protobuf, AsyncAPI)
- Core principles (loose coupling, idempotency, eventual consistency)

### Phase 2: Third-Party Integrations
- Authentication flows (OAuth2, API keys, JWTs)
- Resilience patterns (retries, circuit breakers, caching)
- Data transformation and error handling
- **Project**: Integrate with Stripe, GitHub, or OpenWeather API

### Phase 3: Inter-Service Communication
- Synchronous vs asynchronous communication
- gRPC and Protocol Buffers
- Event-driven architecture with Kafka/RabbitMQ
- API gateways and service mesh
- Distributed tracing with OpenTelemetry
- **Project**: Two microservices with REST + Kafka communication

### Phase 4: Principal-Level Architecture
- Anti-patterns and how to avoid them
- Backpressure and flow control
- Contract testing with Pact
- API versioning strategies
- Legacy system integration
- **Project**: Design financial platform architecture for 50k TPS

### Cloud Section: AWS Cloud Migration
- AWS fundamentals (EC2, S3, RDS, Lambda, API Gateway)
- Migration strategies (lift-and-shift, re-platform, refactor)
- Infrastructure as Code (CloudFormation, Terraform)
- Containerization on AWS (ECS, EKS, Fargate)
- Serverless architecture (Lambda, API Gateway, DynamoDB)
- Monitoring & observability (CloudWatch, X-Ray)
- Security best practices (IAM, VPC, Security Groups)
- Cost optimization strategies
- **Interactive Tools**: Migration dashboard, cost calculator, service selector

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 🏗️ Architecture

For detailed architecture documentation with visual diagrams:

- **[Architecture Documentation](./docs/ARCHITECTURE.md)** - Complete system architecture with Mermaid diagrams
- **[Architecture Viewer](/docs/architecture)** - Interactive architecture diagrams in the app
- **[Developer Setup](./docs/DEV_SETUP.md)** - How to view diagrams locally for developers
- **[Test Users](./docs/TEST_USERS.md)** - Local test credentials bootstrap

### Quick View (Local Development)

```bash
# Start dev server
npm run dev

# View architecture diagrams in browser
open http://localhost:4000/docs/architecture

# Or open markdown file in VS Code
code docs/ARCHITECTURE.md
# Then press Cmd+Shift+V (Mac) or Ctrl+Shift+V (Windows) to preview
```

The architecture documentation includes system overview, request flows, authentication, database schema, component structure, and deployment architecture.

## 💡 Key Technology Benefits for Local Development

One of the major benefits of using modern, standardized technologies is that your application code doesn't care where services live. This makes local development seamless and deployment flexible.

### **Prisma with PostgreSQL (Mono-Environment)**
- **PostgreSQL everywhere**: Local (Docker), Development, Production (Vercel)
- Works identically with:
  - Local PostgreSQL (Docker: `docker-compose up`) or local installation
  - Vercel Postgres (production - automatically configured)
  - Any PostgreSQL provider (AWS RDS, Supabase, etc.)
- Only the `DATABASE_URL` connection string changes between environments
- Same Prisma schema, same queries, same code - zero application changes needed
- See [Mono-Environment Framework](./docs/MONO_ENVIRONMENT.md) for details

### **Next.js**
- Framework-agnostic deployment options
- Runs identically on:
  - Local development server (`npm run dev`)
  - Vercel (serverless functions)
  - AWS (Lambda, ECS, EC2)
  - Docker containers
  - Any Node.js hosting platform
- Same codebase, same behavior - just different deployment targets

### **Spring Boot (Java)**
- Platform-independent Java applications
- Deploy anywhere Java runs:
  - Local development (embedded Tomcat)
  - Docker containers
  - AWS (ECS, EKS, EC2, Lambda with custom runtime)
  - Azure, GCP, or on-premise servers
- Same Spring Boot app works everywhere - just configure environment variables

### **Universal Standards (HTTP, JSON, REST)**
- Language and platform independence
- Frontend (React/Next.js) and backend (Spring Boot/Node.js) communicate seamlessly
- No vendor lock-in - switch providers without code changes
- Works across all cloud providers and on-premise infrastructure

### **Why This Matters**
- ✅ **Mono-Environment**: Same PostgreSQL setup everywhere - no surprises
- ✅ **Vercel-Ready**: Production database is PostgreSQL (required by Vercel)
- ✅ **Team Flexibility**: Developers can use Docker or local PostgreSQL
- ✅ **Deployment Options**: Deploy to Vercel or any platform without code changes
- ✅ **Testing**: Test against PostgreSQL locally, deploy with confidence
- ✅ **Vendor Independence**: Switch cloud providers without rewriting code

**The key principle**: Configure through environment variables, not code changes.

See [Mono-Environment Framework](./docs/MONO_ENVIRONMENT.md) for complete documentation.

## 📁 Project Structure

```
apisandbox/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── phase-1/            # Phase 1 content
│   ├── phase-2/            # Phase 2 content
│   ├── phase-3/            # Phase 3 content
│   ├── phase-4/            # Phase 4 content
│   ├── cloud/              # Cloud section (NEW)
│   │   ├── page.tsx        # Cloud landing page
│   │   ├── aws-migration/  # Migration dashboard
│   │   ├── services/       # AWS services overview
│   │   └── migration/      # Migration strategies
│   └── api/                # API routes
│       └── aws/            # AWS API endpoints
├── components/
│   ├── Navigation.tsx       # Top navigation
│   ├── PhaseLayout.tsx     # Phase page layout
│   ├── ConceptCard.tsx     # Concept display card
│   ├── ProjectCard.tsx     # Project card
│   ├── AwsMigrationDashboard.tsx  # Migration dashboard
│   ├── AwsServiceSelector.tsx     # Service selector
│   └── CostCalculator.tsx         # Cost calculator
├── config/
│   ├── environmentManager.ts          # Environment configuration manager
│   └── environments/
│       ├── local.env.example          # Local development template
│       └── prod.env.example           # Production (Vercel) template
├── docs/
│   ├── ARCHITECTURE.md                # Architecture documentation with Mermaid diagrams
│   ├── MONO_ENVIRONMENT.md            # Mono-environment framework guide
│   ├── VERCEL_DEPLOYMENT.md           # Vercel deployment guide
│   └── DEV_SETUP.md                   # Developer setup guide
├── docker-compose.yml                 # Local PostgreSQL (Docker)
├── vercel.json                        # Vercel configuration
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── AWS_MIGRATION_GUIDE.md            # Migration guide
```

## 🎨 Features

- ✅ Modern, responsive UI with dark mode
- ✅ Interactive navigation between phases
- ✅ Code examples for all concepts
- ✅ Project cards with requirements
- ✅ Beautiful gradient designs
- ✅ Mobile-friendly layout

## 🧪 Next Steps

1. Complete Phase 1 to understand integration fundamentals
2. Build the Phase 2 project to practice with real APIs
3. Create microservices in Phase 3
4. Design enterprise architecture in Phase 4
5. Explore the Cloud section to learn AWS migration

## ☁️ Cloud Section

The Cloud section provides comprehensive training on AWS cloud integration and migration:

- **AWS Services**: Learn about EC2, S3, RDS, Lambda, API Gateway, and more
- **Migration Strategies**: Understand lift-and-shift, re-platform, and refactor approaches
- **Migration Dashboard**: Interactive tools for planning and executing migrations
- **Cost Calculator**: Estimate AWS costs for your migration
- **Migration Guide**: Step-by-step guide to cloud migration

Access the Cloud section from the navigation menu or visit `/cloud`.

## 📝 License

This project is for educational purposes.
