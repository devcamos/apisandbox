import type { ReactNode } from "react"
import { isFeatureEnabled } from "@/config/featureFlags"
import { decidePageAccess } from "@/lib/access/page-access"
import { getPhasePreviewContent } from "@/lib/access/phase-preview-content"
import { getServerViewer } from "@/lib/access/server-viewer"
import type { PhaseId } from "@/lib/subscription-access"
import { PhasePreview } from "@/components/premium/PhasePreview"

interface PremiumPageGateProps {
  phaseNumber: PhaseId
  lockedContentName: string
  children: ReactNode
}

/**
 * Server component gate. `children` is only rendered (and so only serialised into the
 * HTML / RSC payload) when the viewer has access; otherwise a catalog-only preview is sent.
 */
export async function PremiumPageGate({
  phaseNumber,
  lockedContentName,
  children,
}: Readonly<PremiumPageGateProps>) {
  const viewer = await getServerViewer()
  const decision = decidePageAccess({
    phase: phaseNumber,
    paywallEnabled: isFeatureEnabled("PREMIUM_PAYWALL"),
    viewer,
  })
  if (decision === "granted") return <>{children}</>

  const content = getPhasePreviewContent(phaseNumber, lockedContentName)
  return <PhasePreview decision={decision} returnTo={content.href} content={content} />
}
