import React from "react"

type Language = "java"
type PlainLanguage = "plain"

function isWordStart(ch: string) {
  return /[A-Za-z_]/.test(ch)
}

function isWordChar(ch: string) {
  return /[A-Za-z0-9_]/.test(ch)
}

function renderJava(code: string): React.ReactNode[] {
  const keywords = new Set([
    "abstract",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "default",
    "do",
    "else",
    "enum",
    "extends",
    "final",
    "finally",
    "for",
    "if",
    "implements",
    "import",
    "instanceof",
    "interface",
    "native",
    "new",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "static",
    "strictfp",
    "super",
    "switch",
    "synchronized",
    "this",
    "throw",
    "throws",
    "transient",
    "try",
    "var",
    "void",
    "volatile",
    "while",
  ])

  const literals = new Set(["true", "false", "null"])

  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < code.length) {
    const ch = code[i]!
    const next = code[i + 1]

    // Java text blocks (""" ... """) - check before normal string literals
    if (ch === '"' && next === '"' && code[i + 2] === '"') {
      const start = i
      i += 3
      while (
        i < code.length &&
        !(code[i] === '"' && code[i + 1] === '"' && code[i + 2] === '"')
      ) {
        i += 1
      }
      i = Math.min(code.length, i + 3)
      const text = code.slice(start, i)
      nodes.push(
        <span key={start} className="text-amber-200">
          {text}
        </span>,
      )
      continue
    }

    // Line comment
    if (ch === "/" && next === "/") {
      const start = i
      i += 2
      while (i < code.length && code[i] !== "\n") i += 1
      const text = code.slice(start, i)
      nodes.push(
        <span key={start} className="text-slate-400">
          {text}
        </span>,
      )
      continue
    }

    // Block comment
    if (ch === "/" && next === "*") {
      const start = i
      i += 2
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) i += 1
      i = Math.min(code.length, i + 2)
      const text = code.slice(start, i)
      nodes.push(
        <span key={start} className="text-slate-400">
          {text}
        </span>,
      )
      continue
    }

    // String literal
    if (ch === '"') {
      const start = i
      i += 1
      while (i < code.length) {
        const c = code[i]!
        if (c === "\\" && i + 1 < code.length) {
          i += 2
          continue
        }
        if (c === '"') {
          i += 1
          break
        }
        i += 1
      }
      const text = code.slice(start, i)
      nodes.push(
        <span key={start} className="text-amber-200">
          {text}
        </span>,
      )
      continue
    }

    // Whitespace
    if (/\s/.test(ch)) {
      const start = i
      i += 1
      while (i < code.length && /\s/.test(code[i]!)) i += 1
      nodes.push(code.slice(start, i))
      continue
    }

    // Identifier / keyword / literal / class-like
    if (isWordStart(ch)) {
      const start = i
      i += 1
      while (i < code.length && isWordChar(code[i]!)) i += 1
      const word = code.slice(start, i)

      if (keywords.has(word)) {
        nodes.push(
          <span key={start} className="text-sky-300 font-semibold">
            {word}
          </span>,
        )
        continue
      }

      if (literals.has(word)) {
        nodes.push(
          <span key={start} className="text-fuchsia-300 font-semibold">
            {word}
          </span>,
        )
        continue
      }

      // Heuristic: UpperCamelCase identifiers are usually class names in Java.
      if (/^[A-Z][A-Za-z0-9_]*$/.test(word)) {
        nodes.push(
          <span key={start} className="text-emerald-300">
            {word}
          </span>,
        )
        continue
      }

      nodes.push(word)
      continue
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      const start = i
      i += 1
      while (i < code.length && /[0-9_]/.test(code[i]!)) i += 1
      nodes.push(
        <span key={start} className="text-orange-300">
          {code.slice(start, i)}
        </span>,
      )
      continue
    }

    // Punctuation / operators
    nodes.push(
      <span key={i} className="text-slate-300">
        {ch}
      </span>,
    )
    i += 1
  }

  return nodes
}

export function HighlightedCodeBlock({
  code,
  label,
  language = "java",
  defaultOpen = false,
}: {
  code: string
  label?: string
  language?: Language | PlainLanguage
  defaultOpen?: boolean
}) {
  const highlighted = language === "java" ? renderJava(code) : [code]
  return (
    <details className="mt-3 rounded-xl border border-slate-700 bg-slate-950/50 group" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm text-slate-200 marker:hidden">
        <span className="font-semibold tracking-wide text-slate-300/90">
          {label ?? "Code snippet"}
        </span>
        <span className="shrink-0 text-xs font-medium text-cyan-300 transition-colors group-hover:text-cyan-200">
          <span className="group-open:hidden">Show code</span>
          <span className="hidden group-open:inline">Hide code</span>
        </span>
      </summary>
      <div className="px-4 pb-4">
        <pre className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/80 p-4 text-xs leading-relaxed text-slate-200 whitespace-pre font-mono">
          <code>{highlighted}</code>
        </pre>
      </div>
    </details>
  )
}

export function ExpandableCodeBlock({
  code,
  label,
  className,
  preClassName,
  defaultOpen = false,
}: {
  code: string
  label?: string
  className?: string
  preClassName?: string
  defaultOpen?: boolean
}) {
  return (
    <details
      className={`mt-3 rounded-xl border border-slate-700 bg-slate-950/50 group ${className ?? ""}`.trim()}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm text-slate-200 marker:hidden">
        <span className="font-semibold tracking-wide text-slate-300/90">
          {label ?? "Code snippet"}
        </span>
        <span className="shrink-0 text-xs font-medium text-cyan-300 transition-colors group-hover:text-cyan-200">
          <span className="group-open:hidden">Show code</span>
          <span className="hidden group-open:inline">Hide code</span>
        </span>
      </summary>
      <div className="px-4 pb-4">
        <pre
          className={`overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/80 p-4 text-xs leading-relaxed text-slate-200 whitespace-pre font-mono ${preClassName ?? ""}`.trim()}
        >
          <code>{code}</code>
        </pre>
      </div>
    </details>
  )
}
