import type React from "react"

type Dep = {
  kind: "Spring" | "Third-party"
  name: string
  coord: string
  purpose: string
  docsUrl: string
}

function LinkOut({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
    >
      {children}
    </a>
  )
}

function osvQueryUrl(coord: string) {
  return `https://osv.dev/list?q=${encodeURIComponent(coord)}`
}

function nvdQueryUrl(coord: string) {
  return `https://nvd.nist.gov/vuln/search/results?form_type=Basic&query=${encodeURIComponent(coord)}`
}

function ghaQueryUrl(coord: string) {
  return `https://github.com/advisories?query=${encodeURIComponent(coord)}`
}

export function DependencyRadar() {
  const deps: Dep[] = [
    {
      kind: "Spring",
      name: "Spring Web (MVC)",
      coord: "org.springframework:spring-web",
      purpose: "Routing, controller annotations, request binding, and core web primitives.",
      docsUrl: "https://docs.spring.io/spring-framework/reference/web/webmvc.html",
    },
    {
      kind: "Third-party",
      name: "Jackson (databind)",
      coord: "com.fasterxml.jackson.core:jackson-databind",
      purpose: "JSON bytes ⇄ typed objects (DTO binding).",
      docsUrl: "https://github.com/FasterXML/jackson",
    },
    {
      kind: "Third-party",
      name: "OkHttp (optional)",
      coord: "com.squareup.okhttp3:okhttp",
      purpose: "HTTP client with a strong interceptor model and connection pooling.",
      docsUrl: "https://square.github.io/okhttp/",
    },
    {
      kind: "Third-party",
      name: "Resilience4j",
      coord: "io.github.resilience4j:resilience4j-all",
      purpose: "Timeouts, retries, rate limiters, circuit breakers (resilience wrappers).",
      docsUrl: "https://resilience4j.readme.io/",
    },
    {
      kind: "Third-party",
      name: "JUnit 5",
      coord: "org.junit.jupiter:junit-jupiter",
      purpose: "Test runner + assertions.",
      docsUrl: "https://junit.org/junit5/",
    },
    {
      kind: "Third-party",
      name: "Mockito",
      coord: "org.mockito:mockito-core",
      purpose: "Mocking and stubbing for unit tests.",
      docsUrl: "https://site.mockito.org/",
    },
    {
      kind: "Third-party",
      name: "Testcontainers",
      coord: "org.testcontainers:testcontainers",
      purpose: "Integration tests with real infra (Postgres, Redis, etc.).",
      docsUrl: "https://www.testcontainers.org/",
    },
  ]

  return (
    <div id="dependency-radar" className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/30 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">Dependency + Security Radar</div>
          <div className="mt-1 text-sm text-slate-300">
            A principal-level habit: treat dependencies as part of your system design. You choose them,
            you monitor them, and you retire them.
          </div>
        </div>
        <div className="hidden sm:flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/30 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
            Docs
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/30 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
            CVEs
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/30 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
            Transitives
          </span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-xs text-slate-300">
          <thead>
            <tr className="text-left text-slate-300">
              <th className="py-2 pr-6 font-semibold">Kind</th>
              <th className="py-2 pr-6 font-semibold">Dependency</th>
              <th className="py-2 pr-6 font-semibold">Purpose</th>
              <th className="py-2 pr-2 font-semibold">Security links</th>
            </tr>
          </thead>
          <tbody>
            {deps.map((d) => (
              <tr key={d.coord} className="border-t border-slate-800">
                <td className="py-2 pr-6">
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                      d.kind === "Spring"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-slate-600/60 bg-slate-900/40 text-slate-200",
                    ].join(" ")}
                  >
                    {d.kind}
                  </span>
                </td>
                <td className="py-2 pr-6">
                  <div className="font-semibold text-slate-200">
                    <LinkOut href={d.docsUrl}>{d.name}</LinkOut>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-200">{d.coord}</div>
                </td>
                <td className="py-2 pr-6">{d.purpose}</td>
                <td className="py-2 pr-2">
                  <div className="flex flex-wrap gap-2">
                    <LinkOut href={osvQueryUrl(d.coord)}>OSV</LinkOut>
                    <LinkOut href={ghaQueryUrl(d.coord)}>GitHub</LinkOut>
                    <LinkOut href={nvdQueryUrl(d.coord)}>NVD</LinkOut>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="mt-4 rounded-xl border border-slate-700 bg-slate-950/40">
        <summary className="cursor-pointer select-none px-4 py-3 text-xs font-semibold text-slate-200 hover:text-white">
          Principal checklist (what “good” looks like)
        </summary>
        <div className="px-4 pb-4">
          <ul className="mt-2 space-y-1 text-sm text-slate-300 list-disc pl-5">
            <li>Lock versions (and update intentionally) instead of floating.</li>
            <li>Know your transitives: the vuln is often not in the library you imported.</li>
            <li>Track exposure: “present” does not always mean “reachable”.</li>
            <li>Prefer fewer libraries with strong stewardship over many small ones.</li>
            <li>Plan removals: every dependency should have an exit strategy.</li>
          </ul>
        </div>
      </details>
    </div>
  )
}

