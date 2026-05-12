"use client"

import { useMemo, useState } from "react"

export type OntologyTag =
  | "routing"
  | "validation"
  | "binding"
  | "contracts"
  | "errors"
  | "auth"
  | "observability"
  | "di"
  | "serialization"

export type OntologyRow = {
  component: string
  codeElement: string
  why: string
  tags: OntologyTag[]
  kind?: "annotation" | "type" | "method" | "field" | "import" | "other"
}

function inferKind(codeElement: string): NonNullable<OntologyRow["kind"]> {
  const s = codeElement.trim()
  if (s.startsWith("@")) return "annotation"
  if (/\bclass\b/.test(s) || /^record\b/.test(s) || /\brecord\b/.test(s) || /\binterface\b/.test(s)) {
    return "type"
  }
  if (s.includes("(") && s.includes(")")) return "method"
  return "other"
}

function tagLabel(tag: OntologyTag) {
  switch (tag) {
    case "routing":
      return "Routing"
    case "validation":
      return "Validation"
    case "binding":
      return "Binding"
    case "contracts":
      return "Contracts"
    case "errors":
      return "Errors"
    case "auth":
      return "Auth"
    case "observability":
      return "Observability"
    case "di":
      return "DI"
    case "serialization":
      return "Serialization"
  }
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors",
        active
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
          : "border-slate-700 bg-slate-900/30 text-slate-200 hover:bg-slate-900/50",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

export function OntologyBreakdownTable({
  rows,
  defaultTags,
}: {
  rows: OntologyRow[]
  defaultTags?: OntologyTag[]
}) {
  const tags = useMemo(() => {
    const set = new Set<OntologyTag>()
    for (const r of rows) for (const t of r.tags) set.add(t)
    return Array.from(set)
  }, [rows])

  const [activeTags, setActiveTags] = useState<OntologyTag[] | null>(
    defaultTags && defaultTags.length ? defaultTags : null,
  )
  const [preset, setPreset] = useState<"all" | "basic" | "intermediate" | "expert" | "custom">(
    "all",
  )

  const visibleRows = useMemo(() => {
    const withKinds =
      preset === "basic"
        ? rows.filter((r) => {
            const kind = r.kind ?? inferKind(r.codeElement)
            return kind === "annotation" || kind === "type"
          })
        : preset === "intermediate"
          ? rows.filter((r) => {
              const kind = r.kind ?? inferKind(r.codeElement)
              return kind === "annotation" || kind === "type" || kind === "import"
            })
          : preset === "expert"
            ? rows.filter((r) => {
                const kind = r.kind ?? inferKind(r.codeElement)
                return kind === "method" || kind === "field"
              })
          : rows

    if (preset !== "custom") return withKinds
    if (!activeTags || activeTags.length === 0) return withKinds
    const tagSet = new Set(activeTags)
    return withKinds.filter((r) => r.tags.some((t) => tagSet.has(t)))
  }, [rows, activeTags, preset])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip
          active={preset === "all"}
          onClick={() => {
            setPreset("all")
            setActiveTags(null)
          }}
        >
          All
        </Chip>
        <Chip
          active={preset === "basic"}
          onClick={() => {
            setPreset("basic")
            setActiveTags(null)
          }}
        >
          Basic
        </Chip>
        <Chip
          active={preset === "intermediate"}
          onClick={() => {
            setPreset("intermediate")
            setActiveTags(null)
          }}
        >
          Intermediate
        </Chip>
        <Chip
          active={preset === "expert"}
          onClick={() => {
            setPreset("expert")
            setActiveTags(null)
          }}
        >
          Expert
        </Chip>
        <Chip
          active={preset === "custom"}
          onClick={() => {
            setPreset("custom")
            // Keep whatever tags the user already toggled; if none, show all rows.
          }}
        >
          Filter
        </Chip>
        {tags.map((t) => {
          const active = preset === "custom" && (activeTags ?? []).includes(t)
          return (
            <Chip
              key={t}
              active={active}
              onClick={() => {
                setPreset("custom")
                setActiveTags((prev) => {
                  const current = prev ?? []
                  if (current.includes(t)) return current.filter((x) => x !== t)
                  return [...current, t]
                })
              }}
            >
              {tagLabel(t)}
            </Chip>
          )
        })}
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-xs text-slate-300">
          <thead>
            <tr className="text-left text-slate-300">
              <th className="py-2 pr-6 font-semibold">Component</th>
              <th className="py-2 pr-6 font-semibold">Code element</th>
              <th className="py-2 pr-2 font-semibold">Why it exists</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r, idx) => (
              <tr key={`${r.component}-${idx}`} className="border-t border-slate-800">
                <td className="py-2 pr-6">{r.component}</td>
                <td className="py-2 pr-6 font-mono text-[11px] text-slate-200">{r.codeElement}</td>
                <td className="py-2 pr-2">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
