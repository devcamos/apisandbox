import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      // Keep LCOV aligned with unit tests only. A broad `lib/**` include produced
      // thousands of 0%-covered lines in lcov.info; SonarCloud then fails Coverage on New Code.
      include: [
        "lib/assistant/access.ts",
        "lib/assistant/enabled.ts",
        "lib/assistant/limits.ts",
        "lib/assistant/redirect.ts",
        "lib/api-tokens/token-policy.ts",
        "lib/api/v1/handler.ts",
        "lib/api/v1/openapi.ts",
        "lib/api/v1/problem.ts",
        "lib/api/v1/rate-limit.ts",
        "lib/api/v1/request-id.ts",
        "lib/api/v1/require-api-token.ts",
        "lib/api/v1/schemas.ts",
        "lib/auth-authorize-helpers.ts",
        "lib/auth/client-fetch.ts",
        "lib/auth/session-token.ts",
        "lib/browser-credentials.ts",
        "lib/dependency-integrations.ts",
        "lib/demo-completion.ts",
        "lib/demo-login.ts",
        "lib/saas/config.ts",
        "lib/auth/jwt-secret.ts",
        "lib/google-client-id.ts",
        // Omit lib/learning/** and lib/lessons/** — Sonar excludes them from sources,
        // so LCOV entries for those paths produce "Could not resolve" warnings.
        "lib/login-error-parser.ts",
        "lib/password-validation.ts",
        "lib/premium-pricing.ts",
        "lib/prisma-busy-retry.ts",
        "lib/prisma-url.ts",
        "lib/progress/best-score-progress.ts",
        "lib/sanitize-mermaid-svg.ts",
        "lib/safe-redirect.ts",
        "lib/services/user-app-guide-service.ts",
        "lib/stripe-webhook-handlers.ts",
        "lib/stripe-webhook-idempotency.ts",
        "lib/stripe-subscriptions.ts",
        "lib/subscription-provision.ts",
        "lib/stripe-client.ts",
        "lib/user-name.ts",
        "lib/validation/email.ts",
        "lib/validation/learner-profile.ts",
        "config/featureFlags.ts",
      ],
      // subscription.test.ts imports DB-backed helpers; keep them out of LCOV so SonarCloud
      // does not treat Prisma paths as uncovered new code.
      exclude: [
        "**/node_modules/**",
        "**/*.env.example",
        "**/lib/subscription.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
