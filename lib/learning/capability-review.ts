const learn = "#stage-learn-principle"
const mechanism = "#stage-learn-mechanism"
const decision = "#stage-learn-decision"
const tradeOffs = "#stage-learn-trade-offs"
const awsRow = (index: number) => `#stage-aws-map-row-${index}`

function capabilityLink(unitId: string, domainId: string, anchor: string) {
  return `/cloud/aws/certifications/ai-practitioner/domains/${domainId}/capabilities/${unitId}${anchor}`
}

export const domainRubrics: Readonly<Record<string, { criteria: string[]; links: string[] }>> = {
  "ai-ml-fundamentals": {
    criteria: ["Distinguish a false escalation from a missed urgent request", "Choose the more costly error for a stated support context", "Explain the precision–recall or human-review trade-off"],
    links: [mechanism, decision, tradeOffs].map((anchor) => capabilityLink("ai-vs-ml-vs-deep-learning", "ai-ml-fundamentals", anchor)),
  },
  "generative-ai-fundamentals": {
    criteria: ["Describe a specific useful assistant capability", "Explain a concrete failure mode for that capability", "Choose a control and explain when to escalate"],
    links: [decision, mechanism, tradeOffs].map((anchor) => capabilityLink("hallucination", "genai-fundamentals", anchor)),
  },
  "foundation-model-applications": {
    criteria: ["Explain how retrieval supplies current evidence at inference", "Distinguish the retrieval index from model parameters", "Explain when fine-tuning would be suitable and why it is rejected here"],
    links: [capabilityLink("rag", "foundation-models", mechanism), capabilityLink("rag", "foundation-models", learn), capabilityLink("fine-tuning", "foundation-models", decision)],
  },
  "responsible-ai": {
    criteria: ["Identify two affected learner groups", "Compare meaningful error or outcome rates on representative examples", "Describe what to do if the groups experience materially different outcomes"],
    links: [mechanism, learn, decision].map((anchor) => capabilityLink("responsible-ai-principles", "responsible-ai", anchor)),
  },
  "ai-security-governance": {
    criteria: ["Explain which learner records may enter the workflow and how they are minimized", "Describe authorization before data reaches the model", "Explain how output checks or human review handle potential disclosure"],
    links: [capabilityLink("ai-security", "ai-security", decision), capabilityLink("ai-security", "ai-security", awsRow(3)), capabilityLink("guardrails", "responsible-ai", mechanism)],
  },
}

const domainQuestionLinks: Readonly<Record<string, string>> = {
  "ai-classification": capabilityLink("ai-vs-ml-vs-deep-learning", "ai-ml-fundamentals", decision),
  "ai-overfitting": capabilityLink("training-vs-inference", "ai-ml-fundamentals", mechanism),
  "ai-imbalanced-metrics": capabilityLink("ai-vs-ml-vs-deep-learning", "ai-ml-fundamentals", tradeOffs),
  "genai-token": capabilityLink("tokens", "genai-fundamentals", learn),
  "genai-hallucination": capabilityLink("hallucination", "genai-fundamentals", learn),
  "genai-embedding": capabilityLink("embeddings", "genai-fundamentals", learn),
  "fm-rag": capabilityLink("rag", "foundation-models", mechanism),
  "fm-prompt-constraint": capabilityLink("prompt-engineering", "foundation-models", mechanism),
  "fm-finetuning": capabilityLink("fine-tuning", "foundation-models", learn),
  "responsible-bias": capabilityLink("responsible-ai-principles", "responsible-ai", mechanism),
  "responsible-human": capabilityLink("responsible-ai-principles", "responsible-ai", decision),
  "responsible-explainability": capabilityLink("responsible-ai-principles", "responsible-ai", awsRow(1)),
  "ai-least-privilege": capabilityLink("ai-security", "ai-security", awsRow(3)),
  "ai-data-privacy": capabilityLink("ai-security", "ai-security", decision),
  "ai-audit": capabilityLink("ai-governance", "ai-security", awsRow(1)),
}

const capabilityQuestionLinks: Readonly<Record<string, string>> = {
  "aif-ai-ml-choice": decision,
  "aif-training-change": mechanism,
  "aif-fm-selection": decision,
  "aif-vector-auth": mechanism,
  "aif-hallucination-control": decision,
  "aif-prompt-structure": mechanism,
  "aif-prompt-security": decision,
  "aif-rag-security": mechanism,
  "aif-finetune-choice": decision,
  "aif-eval-release": tradeOffs,
  "aif-responsible-human": decision,
  "aif-guardrail-tool": awsRow(2),
  "aif-security-mtls": awsRow(2),
  "aif-security-layer": awsRow(3),
  "aif-governance-control": mechanism,
}

const distractorLinks: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "aif-ai-ml-choice": { "Semantic generation is required": awsRow(1) },
  "aif-security-mtls": { "Business authorization": awsRow(3) },
  "aif-guardrail-role": { "Replace IAM": awsRow(2) },
  "ai-least-privilege": { "A root access key embedded in the prompt": capabilityLink("prompt-engineering", "foundation-models", decision) },
  "fm-rag": { "Replace authentication": capabilityLink("rag", "foundation-models", decision) },
}

export function questionReviewLink(kind: "capability" | "domain-exam", questionId: string, answer: string) {
  return distractorLinks[questionId]?.[answer] ?? (kind === "capability"
    ? capabilityQuestionLinks[questionId] ?? learn
    : domainQuestionLinks[questionId])
}

export function criterionReviewLink(criterion: string) {
  if (/reject|alternative|cost|trade.off|limit|remedy|roll.?back/i.test(criterion)) return tradeOffs
  if (/boundary|mapping|choice|authorization|scope|escalation/i.test(criterion)) return decision
  return mechanism
}
