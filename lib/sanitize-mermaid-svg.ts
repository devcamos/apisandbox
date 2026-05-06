import DOMPurify from "isomorphic-dompurify"

/**
 * Sanitize Mermaid SVG string (DOMPurify SVG profile).
 */
export function sanitizeMermaidSvg(svg: string): string {
  return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true } })
}

/**
 * Mount sanitized SVG as real DOM nodes (avoids innerHTML assignment; browser / jsdom only).
 */
export function mountSanitizedMermaidSvg(container: HTMLElement, svg: string): void {
  const clean = sanitizeMermaidSvg(svg)
  const doc = new DOMParser().parseFromString(clean, "image/svg+xml")
  if (doc.querySelector("parsererror")) {
    container.replaceChildren()
    return
  }
  const root = doc.documentElement
  if (!root || root.tagName.toLowerCase() !== "svg") {
    container.replaceChildren()
    return
  }
  container.replaceChildren()
  container.appendChild(root)
}
