# Education system architecture

API Sandbox remains the product name. The education-system model makes learning state a first-class domain while keeping the existing phase content, premium gates, and API sandbox demos.

## Learning identity

Progress belongs to `User.id`. API routes derive `userId` from the authenticated session and never trust a browser-submitted user id.

| Concept | Storage |
|---------|---------|
| Course | Stable code id such as `phase-2` |
| Module | Stable module id from `lib/lessons/phase-lessons.ts` |
| Checkpoint | Stable checkpoint id from the lesson plan |
| Learner progress | `LearningEnrollment` and `LearningCheckpointProgress` |
| Quiz mastery | Existing `UserPhaseProgress` |

`LearningCheckpointProgress` has its own row id and a unique learner checkpoint identity:

```text
unique(userId, courseId, moduleId, checkpointId)
```

## Premium model

Stripe remains the payment system of choice. Production premium access should use Stripe Checkout, verified webhooks, and the billing portal. Demo instant upgrade is only for non-production local flows.

SaaS readiness fails when Stripe checkout is enabled but Stripe secrets are missing, malformed, or production is using a test secret key.

## Dependency Integration

Dependency Integration maps tools and frameworks to where they are used in the app:

```text
dependency/framework/tool
  -> routes
  -> components
  -> service functions
  -> Prisma models
  -> environment variables
  -> learning areas
```

The app is function/component oriented, not class oriented, so the map tracks code units rather than only classes.
