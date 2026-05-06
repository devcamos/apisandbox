"use client";

import { useEffect, useId, useRef, useState } from "react";
import { sanitizeMermaidSvg } from "@/lib/sanitize-mermaid-svg";

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const elementId = useId().replace(/[:]/g, "-");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      if (!containerRef.current) return;

      try {
        setError(null);
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#0f172a",
            primaryTextColor: "#f8fafc",
            primaryBorderColor: "#38bdf8",
            lineColor: "#38bdf8",
            secondaryColor: "#1e293b",
            tertiaryColor: "#020617",
            background: "#020617",
            mainBkg: "#0f172a",
            secondBkg: "#1e293b",
            textColor: "#e2e8f0",
          },
          flowchart: {
            curve: "basis",
          },
        });

        const { svg } = await mermaid.render(`mermaid-${elementId}`, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = sanitizeMermaidSvg(svg);
        }
      } catch (renderError) {
        if (!cancelled) {
          setError(renderError instanceof Error ? renderError.message : "Unknown render error");
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, elementId]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        Failed to render diagram: {error}
      </div>
    );
  }

  return <div ref={containerRef} className="mermaid-diagram overflow-x-auto rounded-xl bg-slate-950/60 p-4" />;
}
