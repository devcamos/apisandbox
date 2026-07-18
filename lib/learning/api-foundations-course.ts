/**
 * Server-side, versioned first-principles curriculum. Keep assessment answers
 * here; client code receives only sanitized variants from server pages/routes.
 */
import {
  API_FOUNDATIONS_COURSE_ID,
  API_FOUNDATIONS_MASTERY_THRESHOLD,
} from "@/lib/learning/course-ids"

export { API_FOUNDATIONS_COURSE_ID, API_FOUNDATIONS_MASTERY_THRESHOLD } from "@/lib/learning/course-ids"

export type FoundationPhase = 0 | 1

export interface InteractiveScenarioOption {
  id: string
  label: string
  consequence: string
}

export interface InteractiveScenarioStep {
  id: string
  label: string
  system: string
  detail: string
}

export interface InteractiveScenario {
  title: string
  prompt: string
  options: InteractiveScenarioOption[]
  trace: InteractiveScenarioStep[]
}

export interface AssessmentQuestion {
  id: string
  prompt: string
  options: string[]
  correctAnswer: string
  explanation: string
  reviewLabel: string
}

export interface AssessmentDefinition {
  title: string
  description: string
  questions: AssessmentQuestion[]
  reflectionPrompt: string
}

export interface LearningUnit {
  id: string
  phase: FoundationPhase
  title: string
  subtitle: string
  principle: string
  goal: string
  concepts: string[]
  sections: Array<{ title: string; body: string }>
  scenario: InteractiveScenario
  assessment: AssessmentDefinition
}

export interface LearningCourse {
  id: string
  title: string
  description: string
  audience: string
  masteryThreshold: number
  units: LearningUnit[]
}

export interface SanitizedAssessmentQuestion {
  id: string
  prompt: string
  options: string[]
}

export interface SanitizedAssessmentDefinition {
  title: string
  description: string
  questions: SanitizedAssessmentQuestion[]
  reflectionPrompt: string
}

export interface SanitizedLearningUnit extends Omit<LearningUnit, "assessment"> {
  assessment: SanitizedAssessmentDefinition
}

export interface SanitizedLearningCourse extends Omit<LearningCourse, "units"> {
  units: SanitizedLearningUnit[]
}

export interface AssessmentGrade {
  correctAnswers: number
  totalQuestions: number
  scorePercent: number
  mastered: boolean
  details: Array<{
    questionId: string
    correct: boolean
    explanation: string
    reviewLabel: string
  }>
}

