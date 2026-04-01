export interface PhaseQuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
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
        explanation: "200 OK is the standard successful response for a GET request."
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
        explanation: "Git is the core collaboration and version-control system for shipping and maintaining software safely."
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
        explanation: "A VM is a software-defined machine backed by underlying physical hardware."
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
        explanation: "REST is typically the clearest and most widely consumable default for public CRUD APIs."
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
        explanation: "GraphQL is strongest when clients need to shape and combine data flexibly."
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
        explanation: "Events help decouple services and support asynchronous workflows and scale."
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
        explanation: "OAuth2 allows one system to access another on a user’s behalf without sharing the user’s password."
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
        explanation: "Retries can multiply traffic against a degraded dependency and worsen the incident."
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
        explanation: "A circuit breaker protects your system by failing fast when a dependency is unhealthy."
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
        explanation: "Async messaging decouples producers and consumers in time, which helps absorb load and isolate failures."
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
        explanation: "Tracing lets you follow a request path end-to-end across service boundaries."
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
        explanation: "Event systems can redeliver messages, so handlers must tolerate duplicate processing."
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
        explanation: "The system’s constraints and failure modes should drive which components exist at all."
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
        explanation: "Owning a design means articulating the trade-offs and the conditions where it stops being the right choice."
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
        explanation: "Partial failure is dangerous because parts of the system still appear healthy while the overall behavior degrades."
      }
    ]
  }
}

export function getPhaseQuiz(phaseNumber: number) {
  return phaseQuizzes[phaseNumber] ?? null
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
    questions: quiz.questions.map(({ id, prompt, options }) => ({
      id,
      prompt,
      options,
    })),
  }
}

export function gradePhaseQuiz(
  phaseNumber: number,
  answers: Record<string, number>
) {
  const quiz = getPhaseQuiz(phaseNumber)
  if (!quiz) return null

  const details = quiz.questions.map((question) => {
    const selectedIndex = answers[question.id]
    const isCorrect = selectedIndex === question.correctIndex

    return {
      questionId: question.id,
      selectedIndex: typeof selectedIndex === "number" ? selectedIndex : null,
      correctIndex: question.correctIndex,
      isCorrect,
      explanation: question.explanation,
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
