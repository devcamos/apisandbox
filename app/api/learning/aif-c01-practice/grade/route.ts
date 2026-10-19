import { NextResponse } from "next/server"
import {
  getAifExamQuestionsByIds,
  gradeAifExamPracticeSession,
} from "@/lib/learning/aif-c01-question-bank"

export const runtime = "nodejs"

interface GradeRequestBody {
  questionIds?: unknown
  answers?: unknown
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function isAnswersMap(value: unknown): value is Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  return Object.values(value).every((entry) => isStringArray(entry))
}

export async function POST(request: Request) {
  let body: GradeRequestBody
  try {
    body = (await request.json()) as GradeRequestBody
  } catch {
    return NextResponse.json({ error: { message: "Invalid JSON body." } }, { status: 400 })
  }

  if (!isStringArray(body.questionIds) || body.questionIds.length === 0) {
    return NextResponse.json(
      { error: { message: "questionIds must be a non-empty string array." } },
      { status: 400 },
    )
  }
  if (!isAnswersMap(body.answers)) {
    return NextResponse.json(
      { error: { message: "answers must map question ids to selected option id arrays." } },
      { status: 400 },
    )
  }

  const uniqueIds = [...new Set(body.questionIds)]
  if (uniqueIds.length > 40) {
    return NextResponse.json(
      { error: { message: "At most 40 questions can be graded per request." } },
      { status: 400 },
    )
  }

  const questions = getAifExamQuestionsByIds(uniqueIds)
  if (questions.length !== uniqueIds.length) {
    return NextResponse.json(
      { error: { message: "One or more question ids were not found in the bank." } },
      { status: 404 },
    )
  }

  const result = gradeAifExamPracticeSession(questions, body.answers)
  return NextResponse.json({ data: result })
}
