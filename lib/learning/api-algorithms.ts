export interface SpringContext {
  headline: string
  how: string[]
  codeSketch: string
}

export interface ApiAlgorithmLesson {
  id: string
  title: string
  systemName: string
  trigger: string
  existence: string
  mechanics: string[]
  contrast: {
    withSystem: string
    withoutSystem: string
  }
  stress: string
  failure: string
  tradeoffs: string[]
  retrievalQuestions: string[]
  buildTask: string
  springContext: SpringContext
}

export const apiAlgorithmLessons: ApiAlgorithmLesson[] = [
  {
    id: "hash-map-idempotency",
    title: "Hash Maps for Idempotency and Deduplication",
    systemName: "Idempotent write APIs",
    trigger: "Payment retries are creating duplicate charges during transient 502 errors.",
    existence: "Without deterministic deduplication state, retried writes produce correctness failures and customer-impact incidents.",
    mechanics: [
      "Derive an idempotency key from stable business fields (user, operation, unique request token).",
      "Store key -> canonical result with TTL in a low-latency store.",
      "On retry, short-circuit to stored result instead of re-executing side effects.",
    ],
    contrast: {
      withSystem: "Duplicate writes collapse into one canonical outcome; retries are safe.",
      withoutSystem: "Every retry can trigger new side effects and reconciliation costs.",
    },
    stress: "At 10x retry storms, key-store write amplification becomes the bottleneck; optimize TTL and key cardinality.",
    failure: "If key-store latency spikes, fallback mode must avoid blind re-execution of non-idempotent operations.",
    tradeoffs: [
      "Optimizes correctness and retry safety.",
      "Sacrifices extra state storage and key-management complexity.",
      "Wrong choice when operations are naturally idempotent and retry volume is tiny.",
    ],
    retrievalQuestions: [
      "How would you prevent key collisions across tenants sharing a global API gateway?",
      "What signal tells you idempotency storage is now your bottleneck instead of the primary DB?",
    ],
    buildTask: "Implement idempotency middleware for one POST endpoint and prove duplicate retries return one result.",
    springContext: {
      headline: "Spring uses ConcurrentHashMap / Redis to collapse retries into one outcome",
      how: [
        "Create a @Component IdempotencyFilter that extends OncePerRequestFilter and checks a ConcurrentHashMap<String, ResponseEntity<?>> keyed by the Idempotency-Key header.",
        "For production, swap the map for RedisTemplate with TTL-based expiry so keys survive restarts and work across instances.",
        "Spring Cloud Gateway can apply the filter globally to all POST/PUT routes via a GatewayFilterFactory.",
      ],
      codeSketch: `@Component
public class IdempotencyFilter extends OncePerRequestFilter {

    private final RedisTemplate<String, String> redis;

    @Override
    protected void doFilterInternal(
            HttpServletRequest req, HttpServletResponse res,
            FilterChain chain) throws ServletException, IOException {
        String key = req.getHeader("Idempotency-Key");
        if (key != null && Boolean.TRUE.equals(
                redis.hasKey("idempotency:" + key))) {
            String cached = redis.opsForValue()
                    .get("idempotency:" + key);
            res.setContentType("application/json");
            res.getWriter().write(cached);
            return;
        }
        // wrap response, cache result after chain completes
        chain.doFilter(req, res);
    }
}`,
    },
  },
  {
    id: "heap-priority-queues",
    title: "Heaps for Priority Scheduling",
    systemName: "Background job prioritization",
    trigger: "Low-value batch jobs are delaying critical customer-facing tasks during peak load.",
    existence: "FIFO queues alone cannot encode urgency, so important work misses SLA under contention.",
    mechanics: [
      "Assign priority scores to jobs based on business impact and latency SLO.",
      "Use min-heap or max-heap scheduler to pop highest-priority work first.",
      "Apply fairness controls to avoid starvation of lower-priority jobs.",
    ],
    contrast: {
      withSystem: "High-value tasks meet SLA while backlog still grows.",
      withoutSystem: "Critical tasks are delayed behind low-impact batch traffic.",
    },
    stress: "At 10x traffic, scheduling overhead and starvation risk increase; rebalance priorities with aging.",
    failure: "Incorrect priority policy can create silent starvation and hidden customer churn.",
    tradeoffs: [
      "Optimizes SLA adherence for high-impact work.",
      "Sacrifices FIFO simplicity and explainability.",
      "Wrong choice when all jobs truly have identical urgency.",
    ],
    retrievalQuestions: [
      "How would you detect starvation before support tickets surface it?",
      "When should you split queues by class instead of single-queue priority scheduling?",
    ],
    buildTask: "Add priority classes to one worker queue and report percentile latency by class.",
    springContext: {
      headline: "Spring Batch + PriorityBlockingQueue let you schedule jobs by business impact",
      how: [
        "Use a ThreadPoolTaskExecutor backed by a PriorityBlockingQueue<Runnable> so the thread pool always picks the highest-priority Runnable first.",
        "Assign priority via a custom @Priority annotation on Spring Batch Tasklet steps or @Async methods.",
        "Expose per-priority-class latency via Micrometer Timer beans and visualise with /actuator/prometheus.",
      ],
      codeSketch: `@Configuration
public class PriorityExecutorConfig {

    @Bean
    public TaskExecutor priorityExecutor() {
        ThreadPoolTaskExecutor exec = new ThreadPoolTaskExecutor();
        exec.setCorePoolSize(4);
        exec.setMaxPoolSize(8);
        // PriorityBlockingQueue ensures highest-priority
        // Runnable is dequeued first
        exec.setQueueCapacity(0); // direct handoff
        exec.setRejectedExecutionHandler(
            new CallerRunsPolicy());
        exec.initialize();
        return exec;
    }
}

// Usage: @Async("priorityExecutor")
// public void processOrder(Order order) { ... }`,
    },
  },
  {
    id: "sliding-window-rate-limit",
    title: "Sliding Window Counters for Rate Limiting",
    systemName: "Abuse and burst protection",
    trigger: "Burst traffic from retries and bots exhausts downstream capacity every hour.",
    existence: "Without bounded request admission, one actor can consume shared capacity and degrade everyone.",
    mechanics: [
      "Key limiter by tenant/user/IP depending on fairness policy.",
      "Track request counts in a rolling time window with atomic updates.",
      "Return explicit 429 responses with retry guidance.",
    ],
    contrast: {
      withSystem: "Capacity is protected and fairness is enforceable under bursts.",
      withoutSystem: "Traffic spikes trigger cascading failures across unrelated users.",
    },
    stress: "At 10x traffic, centralized counters can become hot keys; shard by key hash and region.",
    failure: "Clock skew or partitioned state can over-admit or over-throttle traffic.",
    tradeoffs: [
      "Optimizes fairness and dependency protection.",
      "Sacrifices some good traffic when limits are conservative.",
      "Wrong choice when workloads require strict per-request guarantees with no drops.",
    ],
    retrievalQuestions: [
      "What changes when your limiter must enforce both per-user and global limits?",
      "How do you choose fail-open vs fail-closed if the limiter data store is unavailable?",
    ],
    buildTask: "Implement per-user sliding-window limits on one endpoint and graph accepted vs rejected traffic.",
    springContext: {
      headline: "Bucket4j + Spring Boot Starter gives annotation-driven rate limiting with Redis backing",
      how: [
        "Add bucket4j-spring-boot-starter; configure per-user buckets in application.yml keyed by the authenticated principal or IP.",
        "Spring Cloud Gateway has a built-in RedisRateLimiter that uses a Lua-scripted sliding-window counter in Redis.",
        "For custom logic, create a HandlerInterceptor that checks a Bucket4j Bucket and returns 429 with Retry-After header.",
      ],
      codeSketch: `@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, Bucket> buckets =
        new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest req,
            HttpServletResponse res, Object handler) {
        String userId = req.getUserPrincipal().getName();
        Bucket bucket = buckets.computeIfAbsent(userId,
            k -> Bucket.builder()
                .addLimit(Bandwidth.classic(
                    100, Refill.intervally(100,
                         Duration.ofMinutes(1))))
                .build());
        if (bucket.tryConsume(1)) {
            return true;
        }
        res.setStatus(429);
        res.setHeader("Retry-After", "60");
        return false;
    }
}`,
    },
  },
  {
    id: "binary-search-capacity",
    title: "Binary Search for Capacity and Timeout Tuning",
    systemName: "Operational parameter tuning",
    trigger: "You need safe max concurrency/timeout values, but brute-force tuning is too slow in production-like tests.",
    existence: "Without systematic search, tuning drifts by intuition and destabilizes latency and error rates.",
    mechanics: [
      "Define a monotonic objective (e.g., keep p95 < target while maximizing throughput).",
      "Search parameter range via midpoint tests in staging load runs.",
      "Lock the highest safe value and codify rollback threshold.",
    ],
    contrast: {
      withSystem: "Converges quickly on safe operating bounds with fewer experiments.",
      withoutSystem: "Tuning becomes noisy trial-and-error with inconsistent results.",
    },
    stress: "At 10x scenarios, monotonic assumptions can fail; validate in multiple traffic shapes.",
    failure: "Mis-specified objective picks locally good but globally unstable operating points.",
    tradeoffs: [
      "Optimizes tuning speed and repeatability.",
      "Sacrifices simplicity when assumptions are not monotonic.",
      "Wrong choice when parameter behavior is highly non-linear and chaotic.",
    ],
    retrievalQuestions: [
      "What metric combination would invalidate binary search as the tuning strategy?",
      "How would you detect that your staging tuning no longer predicts production behavior?",
    ],
    buildTask: "Tune one concurrency or timeout parameter using binary search and publish the experiment log.",
    springContext: {
      headline: "Spring Boot Actuator + HikariCP expose the metrics you binary-search against",
      how: [
        "HikariCP (Spring Boot's default pool) exposes hikaricp.connections.active, .pending, .timeout via Micrometer — these are your objective metrics.",
        "Write a load-test script (Gatling or k6) that sweeps spring.datasource.hikari.maximum-pool-size via a binary-search loop, recording p95 latency at each midpoint.",
        "Codify the winning value in application-prod.yml and set an alert on hikaricp.connections.pending > threshold as a rollback signal.",
      ],
      codeSketch: `# application.yml — the parameter you're tuning
spring:
  datasource:
    hikari:
      maximum-pool-size: 20   # <-- binary-search target
      connection-timeout: 3000 # <-- secondary target

management:
  endpoints:
    web.exposure.include: health,metrics,prometheus
  metrics:
    tags:
      application: my-api

# Binary-search script pseudocode:
# low=5, high=50
# while low <= high:
#   mid = (low + high) / 2
#   set pool-size = mid, run load test
#   if p95 < 200ms AND error_rate < 0.1%:
#     best = mid; low = mid + 1  # try larger
#   else:
#     high = mid - 1             # too aggressive`,
    },
  },
  {
    id: "topk-heavy-hitters",
    title: "Top-K/Heap Patterns for Hotspot Detection",
    systemName: "Operational visibility and cost control",
    trigger: "You know costs are rising, but you cannot identify which endpoints or tenants are causing it.",
    existence: "Without heavy-hitter analysis, optimization efforts target noise instead of true hotspots.",
    mechanics: [
      "Stream request metrics keyed by endpoint/tenant.",
      "Maintain top-K heap for highest cost or latency contributors.",
      "Feed top-K output into weekly optimization and incident reviews.",
    ],
    contrast: {
      withSystem: "Optimization is focused on the handful of contributors driving most pain.",
      withoutSystem: "Teams spread effort across low-impact fixes.",
    },
    stress: "At 10x cardinality, memory pressure grows; use approximate structures or periodic decay.",
    failure: "Bad aggregation windows can hide bursty offenders and delay action.",
    tradeoffs: [
      "Optimizes decision quality and cost focus.",
      "Sacrifices some precision when using approximations.",
      "Wrong choice when total metric cardinality is tiny and full scans are cheap.",
    ],
    retrievalQuestions: [
      "When should you switch from exact top-K to approximate counting?",
      "How do you avoid overfitting optimization to one temporary traffic spike?",
    ],
    buildTask: "Create a top-K report for latency contributors and propose one optimization backed by data.",
    springContext: {
      headline: "Micrometer + Actuator already stream the metrics — add a top-K aggregator",
      how: [
        "Micrometer's Timer and DistributionSummary per endpoint give you the raw signal; export to Prometheus and query topk(10, rate(http_server_requests_seconds_sum[5m])).",
        "For in-app detection, maintain a PriorityQueue<EndpointCost> bounded to K in a @Scheduled bean that reads from the MeterRegistry every minute.",
        "Feed the top-K list into a /actuator/custom/hotspots endpoint so ops dashboards surface it automatically.",
      ],
      codeSketch: `@Component
public class HotspotDetector {

    private final MeterRegistry registry;
    private final Queue<Map.Entry<String, Double>> topK =
        new PriorityQueue<>(
            Comparator.comparingDouble(Map.Entry::getValue));
    private static final int K = 10;

    @Scheduled(fixedRate = 60_000)
    public void detectHotspots() {
        topK.clear();
        registry.find("http.server.requests")
            .timers().forEach(timer -> {
                double cost = timer.totalTime(MILLISECONDS);
                var entry = Map.entry(
                    timer.getId().getTag("uri"), cost);
                topK.offer(entry);
                if (topK.size() > K) topK.poll();
            });
        // expose via /actuator or emit event
    }
}`,
    },
  },
]
