import { NextResponse } from "next/server"

type AssistantRequest = {
  message: string
  pathname?: string
  mode?: "guided" | "expert"
  history?: Array<{ role: "user" | "assistant"; content: string }>
}

function normalize(s: string) {
  return s.toLowerCase().trim()
}

function pickReply({
  message,
  pathname,
  mode,
}: {
  message: string
  pathname: string
  mode: "guided" | "expert"
}): { reply: string; suggestions: string[] } {
  const m = normalize(message)
  const p = pathname || "/"

  const base = {
    reply:
      "Tell me what you’re trying to do (client vs backend), and what endpoint or concept you’re stuck on. I can give you a step-by-step path and a minimal example.",
    suggestions: ["Explain idempotency", "How do cookies vs tokens work?", "Show a retry policy example"],
  }

  const expertPreamble =
    mode === "expert"
      ? "Expert mode: I’ll answer tersely, with production constraints, failure modes, and what to measure.\n\n"
      : ""

  // Phase 0: fundamentals (very common questions)
  if (p.startsWith("/phase-0")) {
    if (m.includes("http") || m.includes("status") || m.includes("headers")) {
      return {
        reply:
          expertPreamble +
          [
            "HTTP fundamentals to master for API work:",
            "- Semantics: status codes, headers, content-type, caching, redirects.",
            "- Safety: idempotency (safe retries), input validation, and consistent errors.",
            "- Transport realities: timeouts, retries with backoff, and connection reuse.",
            "",
            "If you tell me the endpoint you’re integrating, I’ll map the correct status codes and retry rules for it.",
          ].join("\n"),
        suggestions: ["What does idempotent mean?", "When should I retry 429/503?", "Explain Content-Type vs Accept"],
      }
    }

    if (m.includes("async") || m.includes("promise") || m.includes("callback")) {
      return {
        reply:
          expertPreamble +
          [
            "Async is the wrapper around time: network, IO, and waiting for other services.",
            "- The key skill is control flow: what happens when requests complete, fail, or time out.",
            "- For APIs: always design for cancellation, timeouts, retries, and error surfaces.",
            "",
            "If you paste a snippet (or describe your flow), I can show the best-practice structure and where errors should be handled.",
          ].join("\n"),
        suggestions: ["Show a timeout pattern", "How do I avoid retry storms?", "What is backpressure?"],
      }
    }

    return {
      reply:
        expertPreamble +
        [
          "Phase 0 is about building instincts you’ll reuse everywhere:",
          "- HTTP semantics and idempotency",
          "- Auth flows (cookies vs tokens)",
          "- Failure handling (timeouts, retries, circuit breakers)",
          "- Observability (request IDs, structured logs, metrics)",
          "",
          "What do you want to master first: HTTP, auth, resilience, observability, or testing?",
        ].join("\n"),
      suggestions: ["Explain cookies vs tokens", "What is a correlation ID?", "Show a basic retry policy"],
    }
  }

  // Java docs page
  if (p.startsWith("/docs/java")) {
    if (m.includes("objectmapper") || m.includes("jackson") || m.includes("json")) {
      return {
        reply:
          expertPreamble +
          [
            "Jackson’s ObjectMapper is the core JSON bind layer (bytes ⇄ typed DTOs).",
            "- In Spring MVC, HttpMessageConverters use it to deserialize request bodies into your DTOs.",
            "- Production concerns: unknown fields strategy, strict vs lenient parsing, time and timezone handling, and safe polymorphism.",
            "",
            "If you share your DTO shape (or a sample JSON body), I can show the safest annotations/config for it.",
          ].join("\n"),
        suggestions: ["Why @RequestBody matters", "How @Valid produces 400s", "Show a DTO + validation example"],
      }
    }

    if (m.includes("valid") || m.includes("validated") || m.includes("validation")) {
      return {
        reply:
          expertPreamble +
          [
            "@Valid/@Validated turns DTO constraints into predictable 400 responses at the API boundary.",
            "- This prevents downstream NPEs/DB errors and makes clients more reliable.",
            "- Best practice: validate at boundaries, return a stable error envelope, and log with a correlation ID.",
          ].join("\n"),
        suggestions: ["Show ControllerAdvice for validation", "Explain @RequestParam vs @RequestBody", "What is an error envelope?"],
      }
    }

    return {
      reply:
        expertPreamble +
        [
          "On this Java track page, tell me your goal and I’ll recommend a path:",
          "- Client track: build an API client (cookies, JSON, retries, typed DTOs, tests).",
          "- Backend track: rebuild endpoints in Spring (routing, validation, auth, persistence, observability).",
          "",
          "What are you building: a client library, a Spring API, or both?",
        ].join("\n"),
      suggestions: ["Client track checklist", "Backend wrapper stack summary", "What to master first (Pareto)"],
    }
  }

  // Generic routing
  if (m.includes("idempot") || m.includes("retry")) {
    return {
      reply:
        expertPreamble +
        [
          "Idempotency is the property that repeating the same request produces the same effect.",
          "- Safe to retry: GET/HEAD, and POSTs that use an idempotency key (or are designed as idempotent).",
          "- Risky to retry: POSTs that create side effects without idempotency protection (charges, writes, emails).",
          "",
          "If you tell me the method + endpoint, I’ll tell you if it’s safe to retry and what status codes to treat as retryable.",
        ].join("\n"),
      suggestions: ["What status codes are retryable?", "How do I implement idempotency keys?", "What is exponential backoff?"],
    }
  }

  return base
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as AssistantRequest | null

  if (!body || typeof body.message !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { reply, suggestions } = pickReply({
    message: body.message,
    pathname: body.pathname ?? "/",
    mode: body.mode ?? "guided",
  })

  return NextResponse.json({ reply, suggestions })
}

