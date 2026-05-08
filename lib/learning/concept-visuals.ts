export interface ConceptVisualDiagramVariant {
  id: "use-case" | "sequence" | "c4";
  label: string;
  description: string;
  diagram: string;
}

export interface ConceptVisualStage {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  diagrams: ConceptVisualDiagramVariant[];
}

export interface ConceptVisualDefinition {
  id: string;
  concept: string;
  summary: string;
  stages: ConceptVisualStage[];
}

export const conceptVisuals: Record<string, ConceptVisualDefinition> = {
  caching: {
    id: "caching",
    concept: "Caching",
    summary: "Caching exists because repeated expensive reads become a latency and cost problem before they become an architecture diagram.",
    stages: [
      {
        id: "existence",
        label: "Existence",
        title: "Why caching exists",
        description: "Show the real failure first: every request hits the database, and the database becomes the cost and latency bottleneck.",
        bullets: [
          "Protected resource: database CPU, IOPS, and connection pool",
          "Primary trigger: hot repeated reads against the same data",
          "If removed tomorrow: p95/p99 latency rises and read pressure shifts directly to the database"
        ],
        diagrams: [
          {
            id: "use-case",
            label: "Use Case",
            description: "Show the product pressure that forces caching into scope.",
            diagram: `flowchart LR
              U["Users"] --> UC["Need fast repeat reads"]
              UC --> A["Application"]
              A --> D["Primary Database"]
              D -. "repeated reads create pain" .-> H["Constraint: latency + DB saturation"]`
          },
          {
            id: "sequence",
            label: "Sequence",
            description: "Show the repeated request pattern that creates the problem.",
            diagram: `sequenceDiagram
              participant User
              participant App
              participant DB

              User->>App: GET /product/123
              App->>DB: read product 123
              DB-->>App: row
              App-->>User: response
              User->>App: GET /product/123 again
              App->>DB: read product 123 again
              DB-->>App: row
              App-->>User: response`
          },
          {
            id: "c4",
            label: "C4-style",
            description: "Show the container-level picture before caching exists.",
            diagram: `flowchart TB
              subgraph Internet["Users"]
                U["Browser / Client"]
              end
              subgraph Platform["System"]
                A["App Container"]
                D["Database Container"]
              end
              U --> A
              A --> D`
          }
        ]
      },
      {
        id: "constraints",
        label: "Pre/Post Constraints",
        title: "Before and after the constraint forces caching",
        description: "The pre-state is simple but expensive at scale. The post-state adds operational complexity in exchange for lower repeated read cost.",
        bullets: [
          "Pre-constraint: simpler architecture, every read goes to source of truth",
          "Post-constraint: cache absorbs hot reads, source of truth still owns writes",
          "New cost introduced: invalidation, TTL policy, and stale-read risk"
        ],
        diagrams: [
          {
            id: "use-case",
            label: "Use Case",
            description: "Compare the before-state pain to the after-state objective.",
            diagram: `flowchart LR
              PRE["Before: every read hits DB"] --> PAIN["Latency + cost pressure"]
              PAIN --> DECISION["Introduce cache"]
              DECISION --> POST["After: hot reads served from cache"]`
          },
          {
            id: "sequence",
            label: "Sequence",
            description: "Compare the request path before and after caching is introduced.",
            diagram: `sequenceDiagram
              participant User
              participant App
              participant Cache
              participant DB

              Note over User,DB: Before
              User->>App: GET /product/123
              App->>DB: fetch row
              DB-->>App: row
              App-->>User: response

              Note over User,DB: After
              User->>App: GET /product/123
              App->>Cache: read key
              Cache-->>App: hit
              App-->>User: faster response`
          },
          {
            id: "c4",
            label: "C4-style",
            description: "Show the extra container introduced by the new constraint.",
            diagram: `flowchart TB
              subgraph Before["Before"]
                U1["Client"] --> A1["App Container"]
                A1 --> D1["Database Container"]
              end

              subgraph After["After"]
                U2["Client"] --> A2["App Container"]
                A2 --> C2["Cache Container"]
                A2 --> D2["Database Container"]
              end`
          }
        ]
      },
      {
        id: "mechanics",
        label: "Mechanics",
        title: "What the request path actually does",
        description: "This is the exact cache-aside flow. The app checks the cache first, falls back to the database on a miss, then repopulates cache for later reads.",
        bullets: [
          "State lives in two places: source of truth in DB, performance copy in cache",
          "Pattern: cache-aside is the default because it keeps the DB authoritative",
          "Timing assumption: a small staleness window is acceptable"
        ],
        diagrams: [
          {
            id: "use-case",
            label: "Use Case",
            description: "Show the behavior the system is trying to achieve for repeated reads.",
            diagram: `flowchart LR
              U["User requests product"] --> A["App"]
              A --> C["Check cache first"]
              C -->|"hit"| F["Fast response"]
              C -->|"miss"| D["Fetch from DB and populate cache"]`
          },
          {
            id: "sequence",
            label: "Sequence",
            description: "Trace the cache-aside flow exactly.",
            diagram: `sequenceDiagram
              participant User
              participant App
              participant Cache
              participant DB

              User->>App: GET /product/123
              App->>Cache: read key product:123
              alt cache hit
                Cache-->>App: value
                App-->>User: fast response
              else cache miss
                Cache-->>App: miss
                App->>DB: fetch row
                DB-->>App: row
                App->>Cache: set key with TTL
                App-->>User: response
              end`
          },
          {
            id: "c4",
            label: "C4-style",
            description: "Show where the cache sits structurally relative to app and database.",
            diagram: `flowchart TB
              U["Client"] --> A["App Container"]
              A --> C["Cache Container"]
              A --> D["Database Container"]
              C -. "fallback on miss" .-> D`
          }
        ]
      },
      {
        id: "failure",
        label: "Failures and Solutions",
        title: "Where caching breaks and how you contain it",
        description: "Caching failure is usually partial failure: stale data, cache stampede, hot keys, or cache node loss. The solution is not just 'retry'.",
        bullets: [
          "Stampede: many misses hit DB at once; solve with request coalescing or stale-while-revalidate",
          "Hot key: one key gets extreme traffic; solve with replication or sharding strategy",
          "Cache outage: fall back to DB with rate protection and degraded mode"
        ],
        diagrams: [
          {
            id: "use-case",
            label: "Use Case",
            description: "Show the user-visible failure and the operational solutions.",
            diagram: `flowchart LR
              U["Traffic spike"] --> M["Cache miss storm"]
              M --> D["Database overload"]
              D --> S["Slow users"]
              M -. "single-flight" .-> F1["Coalesce"]
              D -. "backpressure" .-> F2["Protect DB"]
              S -. "serve stale" .-> F3["Graceful fallback"]`
          },
          {
            id: "sequence",
            label: "Sequence",
            description: "Trace a miss storm and containment path.",
            diagram: `sequenceDiagram
              participant Users
              participant App
              participant Cache
              participant DB

              Users->>App: many GET /product/123
              App->>Cache: read hot key
              Cache-->>App: miss for many callers
              App->>DB: many duplicate reads
              DB-->>App: slower responses
              App-->>Users: latency spike
              Note over App: solution = coalesce requests / serve stale`
          },
          {
            id: "c4",
            label: "C4-style",
            description: "Show the hotspot and protection boundaries in the container view.",
            diagram: `flowchart TB
              U["Clients"] --> A["App Container"]
              A --> C["Cache Cluster"]
              A --> D["Database Container"]
              C -. "miss storm / hotspot" .-> D
              A -. "single-flight / stale fallback / rate limit" .-> P["Protection Layer"]`
          }
        ]
      },
      {
        id: "tradeoffs",
        label: "Trade-offs",
        title: "What caching buys and what it costs",
        description: "Caching is a speed and cost optimization that spends correctness simplicity. The trade-off is operational and semantic, not just technical.",
        bullets: [
          "Optimized for: lower latency, lower DB cost, higher read throughput",
          "Sacrificed: freshness, simpler reasoning, invalidation ease",
          "Wrong choice when: data changes constantly and stale reads are unacceptable"
        ],
        diagrams: [
          {
            id: "use-case",
            label: "Use Case",
            description: "Show what business and user outcomes caching improves and what it risks.",
            diagram: `flowchart LR
              C["Caching"] --> G["Gain: faster reads"]
              C --> G2["Gain: lower infra cost"]
              C --> X["Risk: stale data"]
              C --> X2["Risk: invalidation complexity"]`
          },
          {
            id: "sequence",
            label: "Sequence",
            description: "Contrast the fast path with the stale-data path.",
            diagram: `sequenceDiagram
              participant User
              participant App
              participant Cache
              participant DB

              Note over User,DB: Performance win
              User->>App: GET /product/123
              App->>Cache: read key
              Cache-->>App: hit
              App-->>User: fast response

              Note over User,DB: Trade-off
              DB-->>Cache: source data changed earlier
              User->>App: GET /product/123
              App->>Cache: read key
              Cache-->>App: stale value
              App-->>User: faster but older response`
          },
          {
            id: "c4",
            label: "C4-style",
            description: "Show the extra infrastructure introduced by caching and the semantic cost it creates.",
            diagram: `flowchart TB
              U["Client"] --> A["App Container"]
              A --> C["Cache Container"]
              A --> D["Database Container"]
              C -. "freshness drift risk" .-> D
              C -. "ops + invalidation overhead" .-> O["Operational complexity"]`
          }
        ]
      }
    ]
  }
};

export function getConceptVisual(conceptId: string) {
  return conceptVisuals[conceptId] ?? null;
}
