import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
/** @type {import("eslint").Linter.Config[]} */
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

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
    rules: {
      // Pedantic for long-form learning copy; escaping every apostrophe hurts readability.
      "react/no-unescaped-entities": "off",
      // Legitimate patterns (hydration, derived reset-on-prop) trigger this in React 19 plugin.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
