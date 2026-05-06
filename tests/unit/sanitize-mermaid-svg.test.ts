import { describe, expect, it } from "vitest"
import { sanitizeMermaidSvg } from "@/lib/sanitize-mermaid-svg"

describe("sanitizeMermaidSvg", () => {
  it("keeps benign svg from mermaid", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><text>ok</text></svg>'
    expect(sanitizeMermaidSvg(svg)).toContain("<svg")
    expect(sanitizeMermaidSvg(svg)).toContain("ok")
  })

  it("strips script tags", () => {
    const dirty = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><text>x</text></svg>'
    const clean = sanitizeMermaidSvg(dirty)
    expect(clean.toLowerCase()).not.toContain("<script")
  })
})
