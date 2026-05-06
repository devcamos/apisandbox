import DOMPurify from "isomorphic-dompurify"

/**
 * Sanitize Mermaid output before assigning to innerHTML (Sonar / XSS hardening).
 */
export function sanitizeMermaidSvg(svg: string): string {
  return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true } })
}
