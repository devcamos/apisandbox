import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";

const require = createRequire(import.meta.url);
/** @type {import("eslint").Linter.Config[]} */
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

const rootDir = dirname(fileURLToPath(import.meta.url));

/** Matches sonar-project.properties `sonar.sources` (+ tests for skip rule). */
const sonarSourceGlobs = [
  "app/api/**/*.{ts,tsx}",
  "config/**/*.{ts,tsx}",
  "lib/**/*.{ts,tsx}",
  "middleware.ts",
];

/**
 * ESLint rules aligned with open SonarCloud issues (see docs/SONAR_LINT_MAP.md).
 */
const sonarParityRules = {
  // S3776
  "sonarjs/cognitive-complexity": ["error", 15],
  // S1854
  "sonarjs/no-dead-store": "error",
  // S2486
  "sonarjs/no-ignored-exceptions": "error",
  // S3358
  "sonarjs/no-nested-conditional": "error",
  // S1128
  "sonarjs/unused-import": "error",
  // S6353
  "sonarjs/concise-regex": "error",
  // S7764
  "unicorn/prefer-global-this": "error",
  // S7773
  "unicorn/prefer-number-properties": "error",
  // S7778
  "unicorn/prefer-single-call": "error",
};

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "mobile/**",
      "*.config.mjs",
    ],
  },
  ...nextCoreWebVitals,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: sonarSourceGlobs,
    plugins: {
      sonarjs,
      unicorn,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: sonarParityRules,
  },
  {
    files: ["tests/**/*.{ts,tsx}"],
    plugins: { sonarjs },
    rules: {
      // S1607 — opt-in suites must document why (see tests/prod-deployment-auth.spec.ts)
      "sonarjs/no-skipped-tests": "error",
    },
  },
  {
    files: sonarSourceGlobs,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: rootDir,
      },
    },
    rules: {
      // S2933
      "@typescript-eslint/prefer-readonly": "error",
    },
  },
];
