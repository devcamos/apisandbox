import type { ReactNode } from "react"
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Compass,
  Lightbulb,
  Map,
  MessageSquareText,
  RefreshCw,
  ShieldAlert,
  Target,
  Wrench,
} from "lucide-react"
import { CapabilityPrediction } from "@/components/learning/CapabilityPractice"
import { CapabilityFlashcards } from "@/components/learning/CapabilityFlashcards"
import { CapabilityExplanation } from "@/components/learning/CapabilityExplanation"
import { CapabilityModuleProgress, CapabilityStageCheckbox } from "@/components/learning/CapabilityModuleProgress"
import { CapabilityLab } from "@/components/learning/CapabilityLab"
import { CourseAssessment } from "@/components/learning/CourseAssessment"
import { CAPABILITY_MASTERY_STAGES, type SanitizedLearningUnit } from "@/lib/learning/api-foundations-course"

const stageIcons = {
  problem: Target,
  predict: Lightbulb,
  learn: BrainCircuit,
  recall: RefreshCw,
  reason: Compass,
  build: Code2,
  break: ShieldAlert,
  explain: MessageSquareText,
  "aws-map": Map,
  exam: CheckCircle2,
} as const

function Stage({
  id,
  title,
  subtitle,
  children,
}: Readonly<{
  id: (typeof CAPABILITY_MASTERY_STAGES)[number]["id"]
  title: string
  subtitle: string
  children: ReactNode
}>) {
  const Icon = stageIcons[id]
  const number = CAPABILITY_MASTERY_STAGES.findIndex((stage) => stage.id === id) + 1

  return (
    <section id={"stage-" + id} className="scroll-mt-24 rounded-2xl border border-slate-700 bg-slate-900/60 p-5 sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-400/10 text-violet-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">Stage {number} of {CAPABILITY_MASTERY_STAGES.length}</p>
          <h3 className="mt-1 text-2xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
      <CapabilityStageCheckbox id={id} title={title} />
    </section>
  )
}

