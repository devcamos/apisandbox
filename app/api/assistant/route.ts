import OpenAI from "openai"
import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { inferAssistantRedirect } from "@/lib/assistant/redirect"

type AssistantRequest = {
  message: string
  pathname?: string
  mode?: "guided" | "expert"
  history?: Array<{ role: "user" | "assistant"; content: string }>
}

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

function formatConversation({
  history,
  message,
}: {
  history: Array<{ role: "user" | "assistant"; content: string }>
  message: string
}) {
  const lines: string[] = []
  for (const m of history) {
    lines.push(`${m.role.toUpperCase()}: ${m.content}`)
  }
  lines.push(`USER: ${message}`)
  return lines.join("\n")
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as AssistantRequest | null

  if (!body || typeof body.message !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const pathname = body.pathname ?? "/"
  const mode = body.mode ?? "guided"
  const redirect = inferAssistantRedirect({ message: body.message, pathname })

  const history = Array.isArray(body.history) ? body.history.slice(-12) : []

  const provider =
    (process.env.ASSISTANT_PROVIDER as "openai" | "gemini" | undefined) ||
    (process.env.GEMINI_API_KEY ? "gemini" : "openai")

  if (provider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing GEMINI_API_KEY. Set it in your environment (e.g. .env.local) to enable Gemini responses.",
        },
        { status: 500 },
      )
    }

    // Default to a generally-available fast model; allow override via env.
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"
    const ai = new GoogleGenAI({ apiKey })

    const prompt = [
      buildInstructions({ pathname, mode }),
      "",
      "Conversation:",
      formatConversation({ history, message: body.message }),
    ].join("\n")

    const result = await ai.models.generateContent({
      model,
      contents: prompt,
    })

    const reply =
      (typeof result.text === "string" ? result.text : "")?.trim() ||
      "I didn’t produce any text output. Try asking again."

    return NextResponse.json({
      reply,
      provider: "gemini",
      model,
      redirect,
      suggestions: ["Explain idempotency", "Cookies vs tokens", "Show a retry policy example"],
    })
  }

  // Default: OpenAI
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing OPENAI_API_KEY. Set it in your environment (e.g. .env.local) to enable OpenAI responses, or set ASSISTANT_PROVIDER=gemini with GEMINI_API_KEY.",
      },
      { status: 500 },
    )
  }

  const client = new OpenAI({ apiKey })
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini"

  const input = [
    ...history.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user" as const, content: body.message },
  ]

  const response = await client.responses.create({
    model,
    instructions: buildInstructions({ pathname, mode }),
    input,
  })

  const reply = response.output_text?.trim() || "I didn’t produce any text output. Try asking again."

  return NextResponse.json({
    reply,
    provider: "openai",
    model: response.model ?? model,
    redirect,
    suggestions: [
      "Explain idempotency",
      "Cookies vs tokens",
      "Show a retry policy example",
    ],
  })
}
