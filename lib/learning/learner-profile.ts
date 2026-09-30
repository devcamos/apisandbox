export interface LearnerOption<TId extends string = string> {
  id: TId
  label: string
  description: string
}

export type EngineeringRoleId =
  | "software-engineer"
  | "backend-engineer"
  | "full-stack-engineer"
  | "platform-engineer"
  | "tech-lead"
  | "architect"

export type ExperienceLevelId =
  | "beginner"
  | "intermediate"
  | "senior"
  | "principal"

export type LanguageId =
  | "typescript"
  | "java"
  | "csharp"
  | "python"
  | "go"
  | "undecided"

export type RuntimeEnvironmentId =
  | "containers"
  | "kubernetes"
  | "serverless"
  | "virtual-machines"
  | "local"
  | "undecided"

export type CloudProviderId = "aws" | "azure" | "gcp" | "hybrid" | "none" | "undecided"

export type LearningGoalId =
  | "build-foundations"
  | "production-readiness"
  | "system-design"
  | "career-progression"
  | "team-standards"

export const ENGINEERING_ROLE_OPTIONS: readonly LearnerOption<EngineeringRoleId>[] = [
  { id: "software-engineer", label: "Software engineer", description: "Build dependable product and platform software." },
  { id: "backend-engineer", label: "Backend engineer", description: "Focus on APIs, data, integrations, and services." },
  { id: "full-stack-engineer", label: "Full-stack engineer", description: "Connect user experiences to production backends." },
  { id: "platform-engineer", label: "Platform engineer", description: "Enable delivery, reliability, and developer productivity." },
  { id: "tech-lead", label: "Tech lead", description: "Guide implementation quality and team-level decisions." },
  { id: "architect", label: "Architect / principal", description: "Shape systems, standards, and organisation-wide trade-offs." },
]

export const EXPERIENCE_LEVEL_OPTIONS: readonly LearnerOption<ExperienceLevelId>[] = [
  { id: "beginner", label: "Beginner", description: "I need the complete mental model and practical vocabulary." },
  { id: "intermediate", label: "Working engineer", description: "I can build APIs and want stronger production judgement." },
  { id: "senior", label: "Senior engineer", description: "I want difficult scenarios, failure analysis, and architecture depth." },
  { id: "principal", label: "Staff / principal", description: "I want system, organisational, cost, and governance trade-offs." },
]

export const LANGUAGE_OPTIONS: readonly LearnerOption<LanguageId>[] = [
  { id: "typescript", label: "TypeScript", description: "Node.js services and full-stack API applications." },
  { id: "java", label: "Java", description: "JVM services and enterprise integration platforms." },
  { id: "csharp", label: "C#", description: ".NET services and enterprise application platforms." },
  { id: "python", label: "Python", description: "API services, automation, data, and AI workloads." },
  { id: "go", label: "Go", description: "Cloud-native services and infrastructure tooling." },
  { id: "undecided", label: "Not sure yet", description: "Start language-neutral and choose after the foundations." },
]

export const FRAMEWORK_OPTIONS: Readonly<Record<LanguageId, readonly LearnerOption[]>> = {
  typescript: [
    { id: "nextjs", label: "Next.js", description: "App Router, Route Handlers, Server Actions, and Node.js." },
    { id: "express", label: "Express", description: "Minimal Node.js HTTP services and middleware." },
    { id: "nestjs", label: "NestJS", description: "Structured TypeScript services with modules and dependency injection." },
  ],
  java: [
    { id: "spring-boot", label: "Spring Boot", description: "Enterprise Java APIs, data, security, and operations." },
    { id: "quarkus", label: "Quarkus", description: "Cloud-native Java services with fast startup." },
  ],
  csharp: [
    { id: "aspnet-core", label: "ASP.NET Core", description: "Modern .NET APIs, middleware, and dependency injection." },
  ],
  python: [
    { id: "fastapi", label: "FastAPI", description: "Typed async APIs with Pydantic and OpenAPI." },
    { id: "django-rest", label: "Django REST Framework", description: "Batteries-included APIs on Django." },
  ],
  go: [
    { id: "go-stdlib", label: "Standard library", description: "Explicit services built on net/http." },
    { id: "gin", label: "Gin", description: "A compact HTTP framework for Go services." },
  ],
  undecided: [
    { id: "undecided", label: "Choose later", description: "Keep examples language-neutral for now." },
  ],
}

