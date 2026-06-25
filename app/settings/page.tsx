"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Copy, KeyRound, Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react"
import { authApiJsonInit, authApiRequestInit } from "@/lib/auth/client-fetch"
import { useSession } from "@/components/providers/SessionProvider"
import { API_TOKEN_SCOPES, type ApiTokenScope, type PublicApiToken } from "@/lib/api-tokens/token-types"

type ApiEnvelope<T> = {
  success?: boolean
  data?: T
  error?: {
    message?: string
  }
}

const scopeLabels: Record<ApiTokenScope, string> = {
  "profile:read": "Profile read",
  "progress:read": "Progress read",
  "progress:write": "Progress write",
}

function formatDate(value: string | null) {
  if (!value) return "Never"
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function tokenStatus(token: PublicApiToken) {
  if (token.revokedAt) return "Revoked"
  if (token.expiresAt && new Date(token.expiresAt) <= new Date()) return "Expired"
  return "Active"
}

export default function SettingsPage() {
  const { status } = useSession()
  const [tokens, setTokens] = useState<PublicApiToken[]>([])
  const [name, setName] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [scopes, setScopes] = useState<ApiTokenScope[]>(["profile:read"])
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const activeTokenCount = useMemo(
    () => tokens.filter((token) => tokenStatus(token) === "Active").length,
    [tokens],
  )

  async function loadTokens() {
    setLoading(true)
    setMessage(null)
    const response = await fetch("/api/api-tokens", authApiRequestInit())
    const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<{ tokens: PublicApiToken[] }>
    if (!response.ok) {
      setMessage(payload.error?.message ?? "Could not load API tokens")
      setLoading(false)
      return
    }
    setTokens(payload.data?.tokens ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (status === "authenticated") {
      void loadTokens()
    } else if (status === "unauthenticated") {
      setLoading(false)
    }
  }, [status])

  function toggleScope(scope: ApiTokenScope) {
    setScopes((current) => {
      if (current.includes(scope)) {
        return current.length === 1 ? current : current.filter((item) => item !== scope)
      }
      return [...current, scope]
    })
  }

  async function createToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setMessage(null)
    setCreatedToken(null)

    const response = await fetch(
      "/api/api-tokens",
      authApiJsonInit({
        name,
        scopes,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      }),
    )
    const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<{
      token: string
      apiToken: PublicApiToken
    }>

    setSubmitting(false)
    if (!response.ok || !payload.data) {
      setMessage(payload.error?.message ?? "Could not create API token")
      return
    }

    setCreatedToken(payload.data.token)
    setTokens((current) => [payload.data!.apiToken, ...current])
    setName("")
    setExpiresAt("")
    setScopes(["profile:read"])
  }

  async function revokeToken(tokenId: string) {
    setMessage(null)
    const response = await fetch(`/api/api-tokens/${tokenId}`, authApiRequestInit({ method: "DELETE" }))
    const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<{ token: PublicApiToken }>
    if (!response.ok || !payload.data) {
      setMessage(payload.error?.message ?? "Could not revoke API token")
      return
    }

    setTokens((current) =>
      current.map((token) => token.id === tokenId ? payload.data!.token : token),
    )
  }

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
          Loading settings
        </div>
      </main>
    )
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <section className="mx-auto max-w-3xl rounded-lg border border-slate-800 bg-slate-900 p-8">
          <h1 className="text-2xl font-semibold">Sign in required</h1>
          <p className="mt-2 text-slate-300">API token settings are available after sign in.</p>
          <Link
            href="/login?callbackUrl=/settings"
            className="mt-6 inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950"
          >
            Sign in
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-300">
              <KeyRound className="h-4 w-4" />
              Settings
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal md:text-4xl">API tokens</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Create product API tokens for integrations. Tokens are shown once, stored as hashes,
              and can be revoked without changing your sign-in session.
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
            <div className="text-2xl font-semibold text-cyan-200">{activeTokenCount}</div>
            <div className="text-sm text-slate-400">active tokens</div>
          </div>
        </header>

        {message && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {message}
          </div>
        )}

        {createdToken && (
          <section className="rounded-lg border border-green-500/30 bg-green-500/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-green-100">Copy this token now</h2>
                <p className="mt-1 text-sm text-green-100/80">It will not be shown again.</p>
              </div>
              <button
                type="button"
                onClick={() => void navigator.clipboard.writeText(createdToken)}
                className="inline-flex items-center gap-2 rounded-lg border border-green-400/40 px-3 py-2 text-sm font-semibold text-green-100 hover:bg-green-400/10"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <code className="mt-4 block overflow-x-auto rounded-lg bg-slate-950 p-3 text-sm text-green-100">
              {createdToken}
            </code>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
          <form onSubmit={createToken} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-cyan-300" />
              <h2 className="font-semibold">Create token</h2>
            </div>

            <label className="mt-5 block text-sm font-medium text-slate-200">
              Token name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                required
                placeholder="CRM sync"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-slate-200">
              Expiry date
              <input
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                type="datetime-local"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </label>

            <fieldset className="mt-4">
              <legend className="text-sm font-medium text-slate-200">Scopes</legend>
              <div className="mt-2 space-y-2">
                {API_TOKEN_SCOPES.map((scope) => (
                  <label
                    key={scope}
                    className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={scopes.includes(scope)}
                      onChange={() => toggleScope(scope)}
                      className="h-4 w-4 accent-cyan-400"
                    />
                    {scopeLabels[scope]}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Create API token
            </button>
          </form>

          <section className="rounded-lg border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="font-semibold">Existing tokens</h2>
            </div>
            <div className="divide-y divide-slate-800">
              {tokens.length === 0 ? (
                <div className="p-6 text-sm text-slate-400">No API tokens yet.</div>
              ) : (
                tokens.map((token) => {
                  const statusLabel = tokenStatus(token)
                  return (
                    <div key={token.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-white">{token.name}</h3>
                          <span className="rounded border border-slate-700 px-2 py-0.5 text-xs text-slate-300">
                            {statusLabel}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-slate-400">
                          <code>{token.tokenPrefix}...</code>
                          <span className="mx-2">·</span>
                          Expires {formatDate(token.expiresAt)}
                          <span className="mx-2">·</span>
                          Last used {formatDate(token.lastUsedAt)}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {token.scopes.map((scope) => (
                            <span key={scope} className="rounded bg-slate-800 px-2 py-1 text-xs text-cyan-100">
                              {scopeLabels[scope]}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={Boolean(token.revokedAt)}
                        onClick={() => void revokeToken(token.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        Revoke
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
