"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"
import { useSession } from "@/components/providers/SessionProvider"
import { canAccessLearningAssistant } from "@/lib/assistant/access"
import { authApiFetchInit } from "@/lib/auth/client-fetch"

type Msg = { id: string; role: "user" | "assistant"; content: string }
type Redirect = { href: string; label: string; reason: string }

function uid() {
  return Math.random().toString(16).slice(2)
}

export function LearningAssistantWidget() {
  const pathname = usePathname()
  const router = useRouter()
  const { status, data: session } = useSession()
  const subscriptionTier = session?.subscriptionTier
  const allowed = canAccessLearningAssistant({
    status,
    subscriptionTier,
    pathname: pathname ?? "/",
  })
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"guided" | "expert">("guided")
  const [provider, setProvider] = useState<string | null>(null)
  const [model, setModel] = useState<string | null>(null)
  const [redirect, setRedirect] = useState<Redirect | null>(null)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "hello",
      role: "assistant",
      content:
        "I’m your learning assistant. Tell me what you’re trying to build (client vs backend), and what page you’re on, and I’ll guide you with API best practices.",
    },
  ])
  const [suggestions, setSuggestions] = useState<string[]>([
    "Explain idempotency",
    "Cookies vs tokens",
    "Show a retry policy example",
  ])

  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [open, messages.length, loading])

  useEffect(() => {
    if (!allowed && open) {
      setOpen(false)
    }
  }, [allowed, open])

  if (!allowed) {
    return null
  }

  async function ask(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    setInput("")
    setSuggestions([])
    setLoading(true)

    const userMsg: Msg = { id: uid(), role: "user", content: trimmed }
    setMessages((prev) => [...prev, userMsg])

    try {
      const res = await fetch("/api/assistant", {
        ...authApiFetchInit,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          pathname,
          mode,
          history: messages
            .slice(-8)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = (await res.json().catch(() => null)) as
        | {
            reply?: string
            suggestions?: string[]
            model?: string
            provider?: string
            redirect?: Redirect | null
            error?: string
          }
        | null

      if (!res.ok) {
        const msg = data?.error || "Assistant request failed."
        throw new Error(msg)
      }

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: data?.reply ?? "I couldn’t generate a response for that. Try rephrasing.",
        },
      ])
      setProvider(data?.provider ?? null)
      setModel(data?.model ?? null)
      setRedirect(data?.redirect ?? null)
      setSuggestions((data?.suggestions ?? []).slice(0, 3))
    } catch (e) {
      const msg = e instanceof Error ? e.message : null
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            msg ||
            "I couldn’t reach the AI backend. If you’re running locally, set `OPENAI_API_KEY` (OpenAI) or `GEMINI_API_KEY` (Gemini) in `.env.local`, then reload.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/15 transition-colors shadow-lg shadow-black/30"
          aria-label="Open learning assistant"
        >
          <Sparkles className="h-4 w-4 text-emerald-200" />
          Learning Assistant
          <MessageCircle className="h-4 w-4 text-emerald-200 opacity-80 group-hover:opacity-100" />
        </button>
      ) : (
        <div className="w-[92vw] max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/90 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white">Learning Assistant</div>
              <div className="mt-0.5 text-xs text-slate-400 truncate">
                Context: <span className="font-mono">{pathname}</span>
              </div>
              {model ? (
                <div className="mt-0.5 text-xs text-slate-500 truncate">
                  {provider ? (
                    <>
                      Provider: <span className="font-mono">{provider}</span> · Model:{" "}
                      <span className="font-mono">{model}</span>
                    </>
                  ) : (
                    <>
                      Model: <span className="font-mono">{model}</span>
                    </>
                  )}
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode((m) => (m === "guided" ? "expert" : "guided"))}
                className={[
                  "rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors",
                  mode === "expert"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15"
                    : "border-slate-700 bg-slate-900/30 text-slate-200 hover:bg-slate-900/50",
                ].join(" ")}
                aria-label="Toggle expert mode"
              >
                {mode === "expert" ? "Expert" : "Guided"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-800 bg-slate-900/30 p-2 text-slate-300 hover:text-white hover:bg-slate-900/60 transition-colors"
                aria-label="Close learning assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={listRef} className="max-h-[55vh] overflow-y-auto px-4 py-3">
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={[
                    "rounded-2xl border px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed",
                    m.role === "assistant"
                      ? "border-slate-800 bg-slate-900/40 text-slate-200"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-50",
                  ].join(" ")}
                >
                  {m.content}
                </div>
              ))}
              {loading ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-300">
                  Thinking…
                </div>
              ) : null}
            </div>

            {redirect ? (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
                <div className="text-xs font-semibold text-slate-200">Best lesson match</div>
                <div className="mt-1 text-sm text-slate-300">{redirect.reason}</div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      router.push(redirect.href)
                    }}
                    className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/15 transition-colors"
                  >
                    {redirect.label}
                  </button>
                </div>
              </div>
            ) : null}

            {suggestions.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="rounded-full border border-slate-700 bg-slate-900/30 px-3 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-900/50 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            className="flex items-center gap-2 border-t border-slate-800 px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault()
              void ask(input)
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about APIs, Java, auth, retries, testing…"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/40"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-100 hover:bg-emerald-500/15 transition-colors disabled:opacity-60"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