export const RUNTIME_ENVIRONMENT_OPTIONS: readonly LearnerOption<RuntimeEnvironmentId>[] = [
  { id: "containers", label: "Containers", description: "Docker or managed container services." },
  { id: "kubernetes", label: "Kubernetes", description: "Orchestrated services and platform operations." },
  { id: "serverless", label: "Serverless", description: "Functions and managed event-driven runtimes." },
  { id: "virtual-machines", label: "Virtual machines", description: "Long-running services on managed hosts." },
  { id: "local", label: "Local development", description: "Learn locally before choosing production infrastructure." },
  { id: "undecided", label: "Not sure yet", description: "Choose after the application model is clear." },
]

export const CLOUD_PROVIDER_OPTIONS: readonly LearnerOption<CloudProviderId>[] = [
  { id: "aws", label: "AWS", description: "Amazon Web Services." },
  { id: "azure", label: "Azure", description: "Microsoft Azure." },
  { id: "gcp", label: "Google Cloud", description: "Google Cloud Platform." },
  { id: "hybrid", label: "Hybrid / multi-cloud", description: "More than one cloud or mixed on-premises systems." },
  { id: "none", label: "No cloud yet", description: "Keep the path platform-neutral." },
  { id: "undecided", label: "Not sure yet", description: "Decide after the production foundations." },
]

export const LEARNING_GOAL_OPTIONS: readonly LearnerOption<LearningGoalId>[] = [
  { id: "build-foundations", label: "Build strong foundations", description: "Understand the full path from code to dependable integration." },
  { id: "production-readiness", label: "Ship production systems", description: "Strengthen reliability, security, observability, and operations." },
  { id: "system-design", label: "Improve system design", description: "Practise distributed-system and architecture trade-offs." },
  { id: "career-progression", label: "Progress toward principal", description: "Build evidence across implementation, judgement, and leadership." },
  { id: "team-standards", label: "Create team standards", description: "Turn engineering knowledge into repeatable organisational practice." },
]

export const FRAMEWORK_IDS = Object.values(FRAMEWORK_OPTIONS).flatMap((options) => options.map((option) => option.id))

export interface LearnerProfileSelection {
  engineeringRole: string | null
  experienceLevel: string | null
  primaryLanguage: string | null
  primaryFramework: string | null
  runtimeEnvironment: string | null
  cloudProvider: string | null
  learningGoal: string | null
}

export interface LearningPathStep {
  id: "foundation" | "stack" | "growth"
  label: string
  title: string
  description: string
  href: string
}

export interface StackBlueprintItem {
  concept: string
  implementation: string
  reason: string
}

