export interface LessonCheckpoint {
  id: string
  label: string
  prompt: string
  expectedLearning?: string
  answerGuide?: string
  projectTask?: string
}

export interface LessonModule {
  id: string
  title: string
  urgency: string
  checkpoints: LessonCheckpoint[]
}

export interface PhaseLessonPlan {
  phase: number
  title: string
  structureLabel: string
  modules: LessonModule[]
}

export const phaseLessonPlans: Record<number, PhaseLessonPlan> = {
  0: {
    phase: 0,
    title: "Fundamentals Progress Tracker",
    structureLabel: "Build-first fundamentals",
    modules: [
      {
        id: "async-core",
        title: "Callbacks and Async",
        urgency: "Auth flows and API calls break fast when async control is sloppy.",
        checkpoints: [
          { id: "observe", label: "Observe", prompt: "Explain what fails when you forget to await a promise in an auth callback." },
          { id: "mechanics", label: "Mechanics", prompt: "Trace request -> callback -> response with one concrete example." },
          { id: "drill", label: "Drill", prompt: "Implement one async flow with error handling and timeout." },
          { id: "verify", label: "Verify", prompt: "Show how you detect and log rejected promises." },
        ],
      },
      {
        id: "http-json",
        title: "HTTP and JSON",
        urgency: "Most integration defects are contract misunderstandings, not code syntax.",
        checkpoints: [
          { id: "observe", label: "Observe", prompt: "List which status codes your endpoint returns and why." },
          { id: "mechanics", label: "Mechanics", prompt: "Map one request body and response body schema." },
          { id: "drill", label: "Drill", prompt: "Build one endpoint with strict validation and error shape." },
          { id: "verify", label: "Verify", prompt: "Test malformed payloads and confirm error responses are stable." },
        ],
      },
      {
        id: "vm-basics",
        title: "VM and Runtime Basics",
        urgency: "Infra costs and latency explode when runtime constraints are ignored.",
        checkpoints: [
          { id: "observe", label: "Observe", prompt: "Identify one workload that should not run on your default VM size." },
          { id: "mechanics", label: "Mechanics", prompt: "Explain CPU, memory, and disk pressure signals for your app." },
          { id: "drill", label: "Drill", prompt: "Pick one scaling action and justify it with a metric." },
          { id: "verify", label: "Verify", prompt: "Define a rollback trigger if scaling harms latency." },
        ],
      },
    ],
  },
  1: {
    phase: 1,
    title: "Integration Mindset Tracker",
    structureLabel: "Decision-first architecture lens",
    modules: [
      {
        id: "rest-vs-graphql",
        title: "REST vs GraphQL",
        urgency: "Wrong protocol choice creates permanent complexity tax.",
        checkpoints: [
          { id: "context", label: "Context", prompt: "What product requirement forces this protocol decision?" },
          { id: "model", label: "Model", prompt: "Sketch request/response shape for both choices." },
          { id: "contrast", label: "Contrast", prompt: "State one cost and one performance difference." },
          { id: "decision", label: "Decision", prompt: "Choose one and defend it with constraints." },
        ],
      },
      {
        id: "sync-vs-async",
        title: "Sync vs Async Integration",
        urgency: "Latency SLOs and reliability targets conflict unless flow is explicit.",
        checkpoints: [
          { id: "context", label: "Context", prompt: "Define user-visible latency requirement." },
          { id: "model", label: "Model", prompt: "Trace dependency chain and failure surface." },
          { id: "contrast", label: "Contrast", prompt: "Compare coupling and retry behavior." },
          { id: "decision", label: "Decision", prompt: "Pick flow model and specify fallback behavior." },
        ],
      },
      {
        id: "contract-style",
        title: "Contract Style",
        urgency: "Unclear contracts cause churn between teams and systems.",
        checkpoints: [
          { id: "context", label: "Context", prompt: "Who consumes this contract and how often does it change?" },
          { id: "model", label: "Model", prompt: "Define versioning and backward-compatibility rules." },
          { id: "contrast", label: "Contrast", prompt: "Compare OpenAPI vs schema-first alternatives for your use case." },
          { id: "decision", label: "Decision", prompt: "Lock the contract governance rule for breaking changes." },
        ],
      },
    ],
  },
  2: {
    phase: 2,
    title: "Third-Party Integration Tracker",
    structureLabel: "Operate-safe integration workflow",
    modules: [
      {
        id: "oauth-flow",
        title: "OAuth2 Integration",
        urgency: "Token and callback mistakes become account takeovers and outages.",
        checkpoints: [
          { id: "integrity", label: "Integrity", prompt: "Define state/nonce checks and token validation path." },
          { id: "mechanics", label: "Mechanics", prompt: "Trace auth code -> token -> refresh flow." },
          { id: "failure", label: "Failure", prompt: "List token expiry and provider outage handling." },
          { id: "ops", label: "Ops", prompt: "Set alerts for auth failure and refresh error rates." },
        ],
      },
      {
        id: "api-key",
        title: "API Key Integrations",
        urgency: "Leaked keys create immediate abuse and bill shock.",
        checkpoints: [
          { id: "integrity", label: "Integrity", prompt: "Show where keys are stored and rotated." },
          { id: "mechanics", label: "Mechanics", prompt: "Implement request signing/header strategy." },
          { id: "failure", label: "Failure", prompt: "Define behavior for 401/429/5xx responses." },
          { id: "ops", label: "Ops", prompt: "Track per-key usage, error, and spend metrics." },
        ],
      },
      {
        id: "resilience",
        title: "Resilience Layer",
        urgency: "External API instability must not cascade into your core product.",
        checkpoints: [
          { id: "integrity", label: "Integrity", prompt: "Set timeout and retry envelope per endpoint." },
          { id: "mechanics", label: "Mechanics", prompt: "Implement exponential backoff and circuit breaker states." },
          { id: "failure", label: "Failure", prompt: "Design fallback data path when provider is down." },
          { id: "ops", label: "Ops", prompt: "Define SLO and breaker-trip alert thresholds." },
        ],
      },
    ],
  },
  3: {
    phase: 3,
    title: "Inter-Service Communication Tracker",
    structureLabel: "Distributed-systems pressure model",
    modules: [
      {
        id: "queue-flow",
        title: "Queue-Based Workflows",
        urgency: "Without controlled async boundaries, spikes become outages.",
        checkpoints: [
          { id: "topology", label: "Topology", prompt: "Define producers, consumers, DLQ, and ownership." },
          { id: "flow", label: "Flow", prompt: "Specify idempotency key and processing semantics." },
          { id: "stress", label: "Stress", prompt: "Predict queue lag behavior at 10x write bursts." },
          { id: "recover", label: "Recover", prompt: "Document replay and poison-message handling." },
        ],
      },
      {
        id: "grpc-service",
        title: "gRPC Service Mesh",
        urgency: "Low-latency service calls fail hard without contract discipline.",
        checkpoints: [
          { id: "topology", label: "Topology", prompt: "Map call graph and high-fanout paths." },
          { id: "flow", label: "Flow", prompt: "Define protobuf schema evolution rules." },
          { id: "stress", label: "Stress", prompt: "Identify connection pool bottleneck at high concurrency." },
          { id: "recover", label: "Recover", prompt: "Set retry budget and deadline propagation policy." },
        ],
      },
      {
        id: "observability",
        title: "Observability Across Services",
        urgency: "You cannot debug what you cannot correlate.",
        checkpoints: [
          { id: "topology", label: "Topology", prompt: "Define trace boundaries and service naming." },
          { id: "flow", label: "Flow", prompt: "Propagate request/correlation IDs end-to-end." },
          { id: "stress", label: "Stress", prompt: "Decide sample rate under peak traffic." },
          { id: "recover", label: "Recover", prompt: "Pinpoint first responder dashboard for incident triage." },
        ],
      },
    ],
  },
  4: {
    phase: 4,
    title: "Principal System Design Tracker",
    structureLabel: "Constraint-driven mini-lessons",
    modules: [
      {
        id: "caching-layer",
        title: "Caching Layer",
        urgency: "DB saturation and latency spikes will kill conversion under read-heavy traffic.",
        checkpoints: [
          { id: "trigger", label: "Trigger", prompt: "Write the production pain that forces caching into scope." },
          {
            id: "existence",
            label: "Existence",
            prompt: "What breaks first if cache does not exist?",
            expectedLearning: "Caching exists to reduce repeated-read pressure on expensive dependencies.",
            answerGuide: "Name the first bottleneck, impacted users, and business damage.",
            projectTask: "Run one endpoint with cache disabled and capture p95 + DB load.",
          },
          {
            id: "mechanics",
            label: "Mechanics",
            prompt: "Trace cache-aside flow including miss/write path.",
            expectedLearning: "You can explain hit/miss behavior, state ownership, and invalidation points.",
            answerGuide: "Write request path, cache key, miss path, write-back, and invalidation trigger.",
            projectTask: "Implement cache-aside for one read endpoint and log hit/miss.",
          },
          {
            id: "contrast",
            label: "Contrast",
            prompt: "Compare p99, cost, and failure risk with vs without cache.",
            expectedLearning: "You can defend why cache is a cost/latency lever, not free complexity.",
            answerGuide: "Provide baseline metrics and post-cache metrics with one trade-off.",
            projectTask: "Record before/after metrics from a load test.",
          },
          {
            id: "stress",
            label: "Stress",
            prompt: "Model hot-key and stampede behavior at 10x traffic.",
            expectedLearning: "You can predict and mitigate cache stampede risks.",
            answerGuide: "Identify first hotspot and mitigation (jitter/single-flight/pre-warm).",
            projectTask: "Simulate key expiry burst and validate mitigation.",
          },
          {
            id: "failure",
            label: "Failure",
            prompt: "Define fallback when cache latency spikes or shard fails.",
            expectedLearning: "You can prevent cache failure from turning into DB meltdown.",
            answerGuide: "Specify fail-open/fail-closed, shed strategy, and fallback response.",
            projectTask: "Inject cache timeout and observe fallback behavior.",
          },
          {
            id: "tradeoffs",
            label: "Trade-offs",
            prompt: "State what freshness you sacrifice for speed.",
            expectedLearning: "You can explicitly choose consistency vs latency.",
            answerGuide: "Define acceptable staleness window and where it is not allowed.",
            projectTask: "Document endpoints that cannot serve stale data.",
          },
          {
            id: "retrieval",
            label: "Retrieval",
            prompt: "Ask one scenario question you would use in design review.",
            expectedLearning: "You can evaluate another design with pressure-case questions.",
            answerGuide: "Question should force a metric-backed design decision.",
            projectTask: "Use your question in a peer review and record the response.",
          },
        ],
      },
      {
        id: "queue-system",
        title: "Queue System",
        urgency: "Write bursts without buffering create dropped work and cascading failures.",
        checkpoints: [
          { id: "trigger", label: "Trigger", prompt: "Describe burst traffic incident that requires a queue." },
          { id: "existence", label: "Existence", prompt: "Which service fails first if writes stay synchronous?" },
          { id: "mechanics", label: "Mechanics", prompt: "Define producer, consumer, retry, DLQ, and idempotency." },
          { id: "contrast", label: "Contrast", prompt: "Compare throughput and correctness with direct writes." },
          { id: "stress", label: "Stress", prompt: "Predict queue lag and backlog recovery window at 10x burst." },
          { id: "failure", label: "Failure", prompt: "Explain poison-message and partial-consumer outage behavior." },
          { id: "tradeoffs", label: "Trade-offs", prompt: "Name the consistency and latency trade-offs accepted." },
          { id: "retrieval", label: "Retrieval", prompt: "Write one scenario where queue is the wrong choice." },
        ],
      },
      {
        id: "rate-limiter",
        title: "Rate Limiter",
        urgency: "Without rate control, abuse and retries can take down core APIs.",
        checkpoints: [
          { id: "trigger", label: "Trigger", prompt: "State concrete abuse or spike condition you must survive." },
          { id: "existence", label: "Existence", prompt: "Which dependency gets protected by this limiter?" },
          { id: "mechanics", label: "Mechanics", prompt: "Choose algorithm (token bucket/sliding window) and keying strategy." },
          { id: "contrast", label: "Contrast", prompt: "Compare fail-open vs fail-closed behavior and impact." },
          { id: "stress", label: "Stress", prompt: "Model burst and steady traffic outcomes." },
          { id: "failure", label: "Failure", prompt: "Explain distributed limiter drift/partition edge case." },
          { id: "tradeoffs", label: "Trade-offs", prompt: "Document fairness vs simplicity decision." },
          { id: "retrieval", label: "Retrieval", prompt: "Write one interview-grade scenario question." },
        ],
      },
    ],
  },
}

export function getPhaseLessonPlan(phase: number): PhaseLessonPlan | null {
  return phaseLessonPlans[phase] ?? null
}
