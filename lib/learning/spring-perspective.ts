import {
  Code,
  Database,
  GitBranch,
  RefreshCw,
  Server,
  Zap,
  type LucideIcon,
} from "lucide-react"

export interface SpringTermInsight {
  title: string
  body: string
}

export interface SpringTermItem {
  id: string
  term: string
  desc: string
  sampleLabel: string
  code: string
  insights: [SpringTermInsight, SpringTermInsight, SpringTermInsight]
}

export interface SpringTab {
  id: string
  label: string
  icon: LucideIcon
  items: SpringTermItem[]
}

export const springTabs: SpringTab[] = [
  {
    id: "async",
    label: "Async",
    icon: RefreshCw,
    items: [
      {
        id: "async-annotation",
        term: "@Async",
        desc: "Marks a method to run on a separate thread pool, returning CompletableFuture<T>.",
        sampleLabel: "Async service boundary",
        code: `@EnableAsync
@Configuration
class AsyncConfig {}

@Service
final class ReportService {
  @Async
  CompletableFuture<Report> generate(UUID reportId) {
    return CompletableFuture.completedFuture(loadReport(reportId));
  }
}`,
        insights: [
          {
            title: "Purpose",
            body: "Use @Async at a clear service boundary where the caller can tolerate eventual completion rather than an immediate response.",
          },
          {
            title: "Best practice",
            body: "Back @Async with an explicit executor configuration so queue size, pool size, and rejection behavior are deliberate rather than framework defaults.",
          },
          {
            title: "Gotcha",
            body: "Self-invocation does not pass through Spring’s proxy, so calling an @Async method from another method on the same class will run synchronously.",
          },
        ],
      },
      {
        id: "webclient",
        term: "WebClient",
        desc: "Spring WebFlux’s non-blocking HTTP client — the reactive equivalent of fetch/promises.",
        sampleLabel: "Non-blocking HTTP client",
        code: `@Component
final class BillingClient {
  private final WebClient webClient;

  BillingClient(WebClient.Builder builder) {
    this.webClient = builder.baseUrl("https://billing.internal").build();
  }

  Mono<Invoice> fetchInvoice(String id) {
    return webClient.get()
      .uri("/invoices/{id}", id)
      .retrieve()
      .bodyToMono(Invoice.class);
  }
}`,
        insights: [
          {
            title: "Purpose",
            body: "WebClient is appropriate when you need high concurrency or streaming behavior without blocking a thread per request.",
          },
          {
            title: "Best practice",
            body: "Centralize timeouts, retry rules, and logging filters on the WebClient builder so every downstream call shares the same resilience baseline.",
          },
          {
            title: "Gotcha",
            body: "Calling block() inside a reactive path defeats the non-blocking model and can create latency or deadlock issues under load.",
          },
        ],
      },
      {
        id: "event-listener",
        term: "@EventListener",
        desc: "Decoupled event callbacks within the application context (pub/sub in one JVM).",
        sampleLabel: "Domain event listener",
        code: `record UserProvisioned(UUID userId, String email) {}

@Component
final class WelcomeEmailListener {
  @EventListener
  void onUserProvisioned(UserProvisioned event) {
    mailer.sendWelcome(event.email());
  }
}`,
        insights: [
          {
            title: "Purpose",
            body: "Use application events to decouple follow-up actions from the main write path when both live inside the same service boundary.",
          },
          {
            title: "Best practice",
            body: "Treat event payloads as stable facts about something that already happened, not as mutable request objects.",
          },
          {
            title: "Gotcha",
            body: "By default listeners run synchronously in-process, so a slow listener still slows the publisher unless you combine it with async execution.",
          },
        ],
      },
      {
        id: "scheduled",
        term: "@Scheduled",
        desc: "Cron and fixed-rate callbacks Spring invokes on a timer (analogous to setInterval).",
        sampleLabel: "Scheduled maintenance task",
        code: `@EnableScheduling
@Configuration
class SchedulerConfig {}

@Component
final class CacheWarmJob {
  @Scheduled(cron = "0 */15 * * * *")
  void warm() {
    cacheService.refresh();
  }
}`,
        insights: [
          {
            title: "Purpose",
            body: "Use @Scheduled for internal maintenance work such as cache refreshes, reconciliations, and periodic cleanup.",
          },
          {
            title: "Best practice",
            body: "Make scheduled jobs idempotent and observable so retries, overlaps, and production debugging stay tractable.",
          },
          {
            title: "Gotcha",
            body: "In horizontally scaled deployments, every instance may run the same schedule unless you add leader election or external coordination.",
          },
        ],
      },
    ],
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    items: [
      {
        id: "jpa-entities",
        term: "JPA Entities",
        desc: "POJOs with @Entity annotations; Jackson serialises them to/from JSON automatically.",
        sampleLabel: "Persistence model",
        code: `@Entity
class CustomerEntity {
  @Id
  UUID id;

  @Column(nullable = false)
  String email;
}`,
        insights: [
          {
            title: "Purpose",
            body: "JPA entities model database state and are designed for persistence concerns such as identity, relations, and transactions.",
          },
          {
            title: "Best practice",
            body: "Keep entities behind a service or mapping layer and expose dedicated DTOs at the API boundary instead of serializing entities directly.",
          },
          {
            title: "Gotcha",
            body: "Returning entities directly can trigger lazy-loading problems, oversized payloads, and accidental coupling between database schema and API contract.",
          },
        ],
      },
      {
        id: "response-entity",
        term: "ResponseEntity<T>",
        desc: "Wraps response body, headers, and status code into one object.",
        sampleLabel: "Explicit response control",
        code: `@GetMapping("/health")
ResponseEntity<Map<String, String>> health() {
  return ResponseEntity
    .ok()
    .header("Cache-Control", "no-store")
    .body(Map.of("status", "ok"));
}`,
        insights: [
          {
            title: "Purpose",
            body: "ResponseEntity is the right tool when the handler needs explicit control over status, headers, and body shape.",
          },
          {
            title: "Best practice",
            body: "Use it selectively for endpoints with header or status nuance rather than wrapping every controller method by habit.",
          },
          {
            title: "Gotcha",
            body: "If every endpoint manually builds ResponseEntity for standard success cases, controllers become noisy and harder to scan for business intent.",
          },
        ],
      },
      {
        id: "stream-api",
        term: "Stream API",
        desc: ".filter(), .map(), .collect() are Java’s equivalent of array methods.",
        sampleLabel: "Collection transformation",
        code: `List<String> activeEmails = users.stream()
  .filter(User::isActive)
  .map(User::email)
  .toList();`,
        insights: [
          {
            title: "Purpose",
            body: "Stream pipelines are good for readable in-memory transformations where the sequence of filtering and mapping matters more than mutation.",
          },
          {
            title: "Best practice",
            body: "Keep each pipeline short and intention-revealing; move complex predicates or mappings into named methods when the chain starts hiding the rule.",
          },
          {
            title: "Gotcha",
            body: "Streams do not automatically make code faster; for database-backed data, pushing filtering or sorting into SQL is usually the better optimization.",
          },
        ],
      },
      {
        id: "concurrent-hash-map",
        term: "ConcurrentHashMap",
        desc: "Used everywhere for caches, config lookups, and in-memory state.",
        sampleLabel: "In-memory concurrent cache",
        code: `final class TokenCache {
  private final ConcurrentHashMap<String, Token> cache = new ConcurrentHashMap<>();

  Token getOrLoad(String key) {
    return cache.computeIfAbsent(key, this::loadToken);
  }
}`,
        insights: [
          {
            title: "Purpose",
            body: "ConcurrentHashMap gives you safe shared mutable lookup state when multiple threads need fast reads and controlled writes.",
          },
          {
            title: "Best practice",
            body: "Use atomic helpers such as computeIfAbsent rather than separate get-then-put logic when correctness depends on a single update step.",
          },
          {
            title: "Gotcha",
            body: "It solves thread safety for the map operations, not for the lifecycle of the values inside it, so mutable cached objects still need careful handling.",
          },
        ],
      },
    ],
  },
  {
    id: "http",
    label: "HTTP",
    icon: Zap,
    items: [
      {
        id: "rest-controller",
        term: "@RestController",
        desc: "Marks a class as an HTTP endpoint; every method returns a response body.",
        sampleLabel: "REST controller",
        code: `@RestController
@RequestMapping("/api/auth")
final class AuthController {
  @GetMapping("/me")
  AuthSession me() {
    return authService.currentSession();
  }
}`,
        insights: [
          {
            title: "Purpose",
            body: "@RestController declares an HTTP entrypoint where handler return values are written directly as JSON or another response body format.",
          },
          {
            title: "Best practice",
            body: "Keep controllers thin: validate input, delegate to services, and return stable DTOs or envelopes rather than embedding domain logic in handlers.",
          },
          {
            title: "Gotcha",
            body: "Returning internal models directly can accidentally expose fields or bind your external contract to internal refactors.",
          },
        ],
      },
      {
        id: "request-mapping",
        term: "@GetMapping / @PostMapping",
        desc: "Maps HTTP methods to Java methods (GET, POST, PUT, DELETE).",
        sampleLabel: "Route mapping",
        code: `@PostMapping("/login")
AuthSession login(@RequestBody @Valid LoginRequest request) {
  return authService.login(request);
}`,
        insights: [
          {
            title: "Purpose",
            body: "Method-level mapping annotations turn HTTP semantics into explicit route handlers that align code structure with the API surface.",
          },
          {
            title: "Best practice",
            body: "Choose route names and verbs around resource meaning and action safety, not just around whatever service method already exists.",
          },
          {
            title: "Gotcha",
            body: "Ambiguous mappings or overloaded paths become hard to reason about quickly, especially once versioning, optional params, or content negotiation are introduced.",
          },
        ],
      },
      {
        id: "request-body",
        term: "@RequestBody / @PathVariable",
        desc: "Binds JSON body or URL parameters to method arguments.",
        sampleLabel: "Request binding",
        code: `@GetMapping("/users/{id}")
UserView findUser(@PathVariable UUID id, @RequestParam(defaultValue = "false") boolean verbose) {
  return userService.find(id, verbose);
}`,
        insights: [
          {
            title: "Purpose",
            body: "These annotations tell Spring where each handler argument comes from so binding is explicit rather than inferred by naming alone.",
          },
          {
            title: "Best practice",
            body: "Reserve path variables for resource identity and request bodies for mutable payloads so the contract stays predictable for clients.",
          },
          {
            title: "Gotcha",
            body: "Loose binding rules can hide malformed inputs unless you pair them with validation and clear error envelopes.",
          },
        ],
      },
      {
        id: "http-status",
        term: "HttpStatus",
        desc: "Enum with all status codes (OK, CREATED, BAD_REQUEST, NOT_FOUND).",
        sampleLabel: "Explicit status mapping",
        code: `@DeleteMapping("/users/{id}")
ResponseEntity<Void> delete(@PathVariable UUID id) {
  userService.delete(id);
  return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
}`,
        insights: [
          {
            title: "Purpose",
            body: "HttpStatus makes response semantics explicit in code instead of hiding them behind magic numbers or incidental defaults.",
          },
          {
            title: "Best practice",
            body: "Be deliberate about 201, 204, 400, 404, and 409 because those are the codes clients most often automate against.",
          },
          {
            title: "Gotcha",
            body: "Using 200 for every successful mutation weakens API semantics and forces clients to inspect bodies when the status code should already convey the outcome.",
          },
        ],
      },
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    icon: Server,
    items: [
      {
        id: "embedded-tomcat",
        term: "Embedded Tomcat",
        desc: "Spring Boot packages its own server inside the JAR; java -jar app.jar runs anywhere.",
        sampleLabel: "Boot application entrypoint",
        code: `@SpringBootApplication
public class ApiSandboxApplication {
  public static void main(String[] args) {
    SpringApplication.run(ApiSandboxApplication.class, args);
  }
}`,
        insights: [
          {
            title: "Purpose",
            body: "Embedded Tomcat turns the app into a self-contained deployable unit rather than requiring a separately managed app server.",
          },
          {
            title: "Best practice",
            body: "Treat the application as immutable at deploy time: build once, then configure with environment-specific settings rather than repackaging per environment.",
          },
          {
            title: "Gotcha",
            body: "Because the server is bundled, JVM memory tuning and connector settings are now part of the app’s operational envelope, not someone else’s infrastructure problem.",
          },
        ],
      },
      {
        id: "docker-spring",
        term: "Docker + Spring",
        desc: "Multi-stage Dockerfile builds a slim JRE image; deploys to EC2, ECS, or Kubernetes.",
        sampleLabel: "Container image build",
        code: `FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ./gradlew bootJar

FROM eclipse-temurin:21-jre
COPY --from=build /app/build/libs/app.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]`,
        insights: [
          {
            title: "Purpose",
            body: "Containerizing Spring standardizes runtime behavior across local development, CI, and deployment platforms.",
          },
          {
            title: "Best practice",
            body: "Use multi-stage builds and a slim runtime base image so your production image contains only the app and the JRE it needs.",
          },
          {
            title: "Gotcha",
            body: "If startup probes, memory flags, or graceful shutdown signals are ignored, the container may look healthy in CI but fail under orchestrated deploys.",
          },
        ],
      },
      {
        id: "spring-profiles",
        term: "Spring Profiles",
        desc: "application-dev.yml vs application-prod.yml swaps config per environment.",
        sampleLabel: "Profile-specific configuration",
        code: `spring:
  profiles:
    active: dev

---
spring:
  config:
    activate:
      on-profile: prod
server:
  shutdown: graceful`,
        insights: [
          {
            title: "Purpose",
            body: "Profiles separate environment-specific configuration from application code so the same artifact can run in dev, staging, and prod.",
          },
          {
            title: "Best practice",
            body: "Keep profile differences narrow and operational; business behavior should not silently diverge across environments unless that divergence is explicit and tested.",
          },
          {
            title: "Gotcha",
            body: "Overusing profiles turns configuration into hidden branching logic, which makes production incidents harder to reproduce locally.",
          },
        ],
      },
      {
        id: "actuator",
        term: "Actuator",
        desc: "/actuator/health endpoint for load balancer health checks on VMs and containers.",
        sampleLabel: "Health endpoint exposure",
        code: `management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      probes:
        enabled: true`,
        insights: [
          {
            title: "Purpose",
            body: "Actuator exposes operational endpoints for health, metrics, and diagnostics so the platform can reason about the service at runtime.",
          },
          {
            title: "Best practice",
            body: "Expose only the endpoints you actively use and integrate health probes with real dependencies that matter for traffic safety.",
          },
          {
            title: "Gotcha",
            body: "Blindly exposing every actuator endpoint can leak internals or create noisy attack surface that operations never needed in the first place.",
          },
        ],
      },
    ],
  },
  {
    id: "algo",
    label: "Algorithms",
    icon: Code,
    items: [
      {
        id: "collections-sort",
        term: "Collections.sort()",
        desc: "TimSort under the hood; pass a Comparator for custom ordering.",
        sampleLabel: "Comparator-based sorting",
        code: `users.sort(
  Comparator.comparing(UserView::lastSeenAt)
    .reversed()
    .thenComparing(UserView::email)
);`,
        insights: [
          {
            title: "Purpose",
            body: "Collections.sort and comparator chains make business ordering explicit when you already have the data in memory.",
          },
          {
            title: "Best practice",
            body: "Sort in memory only after you’ve already narrowed the dataset; if the source is a database, push the ordering down whenever practical.",
          },
          {
            title: "Gotcha",
            body: "Sorting large collections after fetching everything from persistence is often a hidden performance smell, not a harmless convenience.",
          },
        ],
      },
      {
        id: "stream-pipeline",
        term: "Stream pipeline",
        desc: "Declarative .filter().map().collect() that mirrors JS array methods.",
        sampleLabel: "Pipeline for response shaping",
        code: `List<OrderSummary> summaries = orders.stream()
  .filter(Order::isPaid)
  .map(OrderSummary::from)
  .toList();`,
        insights: [
          {
            title: "Purpose",
            body: "A stream pipeline is a concise way to describe transformation flow from source collection to API-facing result.",
          },
          {
            title: "Best practice",
            body: "Prefer simple, linear pipelines that mirror business intent; once the pipeline becomes branching or stateful, move logic into named functions.",
          },
          {
            title: "Gotcha",
            body: "Parallel streams are not a default optimization for web apps and can add contention or surprising behavior without clear throughput gains.",
          },
        ],
      },
      {
        id: "hashmap-o1",
        term: "HashMap O(1)",
        desc: "Spring’s bean registry, @Cacheable, and config resolution all rely on hash maps.",
        sampleLabel: "Lookup-based optimization",
        code: `Map<UUID, UserView> byId = users.stream()
  .collect(Collectors.toMap(UserView::id, user -> user));

UserView target = byId.get(requestedId);`,
        insights: [
          {
            title: "Purpose",
            body: "Hash-map lookups trade a one-time indexing step for fast repeated access, which is a common API optimization pattern.",
          },
          {
            title: "Best practice",
            body: "Use map-based indexing when the code repeatedly searches the same collection by identity or key within one request path.",
          },
          {
            title: "Gotcha",
            body: "The constant-time lookup story only helps if the map’s lifecycle and memory cost are justified; indexing tiny or one-shot collections can just add clutter.",
          },
        ],
      },
      {
        id: "sort-by",
        term: "Sort.by()",
        desc: "Translates to SQL ORDER BY, letting the database’s own sort algorithm handle it.",
        sampleLabel: "Database-backed ordering",
        code: `PageRequest page = PageRequest.of(
  0,
  20,
  Sort.by(Sort.Direction.DESC, "createdAt")
);

return orderRepository.findAll(page);`,
        insights: [
          {
            title: "Purpose",
            body: "Sort.by keeps ordering close to the repository query so the database performs the heavy lifting where indexes and query planners can help.",
          },
          {
            title: "Best practice",
            body: "Pair Sort.by with pagination and indexed columns to avoid moving unbounded ordered data into the application layer.",
          },
          {
            title: "Gotcha",
            body: "Ordering by non-indexed high-cardinality fields can become an expensive production query even though the code path looks harmless.",
          },
        ],
      },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    icon: GitBranch,
    items: [
      {
        id: "maven-gradle",
        term: "Maven / Gradle",
        desc: "Spring Boot plugin builds a fat JAR; ./gradlew bootJar or mvn package.",
        sampleLabel: "Build task entrypoint",
        code: `plugins {
  id("org.springframework.boot") version "3.3.2"
}

tasks.named<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
  archiveFileName.set("app.jar")
}`,
        insights: [
          {
            title: "Purpose",
            body: "The build tool owns dependency resolution, packaging, test execution, and the deployable artifact shape for the service.",
          },
          {
            title: "Best practice",
            body: "Keep the build deterministic by pinning plugin versions and treating the build file as production infrastructure, not incidental setup.",
          },
          {
            title: "Gotcha",
            body: "Complex ad hoc build logic tends to outlive its original need and becomes a hidden source of CI drift or environment-specific failures.",
          },
        ],
      },
      {
        id: "github-actions",
        term: "GitHub Actions",
        desc: "CI pipeline: checkout → setup-java → gradle build → docker push → deploy.",
        sampleLabel: "Spring CI workflow",
        code: `jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
      - run: ./gradlew test bootJar`,
        insights: [
          {
            title: "Purpose",
            body: "CI proves the service can still build, test, and package the same way every time a change lands.",
          },
          {
            title: "Best practice",
            body: "Fail fast on compile and test steps before spending time on image publishing or deploy stages.",
          },
          {
            title: "Gotcha",
            body: "If local development and CI use materially different Java, dependency, or environment assumptions, the pipeline becomes a surprise detector instead of a confidence signal.",
          },
        ],
      },
      {
        id: "spring-cloud-config",
        term: "Spring Cloud Config",
        desc: "Externalised configuration backed by a Git repository (config-as-code).",
        sampleLabel: "Config server client",
        code: `spring:
  application:
    name: billing-service
  config:
    import: optional:configserver:http://config.internal:8888`,
        insights: [
          {
            title: "Purpose",
            body: "Spring Cloud Config centralizes environment configuration so multiple services can share governed, versioned runtime settings.",
          },
          {
            title: "Best practice",
            body: "Use it for deploy-time configuration and operational toggles, while keeping secrets in a dedicated secret store rather than plain config repos.",
          },
          {
            title: "Gotcha",
            body: "A broken config dependency can become a service startup dependency, so failure modes and fallback behavior need to be designed explicitly.",
          },
        ],
      },
      {
        id: "feature-flags",
        term: "Feature flags",
        desc: "Combine Spring Profiles + Git branches for feature toggles across environments.",
        sampleLabel: "Conditional bean toggle",
        code: `@Configuration
class PaymentsConfig {
  @Bean
  @ConditionalOnProperty(name = "features.new-checkout", havingValue = "true")
  CheckoutService newCheckoutService() {
    return new CheckoutService();
  }
}`,
        insights: [
          {
            title: "Purpose",
            body: "Feature flags let you separate release from deploy so risky changes can be activated gradually or rolled back without rebuilding the artifact.",
          },
          {
            title: "Best practice",
            body: "Name flags by business capability and define an owner plus removal plan so short-lived toggles do not become permanent complexity.",
          },
          {
            title: "Gotcha",
            body: "Profile-based toggles are coarse; if every environment has a different combination, you can end up testing one system and running another.",
          },
        ],
      },
    ],
  },
]