const STACK_BLUEPRINTS: Readonly<Record<string, readonly StackBlueprintItem[]>> = {
  nextjs: [
    { concept: "Runtime", implementation: "Node.js runtime and the App Router", reason: "Know which code runs on the server, in the browser, or at the edge." },
    { concept: "HTTP boundary", implementation: "Route Handlers and Server Actions", reason: "Keep external HTTP contracts separate from internal mutations." },
    { concept: "Validation", implementation: "Zod at trust boundaries", reason: "Reject malformed input before it reaches domain logic." },
    { concept: "Dependency calls", implementation: "fetch with timeouts and explicit error mapping", reason: "Treat every remote call as a failure boundary." },
    { concept: "Verification", implementation: "Vitest and Playwright", reason: "Prove domain behaviour and complete user flows." },
    { concept: "Operations", implementation: "Structured logs, traces, health, and deployment analytics", reason: "Make production behaviour explainable." },
  ],
  express: [
    { concept: "Runtime", implementation: "Node.js process and event loop", reason: "Understand concurrency, blocking work, and process lifecycle." },
    { concept: "HTTP boundary", implementation: "Routers and middleware", reason: "Keep transport concerns ordered and explicit." },
    { concept: "Validation", implementation: "Zod or JSON Schema", reason: "Enforce contracts before business logic." },
    { concept: "Dependency calls", implementation: "fetch or undici with timeouts", reason: "Bound latency and classify upstream failures." },
    { concept: "Verification", implementation: "Vitest and Supertest", reason: "Test handlers through the real HTTP boundary." },
    { concept: "Operations", implementation: "OpenTelemetry, structured logs, and health endpoints", reason: "Support diagnosis under load and failure." },
  ],
  nestjs: [
    { concept: "Runtime", implementation: "Node.js with Nest modules and providers", reason: "Make process lifecycle and dependency ownership explicit." },
    { concept: "HTTP boundary", implementation: "Controllers, guards, pipes, and interceptors", reason: "Place each cross-cutting concern at the correct boundary." },
    { concept: "Validation", implementation: "ValidationPipe and explicit DTO contracts", reason: "Keep transport data separate from domain state." },
    { concept: "Dependency calls", implementation: "HttpModule with timeout and retry policy", reason: "Centralise remote-call resilience." },
    { concept: "Verification", implementation: "Jest and Nest testing modules", reason: "Verify units and assembled application behaviour." },
    { concept: "Operations", implementation: "OpenTelemetry, Terminus, and structured logs", reason: "Expose health and request evidence." },
  ],
  "spring-boot": [
    { concept: "Runtime", implementation: "JVM, Spring application context, and managed beans", reason: "Understand lifecycle, threading, and dependency ownership." },
    { concept: "HTTP boundary", implementation: "Controllers, filters, and exception advice", reason: "Keep transport behaviour consistent across services." },
    { concept: "Validation", implementation: "Jakarta Validation and typed request models", reason: "Make invalid states difficult to introduce." },
    { concept: "Dependency calls", implementation: "RestClient or WebClient with Resilience4j", reason: "Apply deliberate timeout, retry, and circuit-breaker policy." },
    { concept: "Verification", implementation: "JUnit, MockMvc, and Testcontainers", reason: "Test contracts against realistic infrastructure." },
    { concept: "Operations", implementation: "Actuator, Micrometer, and OpenTelemetry", reason: "Connect application behaviour to production evidence." },
  ],
  quarkus: [
    { concept: "Runtime", implementation: "JVM or native image with CDI", reason: "Understand build-time optimisation and runtime lifecycle." },
    { concept: "HTTP boundary", implementation: "Jakarta REST resources and filters", reason: "Keep protocols and domain logic separate." },
    { concept: "Validation", implementation: "Hibernate Validator", reason: "Enforce request and domain constraints consistently." },
    { concept: "Dependency calls", implementation: "REST Client with fault tolerance", reason: "Make remote failures bounded and observable." },
    { concept: "Verification", implementation: "Quarkus Test and Testcontainers", reason: "Verify the assembled runtime with realistic dependencies." },
    { concept: "Operations", implementation: "SmallRye Health, Metrics, and OpenTelemetry", reason: "Expose operational readiness and request traces." },
  ],
  "aspnet-core": [
    { concept: "Runtime", implementation: ".NET runtime, host, and dependency injection", reason: "Understand service lifecycle, scopes, and concurrency." },
    { concept: "HTTP boundary", implementation: "Minimal APIs or controllers with middleware", reason: "Keep authentication, errors, and contracts consistent." },
    { concept: "Validation", implementation: "Data annotations or FluentValidation", reason: "Reject invalid input before domain operations." },
    { concept: "Dependency calls", implementation: "HttpClientFactory with resilience handlers", reason: "Control connection reuse, timeout, retry, and circuit policy." },
    { concept: "Verification", implementation: "xUnit and WebApplicationFactory", reason: "Test behaviour through the real application boundary." },
    { concept: "Operations", implementation: "Health checks, OpenTelemetry, and structured logging", reason: "Make services supportable in production." },
  ],
  fastapi: [
    { concept: "Runtime", implementation: "Python, ASGI, and Uvicorn", reason: "Understand async execution and worker boundaries." },
    { concept: "HTTP boundary", implementation: "Path operations and dependencies", reason: "Separate transport, policy, and domain concerns." },
    { concept: "Validation", implementation: "Pydantic models", reason: "Turn API contracts into executable validation." },
    { concept: "Dependency calls", implementation: "httpx with explicit timeout policy", reason: "Avoid unbounded waits and ambiguous failures." },
    { concept: "Verification", implementation: "pytest and TestClient", reason: "Verify functions and HTTP contracts." },
    { concept: "Operations", implementation: "OpenTelemetry, structured logs, and health endpoints", reason: "Provide evidence for production diagnosis." },
  ],
  "django-rest": [
    { concept: "Runtime", implementation: "Python with WSGI or ASGI workers", reason: "Understand request concurrency and process scaling." },
    { concept: "HTTP boundary", implementation: "DRF views, permissions, and serializers", reason: "Keep transport policy explicit and reusable." },
    { concept: "Validation", implementation: "Serializer and domain validation", reason: "Protect both the API contract and stored state." },
    { concept: "Dependency calls", implementation: "httpx with timeout and error translation", reason: "Isolate external failures from internal contracts." },
    { concept: "Verification", implementation: "pytest-django and APIClient", reason: "Test HTTP and persistence behaviour together." },
    { concept: "Operations", implementation: "OpenTelemetry, health checks, and structured logs", reason: "Make worker and request behaviour visible." },
  ],
  "go-stdlib": [
    { concept: "Runtime", implementation: "Go processes and goroutines", reason: "Understand concurrency, cancellation, and process lifecycle." },
    { concept: "HTTP boundary", implementation: "net/http handlers and middleware", reason: "Keep routing and cross-cutting policy explicit." },
    { concept: "Validation", implementation: "Typed decoding and explicit validation", reason: "Reject malformed or incomplete requests early." },
    { concept: "Dependency calls", implementation: "http.Client with context deadlines", reason: "Propagate cancellation and bound remote latency." },
    { concept: "Verification", implementation: "testing and httptest", reason: "Test handlers using the standard HTTP model." },
    { concept: "Operations", implementation: "OpenTelemetry, pprof, health, and structured logs", reason: "Support performance and failure diagnosis." },
  ],
  gin: [
    { concept: "Runtime", implementation: "Go processes and goroutines", reason: "Understand cancellation, concurrency, and lifecycle." },
    { concept: "HTTP boundary", implementation: "Gin handlers and middleware", reason: "Keep request policy composable and ordered." },
    { concept: "Validation", implementation: "Binding with explicit validator rules", reason: "Protect handler and domain assumptions." },
    { concept: "Dependency calls", implementation: "http.Client with context deadlines", reason: "Bound remote calls and propagate cancellation." },
    { concept: "Verification", implementation: "testing and httptest", reason: "Verify routes through HTTP." },
    { concept: "Operations", implementation: "OpenTelemetry, health, and structured logs", reason: "Make request behaviour diagnosable." },
  ],
  undecided: [
    { concept: "Runtime", implementation: "Program, process, memory, and concurrency", reason: "These concepts transfer to every language." },
    { concept: "HTTP boundary", implementation: "Router, handler, and middleware concepts", reason: "Every framework expresses the same request lifecycle." },
    { concept: "Validation", implementation: "Schema and domain constraints", reason: "Trust boundaries exist independently of tooling." },
    { concept: "Dependency calls", implementation: "Timeout, retry, idempotency, and error mapping", reason: "Remote failure is universal." },
    { concept: "Verification", implementation: "Unit, contract, integration, and end-to-end tests", reason: "Evidence should span every system boundary." },
    { concept: "Operations", implementation: "Logs, metrics, traces, health, and alerts", reason: "Production systems must explain their behaviour." },
  ],
}

