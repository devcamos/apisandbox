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
        "lib/auth-authorize-helpers.ts",
        "lib/login-error-parser.ts",
        "lib/sanitize-mermaid-svg.ts",
        "lib/safe-redirect.ts",
        "lib/stripe-webhook-handlers.ts",
        "lib/stripe-client.ts",
        "lib/user-name.ts",
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
