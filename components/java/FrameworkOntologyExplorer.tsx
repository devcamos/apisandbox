"use client"

import { useMemo, useState } from "react"
import { HighlightedCodeBlock } from "@/components/HighlightedCodeBlock"

type FrameworkId = "spring" | "micronaut" | "quarkus"

type Term = {
  id: string
  label: string
  docUrl?: string
  meaning: string
}

type Dependency = {
  id: string
  coord: string
  note?: string
  docUrl?: string
}

type Concept = {
  id: string
  title: string
  summary: string
  terms: Term[]
  sample?: {
    label: string
    code: string
  }
}

type Framework = {
  id: FrameworkId
  name: string
  description: string
  officialDocs: Array<{ label: string; url: string }>
  dependencies: Dependency[]
  concepts: Concept[]
}

function osvQueryUrl(coord: string) {
  // OSV search accepts free-text queries.
  return `https://osv.dev/list?q=${encodeURIComponent(coord)}`
}

function nvdQueryUrl(coord: string) {
  return `https://nvd.nist.gov/vuln/search/results?form_type=Basic&query=${encodeURIComponent(coord)}`
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors",
        active
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
          : "border-slate-700 bg-slate-900/30 text-slate-200 hover:bg-slate-900/50",
      ].join(" ")}
    >
      {children}
    </button>
  )
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

