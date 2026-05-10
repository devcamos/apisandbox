import Link from "next/link"

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="mt-3">
      {label ? (
        <div className="text-xs font-semibold tracking-wide text-slate-300/90 mb-2">{label}</div>
      ) : null}
      <pre className="bg-slate-950/80 border border-slate-700 rounded-xl p-4 overflow-x-auto text-xs text-slate-200 font-mono leading-relaxed whitespace-pre">
        {code}
      </pre>
    </div>
  )
}

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

          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
            <h2 className="text-xl font-bold text-white">Quick Start (Client)</h2>
            <p className="mt-2 text-sm text-slate-300">
              The Sandbox exposes simple auth endpoints you can hit from Java:
              <span className="ml-2 font-mono text-slate-200">POST /api/auth/login</span>,
              <span className="ml-2 font-mono text-slate-200">GET /api/auth/me</span>.
            </p>

            <CodeBlock
              label="Java 21 HttpClient with cookies (session-style auth)"
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

            <div className="mt-4 text-sm text-slate-300">
              Tip: when running locally, your base URL is typically{" "}
              <span className="font-mono text-slate-200">http://localhost:4000</span>.
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
              <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc pl-5">
                <li>Build: Gradle (or Maven) with Java 21.</li>
                <li>JSON: Jackson (databind).</li>
                <li>HTTP: built-in HttpClient (or OkHttp if you prefer).</li>
                <li>Backend: Spring Boot (MVC), Validation, Security (optional).</li>
                <li>DB: Flyway + JPA (or jOOQ).</li>
                <li>Tests: JUnit 5 + Mockito + Testcontainers.</li>
              </ul>
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

