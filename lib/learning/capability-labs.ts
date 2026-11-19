type Value = string | number | boolean | Value[]
type Fixture = { label: string; input: Record<string, Value> }
type Lab = {
  code: string
  baseline: Fixture
  fault: Fixture
  checks: (Fixture & { expected: Value })[]
}

function lab(
  code: string,
  baseline: Fixture,
  fault: Fixture,
  expected: Value,
  normal: Value,
  additionalChecks: Lab["checks"] = [],
): Lab {
  return { code, baseline, fault, checks: [{ ...fault, expected }, { ...baseline, expected: normal }, ...additionalChecks] }
}

// Fixtures deliberately use synthetic, local data and model behaviours.
export const capabilityLabs: Readonly<Record<string, Lab>> = {
  "ai-vs-ml-vs-deep-learning": lab(
    `function solve({ billing, access, weights }) {
  const rule = billing > 0.5 ? "billing" : "access";
  const score = billing * weights[0] + access * weights[1];
  return [rule, score >= 0 ? "billing" : "access"];
}`,
    { label: "Rule and learned prediction", input: { billing: 0.8, access: 0.2, weights: [1, -1] } },
    { label: "Swapped weights", input: { billing: 0.8, access: 0.2, weights: [-1, 1] } },
    ["billing", "access"], ["billing", "billing"], [
      { label: "Ambiguous positive margin", input: { billing: 0.52, access: 0.48, weights: [1, -1] }, expected: ["billing", "ABSTAIN"] },
      { label: "Ambiguous negative margin", input: { billing: 0.48, access: 0.52, weights: [1, -1] }, expected: ["access", "ABSTAIN"] },
    ],
  ),
  "training-vs-inference": lab(
    `function solve({ weight, update, approved, version }) {
  const infer = w => Math.round(100 / (1 + Math.exp(-(-0.4 + w * 0.8))));
  return [version, infer(weight), infer(weight + update)];
}`,
    { label: "Approved frozen model", input: { weight: 1.7, update: 0, approved: true, version: "router-7" } },
    { label: "Attempted live weight update", input: { weight: 1.7, update: -3, approved: true, version: "router-7" } },
    ["router-7", 72, 72], ["router-7", 72, 72], [
      { label: "Unapproved artifact", input: { weight: 2, update: 0, approved: false, version: "router-8" }, expected: "REJECT" },
    ],
  ),
  "foundation-models": lab(
    `function solve({ version, approvedVersion, elapsedMs, budgetMs, passedEvaluation }) {
  return "served:" + version;
}`,
    { label: "Approved model within budget", input: { version: "v1", approvedVersion: "v1", elapsedMs: 50, budgetMs: 100, passedEvaluation: true } },
    { label: "Slow model response", input: { version: "v1", approvedVersion: "v1", elapsedMs: 150, budgetMs: 100, passedEvaluation: true } },
    "TIMEOUT", "served:v1", [
      { label: "Regressed candidate", input: { version: "v2", approvedVersion: "v1", elapsedMs: 50, budgetMs: 100, passedEvaluation: false }, expected: "REJECT" },
    ],
  ),
  transformers: lab(
    `function solve({ tokens, scores, budget }) {
  return tokens.filter((_, i) => scores[i] > 0);
}`,
    { label: "Focused context", input: { tokens: ["query", "key"], scores: [2, 3], budget: 2 } },
    { label: "Distractors fill the context", input: { tokens: ["noise", "query", "key"], scores: [1, 2, 3], budget: 2 } },
    ["query", "key"], ["query", "key"],
  ),
  tokens: lab(
    `function solve({ text, pieces, reserved, limit }) {
  return text.split(" ").length + reserved <= limit;
}`,
    { label: "Toy tokenizer fits", input: { text: "hello world", pieces: ["hello", " world"], reserved: 1, limit: 3 } },
    { label: "One word splits into three pieces", input: { text: "unbelievable", pieces: ["un", "believ", "able"], reserved: 1, limit: 3 } },
    false, true,
  ),
  embeddings: lab(
    `function solve({ query, stored, queryVersion, indexVersion }) {
  return query.reduce((sum, value, i) => sum + value * stored[i], 0);
}`,
    { label: "Matching spaces", input: { query: [1, 2], stored: [1, 2], queryVersion: "v1", indexVersion: "v1" } },
    { label: "Index uses stale preprocessing", input: { query: [1, 2], stored: [1, 2], queryVersion: "v2", indexVersion: "v1" } },
    "REINDEX", 5,
  ),
  "vector-similarity": lab(
    `function solve({ ids, scores, allowed, minimum }) {
  return ids[scores.indexOf(Math.max(...scores))];
}`,
    { label: "Authorized candidate", input: { ids: ["approved"], scores: [0.9], allowed: [true], minimum: 0.7 } },
    { label: "Highest score fails the access filter", input: { ids: ["excluded", "approved"], scores: [0.99, 0.82], allowed: [false, true], minimum: 0.7 } },
    "approved", "approved", [
      { label: "Weak authorized match", input: { ids: ["weak"], scores: [0.5], allowed: [true], minimum: 0.7 }, expected: "ABSTAIN" },
    ],
  ),
  hallucination: lab(
    `function solve({ claim, retrieved, supportsClaim }) {
  return retrieved ? claim : "ABSTAIN";
}`,
    { label: "Claim supported", input: { claim: "Returns accepted", retrieved: true, supportsClaim: true } },
    { label: "Retrieved source does not support claim", input: { claim: "Returns accepted", retrieved: true, supportsClaim: false } },
    "ABSTAIN", "Returns accepted",
  ),
  "prompt-engineering": lab(
    `function solve({ answer, citations, schemaPresent }) {
  return answer;
}`,
    { label: "Valid structured response", input: { answer: "See policy", citations: ["policy"], schemaPresent: true } },
    { label: "Missing output schema", input: { answer: "See policy", citations: [], schemaPresent: false } },
    "REJECT", "See policy", [
      { label: "Incomplete response", input: { answer: "See policy", citations: [], schemaPresent: true }, expected: "REJECT" },
    ],
  ),
  rag: lab(
    `function solve({ candidates, authorized, current }) {
  return candidates[0] ?? "ABSTAIN";
}`,
    { label: "Current approved document", input: { candidates: ["policy-v2"], authorized: [true], current: [true] } },
    { label: "Stale index entry ranks first", input: { candidates: ["policy-v1", "policy-v2"], authorized: [true, true], current: [false, true] } },
    "policy-v2", "policy-v2", [
      { label: "Only ineligible evidence", input: { candidates: ["excluded"], authorized: [false], current: [true] }, expected: "ABSTAIN" },
    ],
  ),
  "fine-tuning": lab(
    `function solve({ trainIds, evalIds, taskScore, safetyScore }) {
  return taskScore >= 0.8 ? "PROMOTE" : "REJECT";
}`,
    { label: "Independent evaluation", input: { trainIds: ["train-1"], evalIds: ["eval-1"], taskScore: 0.9, safetyScore: 1 } },
    { label: "Evaluation sample in training", input: { trainIds: ["eval-1"], evalIds: ["eval-1"], taskScore: 0.99, safetyScore: 1 } },
    "REJECT", "PROMOTE", [
      { label: "Safety regression", input: { trainIds: ["train-1"], evalIds: ["eval-1"], taskScore: 0.9, safetyScore: 0.5 }, expected: "REJECT" },
    ],
  ),
  "model-evaluation": lab(
    `function solve({ scores, severeFailures }) {
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  return mean >= 0.8 ? "PROMOTE" : "REJECT";
}`,
    { label: "Balanced evaluation passes", input: { scores: [0.9, 0.95], severeFailures: 0 } },
    { label: "Aggregate hides a severe failure", input: { scores: [1, 1, 0.6], severeFailures: 1 } },
    "REJECT", "PROMOTE",
  ),
  "responsible-ai-principles": lab(
    `function solve({ sampleCounts, falsePositiveRates, appealAvailable }) {
  return "AUTOMATE";
}`,
    { label: "Adequate coverage and appeal", input: { sampleCounts: [100, 100], falsePositiveRates: [0.06, 0.07], appealAvailable: true } },
    { label: "Affected group absent", input: { sampleCounts: [100, 0], falsePositiveRates: [0.06, 0], appealAvailable: true } },
    "REVIEW", "AUTOMATE", [
      { label: "No appeal path", input: { sampleCounts: [100, 100], falsePositiveRates: [0.06, 0.07], appealAvailable: false }, expected: "REVIEW" },
      { label: "Material subgroup error gap", input: { sampleCounts: [100, 100], falsePositiveRates: [0.06, 0.3], appealAvailable: true }, expected: "REVIEW" },
    ],
  ),
  guardrails: lab(
    `function solve({ requestedTool, allowedTools, outputChecked }) {
  return requestedTool;
}`,
    { label: "Allowed read-only operation", input: { requestedTool: "searchNotes", allowedTools: ["searchNotes"], outputChecked: true } },
    { label: "Permission check rejects a write", input: { requestedTool: "updateNotes", allowedTools: ["searchNotes"], outputChecked: true } },
    "REJECT", "searchNotes", [
      { label: "Unchecked output", input: { requestedTool: "searchNotes", allowedTools: ["searchNotes"], outputChecked: false }, expected: "REJECT" },
    ],
  ),
  "ai-security": lab(
    `function solve({ certificateValid, trustedIssuer, actionAllowed }) {
  return certificateValid ? "ALLOW" : "REJECT";
}`,
    { label: "Trusted authorized workload", input: { certificateValid: true, trustedIssuer: true, actionAllowed: true } },
    { label: "Simulated untrusted issuer", input: { certificateValid: true, trustedIssuer: false, actionAllowed: true } },
    "REJECT", "ALLOW", [
      { label: "Expired certificate", input: { certificateValid: false, trustedIssuer: true, actionAllowed: true }, expected: "REJECT" },
      { label: "Authenticated but unauthorized", input: { certificateValid: true, trustedIssuer: true, actionAllowed: false }, expected: "REJECT" },
    ],
  ),
  "ai-governance": lab(
    `function solve({ modelVersion, promptVersion, approved, rawPromptStored }) {
  return [modelVersion, promptVersion];
}`,
    { label: "Minimal versioned record", input: { modelVersion: "m1", promptVersion: "p1", approved: true, rawPromptStored: false } },
    { label: "Missing prompt version", input: { modelVersion: "m1", promptVersion: "", approved: true, rawPromptStored: false } },
    "REJECT", ["m1", "p1"], [
      { label: "Unapproved model", input: { modelVersion: "m2", promptVersion: "p1", approved: false, rawPromptStored: false }, expected: "REJECT" },
      { label: "Raw prompt retained", input: { modelVersion: "m1", promptVersion: "p1", approved: true, rawPromptStored: true }, expected: "REJECT" },
    ],
  ),
}