export function FrameworkOntologyExplorer() {
  const frameworks: Framework[] = useMemo(
    () => [
      {
        id: "spring",
        name: "Spring (MVC)",
        description:
          "Annotation-driven wrappers over a servlet engine (Tomcat/Jetty/Netty via adapters), with global exception mapping via ControllerAdvice.",
        officialDocs: [
          { label: "@RestControllerAdvice", url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html" },
          { label: "Controller Advice docs", url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html" },
        ],
        dependencies: [
          {
            id: "spring-web",
            coord: "org.springframework:spring-web",
            note: "Core web annotations, routing, and ControllerAdvice support.",
            docUrl: "https://docs.spring.io/spring-framework/reference/web/webmvc.html",
          },
          {
            id: "jackson",
            coord: "com.fasterxml.jackson.core:jackson-databind",
            note: "JSON bind layer used by Spring’s message converters.",
            docUrl: "https://github.com/FasterXML/jackson",
          },
        ],
        concepts: [
          {
            id: "routing-validation",
            title: "Routing + validation",
            summary:
              "Spring wraps request matching and JSON binding around controller methods, then applies validation on bound DTOs.",
            terms: [
              {
                id: "restcontroller",
                label: "@RestController",
                meaning: "Marks a class as a REST controller; methods produce response bodies by default.",
              },
              {
                id: "requestmapping",
                label: "@RequestMapping / @PostMapping",
                meaning: "Routes HTTP method + path to a handler method (routing wrapper).",
              },
              {
                id: "valid",
                label: "@Valid / @Validated",
                meaning:
                  "Triggers bean validation for request bodies/parameters, returning structured 400 errors when invalid.",
              },
            ],
            sample: {
              label: "Controller + DTO validation",
              code: `@RestController
@RequestMapping("/api/auth")
final class AuthController {
  @PostMapping("/login")
  AuthSession login(@RequestBody @Valid LoginRequest req) { /* ... */ }
}

record LoginRequest(@Email String email, @NotBlank String password) {}`,
            },
          },
          {
            id: "errors",
            title: "Uniform errors",
            summary:
              "Global error mapping is expressed as a policy class that routes exceptions to stable HTTP + JSON envelopes.",
            terms: [
              {
                id: "controlleradvice",
                label: "@ControllerAdvice / @RestControllerAdvice",
                docUrl: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html",
                meaning:
                  "Registers a global wrapper for controller exceptions and binder/validation errors.",
              },
              {
                id: "exceptionhandler",
                label: "@ExceptionHandler",
                meaning: "Routes a specific exception type into a handler method (exception routing).",
              },
              {
                id: "responsestatus",
                label: "@ResponseStatus",
                meaning: "Pins the HTTP status code to keep client behavior predictable.",
              },
            ],
            sample: {
              label: "ControllerAdvice sketch",
              code: `@RestControllerAdvice
final class ApiErrors {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  ErrorEnvelope validation(MethodArgumentNotValidException ex) {
    return new ErrorEnvelope("validation_error", "Invalid request");
  }
}

record ErrorEnvelope(String category, String message) {}`,
            },
          },
        ],
      },
      {
        id: "micronaut",
        name: "Micronaut",
        description:
          "Compile-time DI + AOP wrappers; routing via @Controller and errors via @Error handlers or ExceptionHandler implementations.",
        officialDocs: [
          { label: "@Error annotation", url: "https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Error.html" },
          { label: "Micronaut error handling guide", url: "https://docs.micronaut.io/snapshot/guide/" },
        ],
        dependencies: [
          {
            id: "micronaut-http-server",
            coord: "io.micronaut:micronaut-http-server-netty",
            note: "HTTP server wrapper (Netty) + routing.",
            docUrl: "https://docs.micronaut.io/index.html",
          },
          {
            id: "micronaut-validation",
            coord: "io.micronaut:micronaut-validation",
            note: "Validation advice and interceptors (compile-time oriented).",
            docUrl: "https://docs.micronaut.io/index.html",
          },
        ],
        concepts: [
          {
            id: "routing-validation",
            title: "Routing + validation",
            summary:
              "Micronaut routes via @Controller and applies validation via @Validated (an AOP wrapper) and jakarta.validation annotations.",
            terms: [
              {
                id: "controller",
                label: "@Controller",
                docUrl: "https://docs.micronaut.io/4.8.2/api/io/micronaut/http/annotation/Controller.html",
                meaning: "Marks a class as an HTTP controller with a base URI.",
              },
              {
                id: "body",
                label: "@Body",
                meaning: "Binds the request body into a parameter (JSON binding wrapper).",
              },
              {
                id: "validated",
                label: "@Validated",
                docUrl: "https://docs.micronaut.io/snapshot/api/io/micronaut/validation/package-summary.html",
                meaning: "Validation advice around method invocation (wrapper that enforces constraints).",
              },
            ],
          },
          {
            id: "errors",
            title: "Uniform errors",
            summary:
              "Error wrappers can be declared with @Error (status/exception) or by implementing an ExceptionHandler.",
            terms: [
              {
                id: "error",
                label: "@Error",
                docUrl: "https://docs.micronaut.io/latest/api/io/micronaut/http/annotation/Error.html",
                meaning:
                  "Maps an exception or HTTP status to an error route; can be global or controller-local.",
              },
              {
                id: "exceptionhandler",
                label: "ExceptionHandler<T, HttpResponse<?>>",
                docUrl: "https://docs.micronaut.io/4.10.13/api/io/micronaut/core/exceptions/ExceptionHandler.html",
                meaning: "A generic hook interface for handling exceptions during an HTTP request.",
              },
            ],
          },
        ],
      },
      {
        id: "quarkus",
        name: "Quarkus REST",
        description:
          "JAX-RS style wrappers (Jakarta REST) with ExceptionMapper for uniform errors; optimized runtime with build-time augmentation.",
        officialDocs: [
          { label: "Quarkus REST guide", url: "https://quarkus.io/guides/rest" },
        ],
        dependencies: [
          {
            id: "quarkus-rest",
            coord: "io.quarkus:quarkus-rest",
            note: "Quarkus REST endpoints (formerly RESTEasy Reactive).",
            docUrl: "https://quarkus.io/guides/rest",
          },
          {
            id: "jackson",
            coord: "com.fasterxml.jackson.core:jackson-databind",
            note: "Common JSON binding layer (depending on chosen JSON stack).",
            docUrl: "https://github.com/FasterXML/jackson",
          },
        ],
        concepts: [
          {
            id: "routing-validation",
            title: "Routing + validation",
            summary:
              "Routes are expressed via JAX-RS annotations (Path/HTTP method). Validation uses jakarta.validation constraints on DTOs.",
            terms: [
              { id: "path", label: "@Path", meaning: "Declares the resource path prefix (routing wrapper)." },
              { id: "post", label: "@POST / @GET", meaning: "Binds HTTP method to a handler method." },
              { id: "consumes", label: "@Consumes/@Produces", meaning: "Declares content types and drives binding/serialization." },
            ],
          },
          {
            id: "errors",
            title: "Uniform errors",
            summary:
              "Errors are typically mapped with ExceptionMapper implementations, producing stable HTTP + JSON responses.",
            terms: [
              {
                id: "exceptionmapper",
                label: "ExceptionMapper<T>",
                docUrl: "https://quarkus.io/guides/rest",
                meaning:
                  "JAX-RS extension point that converts exceptions into HTTP responses (global wrapper).",
              },
            ],
          },
        ],
      },
    ],
    [],
  )

  const [frameworkId, setFrameworkId] = useState<FrameworkId>("spring")
  const [openConceptId, setOpenConceptId] = useState<string>("routing-validation")
  const [openTermId, setOpenTermId] = useState<string | null>(null)

  const framework = frameworks.find((f) => f.id === frameworkId) ?? frameworks[0]!
  const concept = framework.concepts.find((c) => c.id === openConceptId) ?? framework.concepts[0]!
  const openTerm = concept.terms.find((t) => t.id === openTermId) ?? null

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
      <h2 className="text-xl font-bold text-white">Framework Filter: Ontology View</h2>
      <p className="mt-2 text-sm text-slate-300">
        Pick a framework to see how the same API concerns are expressed as wrappers, annotations, and
        extension points. Each key term is expandable, and dependencies include CVE lookup links.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {frameworks.map((f) => (
          <Chip
            key={f.id}
            active={f.id === framework.id}
            onClick={() => {
              setFrameworkId(f.id)
              setOpenConceptId(f.concepts[0]?.id ?? "routing-validation")
              setOpenTermId(null)
            }}
          >
            {f.name}
          </Chip>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/30 p-4">
        <div className="text-sm font-semibold text-white">{framework.name}</div>
        <div className="mt-1 text-sm text-slate-300">{framework.description}</div>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-300">
          {framework.officialDocs.map((d) => (
            <span key={d.url}>
              <LinkOut href={d.url}>{d.label}</LinkOut>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {framework.concepts.map((c) => (
          <Chip
            key={c.id}
            active={c.id === concept.id}
            onClick={() => {
              setOpenConceptId(c.id)
              setOpenTermId(null)
            }}
          >
            {c.title}
          </Chip>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/30 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">{concept.title}</div>
            <div className="mt-1 text-sm text-slate-300">{concept.summary}</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {concept.terms.map((t) => (
            <Chip
              key={t.id}
              active={t.id === openTermId}
              onClick={() => setOpenTermId((prev) => (prev === t.id ? null : t.id))}
            >
              <span className="font-mono">{t.label}</span>
            </Chip>
          ))}
        </div>

        {openTerm ? (
          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/40 p-4">
            <div className="text-xs font-semibold tracking-wide text-slate-300/90">Key term</div>
            <div className="mt-1 text-sm font-semibold text-white">{openTerm.label}</div>
            <div className="mt-2 text-sm text-slate-300">{openTerm.meaning}</div>
            {openTerm.docUrl ? (
              <div className="mt-2 text-xs">
                <LinkOut href={openTerm.docUrl}>Official docs</LinkOut>
              </div>
            ) : null}
          </div>
        ) : null}

        {concept.sample ? (
          <details className="mt-4 rounded-xl border border-slate-700 bg-slate-950/40">
            <summary className="cursor-pointer select-none px-4 py-3 text-xs font-semibold text-slate-200 hover:text-white">
              Show sample: {concept.sample.label}
            </summary>
            <div className="px-4 pb-4">
              <HighlightedCodeBlock language="java" code={concept.sample.code} />
            </div>
          </details>
        ) : null}
      </div>

      <details className="mt-4 rounded-xl border border-slate-700 bg-slate-900/30">
        <summary className="cursor-pointer select-none px-4 py-3 text-xs font-semibold text-slate-200 hover:text-white">
          Dependencies + CVE lookups
        </summary>
        <div className="px-4 pb-4">
          <div className="mt-2 text-sm text-slate-300">
            These are typical coordinates for the framework layer. Use them to look up advisories (CVEs)
            and keep transitive dependencies healthy.
          </div>
          <div className="mt-3 grid gap-3">
            {framework.dependencies.map((d) => (
              <div key={d.id} className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
                <div className="text-sm font-semibold text-white">{d.coord}</div>
                {d.note ? <div className="mt-1 text-sm text-slate-300">{d.note}</div> : null}
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-300">
                  {d.docUrl ? (
                    <LinkOut href={d.docUrl}>Docs</LinkOut>
                  ) : (
                    <span className="text-slate-500">Docs</span>
                  )}
                  <LinkOut href={osvQueryUrl(d.coord)}>OSV</LinkOut>
                  <LinkOut href={nvdQueryUrl(d.coord)}>NVD</LinkOut>
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  )
}

