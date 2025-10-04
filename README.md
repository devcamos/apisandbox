# API Integration Training Platform

A comprehensive Next.js application for learning API integrations from fundamentals to principal-level architecture.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

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

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

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
│   └── phase-4/            # Phase 4 content
├── components/
│   ├── Navigation.tsx      # Top navigation
│   ├── PhaseLayout.tsx     # Phase page layout
│   ├── ConceptCard.tsx     # Concept display card
│   └── ProjectCard.tsx     # Project card
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
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

## 📝 License

This project is for educational purposes.

