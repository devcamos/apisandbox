# Freemium Model — £5/month Premium

## Pricing

| | Free | Premium (£5/mo) |
|---|---|---|
| **Phases** | 0, 1, 7, 8 | All (0–8) |
| **Interactive visualizers** | No | Yes |
| **Progress tracking** | No | Yes (Shinobi board, XP) |
| **Concept side quests** | No | Yes |
| **Exercises** | No | Yes |
| **Account required** | No | Yes |

---

## Architecture

### Feature Flag System

All SaaS behaviour is gated behind feature flags in `config/featureFlags.ts`:

```typescript
isFeatureEnabled("PREMIUM_PAYWALL")   // Require auth for phases 2–6
isFeatureEnabled("STRIPE_CHECKOUT")   // Real payment flow vs demo mode
isFeatureEnabled("EMAIL_VERIFICATION")// Email verify on signup
isFeatureEnabled("RATE_LIMITING")     // Upstash Redis rate limiting
isFeatureEnabled("ANALYTICS")         // Vercel Analytics
```

Toggle via environment variables:

```env
NEXT_PUBLIC_FF_PREMIUM_PAYWALL=true
NEXT_PUBLIC_FF_STRIPE_CHECKOUT=true
NEXT_PUBLIC_FF_EMAIL_VERIFICATION=true
NEXT_PUBLIC_FF_RATE_LIMITING=true
NEXT_PUBLIC_FF_ANALYTICS=true
```

When all flags are `false` (default local dev), the app runs fully unlocked with no external dependencies.

### Access Control Flow

```
Request → Middleware (server-side)
  ├── PREMIUM_PAYWALL off → pass through
  ├── Public route → pass through
  ├── Premium route + no session → redirect to /login
  └── Protected API + no session → 401

Page render → SubscriptionGate (client-side, defence in depth)
  ├── PREMIUM_PAYWALL off → render content
  ├── Free phase → render content
  ├── Signed in + PREMIUM → render content
  └── Signed in + FREE → show UpgradePrompt
```

### Payment Flow (Stripe)

```
User clicks "Upgrade — £5/month"
  → POST /api/checkout
  → Creates Stripe Checkout Session (GBP, mode: subscription)
  → Redirects to Stripe hosted page
  → User pays
  → Stripe fires webhook: checkout.session.completed
  → POST /api/webhooks/stripe
  → Updates user: subscriptionTier = PREMIUM
  → Sends confirmation email via Resend
  → User returns to /upgrade/success
```

Cancellation is handled via Stripe Customer Portal:
- `POST /api/billing/portal` → generates portal session → user manages subscription
- Webhook `customer.subscription.deleted` → downgrade to FREE

---

## Database Schema

```prisma
model User {
  // ... auth fields
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?
  subscriptionTier     SubscriptionTier @default(FREE)
  subscriptionExpiresAt DateTime?
}

enum SubscriptionTier {
  FREE
  PREMIUM
}
```

**Agent convention:** every new user (password or Google) is bootstrapped in `lib/services/auth/user-bootstrap-service.ts` → `createUserWithInitialData`, which **explicitly sets** `subscriptionTier: "FREE"`. Do not create users elsewhere. Google account linking preserves an existing `PREMIUM` tier. Details: `.cursor/rules/auth-subscription.mdc`.

---

## Infrastructure

| Service | Purpose | Package |
|---------|---------|---------|
| Stripe | Payment processing | `stripe` |
| Upstash Redis | Rate limiting (serverless) | `@upstash/ratelimit`, `@upstash/redis` |
| Resend | Transactional email | `resend` |
| Pino | Structured logging | `pino`, `pino-pretty` |
| Vitest | Unit testing | `vitest`, `@testing-library/react` |

### Rate Limiting

Uses Upstash Redis sliding window algorithm:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Auth (login/signup) | 5 requests | 15 minutes |
| Signup | 3 requests | 1 hour |
| General API | 100 requests | 15 minutes |
| Webhooks | 50 requests | 1 minute |

Only active when `NEXT_PUBLIC_FF_RATE_LIMITING=true` and Upstash credentials are configured.

### Middleware (server-side protection)

When `PREMIUM_PAYWALL` is enabled:
- `/phase-2` through `/phase-6` require a session cookie — unauthenticated users redirect to `/login`
- `/api/subscription/*`, `/api/profile/*`, `/api/phase-progress/*` return 401 without auth
- Security headers added to all responses (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)

### Email

Transactional emails via Resend:
- Welcome email on signup
- Email verification link (24h expiry)
- Subscription confirmation
- Cancellation notification (with end date)

---

## File Structure

```
config/featureFlags.ts           ← Feature flag system
lib/stripe.ts                    ← Stripe client + plans
lib/email.ts                     ← Resend email templates
lib/rate-limit.ts                ← Upstash rate limiting
lib/logger.ts                    ← Pino structured logging
lib/subscription.ts              ← Access control logic
middleware.ts                    ← Server-side route protection
app/api/checkout/route.ts        ← Create Stripe Checkout session
app/api/webhooks/stripe/route.ts ← Handle Stripe lifecycle events
app/api/billing/portal/route.ts  ← Stripe Customer Portal
app/api/subscription/check/      ← Client-side access check
app/api/subscription/upgrade/    ← Demo upgrade (when Stripe disabled)
components/SubscriptionGate.tsx  ← Client-side gate component
prisma/schema.prisma             ← User model with Stripe fields
vitest.config.ts                 ← Unit test configuration
tests/unit/                      ← Unit tests
```

---

## Environment Variables (Production)

```env
# Feature flags — enable all for production
NEXT_PUBLIC_FF_PREMIUM_PAYWALL=true
NEXT_PUBLIC_FF_STRIPE_CHECKOUT=true
NEXT_PUBLIC_FF_EMAIL_VERIFICATION=true
NEXT_PUBLIC_FF_RATE_LIMITING=true
NEXT_PUBLIC_FF_ANALYTICS=true

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Resend
RESEND_API_KEY=re_...
EMAIL_FROM="API Sandbox <hello@yourdomain.com>"

# Logging
LOG_LEVEL=info
```

---

## Testing

```bash
npm run test:unit        # Vitest — feature flags, subscription logic
npm run test:unit:watch  # Vitest in watch mode
npm run test:ci:smoke    # Playwright E2E smoke
npm run test             # Full Playwright suite
```

---

## Remaining Work

- [ ] Stripe Dashboard: create Product + Price (£5/mo GBP)
- [ ] Stripe Dashboard: configure Customer Portal
- [ ] Stripe Dashboard: set webhook endpoint URL
- [ ] Vercel: set production environment variables
- [ ] Create proper Prisma migration (replace db push)
- [ ] Terms of Service + Privacy Policy pages
- [ ] Custom 404/500 error pages
- [ ] Landing page with value proposition
- [ ] SEO metadata per phase
- [ ] Cookie consent banner
