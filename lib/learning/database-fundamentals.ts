export interface DbTopic {
  id: string
  number: number
  title: string
  subtitle: string
  keywords: string[]
  summary: string
  whyItMatters: string
  apiEngineerAngle: string
  pitfalls: { mistake: string; fix: string }[]
  tools?: string[]
}

export const databaseFundamentalsTopics: DbTopic[] = [
  {
    id: "relational-vs-nosql",
    number: 1,
    title: "Relational vs Non-relational",
    subtitle: "SQL · NoSQL",
    keywords: ["Tables", "Joins", "Schemas", "Documents", "Key-value", "Graphs"],
    summary:
      "Relational databases (PostgreSQL, MySQL) model data in tables with strict schemas and relationships. NoSQL stores (MongoDB, Redis, DynamoDB) trade some consistency guarantees for flexible shapes and horizontal scale patterns.",
    whyItMatters:
      "Your API contract often mirrors how data is stored. Wrong store choice creates join pain, migration nightmares, or impossible queries at scale.",
    apiEngineerAngle:
      "Use SQL when you need transactions across entities (billing, accounts). Use document/KV stores for caches, sessions, or denormalized read models — often behind a SQL system of record.",
    pitfalls: [
      { mistake: "Picking MongoDB because JSON APIs use JSON", fix: "Start with Postgres unless you have a clear scale or schema-flexibility reason." },
      { mistake: "Duplicating relational logic in application code", fix: "Let the database enforce constraints where possible; validate at the API boundary too." },
    ],
    tools: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "DynamoDB"],
  },
  {
    id: "acid-base",
    number: 2,
    title: "ACID / BASE",
    subtitle: "Consistency tradeoffs",
    keywords: ["Atomic", "Consistent", "Isolated", "Durable", "Eventually consistent"],
    summary:
      "ACID (typical SQL): all-or-nothing commits, strong consistency within a transaction. BASE (many distributed/NoSQL systems): availability first, with eventual consistency across nodes.",
    whyItMatters:
      "Payment and entitlement flows need ACID. Feeds, analytics, and caches can often tolerate eventual consistency if you design idempotency and reconciliation.",
    apiEngineerAngle:
      "Expose outcomes, not internal DB state. Return 409 on conflicts, use idempotency keys for writes, and document what 'read your own writes' means for your API.",
    pitfalls: [
      { mistake: "Assuming every read is immediately consistent globally", fix: "Route critical reads to primary; use replicas only when stale data is acceptable." },
      { mistake: "Multi-step business logic without a transaction boundary", fix: "Wrap related updates in one transaction or use outbox/saga patterns." },
    ],
  },
  {
    id: "joins",
    number: 3,
    title: "Joins",
    subtitle: "INNER · LEFT · RIGHT · FULL · CROSS · SELF",
    keywords: ["Foreign keys", "INNER", "LEFT", "RIGHT", "FULL", "CROSS", "SELF"],
    summary:
      "Joins combine rows across tables using key relationships. INNER keeps matches only; LEFT keeps all left rows; others cover outer and special cases like Cartesian products (CROSS) or self-references (SELF).",
    whyItMatters:
      "N+1 API patterns often come from loading parents then querying children per row — exactly what a join or eager fetch solves in one round trip.",
    apiEngineerAngle:
      "ORMs hide joins behind `include` / `relations`. Know the SQL your framework generates; add indexes on foreign keys used in joins.",
    pitfalls: [
      { mistake: "N+1 queries in list endpoints", fix: "Batch load with joins, dataloaders, or a single query with IN (...)." },
      { mistake: "CROSS JOIN by accident", fix: "Review generated SQL; missing ON clause explodes row counts." },
    ],
  },
  {
    id: "indexes",
    number: 4,
    title: "Indexes",
    subtitle: "B-tree · Hash · Composite · Covering",
    keywords: ["B-tree", "Hash", "Composite", "Covering", "Full table scan"],
    summary:
      "Indexes speed reads by maintaining sorted lookup structures. B-tree is the default for range queries; hash helps equality; composite indexes match multi-column filters; covering indexes include extra columns to avoid table lookups.",
    whyItMatters:
      "A missing index turns a 5ms lookup into a full table scan that collapses under API traffic.",
    apiEngineerAngle:
      "Index columns you filter and join on (`userId`, `email`, `createdAt`). Every index slows writes slightly — add indexes from real query patterns, not guesses.",
    pitfalls: [
      { mistake: "Indexing every column", fix: "Measure with EXPLAIN; remove unused indexes." },
      { mistake: "Wrong column order in composite indexes", fix: "Leading column must match your most selective/filtered column first." },
    ],
    tools: ["PostgreSQL B-tree", "GIN/GiST (Postgres)", "Prisma @@index"],
  },
  {
    id: "transactions",
    number: 5,
    title: "Transactions",
    subtitle: "BEGIN · COMMIT · ROLLBACK",
    keywords: ["BEGIN", "COMMIT", "ROLLBACK", "Savepoints", "Nested"],
    summary:
      "A transaction groups changes into one atomic unit: COMMIT makes all visible, ROLLBACK undoes all. Savepoints allow partial rollback within a larger transaction.",
    whyItMatters:
      "Upgrading a user to Premium must update subscription tier and audit rows together — half-applied state breaks billing and support.",
    apiEngineerAngle:
      "Prisma: `prisma.$transaction([...])`. Keep transactions short; holding locks during external HTTP calls (Stripe) causes timeouts and deadlocks.",
    pitfalls: [
      { mistake: "Calling Stripe inside a DB transaction", fix: "Commit local state after webhook confirmation or use outbox pattern." },
      { mistake: "Long-running transactions under load", fix: "Split work; use background jobs for slow side effects." },
    ],
  },
  {
    id: "isolation-levels",
    number: 6,
    title: "Isolation Levels",
    subtitle: "Read uncommitted → Serializable",
    keywords: ["Read uncommitted", "Read committed", "Repeatable read", "Serializable"],
    summary:
      "Isolation controls what concurrent transactions see. Higher levels prevent anomalies (dirty reads, non-repeatable reads, phantom rows) at the cost of more locking and retries.",
    whyItMatters:
      "Under load, weak isolation can return duplicate counts, lost updates, or inconsistent dashboard totals.",
    apiEngineerAngle:
      "Postgres default is READ COMMITTED. Use SERIALIZABLE only when you truly need it; handle serialization failures with retry. Design APIs to be idempotent on retry.",
    pitfalls: [
      { mistake: "Assuming SELECT always sees stable data during a request", fix: "Use repeatable read or explicit locking for financial balances." },
      { mistake: "Ignoring deadlock errors", fix: "Retry with backoff; consistent lock ordering on rows." },
    ],
  },
  {
    id: "connection-pooling",
    number: 7,
    title: "Connection Pooling",
    subtitle: "Reuse connections · Pool size",
    keywords: ["PgBouncer", "HikariCP", "Pool size", "Overhead"],
    summary:
      "Opening a DB connection is expensive. Pools keep warm connections and lend them to requests, reducing latency and protecting the database from connection storms.",
    whyItMatters:
      "Serverless and high-concurrency APIs can exhaust max_connections in seconds without pooling.",
    apiEngineerAngle:
      "Prisma uses a pool in the client; serverless needs pooled URLs (e.g. Neon/Vercel pooled connection string). Size pool ≈ expected concurrent DB work, not unbounded.",
    pitfalls: [
      { mistake: "One new connection per serverless invocation", fix: "Use provider pooler or limit concurrency." },
      { mistake: "Pool size far larger than DB allows", fix: "Align app pool × instances with Postgres max_connections." },
    ],
    tools: ["PgBouncer", "HikariCP", "Prisma connection pool", "Neon pooler"],
  },
  {
    id: "migrations",
    number: 8,
    title: "Database Migrations",
    subtitle: "Versioned schema · up / down",
    keywords: ["Flyway", "Liquibase", "Alembic", "Prisma migrate", "Idempotent"],
    summary:
      "Migrations are version-controlled schema changes applied in order (up) and optionally reversed (down). They keep every environment aligned from local to production.",
    whyItMatters:
      "Deploying code that expects a column that does not exist causes 500s for every user.",
    apiEngineerAngle:
      "This repo uses Prisma: `npx prisma migrate dev` locally, `migrate deploy` in CI/prod. Prefer additive changes (new column nullable) before backfill and tighten.",
    pitfalls: [
      { mistake: "Editing applied migration files", fix: "Create a new migration; never rewrite history on shared branches." },
      { mistake: "Blocking deploys with destructive changes", fix: "Expand-contract pattern: add → dual-write → backfill → remove old." },
    ],
    tools: ["Prisma Migrate", "Flyway", "Liquibase", "Alembic"],
  },
  {
    id: "query-optimization",
    number: 9,
    title: "Execution Plan & Query Optimization",
    subtitle: "EXPLAIN · ANALYZE · N+1",
    keywords: ["EXPLAIN", "ANALYZE", "Seq scan", "Index scan", "N+1", "Rewrite"],
    summary:
      "EXPLAIN shows how the database executes a query (seq scan vs index scan). ANALYZE runs it and reports actual timings. Optimization targets fewer rows, better indexes, and fewer round trips.",
    whyItMatters:
      "Slow queries dominate P99 API latency and burn CPU on the database tier.",
    apiEngineerAngle:
      "Log slow queries in staging. Fix N+1 in ORMs, add indexes for WHERE/JOIN columns, paginate large lists, and avoid SELECT * in hot paths.",
    pitfalls: [
      { mistake: "Optimizing without measuring", fix: "EXPLAIN ANALYZE first; fix the largest cost." },
      { mistake: "Offset pagination on huge tables", fix: "Keyset pagination on indexed `(createdAt, id)`." },
    ],
  },
  {
    id: "sharding-replication",
    number: 10,
    title: "Sharding & Replication",
    subtitle: "Horizontal split · Primary / replica",
    keywords: ["Shard key", "Primary", "Replica", "Consistency"],
    summary:
      "Replication copies data to standby nodes for read scale and failover. Sharding splits data across nodes by a shard key when a single machine cannot hold or serve the dataset.",
    whyItMatters:
      "Most apps start with one primary and read replicas; sharding is a later step when vertical scale and replicas are not enough.",
    apiEngineerAngle:
      "Route writes to primary always. Reads from replicas only when stale data is OK. Sharding affects every query — choose shard key carefully (e.g. tenantId).",
    pitfalls: [
      { mistake: "Sharding too early", fix: "Scale vertically, index, cache, and replicate before splitting data." },
      { mistake: "Cross-shard joins", fix: "Denormalize or aggregate at application layer; avoid scatter-gather." },
    ],
  },
  {
    id: "read-replicas",
    number: 11,
    title: "Read Replicas",
    subtitle: "Offload reads · Replication lag",
    keywords: ["Read-only", "Async lag", "Routing", "Primary writes"],
    summary:
      "Read replicas are copies of the primary used for SELECT traffic. Replication is usually asynchronous, so replicas can lag behind by milliseconds to seconds.",
    whyItMatters:
      "Listing dashboards from replicas while billing reads from primary is a common, valid split — if you accept lag on lists.",
    apiEngineerAngle:
      "After signup, reading your own user row from a lagging replica may 404 briefly. Use primary for session/auth paths; replicas for analytics and heavy lists.",
    pitfalls: [
      { mistake: "Reading own writes from replica immediately", fix: "Sticky primary for session or short delay/retry." },
      { mistake: "Treating replica lag as zero in UX", fix: "Surface 'data may take a moment to update' where needed." },
    ],
  },
]
