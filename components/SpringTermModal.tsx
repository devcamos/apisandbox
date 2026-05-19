"use client"

import { useEffect } from "react"
import { AlertTriangle, Lightbulb, X } from "lucide-react"
import { HighlightedCodeBlock } from "@/components/HighlightedCodeBlock"
import type { SpringTermItem } from "@/lib/learning/spring-perspective"

interface SpringTermModalProps {
  isOpen: boolean
  onClose: () => void
  item: SpringTermItem | null
}

export default function SpringTermModal({
  isOpen,
  onClose,
  item,
}: Readonly<SpringTermModalProps>) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close spring term details"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="relative bg-gradient-to-r from-green-600/80 to-emerald-600/70 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="pr-12">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/80">
              Spring Framework Perspective
            </div>
            <h3 className="text-3xl font-bold text-white">{item.term}</h3>
            <p className="mt-2 max-w-3xl text-sm text-emerald-50/90">{item.desc}</p>
          </div>
        </div>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          <section className="rounded-2xl border border-slate-700 bg-slate-950/40 p-5">
            <div className="mb-3 text-sm font-semibold text-slate-200">Code sample</div>
            <HighlightedCodeBlock
              label={item.sampleLabel}
              code={item.code}
              language={item.code.includes("@") || item.code.includes("class") ? "java" : "plain"}
            />
          </section>

          <section className="mt-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              Current implementation notes
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {item.insights.map((insight) => (
                <div
                  key={insight.title}
                  className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5"
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    {insight.title}
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{insight.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
