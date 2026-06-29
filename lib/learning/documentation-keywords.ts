const phaseDocumentationKeywords: Record<string, readonly string[]> = {
  "Callbacks & Async Programming": ["Promises", "async/await", "error handling", "timeouts"],
  "Essential Data Structures": ["arrays", "maps", "sets", "queues"],
  "Virtual Machines (VMs) & EC2": ["instances", "images", "scaling", "security groups"],
  "Essential Algorithms": ["complexity", "search", "sorting", "Big O"],
  "HTTP Fundamentals": ["methods", "status codes", "headers", "JSON"],
  "Version Control (Git) Basics": ["commits", "branches", "merge", "pull requests"],
  REST: ["resources", "HTTP methods", "status codes", "idempotency"],
  GraphQL: ["schema", "queries", "mutations", "resolvers"],
  gRPC: ["Protocol Buffers", "streaming", "contracts", "deadlines"],
  WebSocket: ["handshake", "frames", "real-time", "reconnection"],
  "Event-Driven": ["events", "producers", "consumers", "eventual consistency"],
  OAuth2: ["authorization code", "PKCE", "access token", "refresh token", "scopes"],
  "API Keys": ["headers", "rotation", "rate limits", "secret storage"],
  "JWT (JSON Web Tokens)": ["claims", "signature", "expiry", "bearer token"],
  "Retries & Exponential Backoff": ["retry budget", "backoff", "jitter", "idempotency"],
  "Circuit Breaker": ["closed", "open", "half-open", "fallback"],
  "Stripe Payments": ["checkout", "webhooks", "idempotency", "subscriptions"],
  "Resend Email Service": ["transactional email", "templates", "domains", "delivery"],
  "AWS S3": ["buckets", "object storage", "presigned URLs", "IAM"],
  "Vercel Blob": ["uploads", "tokens", "public assets", "object storage"],
  "Cloudflare R2": ["S3 API", "buckets", "egress", "object storage"],
}

export function getDocumentationKeywords(title: string): readonly string[] {
  return phaseDocumentationKeywords[title] ?? []
}

export { phaseDocumentationKeywords }
