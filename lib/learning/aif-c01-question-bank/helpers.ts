import { AIF_C01_DOMAIN_ORDER, type AifC01DomainId } from "@/lib/learning/aws-ai-practitioner-mastery"
import {
  AIF_C01_DOMAIN_MIX_TOLERANCE_PP,
  AIF_C01_DOMAIN_WEIGHTS,
  AIF_C01_METRICS_TOPICS,
  AIF_C01_MIN_METRICS_QUESTIONS,
  AIF_C01_MIN_MULTI_RESPONSE_RATIO,
  AIF_C01_MIN_QUESTION_COUNT,
} from "@/lib/learning/aif-c01-question-bank/catalog"
import {
  AIF_C01_QUESTION_BANK_VERSION,
  type AifExamPracticeSessionGrade,
  type AifExamQuestion,
  type AifExamQuestionGrade,
  type AifQuestionBankSummary,
  type SanitizedAifExamQuestion,
} from "@/lib/learning/aif-c01-question-bank/types"

const VALID_TASK_STATEMENT_IDS = new Set(
  AIF_C01_DOMAIN_WEIGHTS.flatMap((domain) => domain.taskStatements.map((task) => task.id)),
)

const DOMAIN_TO_TASK_PREFIX: Record<AifC01DomainId, string> = {
  "ai-ml-fundamentals": "1.",
  "genai-fundamentals": "2.",
  "foundation-models": "3.",
  "responsible-ai": "4.",
  "ai-security": "5.",
}

function sameStringSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false
  const rightSet = new Set(right)
  return left.every((value) => rightSet.has(value))
}

export function isMetricsTopic(topic: string): boolean {
  return (AIF_C01_METRICS_TOPICS as readonly string[]).includes(topic)
}

export function sanitizeAifExamQuestion(question: AifExamQuestion): SanitizedAifExamQuestion {
  return {
    id: question.id,
    format: question.format,
    domainId: question.domainId,
    taskStatement: question.taskStatement,
    topic: question.topic,
    difficulty: question.difficulty,
    stem: question.stem,
    options: question.options.map((option) => ({ id: option.id, text: option.text })),
    selectCount: question.correctOptionIds.length,
  }
}

export function sanitizeAifExamQuestions(questions: AifExamQuestion[]): SanitizedAifExamQuestion[] {
  return questions.map(sanitizeAifExamQuestion)
}

export function gradeAifExamQuestion(
  question: AifExamQuestion,
  selectedOptionIds: string[],
): AifExamQuestionGrade {
  const selected = [...new Set(selectedOptionIds)]
  const correct = sameStringSet(selected, question.correctOptionIds)
  return {
    questionId: question.id,
    correct,
    selectedOptionIds: selected,
    correctOptionIds: [...question.correctOptionIds],
    options: question.options.map((option) => ({
      optionId: option.id,
      text: option.text,
      correct: question.correctOptionIds.includes(option.id),
      selected: selected.includes(option.id),
      explanation: option.explanation,
    })),
  }
}

export function gradeAifExamPracticeSession(
  questions: AifExamQuestion[],
  answers: Record<string, string[]>,
): AifExamPracticeSessionGrade {
  const details = questions.map((question) =>
    gradeAifExamQuestion(question, answers[question.id] ?? []),
  )
  const correctCount = details.filter((detail) => detail.correct).length
  const totalQuestions = questions.length
  return {
    correctCount,
    totalQuestions,
    scorePercent: totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100),
    details,
  }
}

