"use client"

import Link from "next/link"
import { SubscriptionGate } from "@/components/SubscriptionGate"

interface Phase5NotFoundProps {
  message: string
  lockedContentName?: string
}

export default function Phase5NotFound({
  message,
  lockedContentName = "Phase 5: API Algorithms",
}: Readonly<Phase5NotFoundProps>) {
  return (
    <SubscriptionGate phaseNumber={5} lockedContentName={lockedContentName}>
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <p className="mb-4">{message}</p>
        <Link href="/phase-5" className="text-cyan-300 underline">
          Back to Phase 5
        </Link>
      </div>
    </SubscriptionGate>
  )
}
