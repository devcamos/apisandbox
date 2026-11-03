import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const getServerViewer = vi.hoisted(() => vi.fn())
const flags = vi.hoisted(() => ({ paywall: true }))

vi.mock("@/lib/access/server-viewer", () => ({ getServerViewer }))
vi.mock("@/config/featureFlags", () => ({
  isFeatureEnabled: (flag: string) => (flag === "PREMIUM_PAYWALL" ? flags.paywall : false),
}))

import { PremiumPageGate } from "@/components/premium/PremiumPageGate"

const SECRET = "PREMIUM-LESSON-BODY-7f3a"

async function render(phase: number | "cloud" | "ai") {
  const el = await PremiumPageGate({
    phaseNumber: phase,
    lockedContentName: "Locked name",
    children: <article>{SECRET}</article>,
  })
  return renderToStaticMarkup(el)
}

const viewer = (tier: string, expiresAt: Date | null = null, email = "learner@example.com") => ({
  id: "u1",
  email,
  isDemo: email.endsWith("@apisandbox.demo"),
  subscriptionTier: tier,
  subscriptionExpiresAt: expiresAt,
})

describe("PremiumPageGate (server)", () => {
  beforeEach(() => {
    flags.paywall = true
    getServerViewer.mockReset()
  })

  it.each([2, 5, 9, "cloud", "ai"] as const)(
    "never sends premium content to an anonymous visitor (phase %s)",
    async (phase) => {
      getServerViewer.mockResolvedValue(null)
      const html = await render(phase)
      expect(html).not.toContain(SECRET)
      expect(html).toContain('data-testid="phase-preview"')
      expect(html).toContain("/login?callbackUrl=")
      expect(html).toContain("/signup?callbackUrl=")
    },
  )

  it("never sends premium content to a FREE user and offers the upgrade flow", async () => {
    getServerViewer.mockResolvedValue(viewer("FREE"))
    const html = await render(2)
    expect(html).not.toContain(SECRET)
    expect(html).toContain('href="/upgrade"')
    expect(html).toContain("Estimated time")
    expect(html).toContain("What you will learn")
  })

  it("treats expired premium as FREE", async () => {
    getServerViewer.mockResolvedValue(viewer("PREMIUM", new Date(Date.now() - 60_000)))
    expect(await render(3)).not.toContain(SECRET)
  })

  it("demo users are locked out of premium phases even with the paywall off", async () => {
    flags.paywall = false
    getServerViewer.mockResolvedValue(viewer("FREE", null, "demo.x@apisandbox.demo"))
    const html = await render(4)
    expect(html).not.toContain(SECRET)
    expect(html).toContain('href="/signup"')
  })

  it("renders content for active premium users", async () => {
    getServerViewer.mockResolvedValue(viewer("PREMIUM", new Date(Date.now() + 86_400_000)))
    expect(await render("cloud")).toContain(SECRET)
  })

  it("renders content when the paywall is off (non-production)", async () => {
    flags.paywall = false
    getServerViewer.mockResolvedValue(null)
    expect(await render(6)).toContain(SECRET)
  })
})

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (name === "page.tsx") out.push(full)
  }
  return out
}

describe("premium route files", () => {
  const root = path.resolve(__dirname, "../../app")
  const premiumPages = [
    ...["phase-2", "phase-3", "phase-4", "phase-5", "phase-6", "phase-7", "phase-8", "phase-9", "ai"]
      .flatMap((d) => walk(path.join(root, d)))
      // Pure redirects carry no content.
      .filter((p) => !/^\s*redirect\(/m.test(readFileSync(p, "utf8"))),
    path.join(root, "cloud/aws/services/page.tsx"),
    path.join(root, "cloud/aws/migration/page.tsx"),
    path.join(root, "cloud/aws/strategies/page.tsx"),
    path.join(root, "cloud/vercel/page.tsx"),
    path.join(root, "cloud/security/page.tsx"),
  ]

  it("finds the premium pages", () => {
    expect(premiumPages.length).toBeGreaterThanOrEqual(25)
  })

  it.each(premiumPages.map((p) => [path.relative(root, p)]))(
    "%s is a server component wrapped in PremiumPageGate",
    (rel) => {
      const src = readFileSync(path.join(root, rel), "utf8")
      expect(src.trimStart().startsWith('"use client"')).toBe(false)
      expect(src).toContain("PremiumPageGate")
      expect(src).not.toContain("SubscriptionGate")
    },
  )
})
