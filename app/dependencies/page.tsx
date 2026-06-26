import { Layers3, Network, PackageCheck } from "lucide-react"
import { getDependencyIntegrations, groupDependencyIntegrationsByType } from "@/lib/dependency-integrations"

const typeLabels: Record<string, string> = {
  framework: "Frameworks",
  payment: "Payments",
  database: "Data",
  auth: "Identity",
  testing: "Testing",
  quality: "Quality",
  ui: "Interface",
  deployment: "Deployment",
}

export default function DependencyIntegrationsPage() {
  const integrations = getDependencyIntegrations()
  const grouped = groupDependencyIntegrationsByType()

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-200">
            <Network className="h-4 w-4" />
            Dependency Integration
          </div>
          <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Tools mapped to app behavior</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            A learning map of the dependencies, frameworks, and platform tools used by API Sandbox,
            grouped by what they power in the product.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="text-2xl font-semibold text-cyan-200">{integrations.length}</div>
              <div className="text-sm text-slate-400">tracked integrations</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="text-2xl font-semibold text-cyan-200">
                {new Set(integrations.flatMap((item) => item.packageNames)).size}
              </div>
              <div className="text-sm text-slate-400">packages mapped</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="text-2xl font-semibold text-cyan-200">
                {new Set(integrations.flatMap((item) => item.learningAreas)).size}
              </div>
              <div className="text-sm text-slate-400">learning areas</div>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {Object.entries(grouped).map(([type, items]) => (
            <section key={type}>
              <div className="mb-3 flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-cyan-300" />
                <h2 className="text-xl font-semibold">{typeLabels[type] ?? type}</h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {items.map((integration) => (
                  <article key={integration.id} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{integration.name}</h3>
                        <p className="mt-1 text-sm text-slate-300">{integration.purpose}</p>
                      </div>
                      <div className="inline-flex shrink-0 items-center gap-1 rounded border border-slate-700 px-2 py-1 text-xs text-slate-300">
                        <PackageCheck className="h-3.5 w-3.5 text-cyan-300" />
                        {integration.type}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <DetailList title="Packages" items={integration.packageNames} />
                      <DetailList title="Environment" items={integration.envVars.length ? integration.envVars : ["None"]} />
                      <DetailList title="Routes" items={integration.routes} />
                      <DetailList title="Components" items={integration.components} />
                      <DetailList title="Functions" items={integration.serviceFunctions.length ? integration.serviceFunctions : ["None"]} />
                      <DetailList title="Prisma models" items={integration.prismaModels.length ? integration.prismaModels : ["None"]} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {integration.learningAreas.map((area) => (
                        <span key={area} className="rounded bg-cyan-500/10 px-2 py-1 text-xs text-cyan-100">
                          {area}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

function DetailList({ title, items }: Readonly<{ title: string; items: string[] }>) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