function findLabel(options: readonly LearnerOption[], id: string | null, fallback: string) {
  return options.find((option) => option.id === id)?.label ?? fallback
}

export function getFrameworkOptions(language: string | null): readonly LearnerOption[] {
  if (!language || !(language in FRAMEWORK_OPTIONS)) return []
  return FRAMEWORK_OPTIONS[language as LanguageId]
}

export function isFrameworkCompatible(language: string | null, framework: string | null) {
  if (!language || !framework) return false
  return getFrameworkOptions(language).some((option) => option.id === framework)
}

export function isLearnerProfileComplete(profile: LearnerProfileSelection) {
  return Boolean(
    profile.engineeringRole &&
      profile.experienceLevel &&
      profile.primaryLanguage &&
      profile.primaryFramework &&
      profile.learningGoal &&
      isFrameworkCompatible(profile.primaryLanguage, profile.primaryFramework),
  )
}

export function getLearnerProfileLabels(profile: LearnerProfileSelection) {
  return {
    role: findLabel(ENGINEERING_ROLE_OPTIONS, profile.engineeringRole, "Engineer"),
    experience: findLabel(EXPERIENCE_LEVEL_OPTIONS, profile.experienceLevel, "Unplaced"),
    language: findLabel(LANGUAGE_OPTIONS, profile.primaryLanguage, "Language-neutral"),
    framework: findLabel(getFrameworkOptions(profile.primaryLanguage), profile.primaryFramework, "Framework-neutral"),
    runtime: findLabel(RUNTIME_ENVIRONMENT_OPTIONS, profile.runtimeEnvironment, "Runtime not selected"),
    cloud: findLabel(CLOUD_PROVIDER_OPTIONS, profile.cloudProvider, "Cloud not selected"),
    goal: findLabel(LEARNING_GOAL_OPTIONS, profile.learningGoal, "Build engineering judgement"),
  }
}

