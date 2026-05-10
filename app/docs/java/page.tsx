import Link from "next/link"
import { HighlightedCodeBlock } from "@/components/HighlightedCodeBlock"

export default function JavaTrackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-semibold">
            Language Track
            <span className="text-emerald-300/80">Java</span>
          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-white">
            Master APIs with Java, using API Sandbox
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            The app stays the same. You use Java to consume and re-implement the same real-world API
            patterns: auth, error handling, retries, rate limits, webhooks, persistence, and testing.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-5">
              <div className="text-sm font-semibold text-white">Track A: Java API Client</div>
              <div className="mt-2 text-sm text-slate-300">
                Learn networking, JSON, cookies/sessions, timeouts, retries, typed DTOs, and tests by
                calling the Sandbox endpoints.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-5">
              <div className="text-sm font-semibold text-white">Track B: Java Backend</div>
              <div className="mt-2 text-sm text-slate-300">
                Rebuild 2 to 3 endpoints in Spring Boot (or Micronaut/Quarkus) to master controllers,
                validation, auth, persistence, and production readiness.
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
            <h2 className="text-xl font-bold text-white">Client vs Backend: The Wrapper Stack</h2>
            <p className="mt-2 text-sm text-slate-300">
              The “quantum leap” is realizing frameworks don’t replace HTTP. They wrap it. They give you
              safer defaults and consistent patterns for the same low-level primitives: sockets, TLS,
              headers, cookies, JSON bytes, and timeouts.
            </p>

            <div className="mt-5 grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/30 p-5">
                <div className="text-sm font-semibold text-white">Client (you consume APIs)</div>
                <div className="mt-3 grid gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">What you write</div>
                    <div className="mt-1 text-sm text-slate-300">
                      DTOs, request builders, auth (cookie/bearer), retries, backoff, parsing errors into
                      typed results.
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Wrapper layers</div>
                    <pre className="mt-2 bg-slate-950/70 border border-slate-800 rounded-xl p-3 overflow-x-auto text-xs text-slate-200 font-mono leading-relaxed whitespace-pre">
{`Your code
  -> (JSON serialize / validate)
  -> HttpClient (or OkHttp)
  -> Connection pool + DNS
  -> TLS
  -> TCP sockets
  -> Remote server`}
                    </pre>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Framework “magic” is mostly</div>
                    <div className="mt-1 text-sm text-slate-300">
                      interceptors/middleware, JSON mappers, retry policies, and consistent error handling.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/30 p-5">
                <div className="text-sm font-semibold text-white">Backend (you expose APIs)</div>
                <div className="mt-3 grid gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">What you write</div>
                    <div className="mt-1 text-sm text-slate-300">
                      controllers/handlers, validation, auth filters, service layer, DB transactions,
                      webhook verification, and observability.
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Wrapper layers</div>
                    <pre className="mt-2 bg-slate-950/70 border border-slate-800 rounded-xl p-3 overflow-x-auto text-xs text-slate-200 font-mono leading-relaxed whitespace-pre">
{`Internet
  -> TCP + TLS termination
  -> HTTP server (Tomcat/Jetty/Netty)
  -> Framework routing (Spring MVC)
  -> Filters/interceptors (auth, logs)
  -> JSON bind (Jackson)
  -> Your controller/service code`}
                    </pre>
                    <div className="mt-3 grid gap-2 text-sm text-slate-300">
                      <div>
                        <span className="font-semibold text-slate-200">TCP + TLS termination:</span>{" "}
                        accept connections, negotiate encryption, and turn raw bytes into secure streams.
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200">HTTP server:</span> parse HTTP
                        (headers, body), manage keep-alive, request threads/event loop, and backpressure.
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200">Framework routing:</span> match
                        method/path, bind parameters, and choose the right controller handler.
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200">Filters/interceptors:</span>{" "}
                        cross-cutting wrappers for auth, correlation IDs, logging, rate limits, and
                        uniform error mapping.
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200">JSON bind:</span> map bytes to
                        typed DTOs (and back), validate shapes, and surface parse errors consistently.
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200">Controller/service code:</span>{" "}
                        your business logic boundary, transactions, idempotency, and side effects (email,
                        webhooks, queues).
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Framework “magic” is mostly</div>
                    <div className="mt-1 text-sm text-slate-300">
                      routing + lifecycle, validation, dependency injection, and uniform error responses.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-700/70 bg-slate-900/30 p-5">
              <div className="text-sm font-semibold text-white">Mapping: same concern, different wrapper</div>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-300">
                      <th className="py-2 pr-6 font-semibold">Concern</th>
                      <th className="py-2 pr-6 font-semibold">Client (Java)</th>
                      <th className="py-2 pr-6 font-semibold">Backend (Spring)</th>
                      <th className="py-2 pr-2 font-semibold">Under the hood</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr className="border-t border-slate-800">
                      <td className="py-2 pr-6">Auth</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">CookieManager / Authorization</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">Filter + SecurityContext</td>
                      <td className="py-2 pr-2">headers/cookies + token parsing</td>
                    </tr>
                    <tr className="border-t border-slate-800">
                      <td className="py-2 pr-6">Validation</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">DTO checks before send</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">@Valid + bean validation</td>
                      <td className="py-2 pr-2">guardrails around unsafe inputs</td>
                    </tr>
                    <tr className="border-t border-slate-800">
                      <td className="py-2 pr-6">Retries/timeouts</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">HttpRequest timeout + retry policy</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">Resilience4j / gateway policy</td>
                      <td className="py-2 pr-2">network failures + latency budgets</td>
                    </tr>
                    <tr className="border-t border-slate-800">
                      <td className="py-2 pr-6">JSON</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">ObjectMapper serialize/deserialize</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">HttpMessageConverters</td>
                      <td className="py-2 pr-2">bytes ⇄ objects</td>
                    </tr>
                    <tr className="border-t border-slate-800">
                      <td className="py-2 pr-6">Errors</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">status + body → typed error</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">@ControllerAdvice</td>
                      <td className="py-2 pr-2">consistent error envelope</td>
                    </tr>
                    <tr className="border-t border-slate-800">
                      <td className="py-2 pr-6">Observability</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">request IDs + logs</td>
                      <td className="py-2 pr-6 font-mono text-xs text-slate-200">filters + MDC + tracing</td>
                      <td className="py-2 pr-2">correlation across hops</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
              <h2 className="text-xl font-bold text-white">What to Master (Java)</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc pl-5">
                <li>HTTP semantics: status codes, headers, content types, idempotency.</li>
                <li>Resilience: timeouts, retries with backoff, circuit breakers.</li>
                <li>Auth: cookies vs tokens, session renewal, safe redirects.</li>
                <li>Persistence: Postgres + migrations + transactional boundaries.</li>
                <li>Observability: structured logs, correlation IDs, metrics.</li>
                <li>Testing: unit + integration (Testcontainers) + contract tests.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
              <h2 className="text-xl font-bold text-white">Suggested Tooling</h2>
              <div className="mt-3 space-y-5 text-sm text-slate-300">
                <div>
                  <div className="text-sm font-semibold text-white">Highlighting</div>
                  <ul className="mt-2 space-y-2 list-disc pl-5">
                    <li>
                      In-app: this page uses the built-in{" "}
                      <span className="font-mono text-slate-200">HighlightedCodeBlock</span> component
                      to highlight Java keywords and class-like identifiers.
                    </li>
                    <li>
                      In Java projects: use IntelliJ IDEA’s inspections and formatter, and enable
                      “unused imports/variables” warnings early.
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-white">Core Dependencies (linked)</div>
                  <ul className="mt-2 space-y-2 list-disc pl-5">
                    <li>
                      JSON:{" "}
                      <a
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
                        href="https://github.com/FasterXML/jackson"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Jackson
                      </a>{" "}
                      (<span className="font-mono text-slate-200">com.fasterxml.jackson.core:jackson-databind</span>)
                    </li>
                    <li>
                      HTTP (optional):{" "}
                      <a
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
                        href="https://square.github.io/okhttp/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        OkHttp
                      </a>{" "}
                      (<span className="font-mono text-slate-200">com.squareup.okhttp3:okhttp</span>)
                    </li>
                    <li>
                      Resilience:{" "}
                      <a
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
                        href="https://resilience4j.readme.io/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Resilience4j
                      </a>{" "}
                      (timeouts, retries, circuit breakers)
                    </li>
                    <li>
                      Tests:{" "}
                      <a
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
                        href="https://junit.org/junit5/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        JUnit 5
                      </a>
                      ,{" "}
                      <a
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
                        href="https://site.mockito.org/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Mockito
                      </a>
                      ,{" "}
                      <a
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
                        href="https://www.testcontainers.org/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Testcontainers
                      </a>
                    </li>
                  </ul>

                  <details className="mt-3 rounded-xl border border-slate-700 bg-slate-900/30">
                    <summary className="cursor-pointer select-none px-4 py-3 text-xs font-semibold text-slate-200 hover:text-white">
                      Show Gradle dependency snippet
                    </summary>
                    <div className="px-4 pb-4">
                      <pre className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 overflow-x-auto text-xs text-slate-200 font-mono leading-relaxed whitespace-pre">
{`dependencies {
  implementation("com.fasterxml.jackson.core:jackson-databind:<version>")
  testImplementation("org.junit.jupiter:junit-jupiter:<version>")
  testImplementation("org.mockito:mockito-core:<version>")
  testImplementation("org.testcontainers:junit-jupiter:<version>")
  testImplementation("org.testcontainers:postgresql:<version>")
}`}
                      </pre>
                    </div>
                  </details>
                </div>

                <div>
                  <div className="text-sm font-semibold text-white">Security: CVEs</div>
                  <ul className="mt-2 space-y-2 list-disc pl-5">
                    <li>
                      Track known vulnerabilities (CVEs) in your dependency tree, including transitive
                      dependencies.
                    </li>
                    <li>
                      Sources:{" "}
                      <a
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
                        href="https://nvd.nist.gov/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        NVD
                      </a>
                      ,{" "}
                      <a
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
                        href="https://osv.dev/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        OSV
                      </a>
                      ,{" "}
                      <a
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
                        href="https://github.com/advisories"
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub Advisory Database
                      </a>
                      .
                    </li>
                    <li>
                      Scanners:{" "}
                      <a
                        className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
                        href="https://owasp.org/www-project-dependency-check/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        OWASP Dependency-Check
                      </a>{" "}
                      (great for Java), plus automated update PRs (Dependabot/Snyk).
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
            <h2 className="text-xl font-bold text-white">Pareto: Java Features APIs Use Most</h2>
            <p className="mt-2 text-sm text-slate-300">
              If you want maximum API-engineering payoff quickly, focus on the few Java features that
              show up everywhere in production services and clients.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-300">
                    <th className="py-2 pr-6 font-semibold">Java feature</th>
                    <th className="py-2 pr-6 font-semibold">How APIs use it</th>
                    <th className="py-2 pr-2 font-semibold">Why it matters</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-t border-slate-800">
                    <td className="py-2 pr-6 font-mono text-xs text-emerald-200">records + strong typing</td>
                    <td className="py-2 pr-6">DTOs for request/response bodies; typed errors</td>
                    <td className="py-2 pr-2">removes “stringly typed” bugs; makes refactors safe</td>
                  </tr>
                  <tr className="border-t border-slate-800">
                    <td className="py-2 pr-6 font-mono text-xs text-emerald-200">generics</td>
                    <td className="py-2 pr-6">typed wrappers: ApiResult&lt;T&gt;, Page&lt;T&gt;, Retry&lt;T&gt;</td>
                    <td className="py-2 pr-2">reusable patterns without losing type safety</td>
                  </tr>
                  <tr className="border-t border-slate-800">
                    <td className="py-2 pr-6 font-mono text-xs text-emerald-200">annotations</td>
                    <td className="py-2 pr-6">Spring controllers, validation, injection, tracing hooks</td>
                    <td className="py-2 pr-2">declarative “wrappers” around HTTP and lifecycle</td>
                  </tr>
                  <tr className="border-t border-slate-800">
                    <td className="py-2 pr-6 font-mono text-xs text-emerald-200">exceptions (disciplined)</td>
                    <td className="py-2 pr-6">translate failures into a consistent error envelope</td>
                    <td className="py-2 pr-2">predictable behavior under failure</td>
                  </tr>
                  <tr className="border-t border-slate-800">
                    <td className="py-2 pr-6 font-mono text-xs text-emerald-200">concurrency</td>
                    <td className="py-2 pr-6">parallel calls, timeouts, backpressure, background work</td>
                    <td className="py-2 pr-2">latency and throughput are usually the real product</td>
                  </tr>
                  <tr className="border-t border-slate-800">
                    <td className="py-2 pr-6 font-mono text-xs text-emerald-200">java.time</td>
                    <td className="py-2 pr-6">token expiry, rate limit windows, audit trails</td>
                    <td className="py-2 pr-2">time bugs are expensive; use Instant/Duration/ZonedDateTime</td>
                  </tr>
                  <tr className="border-t border-slate-800">
                    <td className="py-2 pr-6 font-mono text-xs text-emerald-200">HttpClient + interceptors</td>
                    <td className="py-2 pr-6">cookies, auth headers, retries, logging correlation IDs</td>
                    <td className="py-2 pr-2">this is where reliability and security are enforced</td>
                  </tr>
                  <tr className="border-t border-slate-800">
                    <td className="py-2 pr-6 font-mono text-xs text-emerald-200">tests (JUnit/Mockito)</td>
                    <td className="py-2 pr-6">unit tests for edge cases; integration tests for real IO</td>
                    <td className="py-2 pr-2">prevents regressions; increases change velocity</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <details className="mt-4 rounded-xl border border-slate-700 bg-slate-900/30">
              <summary className="cursor-pointer select-none px-4 py-3 text-xs font-semibold text-slate-200 hover:text-white">
                Show a small “API result wrapper” example (records + generics)
              </summary>
              <div className="px-4 pb-4">
                <pre className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 overflow-x-auto text-xs text-slate-200 font-mono leading-relaxed whitespace-pre">
{`// A common API pattern: success-or-error without throwing everywhere.
public sealed interface ApiResult<T> permits ApiResult.Ok, ApiResult.Err {
  record Ok<T>(T value) implements ApiResult<T> {}
  record Err<T>(int status, String message) implements ApiResult<T> {}
}

public record LoginRequest(String email, String password) {}
public record MeResponse(String id, String email, String name) {}
`}
                </pre>
              </div>
            </details>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
            <h2 className="text-xl font-bold text-white">Quick Start (Client)</h2>
            <p className="mt-2 text-sm text-slate-300">
              The Sandbox exposes simple auth endpoints you can hit from Java:
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1 text-xs">
                <span className="font-mono text-emerald-300">POST</span>
                <span className="font-mono text-slate-200">/api/auth/login</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1 text-xs">
                <span className="font-mono text-sky-300">GET</span>
                <span className="font-mono text-slate-200">/api/auth/me</span>
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-slate-700/80 bg-slate-900/30 p-4">
              <div className="text-sm font-semibold text-white">What’s happening in the code</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-300 list-disc pl-5">
                <li>
                  A <span className="font-mono text-slate-200">CookieManager</span> is attached to{" "}
                  <span className="font-mono text-slate-200">HttpClient</span> so cookies from the
                  login response are stored and automatically sent on later requests.
                </li>
                <li>
                  <span className="font-mono text-slate-200">login()</span> POSTs JSON to{" "}
                  <span className="font-mono text-slate-200">/api/auth/login</span>. The server sets an
                  httpOnly cookie called <span className="font-mono text-slate-200">auth_token</span>.
                </li>
                <li>
                  <span className="font-mono text-slate-200">me()</span> GETs{" "}
                  <span className="font-mono text-slate-200">/api/auth/me</span>. Because the cookie is
                  attached, the API can authenticate you and return the current user.
                </li>
              </ul>
            </div>

            <details className="mt-5 rounded-xl border border-slate-700 bg-slate-950/40">
              <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white">
                Show Java client code (HttpClient + cookies)
                <span className="ml-2 text-xs font-normal text-slate-400">
                  (click to expand)
                </span>
              </summary>
              <div className="px-4 pb-4">
                <HighlightedCodeBlock
                  code={`import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class ApiSandboxClient {
  private final HttpClient http;
  private final String baseUrl;

  public ApiSandboxClient(String baseUrl) {
    var cookies = new CookieManager();
    cookies.setCookiePolicy(CookiePolicy.ACCEPT_ALL);
    this.http = HttpClient.newBuilder()
      .cookieHandler(cookies)
      .connectTimeout(Duration.ofSeconds(5))
      .build();
    this.baseUrl = baseUrl;
  }

  public void login(String email, String password) throws Exception {
    var body = """
      {"email":"%s","password":"%s"}
      """.formatted(email, password);

    var req = HttpRequest.newBuilder()
      .uri(URI.create(baseUrl + "/api/auth/login"))
      .timeout(Duration.ofSeconds(10))
      .header("Content-Type", "application/json")
      .POST(HttpRequest.BodyPublishers.ofString(body))
      .build();

    var res = http.send(req, HttpResponse.BodyHandlers.ofString());
    if (res.statusCode() >= 400) {
      throw new RuntimeException("Login failed: " + res.statusCode() + " " + res.body());
    }
  }

  public String me() throws Exception {
    var req = HttpRequest.newBuilder()
      .uri(URI.create(baseUrl + "/api/auth/me"))
      .timeout(Duration.ofSeconds(10))
      .GET()
      .build();

    var res = http.send(req, HttpResponse.BodyHandlers.ofString());
    if (res.statusCode() >= 400) {
      throw new RuntimeException("Me failed: " + res.statusCode() + " " + res.body());
    }
    return res.body();
  }
}`}
                />
              </div>
            </details>

            <div className="mt-4 text-sm text-slate-300">
              Tip: when running locally, your base URL is typically{" "}
              <span className="font-mono text-slate-200">http://localhost:4000</span>.
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
            <h2 className="text-xl font-bold text-white">Next Steps</h2>
            <div className="mt-2 text-sm text-slate-300">
              If you want, we can add a dedicated Java starter under this repo (for example,
              <span className="ml-2 font-mono text-slate-200">/tracks/java-client</span>) and wire it
              into CI so learners can run the Java tests against the local Sandbox.
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/docs/architecture"
                className="px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-200 hover:bg-slate-900 transition-colors text-sm"
              >
                View Architecture
              </Link>
              <Link
                href="/start"
                className="px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/20 transition-colors text-sm"
              >
                Back to Start
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
