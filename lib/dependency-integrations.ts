export type DependencyIntegrationType =
  | "framework"
  | "payment"
  | "database"
  | "auth"
  | "testing"
  | "quality"
  | "ui"
  | "deployment"

export interface DependencyIntegration {
  id: string
  name: string
  type: DependencyIntegrationType
  purpose: string
  packageNames: string[]
  envVars: string[]
  routes: string[]
  components: string[]
  serviceFunctions: string[]
  prismaModels: string[]
  learningAreas: string[]
}

export const dependencyIntegrations: DependencyIntegration[] = [
  {
    id: "stripe",
    name: "Stripe",
    type: "payment",
    purpose: "Premium subscription checkout, webhook provisioning, and billing portal management.",
    packageNames: ["stripe"],
    envVars: ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID", "STRIPE_WEBHOOK_SECRET"],
    routes: ["/api/checkout", "/api/webhooks/stripe", "/api/billing/portal"],
    components: ["ManageSubscriptionButton", "Upgrade page"],
    serviceFunctions: [
      "requireStripeClient",
      "dispatchStripeWebhookEvent",
      "applyPremiumSubscription",
      "downgradeToFreeSubscription",
    ],
    prismaModels: ["User"],
    learningAreas: ["Phase 7: Monetisation", "SaaS billing", "Webhooks"],
  },
  {
    id: "prisma",
    name: "Prisma",
    type: "database",
    purpose: "Typed PostgreSQL data access for users, auth, subscriptions, API tokens, and learner progress.",
    packageNames: ["@prisma/client", "prisma"],
    envVars: ["DATABASE_URL"],
    routes: ["/api/auth/*", "/api/phase-progress/*", "/api/learning/progress", "/api/api-tokens/*"],
    components: ["PhaseProgressOverview", "LessonTracker"],
    serviceFunctions: ["prisma", "createUserWithInitialData", "getLearningProgressForUser"],
    prismaModels: ["User", "UserPhaseProgress", "LearningEnrollment", "LearningCheckpointProgress", "ApiToken"],
    learningAreas: ["Database fundamentals", "Auth persistence", "Progress tracking"],
  },
  {
    id: "nextjs",
    name: "Next.js App Router",
    type: "framework",
    purpose: "Application routing, server route handlers, layouts, and static/dynamic pages.",
    packageNames: ["next", "react", "react-dom"],
    envVars: ["NEXT_PUBLIC_APP_URL"],
    routes: ["app/**/page.tsx", "app/api/**/route.ts"],
    components: ["Navigation", "PhaseLayout", "SubscriptionGate"],
    serviceFunctions: ["GET route handlers", "POST route handlers", "middleware/proxy auth checks"],
    prismaModels: [],
    learningAreas: ["API route design", "Server/client boundaries", "Deployment architecture"],
  },
  {
    id: "auth",
    name: "NextAuth-compatible auth + custom JWT",
    type: "auth",
    purpose: "Email/password, Google identity linking, session refresh, and protected API access.",
    packageNames: ["next-auth", "@auth/prisma-adapter", "bcryptjs", "google-auth-library"],
    envVars: ["AUTH_SECRET", "AUTH_JWT_SECRET", "NEXTAUTH_SECRET", "GOOGLE_CLIENT_ID"],
    routes: ["/api/auth/login", "/api/auth/signup", "/api/auth/google", "/api/auth/me"],
    components: ["SessionProvider", "LoginForm", "SignupForm"],
    serviceFunctions: ["verifyJwtToken", "requireAuthenticatedUser", "loginWithPassword", "loginWithGoogle"],
    prismaModels: ["User", "Account", "Session", "VerificationToken", "UserProfile"],
    learningAreas: ["Identity", "Session security", "OAuth vs user storage"],
  },
  {
    id: "vercel",
    name: "Vercel",
    type: "deployment",
    purpose: "Production hosting, preview deployments, environment configuration, and analytics.",
    packageNames: ["@vercel/analytics"],
    envVars: ["VERCEL_ENV", "NEXT_PUBLIC_FF_ANALYTICS"],
    routes: ["/api/health/saas", "/api/health/db"],
    components: ["AnalyticsProvider"],
    serviceFunctions: ["evaluateSaasReadiness"],
    prismaModels: [],
    learningAreas: ["Deployment", "Preview environments", "SaaS readiness"],
  },
  {
    id: "vitest-playwright-sonar",
    name: "Vitest, Playwright, and SonarCloud",
    type: "quality",
    purpose: "Unit coverage, browser smoke tests, and quality-gate reporting.",
    packageNames: ["vitest", "@playwright/test", "@vitest/coverage-v8"],
    envVars: ["SONAR_TOKEN"],
    routes: ["tests/unit/**", "tests/*.spec.ts"],
    components: ["Playwright report", "SonarCloud dashboard"],
    serviceFunctions: ["npm run test:unit:ci", "npm run verify:ci", "npm run sonar:status"],
    prismaModels: [],
    learningAreas: ["Verification", "Quality gates", "Regression testing"],
  },
  {
    id: "lucide-tailwind",
    name: "Lucide React and Tailwind CSS",
    type: "ui",
    purpose: "Iconography and utility-first styling for the learning interface.",
    packageNames: ["lucide-react", "tailwindcss"],
    envVars: [],
    routes: ["app/**/page.tsx"],
    components: ["Navigation", "PhaseQuiz", "LessonTracker", "Dependency Integration page"],
    serviceFunctions: [],
    prismaModels: [],
    learningAreas: ["Interface design", "Learning UI", "Responsive layout"],
  },
]

export function getDependencyIntegrations() {
  return dependencyIntegrations
}

export function findDependencyIntegrationById(id: string) {
  return dependencyIntegrations.find((integration) => integration.id === id) ?? null
}

export function groupDependencyIntegrationsByType() {
  return dependencyIntegrations.reduce<Record<DependencyIntegrationType, DependencyIntegration[]>>(
    (groups, integration) => {
      groups[integration.type] = [...(groups[integration.type] ?? []), integration]
      return groups
    },
    {} as Record<DependencyIntegrationType, DependencyIntegration[]>,
  )
}
