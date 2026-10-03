import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { inferAssistantRedirect } from "@/lib/assistant/redirect"
import {
  ASSISTANT_LLM_TIMEOUT_MS,
  ASSISTANT_MAX_BODY_BYTES,
  type AssistantHistoryItem,
  isAbortError,
  validateAssistantInput,
} from "@/lib/assistant/limits"
import { requirePremiumUser } from "@/lib/auth/jwt-auth-middleware"
import { applyRateLimit, attachRateLimitHeaders } from "@/lib/http/apply-rate-limit"
import { handleRouteError } from "@/lib/http/responses"
import { assistantLimiter, type RateLimitResult } from "@/lib/rate-limit"

export const maxDuration = 30

const DEFAULT_SUGGESTIONS = [
  "Explain idempotency",
  "Cookies vs tokens",
  "Show a retry policy example",
] as const

function contextForPath(pathname: string) {
  if (pathname.startsWith("/docs/java")) {
    return [
      "You are helping a learner master Java in the context of APIs using the API Sandbox app.",
      "The page covers: wrapper stack (client vs backend), What to Master list, dependency radar (docs + CVE links), and hands-on labs (cookies, retries, correlation IDs).",
      "Prefer pragmatic, correct, production-ready guidance: idempotency, retries/backoff, auth boundaries, validation, error envelopes, observability, and testing.",
    ].join("\n")
  }
  if (pathname.startsWith("/phase-0")) {
    return [
      "You are helping a learner master API integration fundamentals.",
      "Focus: HTTP semantics, auth flows, resilience (timeouts/retries), observability (request IDs/logs/metrics), and testing.",
      "Be concrete: give minimal examples, common failure modes, and safe defaults.",
    ].join("\n")
  }
  return [
    "You are a learning assistant for API Sandbox.",
    "Help users learn API engineering concepts and apply them in this app.",
  ].join("\n")
}

function buildInstructions({ pathname, mode }: { pathname: string; mode: "guided" | "expert" }) {
  const style =
    mode === "expert"
      ? [
          "Style: expert mode.",
          "Be concise and direct.",
          "Include production constraints, failure modes, and what to measure.",
        ].join("\n")
      : [
          "Style: guided mode.",
          "Use short steps, definitions, and small examples.",
          "Ask one focused follow-up question when needed.",
        ].join("\n")

  return [
    "You are an AI chatbot learning assistant embedded in a developer education app.",
    "Goal: help the user master Java and expert API engineering knowledge in context.",
    "Do not hallucinate specific repository details; if unsure, say what you’re assuming.",
    "",
    `Current page: ${pathname}`,
    "",
    contextForPath(pathname),
    "",
    style,
  ].join("\n")
}

function bodyTooLargeResponse() {
  return NextResponse.json(
    { error: `Request body exceeds the ${ASSISTANT_MAX_BODY_BYTES} byte limit.` },
    { status: 413 },
  )
}

function timeoutResponse() {
  return NextResponse.json(
    { error: "Assistant timed out. Please try again with a shorter question." },
    { status: 504 },
  )
}

function successResponse(
  payload: {
    reply: string
    provider: "openai"
    model: string
    redirect: ReturnType<typeof inferAssistantRedirect>
  },
  rateResult: RateLimitResult,
) {
  return attachRateLimitHeaders(
    NextResponse.json({
      ...payload,
      suggestions: [...DEFAULT_SUGGESTIONS],
    }),
    rateResult,
  )
}

async function parseAssistantBody(request: NextRequest) {
  const contentLength = request.headers.get("content-length")
  if (contentLength && Number(contentLength) > ASSISTANT_MAX_BODY_BYTES) {
    return { error: bodyTooLargeResponse() as NextResponse }
  }

  const rawText = await request.text()
  if (rawText.length > ASSISTANT_MAX_BODY_BYTES) {
    return { error: bodyTooLargeResponse() as NextResponse }
  }

  let body: unknown = null
  try {
    body = rawText ? JSON.parse(rawText) : null
  } catch {
    return {
      error: NextResponse.json({ error: "Invalid request" }, { status: 400 }),
    }
  }

  const validated = validateAssistantInput(body)
  if (!validated.ok) {
    return {
      error: NextResponse.json({ error: validated.error }, { status: validated.status }),
    }
  }

  return { data: validated }
}

async function generateOpenAiReply(input: {
  message: string
  pathname: string
  mode: "guided" | "expert"
  history: AssistantHistoryItem[]
  abortSignal: AbortSignal
  redirect: ReturnType<typeof inferAssistantRedirect>
  rateResult: RateLimitResult
}) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Learning assistant is unavailable. Set OPENAI_API_KEY in your environment (e.g. .env.local) to enable responses for Premium users.",
      },
      { status: 503 },
    )
  }

  const client = new OpenAI({ apiKey, timeout: ASSISTANT_LLM_TIMEOUT_MS })
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini"
  const chatInput = [
    ...input.history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: input.message },
  ]

  try {
    const response = await client.responses.create(
      {
        model,
        instructions: buildInstructions({ pathname: input.pathname, mode: input.mode }),
        input: chatInput,
      },
      { signal: input.abortSignal },
    )
    const reply = response.output_text?.trim() || "I didn’t produce any text output. Try asking again."
    return successResponse(
      {
        reply,
        provider: "openai",
        model: response.model ?? model,
        redirect: input.redirect,
      },
      input.rateResult,
    )
  } catch (error) {
    if (isAbortError(error) || input.abortSignal.aborted) {
      return timeoutResponse()
    }
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePremiumUser(request)

    const rate = await applyRateLimit(request, assistantLimiter, `assistant:${user.id}`)
    if (rate.blocked) return rate.blocked

    const parsed = await parseAssistantBody(request)
    if ("error" in parsed && parsed.error) return parsed.error

    const { message, pathname, mode, history } = parsed.data!
    const redirect = inferAssistantRedirect({ message, pathname })
    const abortSignal = AbortSignal.timeout(ASSISTANT_LLM_TIMEOUT_MS)

    return await generateOpenAiReply({
      message,
      pathname,
      mode,
      history,
      abortSignal,
      redirect,
      rateResult: rate.result,
    })
  } catch (error) {
    if (isAbortError(error)) {
      return timeoutResponse()
    }
    return handleRouteError(error)
  }
}
