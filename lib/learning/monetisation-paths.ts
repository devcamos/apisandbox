export interface RevenueModel {
  type: string
  description: string
  example: string
}

export interface TechRequirement {
  category: string
  tools: string[]
}

export interface StartHereStep {
  step: number
  action: string
  detail: string
}

export interface MonetisationPath {
  id: string
  name: string
  tagline: string
  icon: string
  color: string
  timeToFirstDollar: string
  effortLevel: "Low" | "Medium" | "High"
  monthlyRevenueRange: string
  paretoInsight: string
  what: string
  why: string
  revenueModels: RevenueModel[]
  techStack: TechRequirement[]
  startHere: StartHereStep[]
  keyMetrics: string[]
  realExamples: { name: string; revenue: string; lesson: string }[]
  springContext: {
    headline: string
    stack: string[]
  }
}

export const monetisationPaths: MonetisationPath[] = [
  {
    id: "saas",
    name: "SaaS",
    tagline: "Recurring revenue from software people pay monthly to use",
    icon: "💎",
    color: "from-violet-500 to-purple-600",
    timeToFirstDollar: "2–4 months",
    effortLevel: "High",
    monthlyRevenueRange: "$500 – $100k+",
    paretoInsight: "80% of SaaS revenue comes from solving one painful workflow really well. Don't build a platform — build a painkiller.",
    what: "A hosted application customers access via browser or API, paying a recurring subscription. You handle hosting, updates, and support. They get continuous value without managing infrastructure.",
    why: "SaaS is the most proven software business model because recurring revenue compounds. A customer paying $50/month is worth $600/year with zero additional sales effort. Churn is your only enemy.",
    revenueModels: [
      { type: "Flat subscription", description: "Fixed monthly price per tier (Starter, Pro, Team)", example: "$29/mo, $79/mo, $199/mo" },
      { type: "Per-seat pricing", description: "Charge per user on the account", example: "$12/user/month" },
      { type: "Usage-based", description: "Pay for what you consume (API calls, storage, events)", example: "$0.01 per request after free tier" },
      { type: "Freemium", description: "Free tier with limited features, paid tier unlocks the rest", example: "Free for 3 projects, $19/mo for unlimited" },
    ],
    techStack: [
      { category: "Backend", tools: ["Spring Boot + JPA", "Next.js API routes", "FastAPI"] },
      { category: "Auth", tools: ["Clerk", "NextAuth", "Spring Security + JWT"] },
      { category: "Payments", tools: ["Stripe Subscriptions", "Lemon Squeezy", "Paddle"] },
      { category: "Database", tools: ["PostgreSQL", "PlanetScale", "Supabase"] },
      { category: "Hosting", tools: ["Vercel", "Railway", "AWS ECS", "Fly.io"] },
    ],
    startHere: [
      { step: 1, action: "Pick one painful problem", detail: "Talk to 5 people in a niche. Find the task they complain about weekly. That's your product." },
      { step: 2, action: "Build the landing page first", detail: "Describe the solution, add a waitlist form. If nobody signs up, pick a different problem." },
      { step: 3, action: "Ship an ugly MVP in 2 weeks", detail: "Auth + one core feature + Stripe checkout. No admin panel, no settings page, no perfection." },
      { step: 4, action: "Charge from day one", detail: "Even $9/month validates demand. Free users give feedback; paying users give signal." },
      { step: 5, action: "Iterate on retention, not features", detail: "Track who comes back weekly. Fix why people leave before adding anything new." },
    ],
    keyMetrics: [
      "MRR (Monthly Recurring Revenue) — your north star",
      "Churn rate — % of customers who cancel each month (target < 5%)",
      "LTV (Lifetime Value) — average revenue per customer over their lifetime",
      "CAC (Customer Acquisition Cost) — how much it costs to get one paying customer",
      "LTV:CAC ratio — must be > 3:1 to be sustainable",
    ],
    realExamples: [
      { name: "Plausible Analytics", revenue: "$100k+ MRR", lesson: "Privacy-focused alternative to Google Analytics. One clear differentiator wins." },
      { name: "Buttondown", revenue: "$30k+ MRR", lesson: "Newsletter tool for developers. Built by one person. Niche beats broad." },
      { name: "Cal.com", revenue: "Open-core SaaS", lesson: "Open-source scheduling. Free self-host, paid cloud. Trust drives conversion." },
    ],
    springContext: {
      headline: "Spring Boot is production-grade SaaS infrastructure out of the box",
      stack: [
        "Spring Boot + Spring Security + JWT for multi-tenant auth",
        "Spring Data JPA with PostgreSQL for your core domain",
        "Stripe Java SDK for subscription billing and webhook handling",
        "Spring Actuator + Micrometer for SaaS health metrics",
        "@Scheduled for usage metering, billing cycles, and churn detection jobs",
        "Spring Profiles to separate free-tier vs premium feature flags",
      ],
    },
  },
  {
    id: "api-product",
    name: "API as a Product",
    tagline: "Sell access to your API — developers pay per call or per month",
    icon: "🔌",
    color: "from-blue-500 to-cyan-500",
    timeToFirstDollar: "1–3 months",
    effortLevel: "Medium",
    monthlyRevenueRange: "$200 – $50k+",
    paretoInsight: "80% of API revenue comes from making the integration dead simple. Great docs and a 5-minute quickstart matter more than the 50th endpoint.",
    what: "You build and host an API that other developers integrate into their products. They pay based on usage (requests, data processed) or a flat subscription for access.",
    why: "APIs are the ultimate leverage — you build once, and thousands of developers embed your logic into their products. Every customer's product becomes your distribution channel.",
    revenueModels: [
      { type: "Usage-based", description: "Metered billing per API call or data unit", example: "$5 per 10,000 requests" },
      { type: "Tiered plans", description: "Free tier → Pro → Enterprise with rate limits", example: "100 req/day free, 10k/day $49/mo" },
      { type: "Pay-per-feature", description: "Base API free, premium endpoints cost extra", example: "Search free, AI enrichment $0.02/call" },
    ],
    techStack: [
      { category: "Backend", tools: ["Spring Boot + WebFlux", "Express + rate-limiter", "FastAPI"] },
      { category: "API Gateway", tools: ["Kong", "AWS API Gateway", "Spring Cloud Gateway"] },
      { category: "Auth", tools: ["API keys + HMAC", "OAuth2 client credentials", "JWT"] },
      { category: "Metering", tools: ["Stripe Usage Records", "Lago", "Custom Redis counters"] },
      { category: "Docs", tools: ["Swagger/OpenAPI", "Readme.com", "Mintlify"] },
    ],
    startHere: [
      { step: 1, action: "Find a data or logic gap", detail: "What do developers repeatedly build from scratch? Email validation, geocoding, PDF generation — wrap it in an API." },
      { step: 2, action: "Build 3 endpoints, not 30", detail: "One core capability with excellent reliability. Add endpoints only when customers ask." },
      { step: 3, action: "Publish on RapidAPI or your own docs", detail: "RapidAPI gives you distribution. Your own docs give you brand. Do both." },
      { step: 4, action: "Add metering from day one", detail: "Track every request. Use Stripe usage records or a Redis counter. Bill monthly." },
      { step: 5, action: "Write the 5-minute quickstart", detail: "curl example → language SDKs → copy-paste code. If integration takes > 5 min, you'll lose them." },
    ],
    keyMetrics: [
      "API calls per month — total volume and growth rate",
      "P99 latency — developers will leave if your API is slow",
      "Error rate — target < 0.1% 5xx errors",
      "Developer activation — % who make their first successful call",
      "Revenue per request — your unit economics",
    ],
    realExamples: [
      { name: "OpenAI API", revenue: "Billions ARR", lesson: "Simple API, massive value. Usage-based pricing scales with customer success." },
      { name: "Abstract API", revenue: "$1M+ ARR", lesson: "Suite of utility APIs (email validation, IP geolocation). Small APIs, big aggregate." },
      { name: "Lob", revenue: "$50M+ raised", lesson: "API for sending physical mail. Unsexy problem, huge market." },
    ],
    springContext: {
      headline: "Spring is built for API products — rate limiting, metering, and multi-tenant auth are first-class",
      stack: [
        "Spring Cloud Gateway for rate limiting, API key validation, and request routing",
        "Bucket4j + Spring Boot for per-customer rate limiting",
        "HandlerInterceptor to meter every request and log usage to Redis/PostgreSQL",
        "Spring Security OAuth2 Resource Server for API key and JWT auth",
        "Springdoc-openapi to auto-generate OpenAPI specs from your controllers",
        "Stripe Java SDK with @Scheduled to push usage records for billing",
      ],
    },
  },
  {
    id: "micro-saas",
    name: "Micro-SaaS",
    tagline: "One tiny tool, one specific problem, one person can run it",
    icon: "🎯",
    color: "from-emerald-500 to-green-600",
    timeToFirstDollar: "2–6 weeks",
    effortLevel: "Low",
    monthlyRevenueRange: "$100 – $10k",
    paretoInsight: "80% of micro-SaaS success comes from picking an absurdly narrow niche. 'Invoice tool for freelance translators' beats 'invoice tool' every time.",
    what: "A small, focused software tool that solves one specific problem for a narrow audience. No VC funding, no team of 20 — just you, shipping fast and keeping customers happy.",
    why: "Micro-SaaS is the fastest path from developer to business owner. Small scope means you can ship in weeks, not months. Narrow niche means less competition and easier marketing.",
    revenueModels: [
      { type: "Simple subscription", description: "One price, all features", example: "$9/month or $89/year" },
      { type: "Lifetime deal", description: "One-time payment for forever access (great for launch)", example: "$149 lifetime via AppSumo" },
      { type: "Freemium", description: "Free with limits, paid removes them", example: "3 projects free, unlimited for $12/mo" },
    ],
    techStack: [
      { category: "Full-stack", tools: ["Next.js + Prisma", "SvelteKit + Drizzle", "Spring Boot + Thymeleaf"] },
      { category: "Auth", tools: ["Clerk", "Supabase Auth", "Lucia"] },
      { category: "Payments", tools: ["Lemon Squeezy (simplest)", "Stripe", "Paddle"] },
      { category: "Database", tools: ["SQLite (Turso)", "Supabase", "PlanetScale"] },
      { category: "Hosting", tools: ["Vercel (free tier)", "Railway", "Fly.io"] },
    ],
    startHere: [
      { step: 1, action: "Browse communities for complaints", detail: "Reddit, Twitter, Indie Hackers, niche Slack groups. Look for 'I wish there was a tool that...' or 'I've been doing this manually'." },
      { step: 2, action: "Validate with a landing page", detail: "Carrd or a Next.js page. Describe the tool, collect emails. 50 signups = green light." },
      { step: 3, action: "Build in one weekend sprint", detail: "Auth + core feature + payment. Use a boilerplate (next-forge, shipfast). No custom design." },
      { step: 4, action: "Launch on Product Hunt + niche communities", detail: "Product Hunt for visibility, niche forums for your actual customers." },
      { step: 5, action: "Automate and maintain", detail: "Set up error monitoring, uptime alerts, and auto-billing. Spend 2 hrs/week max." },
    ],
    keyMetrics: [
      "MRR — even $500/month is meaningful at micro scale",
      "Weekly active users — are people actually using it?",
      "Support tickets per week — if > 5, your UX needs work",
      "Time spent per week — target < 5 hours once stable",
      "Profit margin — should be > 80% (low infrastructure costs)",
    ],
    realExamples: [
      { name: "PingPong", revenue: "$3k MRR", lesson: "Simple status page tool. One feature, done well." },
      { name: "Umami", revenue: "Open-source + cloud", lesson: "Self-hostable analytics. Cloud version is the micro-SaaS." },
      { name: "ScreenshotOne", revenue: "$5k+ MRR", lesson: "Screenshot API. One endpoint. Pure utility." },
    ],
    springContext: {
      headline: "Spring Boot is overkill for micro-SaaS but perfect if Java is your strength",
      stack: [
        "Spring Boot + Thymeleaf for server-rendered UI (no frontend framework needed)",
        "Spring Data JPA with H2 (dev) → PostgreSQL (prod) for fast prototyping",
        "Stripe Checkout Session for the simplest payment integration",
        "Spring Boot DevTools for rapid iteration",
        "Single JAR deployment to Railway or Fly.io with Docker",
        "Alternatively: use Next.js for the frontend and Spring Boot as a backend API",
      ],
    },
  },
  {
    id: "digital-products",
    name: "Digital Products",
    tagline: "Create once, sell forever — templates, tools, courses, and kits",
    icon: "📦",
    color: "from-amber-500 to-orange-500",
    timeToFirstDollar: "1–2 weeks",
    effortLevel: "Low",
    monthlyRevenueRange: "$100 – $20k+",
    paretoInsight: "80% of digital product revenue comes from solving a 'time vs money' trade-off. Developers will pay $49 to save 10 hours of setup.",
    what: "Pre-built assets that customers download and use: starter templates, component libraries, CLI tools, video courses, or ebooks. You create the asset once and sell it repeatedly with near-zero marginal cost.",
    why: "Digital products are the lowest-risk entry point. No servers to maintain, no churn to fight. Your only job is creating something valuable and marketing it. Perfect for building an audience while your SaaS is in development.",
    revenueModels: [
      { type: "One-time purchase", description: "Pay once, download forever", example: "$49 for a Next.js SaaS template" },
      { type: "Tiered bundles", description: "Basic / Pro / Complete packages", example: "$29 / $79 / $149" },
      { type: "Membership", description: "Access to all products + updates for a monthly fee", example: "$19/month for the full library" },
    ],
    techStack: [
      { category: "Storefront", tools: ["Gumroad", "Lemon Squeezy", "Shopify Digital"] },
      { category: "Content", tools: ["Notion (courses)", "GitHub (templates)", "Figma (design kits)"] },
      { category: "Marketing", tools: ["Twitter/X", "Newsletter (Buttondown)", "SEO blog"] },
      { category: "Delivery", tools: ["GitHub private repos", "License keys", "Download links"] },
    ],
    startHere: [
      { step: 1, action: "Audit your own shortcuts", detail: "What boilerplate do you copy between projects? What setup takes you 2 hours? That's your product." },
      { step: 2, action: "Package it properly", detail: "README, install script, documented config. The packaging IS the product." },
      { step: 3, action: "List on Gumroad or Lemon Squeezy", detail: "10 minutes to set up. They handle payments, delivery, and taxes." },
      { step: 4, action: "Write one viral tweet/post", detail: "Show a before/after — 'I used to spend 3 hours setting up auth. Now I run one command.'" },
      { step: 5, action: "Build in public", detail: "Share your revenue numbers, customer feedback, updates. Transparency builds trust and audience." },
    ],
    keyMetrics: [
      "Total revenue — simple and clear",
      "Conversion rate — % of page visitors who buy (target 2–5%)",
      "Average order value — upsell bundles to increase this",
      "Refund rate — target < 5%, high refunds = wrong audience",
      "Traffic sources — know where your buyers come from",
    ],
    realExamples: [
      { name: "Tailwind UI", revenue: "$10M+ total", lesson: "Component library. Perfectly packaged, massive audience." },
      { name: "ShipFast", revenue: "$1M+ total", lesson: "Next.js SaaS boilerplate. Saves developers weeks of setup." },
      { name: "Refactoring UI (book)", revenue: "$1M+ total", lesson: "Design knowledge for developers. Ebook + video course." },
    ],
    springContext: {
      headline: "Your Spring expertise IS the product — sell what you know as templates and tools",
      stack: [
        "Spring Boot starter template with auth + Stripe + multi-tenancy pre-configured",
        "Spring CLI archetype or GitHub template repo as the deliverable",
        "Gradle/Maven archetypes customers can scaffold from",
        "Sell on Gumroad with GitHub private repo access as delivery",
        "Video course: 'Production Spring Boot' using your real project as the curriculum",
        "Open-source a basic version, sell the premium version with advanced features",
      ],
    },
  },
  {
    id: "marketplace",
    name: "Marketplace / Platform",
    tagline: "Connect buyers and sellers, take a cut of every transaction",
    icon: "🏪",
    color: "from-rose-500 to-pink-600",
    timeToFirstDollar: "3–6 months",
    effortLevel: "High",
    monthlyRevenueRange: "$1k – $500k+",
    paretoInsight: "80% of marketplace success comes from solving the chicken-and-egg problem on the supply side first. Get 20 great sellers, and buyers will come.",
    what: "A platform where two sides transact — freelancers and clients, creators and consumers, providers and businesses. You facilitate the connection and take a percentage of each transaction.",
    why: "Marketplaces have the strongest network effects in software. Once both sides are active, growth becomes self-reinforcing. The platform becomes more valuable with every new participant.",
    revenueModels: [
      { type: "Transaction fee", description: "Take a percentage of each sale", example: "10–20% of each transaction" },
      { type: "Listing fee", description: "Charge sellers to list their offering", example: "$5 per listing" },
      { type: "Subscription for sellers", description: "Monthly fee for premium placement or features", example: "$29/mo for featured listings" },
      { type: "Hybrid", description: "Free to list + transaction fee + optional premium", example: "Free listing, 15% fee, $49/mo for analytics" },
    ],
    techStack: [
      { category: "Backend", tools: ["Spring Boot", "Next.js + tRPC", "Ruby on Rails"] },
      { category: "Payments", tools: ["Stripe Connect (essential)", "PayPal Commerce", "Mangopay"] },
      { category: "Search", tools: ["Elasticsearch", "Algolia", "Meilisearch"] },
      { category: "Trust & Safety", tools: ["Stripe Identity", "Custom review system", "Moderation tools"] },
      { category: "Real-time", tools: ["WebSocket chat", "Email notifications", "Push notifications"] },
    ],
    startHere: [
      { step: 1, action: "Pick a niche marketplace", detail: "Not 'a marketplace for everything' — a marketplace for freelance DevOps engineers, or handmade ceramics, or local tutors." },
      { step: 2, action: "Recruit 20 sellers manually", detail: "Email, DM, call. Get 20 quality providers before building anything complex." },
      { step: 3, action: "Build the simplest transaction flow", detail: "Profile → listing → checkout → payout. Use Stripe Connect for split payments from day one." },
      { step: 4, action: "Be the matchmaker early on", detail: "Manually connect buyers with sellers. Learn what they value. Automate later." },
      { step: 5, action: "Add trust features", detail: "Reviews, verification badges, escrow. Trust is the marketplace's core product." },
    ],
    keyMetrics: [
      "GMV (Gross Merchandise Value) — total transaction volume through the platform",
      "Take rate — your revenue as a % of GMV",
      "Liquidity — % of listings that result in a transaction",
      "Buyer-to-seller ratio — healthy is 5:1 to 10:1",
      "Repeat transaction rate — are buyers coming back?",
    ],
    realExamples: [
      { name: "Toptal", revenue: "$100M+ ARR", lesson: "Curated freelancer marketplace. Vetting supply side = premium pricing." },
      { name: "Contra", revenue: "VC-funded, growing", lesson: "Freelancer platform with 0% commission. Monetises via premium features." },
      { name: "Teachable", revenue: "Acquired for $250M", lesson: "Marketplace for online courses. Creators are the supply side." },
    ],
    springContext: {
      headline: "Spring Boot + Stripe Connect handles the hardest part — splitting payments between parties",
      stack: [
        "Stripe Connect for onboarding sellers, split payments, and automated payouts",
        "Spring Security with role-based access (BUYER, SELLER, ADMIN)",
        "Spring Data JPA with full-text search (PostgreSQL tsvector) or Elasticsearch",
        "WebSocket (STOMP) for real-time messaging between buyers and sellers",
        "Spring Events for async workflows: order placed → seller notified → escrow held → payout released",
        "@Scheduled jobs for payout batching, fraud detection, and listing expiry",
      ],
    },
  },
  {
    id: "open-core",
    name: "Open-Core",
    tagline: "Free open-source core, paid cloud or premium features",
    icon: "🔓",
    color: "from-gray-500 to-slate-600",
    timeToFirstDollar: "3–6 months",
    effortLevel: "High",
    monthlyRevenueRange: "$500 – $100k+",
    paretoInsight: "80% of open-core conversion comes from the hosted/managed version. Developers love self-hosting in theory but pay for convenience in practice.",
    what: "You open-source your core product (building trust and distribution), then monetise via a hosted cloud version, premium features, or enterprise support.",
    why: "Open-source is the most powerful distribution channel in developer tools. It builds trust, generates community contributions, and creates a moat of adoption that's nearly impossible to compete against.",
    revenueModels: [
      { type: "Managed cloud", description: "Self-host free, or pay for hosted version", example: "Free self-host, $29/mo cloud" },
      { type: "Premium features", description: "Core free, advanced features paid (SSO, audit logs, RBAC)", example: "Free for teams < 5, $15/user for enterprise" },
      { type: "Support & SLAs", description: "Enterprise support contracts", example: "$5k/year for guaranteed response times" },
      { type: "Dual license", description: "Open source for personal use, paid license for commercial", example: "AGPL + commercial license $499/year" },
    ],
    techStack: [
      { category: "Core", tools: ["Spring Boot (battle-tested)", "Go", "Rust"] },
      { category: "Distribution", tools: ["GitHub", "Docker Hub", "Helm charts"] },
      { category: "Cloud layer", tools: ["Kubernetes + Terraform", "Vercel/Railway for managed hosting", "Stripe for billing"] },
      { category: "Community", tools: ["GitHub Discussions", "Discord", "Documentation site"] },
    ],
    startHere: [
      { step: 1, action: "Build a useful tool and open-source it", detail: "Solve your own problem first. Open-source it. Get 100 GitHub stars before thinking about money." },
      { step: 2, action: "Add Docker support", detail: "docker-compose up should work. If it's hard to self-host, people will pay for cloud." },
      { step: 3, action: "Launch the cloud version", detail: "Same product, hosted by you. Stripe subscription. The convenience premium is real." },
      { step: 4, action: "Add enterprise features behind a flag", detail: "SSO, RBAC, audit logs, custom branding. These are the features enterprises will pay $1k+/month for." },
      { step: 5, action: "Nurture the community", detail: "Contributors become advocates. Advocates bring enterprises. Enterprises pay." },
    ],
    keyMetrics: [
      "GitHub stars / Docker pulls — adoption leading indicator",
      "Self-host to cloud conversion rate — target 1–5%",
      "Cloud MRR — your actual revenue",
      "Community contributions — PRs, issues, discussions per month",
      "Enterprise pipeline — # of companies in sales conversations",
    ],
    realExamples: [
      { name: "GitLab", revenue: "$400M+ ARR", lesson: "Open-source DevOps platform. Free CE, paid EE with enterprise features." },
      { name: "Supabase", revenue: "$10M+ ARR", lesson: "Open-source Firebase alternative. Self-host free, pay for managed cloud." },
      { name: "Plausible", revenue: "$100k+ MRR", lesson: "Open-source analytics. AGPL license + paid cloud = clean model." },
    ],
    springContext: {
      headline: "Spring Boot's production maturity makes it ideal for enterprise open-core",
      stack: [
        "Spring Boot as the open-source core — enterprises trust the JVM ecosystem",
        "Spring Profiles to toggle free vs premium features at runtime",
        "Docker + docker-compose for easy self-hosting distribution",
        "Spring Security for the premium features (SSO/SAML, RBAC, audit logging)",
        "Spring Boot Admin for the managed cloud's operational dashboard",
        "Testcontainers for community contributors to run tests easily",
      ],
    },
  },
]

export function getMonetisationPath(id: string): MonetisationPath | undefined {
  return monetisationPaths.find((p) => p.id === id)
}