export interface SelectAifQuestionsOptions {
  domainId?: AifC01DomainId
  topic?: string
  metricsOnly?: boolean
  limit?: number
  /** Deterministic shuffle seed for practice/mocks. */
  seed?: number
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const next = mulberry32(seed)
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(next() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

export function selectAifExamQuestions(
  bank: readonly AifExamQuestion[],
  options: SelectAifQuestionsOptions = {},
): AifExamQuestion[] {
  let filtered = [...bank]
  if (options.domainId) {
    filtered = filtered.filter((question) => question.domainId === options.domainId)
  }
  if (options.topic) {
    filtered = filtered.filter((question) => question.topic === options.topic)
  }
  if (options.metricsOnly) {
    filtered = filtered.filter((question) => isMetricsTopic(question.topic))
  }
  if (typeof options.seed === "number") {
    filtered = shuffleWithSeed(filtered, options.seed)
  }
  if (typeof options.limit === "number" && options.limit >= 0) {
    filtered = filtered.slice(0, options.limit)
  }
  return filtered
}

export function summarizeAifQuestionBank(bank: readonly AifExamQuestion[]): AifQuestionBankSummary {
  const byDomain = Object.fromEntries(
    AIF_C01_DOMAIN_ORDER.map((domainId) => [domainId, { count: 0, percent: 0 }]),
  ) as AifQuestionBankSummary["byDomain"]

  let singleChoiceCount = 0
  let multiResponseCount = 0
  let metricsTopicCount = 0

  for (const question of bank) {
    byDomain[question.domainId].count += 1
    if (question.format === "single-choice") singleChoiceCount += 1
    else multiResponseCount += 1
    if (isMetricsTopic(question.topic)) metricsTopicCount += 1
  }

  const totalQuestions = bank.length
  for (const domainId of AIF_C01_DOMAIN_ORDER) {
    byDomain[domainId].percent =
      totalQuestions === 0 ? 0 : (byDomain[domainId].count / totalQuestions) * 100
  }

  return {
    version: AIF_C01_QUESTION_BANK_VERSION,
    totalQuestions,
    singleChoiceCount,
    multiResponseCount,
    metricsTopicCount,
    byDomain,
  }
}

export interface AifQuestionBankValidationIssue {
  code: string
  message: string
  questionId?: string
}

function pushIssue(
  issues: AifQuestionBankValidationIssue[],
  questionId: string,
  code: string,
  message: string,
) {
  issues.push({ code, message, questionId })
}

function validateQuestionIdentity(
  question: AifExamQuestion,
  issues: AifQuestionBankValidationIssue[],
) {
  const prefix = `Question ${question.id}`
  if (!question.id.trim()) {
    pushIssue(issues, question.id, "missing-id", `${prefix}: id is required`)
  }
  if (question.bankVersion !== AIF_C01_QUESTION_BANK_VERSION) {
    pushIssue(
      issues,
      question.id,
      "bank-version",
      `${prefix}: bankVersion must be ${AIF_C01_QUESTION_BANK_VERSION}`,
    )
  }
  if (!AIF_C01_DOMAIN_ORDER.includes(question.domainId)) {
    pushIssue(issues, question.id, "domain", `${prefix}: unknown domainId ${question.domainId}`)
  }
  if (!VALID_TASK_STATEMENT_IDS.has(question.taskStatement)) {
    pushIssue(
      issues,
      question.id,
      "task-statement",
      `${prefix}: unknown taskStatement ${question.taskStatement}`,
    )
    return
  }
  if (!question.taskStatement.startsWith(DOMAIN_TO_TASK_PREFIX[question.domainId])) {
    pushIssue(
      issues,
      question.id,
      "task-domain-mismatch",
      `${prefix}: taskStatement ${question.taskStatement} does not match domain ${question.domainId}`,
    )
  }
}

function validateQuestionContent(
  question: AifExamQuestion,
  issues: AifQuestionBankValidationIssue[],
) {
  const prefix = `Question ${question.id}`
  if (!question.topic.trim()) {
    pushIssue(issues, question.id, "topic", `${prefix}: topic is required`)
  }
  if (!question.stem.trim()) {
    pushIssue(issues, question.id, "stem", `${prefix}: stem is required`)
  }
}

function validateQuestionOptions(
  question: AifExamQuestion,
  issues: AifQuestionBankValidationIssue[],
): string[] {
  const prefix = `Question ${question.id}`
  const optionIds = question.options.map((option) => option.id)
  if (new Set(optionIds).size !== optionIds.length) {
    pushIssue(issues, question.id, "duplicate-option-id", `${prefix}: option ids must be unique`)
  }

  for (const option of question.options) {
    if (!option.id.trim() || !option.text.trim()) {
      pushIssue(issues, question.id, "option-empty", `${prefix}: every option needs id and text`)
    }
    if (!option.explanation.trim()) {
      pushIssue(
        issues,
        question.id,
        "option-explanation",
        `${prefix}: option ${option.id} is missing an explanation`,
      )
    }
  }

  return optionIds
}

function validateQuestionFormatAndKey(
  question: AifExamQuestion,
  optionIds: string[],
  issues: AifQuestionBankValidationIssue[],
) {
  const prefix = `Question ${question.id}`
  if (question.format === "single-choice") {
    if (question.options.length !== 4) {
      pushIssue(
        issues,
        question.id,
        "single-choice-options",
        `${prefix}: single-choice must have exactly 4 options`,
      )
    }
    if (question.correctOptionIds.length !== 1) {
      pushIssue(
        issues,
        question.id,
        "single-choice-key",
        `${prefix}: single-choice must have exactly 1 correct option`,
      )
    }
  } else {
    if (question.options.length < 5) {
      pushIssue(
        issues,
        question.id,
        "multi-response-options",
        `${prefix}: multi-response must have at least 5 options`,
      )
    }
    if (question.correctOptionIds.length < 2) {
      pushIssue(
        issues,
        question.id,
        "multi-response-key",
        `${prefix}: multi-response must have at least 2 correct options`,
      )
    }
  }

  for (const correctId of question.correctOptionIds) {
    if (!optionIds.includes(correctId)) {
      pushIssue(
        issues,
        question.id,
        "answer-key",
        `${prefix}: correctOptionId ${correctId} is not in options`,
      )
    }
  }
}

export function validateAifQuestion(question: AifExamQuestion): AifQuestionBankValidationIssue[] {
  const issues: AifQuestionBankValidationIssue[] = []
  validateQuestionIdentity(question, issues)
  validateQuestionContent(question, issues)
  const optionIds = validateQuestionOptions(question, issues)
  validateQuestionFormatAndKey(question, optionIds, issues)
  return issues
}

export function validateAifQuestionBank(bank: readonly AifExamQuestion[]): AifQuestionBankValidationIssue[] {
  const issues: AifQuestionBankValidationIssue[] = []
  const ids = new Set<string>()
  const stems = new Map<string, string>()

  for (const question of bank) {
    issues.push(...validateAifQuestion(question))
    if (ids.has(question.id)) {
      issues.push({
        code: "duplicate-id",
        message: `Duplicate question id: ${question.id}`,
        questionId: question.id,
      })
    }
    ids.add(question.id)

    const normalizedStem = question.stem.trim().toLowerCase()
    const existing = stems.get(normalizedStem)
    if (existing) {
      issues.push({
        code: "duplicate-stem",
        message: `Duplicate stem between ${existing} and ${question.id}`,
        questionId: question.id,
      })
    } else {
      stems.set(normalizedStem, question.id)
    }
  }

  const summary = summarizeAifQuestionBank(bank)
  if (summary.totalQuestions < AIF_C01_MIN_QUESTION_COUNT) {
    issues.push({
      code: "min-count",
      message: `Bank has ${summary.totalQuestions} questions; need at least ${AIF_C01_MIN_QUESTION_COUNT}`,
    })
  }

  if (summary.metricsTopicCount < AIF_C01_MIN_METRICS_QUESTIONS) {
    issues.push({
      code: "metrics-depth",
      message: `Bank has ${summary.metricsTopicCount} metrics questions; need at least ${AIF_C01_MIN_METRICS_QUESTIONS}`,
    })
  }

  const multiRatio =
    summary.totalQuestions === 0 ? 0 : summary.multiResponseCount / summary.totalQuestions
  if (multiRatio < AIF_C01_MIN_MULTI_RESPONSE_RATIO) {
    issues.push({
      code: "multi-response-ratio",
      message: `Multi-response ratio is ${(multiRatio * 100).toFixed(1)}%; need at least ${AIF_C01_MIN_MULTI_RESPONSE_RATIO * 100}%`,
    })
  }

  for (const domain of AIF_C01_DOMAIN_WEIGHTS) {
    const actual = summary.byDomain[domain.domainId].percent
    const drift = Math.abs(actual - domain.weightPercent)
    if (drift > AIF_C01_DOMAIN_MIX_TOLERANCE_PP) {
      issues.push({
        code: "domain-mix",
        message: `Domain ${domain.domainId} is ${actual.toFixed(1)}% (target ${domain.weightPercent}% ±${AIF_C01_DOMAIN_MIX_TOLERANCE_PP})`,
      })
    }
  }

  return issues
}
