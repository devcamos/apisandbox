type ResultDetail = {
  questionId: string
  concept: string
  isCorrect: boolean
  redirect?: {
    href: string
    label: string
  } | null
}

export function masteryLabel(correctAnswers: number, totalQuestions: number) {
  const ratio = totalQuestions === 0 ? 0 : correctAnswers / totalQuestions
  if (ratio >= 1) return "Ready for the next phase"
  if (ratio >= 0.75) return "Strong grasp"
  if (ratio >= 0.5) return "Building understanding"
  return "Needs reinforcement"
}

export function masterySummary(details: ResultDetail[]) {
  const strengths = details.filter((d) => d.isCorrect).map((d) => d.concept)
  const gaps = details.filter((d) => !d.isCorrect).map((d) => d.concept)

  const seen = new Set<string>()
  const unique = (items: string[]) =>
    items.filter((item) => {
      if (seen.has(item)) return false
      seen.add(item)
      return true
    })

  return {
    strengths: unique(strengths),
    gaps: unique(gaps),
  }
}

export function recommendedRedirects(details: ResultDetail[]) {
  const seen = new Set<string>()
  return details
    .filter((d) => !d.isCorrect && d.redirect)
    .map((d) => d.redirect!)
    .filter((redirect) => {
      if (seen.has(redirect.href)) return false
      seen.add(redirect.href)
      return true
    })
}

