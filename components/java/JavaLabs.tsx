import type React from "react"
import { HighlightedCodeBlock } from "@/components/HighlightedCodeBlock"

function Lab({
  title,
  level,
  goal,
  children,
}: {
  title: string
  level: "Foundation" | "Intermediate" | "Expert"
  goal: string
  children: React.ReactNode
}) {
  const levelStyle =
    level === "Foundation"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : level === "Intermediate"
        ? "border-sky-500/30 bg-sky-500/10 text-sky-200"
        : "border-amber-500/30 bg-amber-500/10 text-amber-200"

  return (
    <details className="rounded-2xl border border-slate-700 bg-slate-950/40">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white">
        <span
          className={[
            "mr-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold align-middle",
            levelStyle,
          ].join(" ")}
        >
          {level}
        </span>
        {title}
      </summary>
      <div className="px-4 pb-4">
        <div className="mt-2 text-sm text-slate-300">
          <span className="font-semibold text-slate-200">Goal:</span> {goal}
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </details>
  )
}

export function JavaLabs() {
  return (
    <div id="labs" className="mt-10 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
      <h2 className="text-xl font-bold text-white">Labs (hands-on)</h2>
      <p className="mt-2 text-sm text-slate-300">
        These are small, practical “do the thing” exercises. The point is not the code style; it’s
        learning where APIs fail, how wrappers behave, and what production-ready clients/services must
        guarantee.
      </p>

      <div className="mt-4 grid gap-4">
        <Lab
          title="Lab 1: Session auth with cookies (login → me)"
          level="Foundation"
          goal="Understand cookie-based auth, how session state is carried, and what the server expects on subsequent requests."
        >
          <div className="text-sm text-slate-300">
            Try the flow against <span className="font-mono text-slate-200">http://localhost:4000</span>{" "}
            and confirm that the second request succeeds only because the cookie jar is attached.
          </div>
          <HighlightedCodeBlock
            label="Cookie-backed client sketch"
            language="java"
            code={`import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public final class Lab1Cookies {
  static HttpClient http(String baseUrl) {
    var cookies = new CookieManager();
    cookies.setCookiePolicy(CookiePolicy.ACCEPT_ALL);
    return HttpClient.newBuilder()
      .cookieHandler(cookies)
      .connectTimeout(Duration.ofSeconds(5))
      .build();
  }

  static void login(HttpClient http, String baseUrl, String email, String password) throws Exception {
    var body = ("{\\"email\\":\\"%s\\",\\"password\\":\\"%s\\"}").formatted(email, password);
    var req = HttpRequest.newBuilder()
      .uri(URI.create(baseUrl + "/api/auth/login"))
      .timeout(Duration.ofSeconds(10))
      .header("Content-Type", "application/json")
      .POST(HttpRequest.BodyPublishers.ofString(body))
      .build();
    var res = http.send(req, HttpResponse.BodyHandlers.ofString());
    System.out.println("login status=" + res.statusCode());
  }

  static void me(HttpClient http, String baseUrl) throws Exception {
    var req = HttpRequest.newBuilder()
      .uri(URI.create(baseUrl + "/api/auth/me"))
      .timeout(Duration.ofSeconds(10))
      .GET()
      .build();
    var res = http.send(req, HttpResponse.BodyHandlers.ofString());
    System.out.println("me status=" + res.statusCode());
    System.out.println(res.body());
  }

  public static void main(String[] args) throws Exception {
    var baseUrl = "http://localhost:4000";
    var http = http(baseUrl);
    login(http, baseUrl, "demo@example.com", "password");
    me(http, baseUrl);
  }
}`}
          />
          <div className="mt-3 text-sm text-slate-300">
            Expected result: <span className="font-mono text-slate-200">login status=200</span>, then{" "}
            <span className="font-mono text-slate-200">me status=200</span> with a user JSON body.
          </div>
        </Lab>

        <Lab
          title="Lab 2: Timeouts + retries with backoff (when it is safe)"
          level="Intermediate"
          goal="Learn what to retry, how to back off, and how to avoid multiplying load during incidents."
        >
          <div className="text-sm text-slate-300">
            Production rule of thumb: retry only idempotent operations (GET/HEAD, or POSTs with
            idempotency keys). If you retry “unsafe” requests you can create double-charges, duplicate
            writes, and subtle bugs.
          </div>
          <HighlightedCodeBlock
            label="Retry wrapper sketch (exponential backoff + jitter)"
            language="java"
            code={`import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.ThreadLocalRandom;

final class RetryPolicy {
  static boolean isRetryableStatus(int status) {
    return status == 429 || status == 500 || status == 502 || status == 503 || status == 504;
  }

  static Duration backoff(int attempt) {
    // attempt: 1..N
    long baseMs = 200L * (1L << (attempt - 1)); // 200, 400, 800...
    long jitter = ThreadLocalRandom.current().nextLong(0, 100);
    return Duration.ofMillis(Math.min(2_000, baseMs + jitter));
  }

  static <T> HttpResponse<T> withRetries(
      java.util.concurrent.Callable<HttpResponse<T>> call,
      int maxAttempts
  ) throws Exception {
    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        var res = call.call();
        if (!isRetryableStatus(res.statusCode()) || attempt == maxAttempts) return res;
      } catch (java.net.http.HttpTimeoutException timeout) {
        if (attempt == maxAttempts) throw timeout;
      } catch (java.io.IOException network) {
        if (attempt == maxAttempts) throw network;
      }

      Thread.sleep(backoff(attempt).toMillis());
    }
    throw new IllegalStateException("unreachable");
  }
}`}
          />
          <div className="mt-3 text-sm text-slate-300">
            Expert check: instrument retries (attempt count + total delay) so you can see when clients are
            “self-DDoSing” your API during partial outages.
          </div>
        </Lab>

        <Lab
          title="Lab 3: Correlation IDs (trace a request across hops)"
          level="Expert"
          goal="Make debugging possible: propagate a request ID, log it consistently, and return it to clients."
        >
          <div className="text-sm text-slate-300">
            Correlation IDs are the simplest version of distributed tracing. Even without full tracing,
            a request ID can cut incident time dramatically.
          </div>
          <HighlightedCodeBlock
            label="Client: send and read X-Request-Id"
            language="java"
            code={`import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.UUID;

public final class Lab3RequestId {
  public static void main(String[] args) throws Exception {
    var baseUrl = "http://localhost:4000";
    var requestId = UUID.randomUUID().toString();

    var http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    var req = HttpRequest.newBuilder()
      .uri(URI.create(baseUrl + "/api/auth/me"))
      .timeout(Duration.ofSeconds(10))
      .header("X-Request-Id", requestId)
      .GET()
      .build();

    var res = http.send(req, HttpResponse.BodyHandlers.ofString());
    System.out.println("client sent X-Request-Id=" + requestId);
    System.out.println("server echoed X-Request-Id=" + res.headers().firstValue("X-Request-Id").orElse("<none>"));
  }
}`}
          />
          <div className="mt-3 text-sm text-slate-300">
            Backend follow-up: add a filter that sets/echoes the header and writes it into log context (MDC),
            then search logs by that ID.
          </div>
        </Lab>
      </div>
    </div>
  )
}
