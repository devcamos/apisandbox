export interface PhaseQuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
  concept: string
  redirect?: {
    href: string
    label: string
  }
}

export interface PhaseQuizDefinition {
  phaseNumber: number
  title: string
  description: string
  xpPerCorrect: number
  questions: PhaseQuizQuestion[]
}

export const phaseQuizzes: Record<number, PhaseQuizDefinition> = {
  0: {
    phaseNumber: 0,
    title: "Phase 0 Checkpoint",
    description: "Verify the fundamentals before moving into integration patterns.",
    xpPerCorrect: 20,
    questions: [
      {
        id: "http-status",
        prompt: "Which HTTP status code usually indicates a successful GET request?",
        options: ["201", "200", "404", "500"],
        correctIndex: 1,
        explanation: "200 OK is the standard successful response for a GET request.",
        concept: "HTTP semantics",
        redirect: { href: "/phase-0", label: "Review HTTP fundamentals" },
      },
      {
        id: "git-purpose",
        prompt: "Why is Git fundamental for API and cloud work?",
        options: [
          "It replaces production databases",
          "It tracks changes and supports collaboration safely",
          "It automatically scales servers",
          "It encrypts HTTP traffic"
        ],
        correctIndex: 1,
        explanation: "Git is the core collaboration and version-control system for shipping and maintaining software safely.",
        concept: "Version control",
        redirect: { href: "/phase-0", label: "Review foundational tooling" },
      },
      {
        id: "vm-definition",
        prompt: "What is a virtual machine in cloud computing?",
        options: [
          "A network-only routing layer",
          "A software-emulated computer running on physical infrastructure",
          "A serverless function trigger",
          "A database replication node"
        ],
        correctIndex: 1,
        explanation: "A VM is a software-defined machine backed by underlying physical hardware.",
        concept: "Cloud compute basics",
        redirect: { href: "/phase-0", label: "Review VM and cloud basics" },
      },
      {
        id: "dns-purpose",
        prompt: "What does DNS primarily do for applications on the internet?",
        options: [
          "Encrypts requests between services",
          "Translates domain names into reachable IP addresses",
          "Stores JSON payloads for APIs",
          "Balances CPU across containers"
        ],
        correctIndex: 1,
        explanation: "DNS maps human-readable hostnames to IP addresses so clients can find the right system.",
        concept: "Networking foundations",
        redirect: { href: "/phase-0", label: "Review internet and DNS basics" },
      },
      {
        id: "json-role",
        prompt: "Why is JSON so common in APIs?",
        options: [
          "It is a binary protocol optimised for GPUs",
          "It is lightweight, readable, and supported by nearly every language",
          "It replaces HTTP status codes",
          "It automatically validates database schemas"
        ],
        correctIndex: 1,
        explanation: "JSON is widely adopted because it is easy to produce and consume across different languages and systems.",
        concept: "JSON fundamentals",
        redirect: { href: "/phase-0", label: "Review core API data formats" },
      }
    ]
  },
  1: {
    phaseNumber: 1,
    title: "Phase 1 Checkpoint",
    description: "Test whether you can choose the right integration style for the problem.",
    xpPerCorrect: 25,
    questions: [
      {
        id: "rest-fit",
        prompt: "Which style is usually the best default for a public CRUD API?",
        options: ["REST", "WebSocket", "Kafka", "gRPC streaming"],
        correctIndex: 0,
        explanation: "REST is typically the clearest and most widely consumable default for public CRUD APIs.",
        concept: "API style selection",
        redirect: { href: "/phase-1", label: "Review API style tradeoffs" },
      },
      {
        id: "graphql-fit",
        prompt: "When is GraphQL usually a stronger fit than REST?",
        options: [
          "When clients need flexible nested reads from a single endpoint",
          "When you need ultra-low binary overhead between internal services",
          "When you only need fire-and-forget events",
          "When browsers cannot make HTTP requests"
        ],
        correctIndex: 0,
        explanation: "GraphQL is strongest when clients need to shape and combine data flexibly.",
        concept: "GraphQL fit",
        redirect: { href: "/phase-1", label: "Review GraphQL vs REST" },
      },
      {
        id: "event-driven-fit",
        prompt: "Why choose an event-driven approach?",
        options: [
          "To guarantee immediate consistency everywhere",
          "To tightly couple all services",
          "To decouple producers and consumers for async workflows",
          "To avoid retries entirely"
        ],
        correctIndex: 2,
        explanation: "Events help decouple services and support asynchronous workflows and scale.",
        concept: "Event-driven architecture",
        redirect: { href: "/phase-1", label: "Review event-driven patterns" },
      },
      {
        id: "http-json-default",
        prompt: "Why do most modern beginner-friendly APIs start with HTTP plus JSON?",
        options: [
          "Because browsers cannot read any other format",
          "Because they create a widely interoperable default across languages and platforms",
          "Because they remove the need for versioning",
          "Because they guarantee lower latency than gRPC"
        ],
        correctIndex: 1,
        explanation: "HTTP plus JSON is the easiest shared contract across teams, platforms, and languages, which is why it becomes the default starting point.",
        concept: "Universal API standards",
        redirect: { href: "/phase-1", label: "Review universal standards" },
      },
      {
        id: "sync-vs-async-choice",
        prompt: "When is a synchronous API call usually the better default than async messaging?",
        options: [
          "When the caller needs an immediate response to continue",
          "When you want producers and consumers to be loosely coupled in time",
          "When duplicate handling is too easy",
          "When you never want retries"
        ],
        correctIndex: 0,
        explanation: "If the caller cannot continue without the response, a synchronous request/response pattern is usually the right starting point.",
        concept: "Sync request-response",
        redirect: { href: "/phase-1", label: "Review integration decision making" },
      }
    ]
  },
  2: {
    phaseNumber: 2,
    title: "Phase 2 Checkpoint",
    description: "Check your handling of third-party integration reliability and auth.",
    xpPerCorrect: 30,
    questions: [
      {
        id: "oauth-purpose",
        prompt: "What problem does OAuth2 primarily solve?",
        options: [
          "Database indexing",
          "Delegated access without sharing passwords",
          "In-memory caching",
          "Schema migration"
        ],
        correctIndex: 1,
        explanation: "OAuth2 allows one system to access another on a user’s behalf without sharing the user’s password.",
        concept: "OAuth2",
        redirect: { href: "/phase-2/demos/oauth2", label: "Open the OAuth2 demo" },
      },
      {
        id: "retry-risk",
        prompt: "What is the main risk of adding retries blindly?",
        options: [
          "They can amplify load and make an outage worse",
          "They reduce network bandwidth too much",
          "They prevent monitoring from working",
          "They force synchronous processing"
        ],
        correctIndex: 0,
        explanation: "Retries can multiply traffic against a degraded dependency and worsen the incident.",
        concept: "Retries and backoff",
        redirect: { href: "/phase-2/demos/retry", label: "Open the retry demo" },
      },
      {
        id: "circuit-breaker-purpose",
        prompt: "Why use a circuit breaker with external APIs?",
        options: [
          "To increase payload size",
          "To cache every response forever",
          "To stop repeated calls to an unhealthy dependency",
          "To replace authentication"
        ],
        correctIndex: 2,
        explanation: "A circuit breaker protects your system by failing fast when a dependency is unhealthy.",
        concept: "Circuit breakers",
        redirect: { href: "/phase-2/demos/circuit-breaker", label: "Open the circuit-breaker demo" },
      },
      {
        id: "idempotency-purpose",
        prompt: "Why is idempotency important when calling external APIs with retries?",
        options: [
          "It guarantees faster JSON serialization",
          "It helps repeated requests avoid creating duplicate side effects",
          "It removes the need for authentication",
          "It prevents rate limits from happening"
        ],
        correctIndex: 1,
        explanation: "Idempotency protects operations like payments or order creation from accidental duplication when retries happen.",
        concept: "Idempotency",
        redirect: { href: "/phase-2/demos/retry", label: "Review retry safety" },
      },
      {
        id: "token-vs-key",
        prompt: "What is a practical difference between OAuth2 tokens and simple API keys?",
        options: [
          "OAuth2 tokens support delegated access and expiry semantics",
          "API keys can only be used over WebSocket",
          "OAuth2 removes the need for HTTPS",
          "API keys always provide user-specific consent screens"
        ],
        correctIndex: 0,
        explanation: "OAuth2 is built for delegated access, consent, and scoped expiry. API keys are simpler but usually less expressive.",
        concept: "Auth model selection",
        redirect: { href: "/phase-2/demos/oauth2", label: "Review OAuth2 vs API keys" },
      }
    ]
  },
  3: {
    phaseNumber: 3,
    title: "Phase 3 Checkpoint",
    description: "Validate your understanding of service-to-service communication and observability.",
    xpPerCorrect: 35,
    questions: [
      {
        id: "sync-vs-async",
        prompt: "Which statement best describes async messaging?",
        options: [
          "The caller waits for the entire workflow to complete before continuing",
          "The producer and consumer can be decoupled in time",
          "It guarantees total ordering across every service by default",
          "It removes the need for idempotency"
        ],
        correctIndex: 1,
        explanation: "Async messaging decouples producers and consumers in time, which helps absorb load and isolate failures.",
        concept: "Async messaging",
        redirect: { href: "/phase-3", label: "Review sync vs async communication" },
      },
      {
        id: "distributed-tracing",
        prompt: "What is distributed tracing primarily for?",
        options: [
          "Encrypting service traffic",
          "Tracking a request across multiple services",
          "Replacing logs and metrics completely",
          "Running database backups"
        ],
        correctIndex: 1,
        explanation: "Tracing lets you follow a request path end-to-end across service boundaries.",
        concept: "Distributed tracing",
        redirect: { href: "/observability", label: "Open observability" },
      },
      {
        id: "event-idempotency",
        prompt: "Why is idempotency important in event-driven systems?",
        options: [
          "Because duplicate delivery can happen and handlers must stay safe",
          "Because event brokers never redeliver messages",
          "Because it speeds up frontend rendering",
          "Because it removes the need for monitoring"
        ],
        correctIndex: 0,
        explanation: "Event systems can redeliver messages, so handlers must tolerate duplicate processing.",
        concept: "Idempotency in event systems",
        redirect: { href: "/phase-3", label: "Review event-driven safety" },
      },
      {
        id: "correlation-id-purpose",
        prompt: "Why do teams add correlation IDs to requests and events?",
        options: [
          "To compress payloads before transport",
          "To connect logs and traces across multiple hops",
          "To replace authentication headers",
          "To avoid database transactions"
        ],
        correctIndex: 1,
        explanation: "Correlation IDs let you follow one request path through services, logs, and queues during debugging and incident response.",
        concept: "Correlation IDs",
        redirect: { href: "/observability", label: "Review correlation and tracing" },
      },
      {
        id: "queue-benefit",
        prompt: "What is a major benefit of introducing a queue between services?",
        options: [
          "It guarantees zero failures",
          "It smooths bursts and decouples producer speed from consumer speed",
          "It removes the need for monitoring",
          "It makes every workflow synchronous"
        ],
        correctIndex: 1,
        explanation: "Queues absorb bursts and let consumers process work at their own pace, which improves resilience under load.",
        concept: "Queue decoupling",
        redirect: { href: "/phase-3", label: "Review service decoupling patterns" },
      }
    ]
  },
  4: {
    phaseNumber: 4,
    title: "Phase 4 Checkpoint",
    description: "Prove you can reason about architecture before choosing components.",
    xpPerCorrect: 40,
    questions: [
      {
        id: "constraint-first",
        prompt: "What should come before choosing a cache, queue, or rate limiter?",
        options: [
          "Selecting the cloud provider",
          "Constraint-driven reasoning about the system’s purpose and limits",
          "Drawing the architecture diagram in a slide deck",
          "Benchmarking the UI"
        ],
        correctIndex: 1,
        explanation: "The system’s constraints and failure modes should drive which components exist at all.",
        concept: "Constraint-driven design",
        redirect: { href: "/docs/architecture", label: "Review architecture reasoning" },
      },
      {
        id: "tradeoff-proof",
        prompt: "What proves you actually own a design decision?",
        options: [
          "You can name a popular company that uses it",
          "You can argue why it beats the top alternatives and what it sacrifices",
          "You can draw many boxes and arrows",
          "You can add retries everywhere"
        ],
        correctIndex: 1,
        explanation: "Owning a design means articulating the trade-offs and the conditions where it stops being the right choice.",
        concept: "Architecture tradeoffs",
        redirect: { href: "/docs/architecture", label: "Review tradeoff analysis" },
      },
      {
        id: "partial-failure",
        prompt: "Why is partial failure harder than total failure?",
        options: [
          "Because it is always cheaper to fix",
          "Because the system may degrade in inconsistent and misleading ways",
          "Because monitoring stops working entirely",
          "Because it only affects stateless services"
        ],
        correctIndex: 1,
        explanation: "Partial failure is dangerous because parts of the system still appear healthy while the overall behavior degrades.",
        concept: "Partial failure",
        redirect: { href: "/phase-4", label: "Review failure-mode reasoning" },
      },
      {
        id: "bottleneck-thinking",
        prompt: "Why should architecture reviews identify bottlenecks early?",
        options: [
          "Because the slowest or most fragile part often determines overall system behavior",
          "Because bottlenecks only matter after launch",
          "Because queues automatically remove all bottlenecks",
          "Because bottlenecks only exist in databases"
        ],
        correctIndex: 0,
        explanation: "Systems are constrained by their weakest or slowest links, so good architecture identifies those limits before scaling pain appears.",
        concept: "System bottlenecks",
        redirect: { href: "/docs/architecture", label: "Review system constraints" },
      },
      {
        id: "operability-proof",
        prompt: "What makes an architecture production-ready beyond the diagram itself?",
        options: [
          "Having many premium vendor tools",
          "Clear observability, failure handling, and operational runbooks",
          "Using only synchronous REST",
          "Avoiding all third-party dependencies"
        ],
        correctIndex: 1,
        explanation: "A design is only production-ready if operators can observe it, respond to failure, and run it safely over time.",
        concept: "Operability",
        redirect: { href: "/docs/architecture", label: "Review production readiness" },
      }
    ]
  },
  7: {
    phaseNumber: 7,
    title: "Phase 7 Checkpoint",
    description: "Test whether you can reason about monetisation strategy before building.",
    xpPerCorrect: 30,
    questions: [
      {
        id: "saas-metric",
        prompt: "What is the most important metric for a SaaS business?",
        options: [
          "Total lines of code",
          "Monthly Recurring Revenue (MRR)",
          "Number of features shipped",
          "GitHub stars"
        ],
        correctIndex: 1,
        explanation: "MRR is the north star for SaaS — it represents predictable, recurring income that compounds over time.",
        concept: "SaaS metrics",
        redirect: { href: "/phase-7", label: "Review monetisation metrics" },
      },
      {
        id: "mvp-scope",
        prompt: "What should an MVP include?",
        options: [
          "Every feature you can think of",
          "Auth + one core feature + payment",
          "A complete admin dashboard",
          "At least 20 API endpoints"
        ],
        correctIndex: 1,
        explanation: "An MVP is the smallest thing someone will pay for. Auth, one core feature, and payment is the proven formula.",
        concept: "MVP scope",
        redirect: { href: "/phase-7", label: "Review MVP scoping" },
      },
      {
        id: "pricing-strategy",
        prompt: "Why should you charge from day one?",
        options: [
          "To cover server costs immediately",
          "Because free users give feedback but paying users give signal",
          "Because investors require it",
          "To prevent competitors from copying you"
        ],
        correctIndex: 1,
        explanation: "Paying customers prove demand. Free users will say they love it but never convert. Payment is the ultimate validation.",
        concept: "Pricing signal",
        redirect: { href: "/phase-7", label: "Review pricing strategy" },
      },
      {
        id: "retention-meaning",
        prompt: "Why is retention more valuable than a spike in signups?",
        options: [
          "Because retained users prove recurring value and product fit",
          "Because signups never matter",
          "Because retention replaces pricing strategy",
          "Because investors only track retention charts"
        ],
        correctIndex: 0,
        explanation: "Retention shows that users continue getting value, which is a stronger signal than one-time acquisition.",
        concept: "Retention",
        redirect: { href: "/phase-7", label: "Review product-market fit signals" },
      },
      {
        id: "distribution-choice",
        prompt: "What should usually come before scaling growth channels aggressively?",
        options: [
          "A validated offer with evidence someone will pay",
          "A complete enterprise feature set",
          "A larger infrastructure budget",
          "A second product line"
        ],
        correctIndex: 0,
        explanation: "Growth amplifies what already works. Without a validated offer, scaling distribution just accelerates waste.",
        concept: "Distribution readiness",
        redirect: { href: "/phase-7", label: "Review go-to-market foundations" },
      }
    ]
  },
  8: {
    phaseNumber: 8,
    title: "Phase 8 Checkpoint",
    description: "Test your understanding of data science in production systems.",
    xpPerCorrect: 20,
    questions: [
      {
        id: "model-serving",
        prompt: "What is the most critical mistake when serving an ML model in production?",
        options: [
          "Using REST instead of gRPC",
          "Loading the model on every request instead of once at startup",
          "Using Python instead of Java",
          "Not using GPU for inference"
        ],
        correctIndex: 1,
        explanation: "Model loading can take 5-30 seconds. Loading on every request makes the API unusable. Load once at startup and hold in memory.",
        concept: "Model serving",
        redirect: { href: "/phase-8", label: "Review production ML serving" },
      },
      {
        id: "training-serving-skew",
        prompt: "What is training-serving skew?",
        options: [
          "When the model takes longer to train than to serve",
          "When GPU utilization is uneven across nodes",
          "When features computed during training differ from production",
          "When the model file is too large for the container"
        ],
        correctIndex: 2,
        explanation: "Training-serving skew is the #1 silent killer of ML models. Feature stores exist to ensure the model sees the same features in training and production.",
        concept: "Training-serving skew",
        redirect: { href: "/phase-8", label: "Review feature consistency" },
      },
      {
        id: "data-drift",
        prompt: "You notice your fraud model suddenly flags 30% of transactions instead of the usual 2%. What is the most likely cause?",
        options: [
          "The model file is corrupted",
          "The API gateway is misconfigured",
          "Data drift — input feature distributions have shifted",
          "The database connection pool is exhausted"
        ],
        correctIndex: 2,
        explanation: "A sudden change in prediction distribution almost always means the input data has shifted. This is data drift, and it's why ML monitoring focuses on input distributions.",
        concept: "Data drift",
        redirect: { href: "/phase-8", label: "Review ML monitoring" },
      },
      {
        id: "ab-testing",
        prompt: "Why should you NOT peek at A/B test results daily and stop early?",
        options: [
          "It costs too much compute to query results frequently",
          "Early stopping inflates false positive rate — you'll ship things that don't actually work",
          "The data warehouse can't handle frequent queries",
          "It violates GDPR regulations"
        ],
        correctIndex: 1,
        explanation: "Peeking and stopping early is called 'optional stopping' and it dramatically inflates false positives. Pre-commit to a run duration based on sample size calculations.",
        concept: "A/B test validity",
        redirect: { href: "/phase-8", label: "Review experimentation rigor" },
      },
      {
        id: "feature-store-purpose",
        prompt: "Why do teams introduce a feature store in production ML systems?",
        options: [
          "To guarantee that models always use GPUs",
          "To keep feature definitions consistent between training and serving",
          "To replace model monitoring entirely",
          "To make labeling unnecessary"
        ],
        correctIndex: 1,
        explanation: "Feature stores help ensure that the same feature logic is reused consistently across training and serving environments.",
        concept: "Feature consistency",
        redirect: { href: "/phase-8", label: "Review training-serving consistency" },
      }
    ]
  },
  9: {
    phaseNumber: 9,
    title: "Phase 9 Checkpoint",
    description: "Validate database fundamentals before you scale data-heavy APIs.",
    xpPerCorrect: 20,
    questions: [
      {
        id: "sql-vs-nosql",
        prompt: "When is a relational database usually the better default for an API backend?",
        options: [
          "When you only need ephemeral cache keys",
          "When you need transactions across related entities with enforced constraints",
          "When you never need joins",
          "When schema flexibility matters more than consistency"
        ],
        correctIndex: 1,
        explanation: "Relational stores excel at ACID transactions, foreign keys, and joins across normalized entities — typical for accounts, billing, and entitlements.",
        concept: "Relational vs NoSQL",
        redirect: { href: "/phase-9", label: "Review SQL vs NoSQL" },
      },
      {
        id: "acid-use",
        prompt: "Which flow most clearly needs ACID guarantees?",
        options: [
          "Serving a public blog post list from a CDN",
          "Upgrading subscription tier and writing an audit log row together",
          "Caching weather data for 10 minutes",
          "Streaming analytics events to a warehouse"
        ],
        correctIndex: 1,
        explanation: "Billing and entitlement updates should commit atomically — partial success corrupts user state.",
        concept: "ACID / transactions",
        redirect: { href: "/phase-9", label: "Review ACID and transactions" },
      },
      {
        id: "indexes",
        prompt: "What is the main purpose of a database index?",
        options: [
          "To encrypt data at rest",
          "To speed up reads by avoiding full table scans on filtered columns",
          "To replace migrations",
          "To disable replication lag"
        ],
        correctIndex: 1,
        explanation: "Indexes trade a bit of write overhead for faster lookups on indexed columns used in WHERE and JOIN clauses.",
        concept: "Indexes",
        redirect: { href: "/phase-9", label: "Review indexes" },
      },
      {
        id: "connection-pool",
        prompt: "Why do API servers use connection pooling?",
        options: [
          "To store JWT secrets",
          "To reuse open database connections and reduce per-request connection overhead",
          "To shard data automatically",
          "To replace EXPLAIN ANALYZE"
        ],
        correctIndex: 1,
        explanation: "Opening connections is expensive; pools lend warm connections to concurrent requests within safe limits.",
        concept: "Connection pooling",
        redirect: { href: "/phase-9", label: "Review connection pooling" },
      },
      {
        id: "read-replicas",
        prompt: "When routing API reads to a read replica, what must you account for?",
        options: [
          "Replicas always return the latest write immediately",
          "Asynchronous replication lag — reads may be slightly stale",
          "Replicas handle writes faster than the primary",
          "Replicas eliminate the need for indexes"
        ],
        correctIndex: 1,
        explanation: "Replicas often lag the primary; session-critical reads (auth, own profile) should usually hit the primary.",
        concept: "Read replicas",
        redirect: { href: "/phase-9", label: "Review read replicas" },
      },
    ],
  },
}

