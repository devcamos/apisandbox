# Engineering principles

Reference tree for reviews and refactors. Apply pragmatically — prefer small, verifiable steps over theoretical purity.

```
Engineering Best Practices
├── Universal Engineering Principles
│   ├── KISS
│   ├── DRY
│   ├── YAGNI
│   ├── SOLID
│   └── Separation of Concerns
├── Security Principles
│   ├── OWASP
│   ├── Least Privilege
│   ├── Zero Trust
│   └── Defense in Depth
├── System Design Principles
│   ├── CAP Theorem
│   ├── Scalability
│   ├── Reliability
│   ├── Observability
│   └── Event-Driven Design
├── UX Principles
│   ├── Nielsen Heuristics
│   ├── Accessibility
│   ├── Progressive Disclosure
│   └── Feedback Loops
└── Production Principles
    ├── CI/CD
    ├── IaC
    ├── Monitoring
    ├── Fail Fast
    └── Graceful Degradation
```

## How we use this in API Sandbox

| Principle | Practice in this repo |
|-----------|------------------------|
| **KISS** | Small modules (`lib/auth/client-fetch.ts`), one job per helper |
| **DRY** | Shared auth client helpers, Google button hook, middleware redirect helper |
| **YAGNI** | No new abstractions until a second consumer exists |
| **SOLID** | Auth UI vs `lib/services/auth/*` vs API routes vs middleware |
| **Separation of Concerns** | Cookie session (middleware) vs Bearer API (`readAuthToken`) |
| **OWASP / Defense in Depth** | Middleware security headers, httpOnly cookies, safe redirects |
| **Least Privilege** | Protected routes require session; API routes validate tokens |
| **Fail Fast** | Zod + `parseJsonBody`, client validation before submit |
| **Observability** | `/api/health/*`, structured API errors |
| **CI/CD** | `npm run verify:ci`, trunk → `main`, release line `v1` |
| **Accessibility / Feedback** | Login error types, loading states, ARIA on fields |

See [GITFLOW.md](./GITFLOW.md) for branching and [AGENT_PR_CHECKLIST.md](./AGENT_PR_CHECKLIST.md) for pre-merge gates.
