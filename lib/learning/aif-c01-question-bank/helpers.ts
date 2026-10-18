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

export function validateAifQuestion(question: AifExamQuestion): AifQuestionBankValidationIssue[] {
  const issues: AifQuestionBankValidationIssue[] = []
  const prefix = `Question ${question.id}`

  if (!question.id.trim()) {
    issues.push({ code: "missing-id", message: `${prefix}: id is required`, questionId: question.id })
  }
  if (question.bankVersion !== AIF_C01_QUESTION_BANK_VERSION) {
    issues.push({
      code: "bank-version",
      message: `${prefix}: bankVersion must be ${AIF_C01_QUESTION_BANK_VERSION}`,
      questionId: question.id,
    })
  }
  if (!AIF_C01_DOMAIN_ORDER.includes(question.domainId)) {
    issues.push({
      code: "domain",
      message: `${prefix}: unknown domainId ${question.domainId}`,
      questionId: question.id,
    })
  }
  if (!VALID_TASK_STATEMENT_IDS.has(question.taskStatement)) {
    issues.push({
      code: "task-statement",
      message: `${prefix}: unknown taskStatement ${question.taskStatement}`,
      questionId: question.id,
    })
  } else if (!question.taskStatement.startsWith(DOMAIN_TO_TASK_PREFIX[question.domainId])) {
    issues.push({
      code: "task-domain-mismatch",
      message: `${prefix}: taskStatement ${question.taskStatement} does not match domain ${question.domainId}`,
      questionId: question.id,
    })
  }
  if (!question.topic.trim()) {
    issues.push({ code: "topic", message: `${prefix}: topic is required`, questionId: question.id })
  }
  if (!question.stem.trim()) {
    issues.push({ code: "stem", message: `${prefix}: stem is required`, questionId: question.id })
  }

  const optionIds = question.options.map((option) => option.id)
  if (new Set(optionIds).size !== optionIds.length) {
    issues.push({
      code: "duplicate-option-id",
      message: `${prefix}: option ids must be unique`,
      questionId: question.id,
    })
  }

  for (const option of question.options) {
    if (!option.id.trim() || !option.text.trim()) {
      issues.push({
        code: "option-empty",
        message: `${prefix}: every option needs id and text`,
        questionId: question.id,
      })
    }
    if (!option.explanation.trim()) {
      issues.push({
        code: "option-explanation",
        message: `${prefix}: option ${option.id} is missing an explanation`,
        questionId: question.id,
      })
    }
  }

  if (question.format === "single-choice") {
    if (question.options.length !== 4) {
      issues.push({
        code: "single-choice-options",
        message: `${prefix}: single-choice must have exactly 4 options`,
        questionId: question.id,
      })
    }
    if (question.correctOptionIds.length !== 1) {
      issues.push({
        code: "single-choice-key",
        message: `${prefix}: single-choice must have exactly 1 correct option`,
        questionId: question.id,
      })
    }
  } else {
    if (question.options.length < 5) {
      issues.push({
        code: "multi-response-options",
        message: `${prefix}: multi-response must have at least 5 options`,
        questionId: question.id,
      })
    }
    if (question.correctOptionIds.length < 2) {
      issues.push({
        code: "multi-response-key",
        message: `${prefix}: multi-response must have at least 2 correct options`,
        questionId: question.id,
      })
    }
  }

  for (const correctId of question.correctOptionIds) {
    if (!optionIds.includes(correctId)) {
      issues.push({
        code: "answer-key",
        message: `${prefix}: correctOptionId ${correctId} is not in options`,
        questionId: question.id,
      })
    }
  }

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