const apiFoundationsCourse: LearningCourse = {
  id: API_FOUNDATIONS_COURSE_ID,
  title: "API Foundations: First Principles",
  description:
    "Follow one package-tracking request from code running on a machine to a dependable integration with another system.",
  audience: "Career-switching developers who want a reliable mental model before choosing frameworks.",
  masteryThreshold: API_FOUNDATIONS_MASTERY_THRESHOLD,
  units: [
    {
      id: "programs-and-state",
      phase: 0,
      title: "Programs, state, and async work",
      subtitle: "An API begins as instructions changing data over time.",
      principle: "A program is instructions operating on state; asynchronous work finishes later, not never.",
      goal: "Explain why API code must wait for network work and handle the result or failure.",
      concepts: ["variables and state", "JSON-shaped data", "functions", "promises", "async/await", "failure paths"],
      sections: [
        {
          title: "Start with a program, not a protocol",
          body: "The package screen is a program. It stores a tracking number, asks another system for an update, then changes what the user sees. HTTP is only one way that program can ask for outside information.",
        },
        {
          title: "Async means the answer arrives later",
          body: "A network request starts now and settles later. await pauses this part of the program until the promise succeeds or fails, so the next line works with a real response instead of an unfinished promise.",
        },
      ],
      scenario: {
        title: "Tracking screen: wait or render?",
        prompt: "The package page has started a status lookup. What should it do before showing the delivery status?",
        options: [
          { id: "wait", label: "Wait for the lookup to settle", consequence: "The screen can render a confirmed status or an explicit error state." },
          { id: "render-early", label: "Render the promise as if it were a status", consequence: "The program has no final status yet, so it must not present one as fact." },
        ],
        trace: [
          { id: "input", label: "Tracking number captured", system: "Browser program", detail: "State stores PKG-2048 before the request begins." },
          { id: "request", label: "Lookup started", system: "Async function", detail: "The function receives a promise representing future work." },
          { id: "settle", label: "Result settles", system: "Promise", detail: "It fulfills with delivery data or rejects with a failure that needs handling." },
          { id: "render", label: "Visible state changes", system: "Browser program", detail: "Only a settled result can become a reliable status or error message." },
        ],
      },
      assessment: {
        title: "Explain async API work",
        description: "Use the program model before moving down to the machine and network.",
        reflectionPrompt: "In your own words, explain why a screen cannot safely treat an in-flight network request as its final data.",
        questions: [
          {
            id: "async-result",
            prompt: "What does a promise represent when an app starts an API request?",
            options: ["A completed response", "A value that may arrive or fail later", "A permanent database record", "A DNS address"],
            correctAnswer: "A value that may arrive or fail later",
            explanation: "A promise represents the eventual result of asynchronous work, including the possibility of rejection.",
            reviewLabel: "Promises and async control flow",
          },
          {
            id: "async-failure",
            prompt: "Why should an awaited request have a failure path?",
            options: ["Networks and servers can fail after work starts", "await prevents all failures", "JSON cannot represent errors", "HTTP has no error responses"],
            correctAnswer: "Networks and servers can fail after work starts",
            explanation: "Waiting for work does not guarantee success; code must describe the failure state as well as the success state.",
            reviewLabel: "Async failure handling",
          },
        ],
      },
    },
    {
      id: "machines-and-processes",
      phase: 0,
      title: "Machines, processes, and ports",
      subtitle: "A program needs a running process and a reachable door.",
      principle: "A server process uses finite CPU, memory, storage, and a port to accept work.",
      goal: "Distinguish an application process from its machine and explain the purpose of a port.",
      concepts: ["processes", "CPU", "memory", "storage", "ports", "runtime environment"],
      sections: [
        {
          title: "A server is a running program",
          body: "The package service is not the whole cloud computer. It is one process on a machine or container, using memory for active work, CPU for instructions, storage for durable data, and a port for network traffic.",
        },
        {
          title: "Ports name a service on a machine",
          body: "An IP address reaches a machine. A port reaches the particular process listening on that machine. This is why two web services can run on the same machine without receiving each other’s traffic.",
        },
      ],
      scenario: {
        title: "Which service receives the parcel lookup?",
        prompt: "A request has reached the tracking platform's machine. What identifies the server process that should receive it?",
        options: [
          { id: "port", label: "The destination port", consequence: "The operating system directs traffic to the process listening on that port." },
          { id: "disk", label: "The machine's disk", consequence: "Disk stores data; it does not route incoming network connections." },
        ],
        trace: [
          { id: "machine", label: "Machine reached", system: "Network", detail: "Traffic arrives at the host that owns the destination IP address." },
          { id: "port", label: "Port selected", system: "Operating system", detail: "The host uses the destination port to find the listening service." },
          { id: "process", label: "Process accepts work", system: "Tracking API", detail: "The process reads the request and uses CPU and memory to handle it." },
          { id: "storage", label: "Status read", system: "Data store", detail: "The process may read durable delivery information before replying." },
        ],
      },
      assessment: {
        title: "Explain a server runtime",
        description: "Confirm the physical and runtime boundary before introducing the network path.",
        reflectionPrompt: "Explain the difference between an IP address and a port using the tracking API as your example.",
        questions: [
          {
            id: "port-purpose",
            prompt: "What is a port primarily used for?",
            options: ["Selecting a service process on a machine", "Encrypting a request body", "Storing a database row", "Resolving a domain name"],
            correctAnswer: "Selecting a service process on a machine",
            explanation: "A port identifies the application endpoint listening on a host.",
            reviewLabel: "Ports and processes",
          },
          {
            id: "runtime-resource",
            prompt: "Which resource is used for a process's active, temporary working data?",
            options: ["Memory", "DNS", "TLS", "A URL path"],
            correctAnswer: "Memory",
            explanation: "Memory holds a process's active state; durable data belongs in storage.",
            reviewLabel: "Runtime resources",
          },
        ],
      },
    },
    {
      id: "network-path",
      phase: 0,
      title: "The network path",
      subtitle: "Names, addresses, connections, and privacy get a request to the right machine.",
      principle: "DNS finds an address, TCP carries an ordered conversation, and TLS protects it in transit.",
      goal: "Trace a request from a hostname through DNS, connection setup, and encryption.",
      concepts: ["hostnames", "DNS", "IP addresses", "TCP", "TLS", "latency"],
      sections: [
        {
          title: "Humans use names; networks route addresses",
          body: "track.example.com is memorable, but routers need an IP address. DNS maps the hostname to an address before the browser can open a connection to the tracking service.",
        },
        {
          title: "Connections and encryption solve different problems",
          body: "TCP provides an ordered, reliable byte stream. TLS authenticates the server and encrypts that stream. HTTPS means HTTP carried over TLS, not a replacement for either network layer.",
        },
      ],
      scenario: {
        title: "Trace the request before HTTP",
        prompt: "The browser knows only https://track.example.com/packages/PKG-2048. What happens before it can send the HTTP request?",
        options: [
          { id: "resolve", label: "Resolve the hostname, then connect securely", consequence: "DNS provides a destination address and the browser can establish TCP/TLS before sending HTTP." },
          { id: "direct-http", label: "Send HTTP to the hostname without resolution", consequence: "A hostname still needs an address before the network can route traffic to a machine." },
        ],
        trace: [
          { id: "dns", label: "DNS lookup", system: "Resolver", detail: "track.example.com is translated into a reachable IP address." },
          { id: "tcp", label: "TCP connection", system: "Browser and server", detail: "Both sides establish an ordered connection." },
          { id: "tls", label: "TLS handshake", system: "Browser and server", detail: "The browser verifies the server and negotiates encryption." },
          { id: "http", label: "HTTP can travel", system: "HTTPS", detail: "The request message now travels inside the encrypted connection." },
        ],
      },
      assessment: {
        title: "Explain the network path",
        description: "Prove that you can separate naming, delivery, and encryption.",
        reflectionPrompt: "Explain what DNS, TCP, and TLS each contribute before an HTTPS request reaches the tracking API.",
        questions: [
          {
            id: "dns-role",
            prompt: "What does DNS do for track.example.com?",
            options: ["Maps the hostname to a reachable IP address", "Encrypts the response", "Validates the JSON body", "Starts a database transaction"],
            correctAnswer: "Maps the hostname to a reachable IP address",
            explanation: "DNS translates a human-friendly name into information the network can route.",
            reviewLabel: "DNS and addressing",
          },
          {
            id: "tls-role",
            prompt: "What is TLS responsible for in HTTPS?",
            options: ["Protecting and authenticating the connection", "Choosing an HTTP method", "Assigning a port", "Caching JSON"],
            correctAnswer: "Protecting and authenticating the connection",
            explanation: "TLS encrypts traffic in transit and helps the client verify the server it connected to.",
            reviewLabel: "TLS and HTTPS",
          },
        ],
      },
    },
    {
      id: "http-messages",
      phase: 1,
      title: "HTTP messages",
      subtitle: "An API request is a structured message with intent and a reply.",
      principle: "HTTP gives clients and servers a shared grammar: method, URL, headers, body, status, and response body.",
      goal: "Read an HTTP exchange and justify the method, status code, headers, and body.",
      concepts: ["URLs", "methods", "headers", "request body", "response body", "status codes", "idempotency"],
      sections: [
        {
          title: "Methods communicate intent",
          body: "GET asks for the current package state. POST asks the service to create a new thing or action. The method is part of the contract, so clients and servers can reason about caching, retries, and expectations.",
        },
        {
          title: "Status codes summarize the result",
          body: "A status code does not replace a response body, but it gives every client a quick category: success, client-side problem, or server-side failure. Stable status choices make integrations predictable.",
        },
      ],
      scenario: {
        title: "Read a tracking request",
        prompt: "The browser needs the latest status for an existing package. Which HTTP shape expresses that intent?",
        options: [
          { id: "get", label: "GET /packages/PKG-2048", consequence: "The request names an existing resource and asks to retrieve its current representation." },
          { id: "post", label: "POST /packages/PKG-2048 with no action", consequence: "POST can be valid for a defined action, but it hides a simple read behind a less clear intent." },
        ],
        trace: [
          { id: "method", label: "Method read", system: "Tracking API", detail: "GET communicates that the client wants the package representation." },
          { id: "route", label: "Route matched", system: "HTTP router", detail: "The path identifies the requested package resource." },
          { id: "headers", label: "Headers checked", system: "API boundary", detail: "Authorization and accepted response format are metadata, not the package itself." },
          { id: "response", label: "200 response", system: "Tracking API", detail: "The API returns a success status and a JSON representation of the package." },
        ],
      },
      assessment: {
        title: "Explain an HTTP exchange",
        description: "Use the message grammar before designing a JSON contract.",
        reflectionPrompt: "Explain how the method, path, headers, body, and status code divide responsibility in one tracking request.",
        questions: [
          {
            id: "get-semantics",
            prompt: "Which request is the clearest default for reading one existing package?",
            options: ["GET /packages/PKG-2048", "POST /packages/PKG-2048", "DELETE /packages/PKG-2048", "PATCH /packages"],
            correctAnswer: "GET /packages/PKG-2048",
            explanation: "GET expresses retrieval of the resource identified by the URL.",
            reviewLabel: "HTTP methods and resources",
          },
          {
            id: "status-category",
            prompt: "Which status-code family usually signals that the client sent an invalid request?",
            options: ["4xx", "2xx", "3xx", "5xx"],
            correctAnswer: "4xx",
            explanation: "4xx responses communicate client-side request, authentication, or authorization problems.",
            reviewLabel: "HTTP status categories",
          },
        ],
      },
    },
    {
      id: "api-contracts",
      phase: 1,
      title: "API contracts",
      subtitle: "A useful API makes valid data and failure shapes predictable.",
      principle: "An API contract defines the request and response shapes that independent programs can rely on.",
      goal: "Explain why validation, stable errors, and compatibility matter to API consumers.",
      concepts: ["JSON", "schemas", "validation", "error envelopes", "versioning", "backward compatibility"],
      sections: [
        {
          title: "JSON is data, not a contract by itself",
          body: "Both sides may understand JSON while disagreeing about required fields, types, and meanings. A contract says that trackingNumber is required, status is one of known values, and an invalid request returns a stable error shape.",
        },
        {
          title: "Validation protects the boundary",
          body: "Validate data when it enters the API, before it reaches business logic or storage. A clear 400 response lets a caller correct its request; an unstructured server error leaves everyone guessing.",
        },
      ],
      scenario: {
        title: "Reject a malformed delivery update",
        prompt: "A carrier sends { status: 42 } when the contract requires a recognised text status. How should the tracking API respond?",
        options: [
          { id: "validate", label: "Return a stable validation error", consequence: "The carrier learns which field is invalid without the API storing nonsense or leaking internals." },
          { id: "accept", label: "Store it and hope consumers adapt", consequence: "Every consumer now has to defend against a value the contract did not permit." },
        ],
        trace: [
          { id: "parse", label: "Body parsed", system: "API boundary", detail: "The incoming JSON becomes data the server can inspect." },
          { id: "validate", label: "Schema checked", system: "Validation", detail: "status is rejected because a number is not a permitted delivery status." },
          { id: "error", label: "400 response formed", system: "Error envelope", detail: "The client receives a stable code, message, and field reference." },
          { id: "protect", label: "Domain protected", system: "Tracking service", detail: "Invalid input never reaches the package record or downstream consumers." },
        ],
      },
      assessment: {
        title: "Explain an API contract",
        description: "Show that JSON, validation, and compatibility work together.",
        reflectionPrompt: "Explain why accepting malformed JSON-shaped data can break another program even if the API itself does not crash immediately.",
        questions: [
          {
            id: "contract-purpose",
            prompt: "What does an API contract primarily give an API consumer?",
            options: ["A predictable agreement about valid requests and responses", "A guarantee that the network never fails", "A replacement for authentication", "Unlimited storage"],
            correctAnswer: "A predictable agreement about valid requests and responses",
            explanation: "Contracts reduce ambiguity between independently deployed clients and services.",
            reviewLabel: "Contract boundaries",
          },
          {
            id: "validation-response",
            prompt: "What is the best default response to a malformed client payload?",
            options: ["A clear 4xx validation error", "A silent data rewrite", "A 200 response with no body", "An unstructured stack trace"],
            correctAnswer: "A clear 4xx validation error",
            explanation: "A stable client-error response lets the caller correct its request without exposing server internals.",
            reviewLabel: "Validation and errors",
          },
        ],
      },
    },
    {
      id: "dependable-integrations",
      phase: 1,
      title: "Dependable integrations",
      subtitle: "Another API is a dependency with identity, delay, and failure modes.",
      principle: "A dependable integration sets boundaries for identity, time, retries, and evidence before a dependency is unavailable.",
      goal: "Explain the roles of authentication, timeouts, cautious retries, and observability in an API integration.",
      concepts: ["API keys and tokens", "timeouts", "retries", "idempotency", "request IDs", "logs and metrics"],
      sections: [
        {
          title: "Dependencies do not share your reliability",
          body: "The carrier API can be slow, unavailable, or return an unexpected response. A timeout defines how long your package service will wait; a retry is only safe when repeating the work will not create a harmful duplicate.",
        },
        {
          title: "Observability turns a symptom into evidence",
          body: "A request ID connects the browser, your API, and the carrier call. Logs explain individual events, metrics show patterns, and traces show where time was spent across the request path.",
        },
      ],
      scenario: {
        title: "The carrier API becomes slow",
        prompt: "The carrier status call has not returned. Which response gives the tracking service a controlled failure boundary?",
        options: [
          { id: "timeout", label: "Use a timeout and record the request ID", consequence: "The service can stop waiting, return a clear temporary result, and investigate one correlated request." },
          { id: "wait-forever", label: "Wait indefinitely for a perfect answer", consequence: "Each stalled dependency call can consume resources and leave the customer without an answer." },
        ],
        trace: [
          { id: "identity", label: "Dependency authenticated", system: "Integration client", detail: "A scoped credential identifies the tracking service to the carrier." },
          { id: "timeout", label: "Timeout reached", system: "Integration client", detail: "The call ends at the chosen boundary instead of occupying resources forever." },
          { id: "fallback", label: "Controlled response", system: "Tracking API", detail: "The API can return the last known status and a temporary-unavailable signal when the product allows it." },
          { id: "evidence", label: "Request correlated", system: "Observability", detail: "The request ID, latency, and error category make the dependency problem diagnosable." },
        ],
      },
      assessment: {
        title: "Explain dependable integrations",
        description: "Connect the API contract to the realities of another system failing or slowing down.",
        reflectionPrompt: "Explain why a timeout and a request ID are different controls, and how they work together during a carrier outage.",
        questions: [
          {
            id: "timeout-purpose",
            prompt: "What is the main purpose of an integration timeout?",
            options: ["Bound how long the service waits for a dependency", "Guarantee a successful response", "Encrypt an API key", "Choose a JSON schema"],
            correctAnswer: "Bound how long the service waits for a dependency",
            explanation: "Timeouts create a failure boundary so slow dependencies cannot wait forever.",
            reviewLabel: "Timeout boundaries",
          },
          {
            id: "retry-safety",
            prompt: "When is a retry especially risky?",
            options: ["When repeating the request could create a duplicate side effect", "When reading a cached document", "When DNS returns an address", "When a GET succeeds"],
            correctAnswer: "When repeating the request could create a duplicate side effect",
            explanation: "Retries need idempotency or another duplicate-protection strategy when an operation changes state.",
            reviewLabel: "Retries and idempotency",
          },
        ],
      },
    },
  ],
}

