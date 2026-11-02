import { PremiumPageGate } from "@/components/premium/PremiumPageGate"
import PageContent from "./_content/PageContent"

/** Server-gated Cloud page (its tools call premium /api/aws/* routes). */
export default function Page() {
  return (
    <PremiumPageGate phaseNumber="cloud" lockedContentName="AWS Migration">
      <PageContent />
    </PremiumPageGate>
  )
}
