import type { Metadata } from "next"
import { SubscriptionGate } from "@/components/SubscriptionGate"
import { AifExamPractice } from "@/components/learning/AifExamPractice"
import {
  AIF_C01_QUESTION_BANK,
  sanitizeAifExamQuestions,
  selectAifExamQuestions,
  summarizeAifQuestionBank,
} from "@/lib/learning/aif-c01-question-bank"
import type { AifC01DomainId } from "@/lib/learning/aws-ai-practitioner-mastery"

export const metadata: Metadata = {
  title: "AIF-C01 exam practice | API Sandbox",
  description:
    "Original AWS Certified AI Practitioner (AIF-C01) practice questions with plain-English explanations for every option.",
}

const DOMAIN_IDS = new Set<AifC01DomainId>([
  "ai-ml-fundamentals",
  "genai-fundamentals",
  "foundation-models",
  "responsible-ai",
  "ai-security",
])

type PracticeFilter = "all" | "metrics" | AifC01DomainId

function parseFilter(raw: string | undefined): PracticeFilter {
  if (!raw || raw === "all") return "all"
  if (raw === "metrics") return "metrics"
  if (DOMAIN_IDS.has(raw as AifC01DomainId)) return raw as AifC01DomainId
  return "all"
}

function practiceSeed(filter: PracticeFilter): number {
  // Stable-enough seed per UTC day so refresh keeps a set, while a new day refreshes it.
  const dayKey = new Date().toISOString().slice(0, 10)
  let hash = 0
  const source = `${filter}:${dayKey}`
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0
  }
  return hash || 1
}

function seedFromSetParam(filter: PracticeFilter, setParam: string | undefined): number {
  if (setParam && /^\d+$/.test(setParam)) {
    return (Number.parseInt(setParam, 10) + practiceSeed(filter)) >>> 0 || 1
  }
  return practiceSeed(filter)
}

export default async function AifExamPracticePage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ filter?: string; limit?: string; set?: string }>
}>) {
  const params = await searchParams
  const filter = parseFilter(params.filter)
  const parsedLimit = Number.parseInt(params.limit ?? "8", 10)
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 20) : 8

  const selected = selectAifExamQuestions(AIF_C01_QUESTION_BANK, {
    domainId: DOMAIN_IDS.has(filter as AifC01DomainId) ? (filter as AifC01DomainId) : undefined,
    metricsOnly: filter === "metrics",
    seed: seedFromSetParam(filter, params.set),
    limit,
  })

  const summary = summarizeAifQuestionBank(AIF_C01_QUESTION_BANK)

  return (
    <SubscriptionGate phaseNumber="cloud" lockedContentName="AIF-C01 exam practice">
      <AifExamPractice
        questions={sanitizeAifExamQuestions(selected)}
        summary={summary}
        initialFilter={filter}
      />
    </SubscriptionGate>
  )
}
