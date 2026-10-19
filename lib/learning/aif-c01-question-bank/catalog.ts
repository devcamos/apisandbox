import type { AifDomainWeightSpec } from "@/lib/learning/aif-c01-question-bank/types"

/**
 * Official AIF-C01 domain weightings (AWS exam guide v1.1, April 2026).
 * Verified against https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/
 */
export const AIF_C01_DOMAIN_WEIGHTS: readonly AifDomainWeightSpec[] = [
  {
    domainId: "ai-ml-fundamentals",
    title: "Fundamentals of AI and ML",
    weightPercent: 20,
    taskStatements: [
      { id: "1.1", title: "Explain basic AI concepts and terminologies" },
      { id: "1.2", title: "Identify practical use cases for AI" },
      { id: "1.3", title: "Describe the AI/ML development lifecycle" },
    ],
  },
  {
    domainId: "genai-fundamentals",
    title: "Fundamentals of Generative AI",
    weightPercent: 24,
    taskStatements: [
      { id: "2.1", title: "Explain the basic concepts of generative AI (GenAI)" },
      { id: "2.2", title: "Understand the capabilities and limitations of GenAI for solving business problems" },
      { id: "2.3", title: "Describe AWS infrastructure and technologies for building GenAI applications" },
    ],
  },
  {
    domainId: "foundation-models",
    title: "Applications of Foundation Models",
    weightPercent: 28,
    taskStatements: [
      { id: "3.1", title: "Describe design considerations for applications that use foundation models (FMs)" },
      { id: "3.2", title: "Choose effective prompt engineering techniques" },
      { id: "3.3", title: "Describe the training and fine-tuning process for FMs" },
      { id: "3.4", title: "Describe methods to evaluate FM performance" },
    ],
  },
  {
    domainId: "responsible-ai",
    title: "Guidelines for Responsible AI",
    weightPercent: 14,
    taskStatements: [
      { id: "4.1", title: "Explain the development of AI systems that are responsible" },
      { id: "4.2", title: "Recognize the importance of transparent and explainable models" },
    ],
  },
  {
    domainId: "ai-security",
    title: "Security, Compliance, and Governance for AI Solutions",
    weightPercent: 14,
    taskStatements: [
      { id: "5.1", title: "Explain methods to secure AI systems" },
      { id: "5.2", title: "Recognize governance and compliance regulations for AI systems" },
    ],
  },
] as const

/** Topics that count toward the Domain 1 evaluation-metrics depth requirement. */
export const AIF_C01_METRICS_TOPICS = [
  "precision",
  "recall",
  "f1-score",
  "confusion-matrix",
  "accuracy",
  "evaluation-metrics",
] as const

export type AifC01MetricsTopic = (typeof AIF_C01_METRICS_TOPICS)[number]

/** Allowed domain mix drift vs official weightings (percentage points). */
export const AIF_C01_DOMAIN_MIX_TOLERANCE_PP = 2

/** Minimum share of multi-response questions in the bank. */
export const AIF_C01_MIN_MULTI_RESPONSE_RATIO = 0.2

/** Minimum questions tagged to evaluation metrics topics. */
export const AIF_C01_MIN_METRICS_QUESTIONS = 25

/** Soft target for bank size; CI enforces the hard floor below. */
export const AIF_C01_TARGET_QUESTION_COUNT = 200

/** Hard floor for shipping this ticket. */
export const AIF_C01_MIN_QUESTION_COUNT = 120
