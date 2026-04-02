export interface ApiAlgorithmLesson {
  id: string
  title: string
  systemName: string
  trigger: string
  existence: string
  mechanics: string[]
  contrast: {
    withSystem: string
    withoutSystem: string
  }
  stress: string
  failure: string
  tradeoffs: string[]
  retrievalQuestions: string[]
  buildTask: string
}

export const apiAlgorithmLessons: ApiAlgorithmLesson[] = [
  {
    id: "hash-map-idempotency",
    title: "Hash Maps for Idempotency and Deduplication",
    systemName: "Idempotent write APIs",
    trigger: "Payment retries are creating duplicate charges during transient 502 errors.",
    existence: "Without deterministic deduplication state, retried writes produce correctness failures and customer-impact incidents.",
    mechanics: [
      "Derive an idempotency key from stable business fields (user, operation, unique request token).",
      "Store key -> canonical result with TTL in a low-latency store.",
      "On retry, short-circuit to stored result instead of re-executing side effects.",
    ],
    contrast: {
      withSystem: "Duplicate writes collapse into one canonical outcome; retries are safe.",
      withoutSystem: "Every retry can trigger new side effects and reconciliation costs.",
    },
    stress: "At 10x retry storms, key-store write amplification becomes the bottleneck; optimize TTL and key cardinality.",
    failure: "If key-store latency spikes, fallback mode must avoid blind re-execution of non-idempotent operations.",
    tradeoffs: [
      "Optimizes correctness and retry safety.",
      "Sacrifices extra state storage and key-management complexity.",
      "Wrong choice when operations are naturally idempotent and retry volume is tiny.",
    ],
    retrievalQuestions: [
      "How would you prevent key collisions across tenants sharing a global API gateway?",
      "What signal tells you idempotency storage is now your bottleneck instead of the primary DB?",
    ],
    buildTask: "Implement idempotency middleware for one POST endpoint and prove duplicate retries return one result.",
  },
  {
    id: "heap-priority-queues",
    title: "Heaps for Priority Scheduling",
    systemName: "Background job prioritization",
    trigger: "Low-value batch jobs are delaying critical customer-facing tasks during peak load.",
    existence: "FIFO queues alone cannot encode urgency, so important work misses SLA under contention.",
    mechanics: [
      "Assign priority scores to jobs based on business impact and latency SLO.",
      "Use min-heap or max-heap scheduler to pop highest-priority work first.",
      "Apply fairness controls to avoid starvation of lower-priority jobs.",
    ],
    contrast: {
      withSystem: "High-value tasks meet SLA while backlog still grows.",
      withoutSystem: "Critical tasks are delayed behind low-impact batch traffic.",
    },
    stress: "At 10x traffic, scheduling overhead and starvation risk increase; rebalance priorities with aging.",
    failure: "Incorrect priority policy can create silent starvation and hidden customer churn.",
    tradeoffs: [
      "Optimizes SLA adherence for high-impact work.",
      "Sacrifices FIFO simplicity and explainability.",
      "Wrong choice when all jobs truly have identical urgency.",
    ],
    retrievalQuestions: [
      "How would you detect starvation before support tickets surface it?",
      "When should you split queues by class instead of single-queue priority scheduling?",
    ],
    buildTask: "Add priority classes to one worker queue and report percentile latency by class.",
  },
  {
    id: "sliding-window-rate-limit",
    title: "Sliding Window Counters for Rate Limiting",
    systemName: "Abuse and burst protection",
    trigger: "Burst traffic from retries and bots exhausts downstream capacity every hour.",
    existence: "Without bounded request admission, one actor can consume shared capacity and degrade everyone.",
    mechanics: [
      "Key limiter by tenant/user/IP depending on fairness policy.",
      "Track request counts in a rolling time window with atomic updates.",
      "Return explicit 429 responses with retry guidance.",
    ],
    contrast: {
      withSystem: "Capacity is protected and fairness is enforceable under bursts.",
      withoutSystem: "Traffic spikes trigger cascading failures across unrelated users.",
    },
    stress: "At 10x traffic, centralized counters can become hot keys; shard by key hash and region.",
    failure: "Clock skew or partitioned state can over-admit or over-throttle traffic.",
    tradeoffs: [
      "Optimizes fairness and dependency protection.",
      "Sacrifices some good traffic when limits are conservative.",
      "Wrong choice when workloads require strict per-request guarantees with no drops.",
    ],
    retrievalQuestions: [
      "What changes when your limiter must enforce both per-user and global limits?",
      "How do you choose fail-open vs fail-closed if the limiter data store is unavailable?",
    ],
    buildTask: "Implement per-user sliding-window limits on one endpoint and graph accepted vs rejected traffic.",
  },
  {
    id: "binary-search-capacity",
    title: "Binary Search for Capacity and Timeout Tuning",
    systemName: "Operational parameter tuning",
    trigger: "You need safe max concurrency/timeout values, but brute-force tuning is too slow in production-like tests.",
    existence: "Without systematic search, tuning drifts by intuition and destabilizes latency and error rates.",
    mechanics: [
      "Define a monotonic objective (e.g., keep p95 < target while maximizing throughput).",
      "Search parameter range via midpoint tests in staging load runs.",
      "Lock the highest safe value and codify rollback threshold.",
    ],
    contrast: {
      withSystem: "Converges quickly on safe operating bounds with fewer experiments.",
      withoutSystem: "Tuning becomes noisy trial-and-error with inconsistent results.",
    },
    stress: "At 10x scenarios, monotonic assumptions can fail; validate in multiple traffic shapes.",
    failure: "Mis-specified objective picks locally good but globally unstable operating points.",
    tradeoffs: [
      "Optimizes tuning speed and repeatability.",
      "Sacrifices simplicity when assumptions are not monotonic.",
      "Wrong choice when parameter behavior is highly non-linear and chaotic.",
    ],
    retrievalQuestions: [
      "What metric combination would invalidate binary search as the tuning strategy?",
      "How would you detect that your staging tuning no longer predicts production behavior?",
    ],
    buildTask: "Tune one concurrency or timeout parameter using binary search and publish the experiment log.",
  },
  {
    id: "topk-heavy-hitters",
    title: "Top-K/Heap Patterns for Hotspot Detection",
    systemName: "Operational visibility and cost control",
    trigger: "You know costs are rising, but you cannot identify which endpoints or tenants are causing it.",
    existence: "Without heavy-hitter analysis, optimization efforts target noise instead of true hotspots.",
    mechanics: [
      "Stream request metrics keyed by endpoint/tenant.",
      "Maintain top-K heap for highest cost or latency contributors.",
      "Feed top-K output into weekly optimization and incident reviews.",
    ],
    contrast: {
      withSystem: "Optimization is focused on the handful of contributors driving most pain.",
      withoutSystem: "Teams spread effort across low-impact fixes.",
    },
    stress: "At 10x cardinality, memory pressure grows; use approximate structures or periodic decay.",
    failure: "Bad aggregation windows can hide bursty offenders and delay action.",
    tradeoffs: [
      "Optimizes decision quality and cost focus.",
      "Sacrifices some precision when using approximations.",
      "Wrong choice when total metric cardinality is tiny and full scans are cheap.",
    ],
    retrievalQuestions: [
      "When should you switch from exact top-K to approximate counting?",
      "How do you avoid overfitting optimization to one temporary traffic spike?",
    ],
    buildTask: "Create a top-K report for latency contributors and propose one optimization backed by data.",
  },
]