function getGrowthStep(experienceLevel: string | null) {
  if (experienceLevel === "principal") {
    return {
      title: "Principal architecture judgement",
      description: "Practise governance, migration, cost, risk, and organisation-wide trade-offs.",
      href: "/phase-4",
    }
  }

  if (experienceLevel === "senior") {
    return {
      title: "Distributed-system decisions",
      description: "Work through failure, consistency, observability, and service-boundary scenarios.",
      href: "/phase-3",
    }
  }

  return {
    title: "Production integrations",
    description: "Apply authentication, resilience, validation, and operational evidence.",
    href: "/phase-2",
  }
}

export function getPersonalizedLearningPath(profile: LearnerProfileSelection): readonly LearningPathStep[] {
  const labels = getLearnerProfileLabels(profile)
  const foundationDescription = profile.experienceLevel === "senior" || profile.experienceLevel === "principal"
    ? "Validate the universal model quickly, then use weak areas to focus the deeper path."
    : "Build the causal model from program state through HTTP contracts and dependable integrations."

  const growthStep = getGrowthStep(profile.experienceLevel)

  return [
    {
      id: "foundation",
      label: "1 · Universal foundation",
      title: "API Foundations",
      description: foundationDescription,
      href: "/learn/api-foundations",
    },
    {
      id: "stack",
      label: "2 · Your implementation",
      title: `${labels.framework} with ${labels.language}`,
      description: `Map runtime, HTTP, validation, testing, and operations into ${labels.framework}.`,
      href: "/learn/stack",
    },
    {
      id: "growth",
      label: "3 · Enterprise growth",
      ...growthStep,
    },
  ]
}

export function getStackBlueprint(framework: string | null): readonly StackBlueprintItem[] {
  if (!framework) return STACK_BLUEPRINTS.undecided
  return STACK_BLUEPRINTS[framework] ?? STACK_BLUEPRINTS.undecided
}