function BulletList({ items, tone = "default" }: Readonly<{ items: string[]; tone?: "default" | "warning" | "success" }>) {
  const iconClass = tone === "warning" ? "text-amber-300" : tone === "success" ? "text-emerald-300" : "text-violet-300"
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-300">
          <CheckCircle2 className={"mt-1 h-4 w-4 shrink-0 " + iconClass} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function AwsCapabilityMasteryJourney({
  courseId,
  trackSlug,
  unit,
  loginCallbackUrl,
}: Readonly<{
  courseId: string
  trackSlug: string
  unit: SanitizedLearningUnit
  loginCallbackUrl: string
}>) {
  const content = unit.certification?.masteryJourney
  if (!content) return null

  return (
    <div>
      <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Wrench className="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" />
          <div>
            <h2 className="text-xl font-bold text-white">Mastery requires transfer evidence</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Opening this capability or watching related content earns nothing. Predict first, run the lab, inject a fault, explain your decision, map the invariant to AWS, then pass the scored checkpoint.
            </p>
          </div>
        </div>
      </div>

      <CapabilityModuleProgress courseId={courseId} unitId={unit.id}>
        <Stage id="problem" title="Problem" subtitle="Start with the consequence before vocabulary or services.">
          <p className="text-base leading-7 text-slate-200">{content.problem}</p>
          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/35 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capability goal</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{unit.goal}</p>
          </div>
        </Stage>

        <Stage id="predict" title="Predict" subtitle="Commit to a decision before seeing the mechanism.">
          <CapabilityPrediction scenario={unit.scenario} courseId={courseId} unitId={unit.id} />
        </Stage>

        <Stage id="learn" title="Learn" subtitle="Build the provider-independent causal model.">
          <div className="grid gap-4 lg:grid-cols-2">
            <div id="stage-learn-principle" className="scroll-mt-24 rounded-xl border border-violet-400/25 bg-violet-400/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">Principle</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{unit.principle}</p>
            </div>
            <div id="stage-learn-mechanism" className="scroll-mt-24 rounded-xl border border-slate-700 bg-slate-950/35 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Mechanism</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{content.mechanism}</p>
            </div>
          </div>
          <div id="stage-learn-decision" className="mt-5 grid scroll-mt-24 gap-4 lg:grid-cols-3">
            <div><h4 className="mb-2 font-semibold text-white">Use when</h4><BulletList items={content.decision.useWhen} tone="success" /></div>
            <div><h4 className="mb-2 font-semibold text-white">Avoid when</h4><BulletList items={content.decision.avoidWhen} tone="warning" /></div>
            <div><h4 className="mb-2 font-semibold text-white">Alternatives</h4><BulletList items={content.decision.alternatives} /></div>
          </div>
          <div id="stage-learn-trade-offs" className="mt-5 scroll-mt-24 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <h4 className="flex items-center gap-2 font-semibold text-white"><AlertTriangle className="h-4 w-4 text-amber-300" /> Trade-offs</h4>
            <div className="mt-3"><BulletList items={content.tradeOffs} tone="warning" /></div>
          </div>
        </Stage>

        <Stage id="recall" title="Recall" subtitle="Close the explanation and retrieve the model from memory.">
          <ol className="grid gap-3 sm:grid-cols-2">
            {content.recallPrompts.map((prompt, index) => (
              <li key={prompt} className="rounded-xl border border-slate-700 bg-slate-950/35 p-4 text-sm leading-6 text-slate-200">
                <span className="mr-2 font-bold text-violet-300">{index + 1}.</span>{prompt}
                <details className="mt-2 text-sm">
                  <summary className="cursor-pointer text-violet-200">Show hint</summary>
                  <a href={index === 0 ? "#stage-learn-mechanism" : "#stage-learn-decision"} className="underline">Review {index === 0 ? "the mechanism" : "the decision boundary"}</a>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-violet-200">Reveal canonical answer</summary>
                    <p className="mt-1 text-slate-300">{content.recallAnswers[index]}</p>
                  </details>
                </details>
              </li>
            ))}
          </ol>
        </Stage>

        <Stage id="reason" title="Reason" subtitle="Defend a decision under real constraints.">
          <p className="text-base font-semibold leading-7 text-white">{content.reasoning.prompt}</p>
          <div className="mt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">A strong decision addresses</p><BulletList items={content.reasoning.strongAnswerIncludes} /></div>
        </Stage>

        <Stage id="build" title="Build" subtitle="Demonstrate the invariant without relying on AWS.">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h4 className="text-lg font-bold text-white">{content.implementation.title}</h4><p className="mt-1 text-sm leading-6 text-slate-300">{content.implementation.objective}</p></div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">{content.implementation.language}</span>
              {content.implementation.stack.map((item) => <span key={item} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{item}</span>)}
            </div>
          </div>
          <ol className="mt-5 grid gap-3 sm:grid-cols-3">
            {content.implementation.steps.map((step, index) => <li key={step} className="rounded-xl border border-slate-700 bg-slate-950/35 p-4 text-sm leading-6 text-slate-300"><span className="font-bold text-emerald-300">{index + 1}.</span> {step}</li>)}
          </ol>
          <CapabilityLab courseId={courseId} unitId={unit.id} stage="build" />
          <details className="mt-4 text-sm text-slate-300">
            <summary className="cursor-pointer">View Java 21 reference</summary>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs leading-6 text-emerald-100"><code>{content.implementation.code}</code></pre>
          </details>
          <div className="mt-5"><h4 className="mb-2 font-semibold text-white">Success criteria</h4><BulletList items={content.implementation.successCriteria} tone="success" /></div>
        </Stage>

        <Stage id="break" title="Break" subtitle="Inject failure before production does.">
          <div className="grid gap-4 lg:grid-cols-2">
            <div><h4 className="mb-2 font-semibold text-white">Faults to inject</h4><BulletList items={content.breakExercise.faults} tone="warning" /></div>
            <div><h4 className="mb-2 font-semibold text-white">Observe</h4><BulletList items={content.breakExercise.observe} /></div>
          </div>
          <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Recovery design</p><p className="mt-2 text-sm leading-6 text-slate-200">{content.breakExercise.recovery}</p></div>
          <CapabilityLab courseId={courseId} unitId={unit.id} stage="break" />
        </Stage>

        <Stage id="explain" title="Explain" subtitle="Answer each flashcard aloud before revealing it.">
          <CapabilityFlashcards key={unit.id} cards={[
            { prompt: "How does this capability work?", answer: [content.mechanism] },
            { prompt: "When would you choose this approach?", answer: content.decision.useWhen },
            { prompt: "When would you avoid it, and what could you use instead?", answer: [...content.decision.avoidWhen, content.decision.alternatives.join(" · ")] },
            { prompt: "Which trade-offs would you explain to a teammate?", answer: content.tradeOffs },
          ]} />
          <details className="mt-5 rounded-xl border border-slate-700 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-violet-200">Write a graded explanation</summary>
            <div className="mt-4">
              <CapabilityExplanation courseId={courseId} unitId={unit.id} prompt={content.explanation.prompt} criteria={content.explanation.evidenceCriteria} />
            </div>
          </details>
        </Stage>

        <Stage id="aws-map" title="AWS Map" subtitle="Map the invariant to AWS only after understanding it.">
          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="min-w-full divide-y divide-slate-700 text-left text-sm">
              <thead className="bg-slate-950/50 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-4 py-3">Invariant capability</th><th className="px-4 py-3">AWS implementation</th><th className="px-4 py-3">Why it maps</th></tr></thead>
              <tbody className="divide-y divide-slate-800">
                {content.platformMap.items.map((item, index) => (
                  <tr id={`stage-aws-map-row-${index + 1}`} className="scroll-mt-24" key={item.invariant + "-" + item.implementation}>
                    <td className="px-4 py-4 font-semibold text-white">{item.invariant}</td>
                    <td className="px-4 py-4 text-violet-200">{item.implementation}</td>
                    <td className="px-4 py-4 leading-6 text-slate-300">{item.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-xl border border-violet-400/20 bg-violet-400/5 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-violet-300">AIF-C01 exam lens</p><p className="mt-2 text-sm leading-6 text-slate-200">{content.platformMap.examLens}</p></div>
        </Stage>

        <Stage id="exam" title="Exam" subtitle="Check recall and export the evidence from your practice.">
          <CourseAssessment courseId={courseId} unitId={unit.id} assessment={unit.assessment} loginCallbackUrl={loginCallbackUrl} showReflection={false} certificationKind="capability" evidenceTitle={unit.title} />
          <p className="mt-4 text-xs leading-5 text-slate-500">Passing records the scored checkpoint for {trackSlug}. Your export also includes the practical evidence you collected.</p>
        </Stage>
      </CapabilityModuleProgress>
    </div>
  )
}
