# Third-party integrations — coverage by pattern

Audit of what API Sandbox teaches vs what is wired live. Use this when prioritising demos, env setup, and Phase 2+ gaps.

**Legend:** ✅ Live or real when configured · 🎮 Interactive (local/mock) · 📖 Content only · ❌ Missing

---

## 1. API style patterns (Phase 1)

| Pattern | Teaching | Interactive | Live external API | Gap |
|---------|----------|-------------|-------------------|-----|
| **REST** | ✅ Phase 1 | 🎮 `ApiEndpointTester` | ✅ JSONPlaceholder | Add pagination/link-header demo |
| **GraphQL** | ✅ Phase 1 | 🎮 `GraphQLTester` (mock) | ❌ | Point at a public GraphQL API or sandbox |
| **gRPC** | ✅ Phase 1 | 📖 Proto + code samples | ❌ | Browser gRPC hard; consider grpc-web or “call from script” lab |
| **WebSocket** | ✅ Phase 1 | 🎮 `WebSocketTester` (local sim) | ❌ | Optional: echo server or public WS feed |
| **Event-driven** | ✅ Phase 1 | 🎮 `EventDrivenTester` (local sim) | ❌ | Queue/pub-sub lab (SQS, RabbitMQ, or in-memory bus) |

---

## 2. Authentication patterns (Phase 2)

| Pattern | Teaching | Interactive | Live | Gap |
|---------|----------|-------------|------|-----|
| **OAuth 2.0** | ✅ Phase 2 | 🎮 `OAuth2Simulator` | ❌ (sim only) | Optional: real Google/GitHub OAuth lab (app already has Google sign-in) |
| **API keys** | ✅ Phase 2 | 🎮 `ApiKeyTester` | 🎮 Mock + optional OpenWeather | Document key rotation flow; header vs query demo ✅ |
| **JWT** | ✅ Phase 2 + app auth | 🎮 Decode demo (`/phase-2/demos/jwt`) | ✅ App uses JWT | Add verify-signature exercise (not just decode) |
| **HMAC / webhook signatures** | 📖 Stripe section | ❌ | ✅ Stripe webhooks (backend) | Learner-facing “verify Stripe signature” demo |
| **mTLS** | 📖 mentioned | ❌ | ❌ | Low priority unless enterprise track |

---

## 3. Resilience patterns (Phase 2)

| Pattern | Teaching | Interactive | Live | Gap |
|---------|----------|-------------|------|-----|
| **Retry + backoff** | ✅ Phase 2 | 🎮 `RetryDemo` | 🎮 Local random failures | Honor `Retry-After` header demo |
| **Circuit breaker** | ✅ Phase 2 | 🎮 `CircuitBreakerDemo` | 🎮 Local sim | Tie to health-check / half-open UI |
| **Rate limiting** | ✅ Content + SaaS | ❌ learner demo | ✅ Upstash (when configured) | Interactive 429 + backoff demo |
| **Timeout / bulkhead** | 📖 Phase 2–3 | ❌ | ❌ | Small timeout budget visualiser |
| **Idempotency keys** | 📖 payments content | ❌ | 📖 Stripe docs | POST retry + `Idempotency-Key` demo |

---

## 4. Data & persistence (Phase 2, 9)

| Pattern | Teaching | Interactive | Live | Gap |
|---------|----------|-------------|------|-----|
| **PostgreSQL** | ✅ Phase 2, 9 | 📖 | ✅ App DB | Prisma Studio link in onboarding ✅ |
| **ORM / migrations** | ✅ Phase 3 | 📖 | ✅ Prisma | — |
| **Connection pooling** | ✅ Phase 9 | 📖 | ✅ Via Prisma | — |
| **Cache (Redis)** | 📖 | ❌ | ✅ Upstash (rate limit only) | Cache-aside demo for API responses |

---

## 5. Observability & ops (Phase 3, `/observability`)

| Pattern | Teaching | Interactive | Live | Gap |
|---------|----------|-------------|------|-----|
| **Structured logging** | ✅ | 📖 | ✅ App logs | — |
| **Metrics / percentiles** | ✅ | 🎮 `ObservabilityDashboard` | 🎮 Local metrics | Export to Prometheus format demo |
| **Health checks** | ✅ | ✅ `/api/health/*` | ✅ | — |
| **Correlation IDs** | ✅ Phase 3 | 📖 | Partial | Propagate `x-request-id` in `ApiEndpointTester` |
| **Tracing (OpenTelemetry)** | 📖 | ❌ | ❌ | Optional advanced module |

---

## 6. Platform SaaS (the app itself)

| Integration | Purpose | Status | Env / notes |
|-------------|---------|--------|-------------|
| **PostgreSQL** | Users, progress, billing | ✅ Required | `DATABASE_URL` |
| **Stripe** | Subscriptions | ✅ When flagged | `STRIPE_*`, webhooks — see [STRIPE_LOCAL.md](./STRIPE_LOCAL.md) |
| **Google OAuth** | Sign-in | ✅ When configured | `GOOGLE_CLIENT_ID` / secret |
| **OpenAI / Gemini** | Learning assistant | ✅ Optional | `OPENAI_API_KEY` or `GEMINI_API_KEY` |
| **Resend** | Email | ✅ Placeholder in CI | `RESEND_API_KEY` |
| **Upstash Redis** | Rate limiting | ✅ When flagged | `UPSTASH_REDIS_*` |
| **Vercel Analytics** | Usage | ✅ Optional | `NEXT_PUBLIC_FF_ANALYTICS` |

Readiness probe: `GET /api/health/saas` (see [SAAS.md](./SAAS.md)).

---

## 7. AWS / cloud content (Phase 6–8, `/cloud`)

| Area | Teaching | Interactive | Live AWS | Gap |
|------|----------|-------------|----------|-----|
| **Service catalog** | ✅ | 📖 table | ❌ | Mock cost estimate only |
| **Migration strategies** | ✅ | 🎮 Analyze API (mock) | ❌ | — |
| **Architecture templates** | ✅ | 📖 | ❌ | — |

---

## 8. Recommended next demos (highest ROI)

1. **Idempotency-Key** — POST retry safe payment/API write (ties to Stripe + REST).
2. **Webhook signature verification** — HMAC checker (Stripe-style).
3. **Rate limit + 429** — client backoff when Upstash or in-memory limit hit.
4. **GraphQL live query** — one read-only public endpoint.
5. **Correlation ID** — pass `x-request-id` through `ApiEndpointTester` and log chain.

---

## 9. Math ↔ pattern map (for future “Math for API builders” module)

| Maths | Pattern / integration |
|-------|------------------------|
| Sets & relations | SQL joins, allow lists |
| Boolean logic | IAM, middleware, feature flags |
| Statistics | p95 latency, error budgets |
| Graphs | Service deps, workflow state machines |
| Modular arithmetic | Sharding, consistent hash |
| Big-O | Index choice, N+1 queries |

See conversation / Phase 9 for database fundamentals; avoid duplicating a full Khan-style maths track inside the product.
