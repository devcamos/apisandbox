import { PremiumPageGate } from "@/components/premium/PremiumPageGate"
import PageContent from "./_content/PageContent"

/** Server-gated Phase 2 demo. */
export default function Page() {
  return (
    <PremiumPageGate phaseNumber={2} lockedContentName="Phase 2: Third-Party Integrations">
      <PageContent />
    </PremiumPageGate>
  )
}