export function getPhaseQuiz(phaseNumber: number) {
  return phaseQuizzes[phaseNumber] ?? null
}

/** Fisher–Yates shuffle (mutates a copy). */
export function shuffleOptions<T>(items: readonly T[]): T[] {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getSanitizedPhaseQuiz(phaseNumber: number) {
  const quiz = getPhaseQuiz(phaseNumber)
  if (!quiz) return null

  return {
    phaseNumber: quiz.phaseNumber,
    title: quiz.title,
    description: quiz.description,
    xpPerCorrect: quiz.xpPerCorrect,
    totalQuestions: quiz.questions.length,
    questions: quiz.questions.map(({ id, prompt, options, concept }) => ({
      id,
      prompt,
      options: shuffleOptions(options),
      concept,
    })),
  }
}

export function gradePhaseQuiz(
  phaseNumber: number,
  answers: Record<string, string>,
) {
  const quiz = getPhaseQuiz(phaseNumber)
  if (!quiz) return null

  const details = quiz.questions.map((question) => {
    const selectedAnswer = answers[question.id]?.trim()
    const correctAnswer = question.options[question.correctIndex]
    const isCorrect = selectedAnswer === correctAnswer

    return {
      questionId: question.id,
      selectedAnswer: selectedAnswer ?? null,
      correctAnswer,
      isCorrect,
      explanation: question.explanation,
      concept: question.concept,
      redirect: question.redirect ?? null,
    }
  })

  const correctAnswers = details.filter((item) => item.isCorrect).length
  const xpEarned = correctAnswers * quiz.xpPerCorrect

  return {
    totalQuestions: quiz.questions.length,
    correctAnswers,
    xpEarned,
    details,
  }
}
