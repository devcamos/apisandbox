import { PremiumPageGate } from "@/components/premium/PremiumPageGate"
import PageContent from "./_content/PageContent"

/**
 * Server-gated: premium content is only rendered for viewers with access, so free
 * users receive the PhasePreview instead of the lesson in the HTML / RSC payload.
 */
export default function Page() {
  return (
    <PremiumPageGate phaseNumber={2} lockedContentName="Phase 2: Third-Party Integrations">
      <PageContent />
    </PremiumPageGate>
  )
}
