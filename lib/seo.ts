import { Metadata } from "next"

interface PhaseMetaInput {
  phaseNumber: number
  title: string
  description: string
}

export function generatePhaseMetadata({ phaseNumber, title, description }: PhaseMetaInput): Metadata {
  const fullTitle = `Phase ${phaseNumber}: ${title} — API Sandbox`
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
    },
  }
}
