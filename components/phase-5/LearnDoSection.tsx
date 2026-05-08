"use client"

import { CompactBulletListCard } from "@/components/phase-5/BulletListCard"

interface LearnDoSectionProps {
  learn: readonly string[]
  doItems: readonly string[]
  className?: string
}

export default function LearnDoSection({
  learn,
  doItems,
  className = "grid lg:grid-cols-2 gap-4",
}: Readonly<LearnDoSectionProps>) {
  return (
    <section className={className}>
      <CompactBulletListCard
        heading="What to learn"
        items={learn}
        containerClass="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4"
        headingClass="text-xs text-emerald-300 mb-2"
        listClass="space-y-1.5 text-sm text-emerald-100"
        dotClass="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300"
      />
      <CompactBulletListCard
        heading="What to do"
        items={doItems}
        containerClass="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4"
        headingClass="text-xs text-cyan-300 mb-2"
        listClass="space-y-1.5 text-sm text-cyan-100"
        dotClass="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300"
      />
    </section>
  )
}