const learningCourses: Record<string, LearningCourse> = {
  [API_FOUNDATIONS_COURSE_ID]: apiFoundationsCourse,
}

export function getLearningCourse(courseId: string): LearningCourse | null {
  return learningCourses[courseId] ?? null
}

export function getApiFoundationsCourse() {
  return apiFoundationsCourse
}

export function getLearningUnit(courseId: string, unitId: string): LearningUnit | null {
  return getLearningCourse(courseId)?.units.find((unit) => unit.id === unitId) ?? null
}

export function getSanitizedLearningCourse(courseId: string): SanitizedLearningCourse | null {
  const course = getLearningCourse(courseId)
  if (!course) return null
  return {
    ...course,
    units: course.units.map(({ assessment, ...unit }) => ({
      ...unit,
      assessment: {
        title: assessment.title,
        description: assessment.description,
        reflectionPrompt: assessment.reflectionPrompt,
        questions: assessment.questions.map(({ id, prompt, options }) => ({ id, prompt, options })),
      },
    })),
  }
}

export function getSanitizedAssessment(courseId: string, unitId: string): SanitizedAssessmentDefinition | null {
  const unit = getLearningUnit(courseId, unitId)
  if (!unit) return null
  const { assessment } = unit
  return {
    title: assessment.title,
    description: assessment.description,
    reflectionPrompt: assessment.reflectionPrompt,
    questions: assessment.questions.map(({ id, prompt, options }) => ({ id, prompt, options })),
  }
}

export function gradeLearningUnitAssessment(
  courseId: string,
  unitId: string,
  answers: Record<string, string>,
): AssessmentGrade | null {
  const unit = getLearningUnit(courseId, unitId)
  if (!unit) return null
  const { questions } = unit.assessment
  const correctAnswers = questions.filter((question) => answers[question.id] === question.correctAnswer).length
  const totalQuestions = questions.length
  const scorePercent = totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 100)

  return {
    correctAnswers,
    totalQuestions,
    scorePercent,
    mastered: correctAnswers / totalQuestions >= apiFoundationsCourse.masteryThreshold,
    details: questions.map((question) => ({
      questionId: question.id,
      correct: answers[question.id] === question.correctAnswer,
      explanation: question.explanation,
      reviewLabel: question.reviewLabel,
    })),
  }
}

export function isLearningUnitMastered(correctAnswers: number, totalQuestions: number, masteryThreshold: number) {
  return totalQuestions > 0 && correctAnswers / totalQuestions >= masteryThreshold
}
