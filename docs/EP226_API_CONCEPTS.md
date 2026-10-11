# EP226 API concepts → API Sandbox map

Source: ByteByteGo newsletter **EP226: API Concepts Every Software Engineer Should Know** (2026-09-19). The email lists 28 concepts in six groups and explains them at group level only; per-concept detail lived in an infographic that is not reproduced here. This map does not invent claims beyond that grouping.

| # | EP226 concept | Group | Where it is taught in API Sandbox |
|---|---------------|-------|-----------------------------------|
| 1 | HTTP methods | HTTP basics | API Foundations unit `http-messages`; Phase 0 lesson `http-json` |
| 2 | Status codes | HTTP basics | `http-messages`; Phase 0 `http-json`; phase quizzes |
| 3 | Request formats | HTTP basics | API Foundations unit `api-contracts` (JSON, schemas, validation) |
| 4 | Response structure | HTTP basics | `api-contracts` (error envelopes, stable responses) |
| 5 | REST | API styles | Phase 1 lesson `rest-vs-graphql`; architecture pattern category `rest` |
| 6 | GraphQL | API styles | Phase 1 `rest-vs-graphql`; category `graphql` |
| 7 | gRPC | API styles | Phase 3 lesson `grpc-service`; category `grpc` |
| 8 | Webhooks | API styles | Phase 2 lesson `webhooks` (also Stripe webhook ops in later billing content) |
| 9 | WebSockets | API styles | Architecture pattern category `websocket`; Phase 0/1 real-time mentions |
| 10 | Naming | Design decisions | Phase 1 lesson `resource-naming` |
| 11 | Pagination | Design decisions | Phase 1 lesson `pagination` |
| 12 | Versioning | Design decisions | Phase 4 versioning topics; `api-contracts`; live `/api/v1` surface |
| 13 | Error responses | Design decisions | `api-contracts`; Phase 0 stable errors; `/api/v1` RFC 9457 problem+json |
| 14 | Backward compatibility | Design decisions | Phase 4 breaking-change topics; `api-contracts`; Phase 1 `contract-style` |
| 15 | API keys | Security | Phase 2 lesson `api-key` + demo `/phase-2/demos/api-keys` |
| 16 | OAuth | Security | Phase 2 lesson `oauth-flow` + OAuth2 demo |
| 17 | JWTs | Security | Phase 2 JWT demo; catalog “OAuth2 & JWTs” |
| 18 | Scopes | Security | Phase 2 lesson `token-scopes` (worked example: personal API tokens on `/api/v1`) |
| 19 | Permissions | Security | Phase 2 lesson `permissions` |
| 20 | Timeouts | Reliability | Phase 1 dependable-integrations; Phase 2 resilience |
| 21 | Retries | Reliability | `dependable-integrations`; Phase 2 retry demo; `resilience` lesson |
| 22 | Idempotency | Reliability | Phase 5 `idempotency-dedup`; Phase 2 algo-lens resilience |
| 23 | Rate limits | Reliability | Phase 4 `rate-limiter`; Phase 5 `rate-control-windows` |
| 24 | Caching | Reliability | Phase 4 `caching-layer` |
| 25 | Documentation | Supporting work | Phase 1 lesson `api-documentation` (+ `docs/API_V1.md`) |
| 26 | Specs | Supporting work | Phase 1 OpenAPI / `contract-style`; published `GET /api/v1/openapi.json` |
| 27 | Observability | Supporting work | Phase 3 `observability`; `dependable-integrations` |
| 28 | Contract testing | Supporting work | Phase 4 “Contract Testing with Pact” topics |

## Live worked examples in this app

Personal API tokens (`Bearer apisb_…`) on `/api/v1` demonstrate scopes, versioning (`/v1`), standard errors (`application/problem+json`), and OpenAPI. See [API_V1.md](./API_V1.md).
