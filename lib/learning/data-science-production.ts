export interface PhaseConnection {
  phase: number
  title: string
  link: string
}

export interface DSTechStack {
  category: string
  tools: string[]
}

export interface DSCategory {
  id: string
  name: string
  icon: string
  color: string
  tagline: string
  paretoInsight: string
  why: string
  howItFits: string
  connectedPhases: PhaseConnection[]
  coreConcepts: { term: string; definition: string }[]
  pipeline: { step: string; detail: string }[]
  techStack: DSTechStack[]
  antiPatterns: { mistake: string; fix: string }[]
  springContext: {
    headline: string
    points: string[]
    codeSketch: string
  }
}

export const dsCategories: DSCategory[] = [
  {
    id: "model-serving",
    name: "Model Serving",
    icon: "🧠",
    color: "from-purple-500 to-violet-600",
    tagline: "Deploy ML models as scalable, low-latency APIs",
    paretoInsight: "80% of ML value is unlocked by serving one model reliably at < 100ms P99. Don't build a platform — deploy one model behind a REST endpoint and prove business impact first.",
    why: "A model in a notebook generates zero revenue. The moment it's behind an API, every product team can call it. Model serving is the single skill that turns a data scientist into a production engineer.",
    howItFits: "Phase 1 taught you API styles (REST, gRPC). Phase 4 taught architecture at scale. Model serving is where those converge — you're building an API whose logic is a trained model instead of hand-written code.",
    connectedPhases: [
      { phase: 1, title: "REST/gRPC for the serving transport", link: "/phase-1" },
      { phase: 3, title: "Inter-service communication for model microservices", link: "/phase-3" },
      { phase: 4, title: "Architecture patterns for inference at scale", link: "/phase-4" },
    ],
    coreConcepts: [
      { term: "Online inference", definition: "Model predicts in real-time per request (< 100ms). Used for search ranking, fraud detection, recommendations." },
      { term: "Batch inference", definition: "Model scores a dataset offline (hourly/daily). Used for email campaigns, risk reports, pre-computed recommendations." },
      { term: "Model registry", definition: "Versioned storage for trained models (MLflow, Weights & Biases). Like a Docker registry but for .pkl/.onnx files." },
      { term: "Shadow mode", definition: "New model receives live traffic but its predictions aren't shown to users. Lets you compare accuracy against the current model safely." },
      { term: "Canary deployment", definition: "Route 5% of traffic to the new model, 95% to the old. Gradually shift if metrics hold. Same pattern as API canary deploys." },
      { term: "Model latency budget", definition: "If your API SLA is 200ms and the model takes 150ms, you have 50ms for everything else. This drives architecture decisions." },
    ],
    pipeline: [
      { step: "Export the model", detail: "Save as ONNX, PMML, or serialized format. ONNX gives you framework-agnostic inference." },
      { step: "Wrap in an API", detail: "FastAPI/Flask (Python), Spring Boot + ONNX Runtime (Java), or TensorFlow Serving (gRPC)." },
      { step: "Add input validation", detail: "Validate feature types, ranges, and nulls before inference. Bad input = garbage predictions." },
      { step: "Containerize", detail: "Docker image with model weights baked in. Pin dependency versions. GPU base image if needed." },
      { step: "Deploy behind a load balancer", detail: "Kubernetes + HPA for auto-scaling. Scale on P99 latency, not just CPU." },
      { step: "Add monitoring", detail: "Log predictions, input distributions, and latency. Alert on drift and error rate spikes." },
    ],
    techStack: [
      { category: "Serving frameworks", tools: ["TensorFlow Serving", "TorchServe", "Triton Inference Server", "ONNX Runtime", "BentoML"] },
      { category: "API layer", tools: ["FastAPI", "Spring Boot + DJL", "Flask", "gRPC"] },
      { category: "Orchestration", tools: ["Kubernetes", "Seldon Core", "KServe", "AWS SageMaker Endpoints"] },
      { category: "Model registry", tools: ["MLflow", "Weights & Biases", "DVC", "Neptune"] },
    ],
    antiPatterns: [
      { mistake: "Loading the model on every request", fix: "Load once at startup, hold in memory. Model loading can take 5-30 seconds." },
      { mistake: "No input validation before inference", fix: "Validate schema, ranges, and nulls. A NaN input silently corrupts predictions." },
      { mistake: "Serving directly from a Jupyter notebook", fix: "Export to ONNX/PMML. Notebook servers aren't designed for concurrent traffic." },
      { mistake: "No fallback when the model is down", fix: "Return a sensible default (e.g. most popular items, average price) or a cached previous prediction." },
    ],
    springContext: {
      headline: "Spring Boot + Deep Java Library (DJL) serves models natively in the JVM",
      points: [
        "Deep Java Library (DJL) loads PyTorch, TensorFlow, and ONNX models directly in Java — no Python sidecar",
        "@RestController wraps inference in a standard REST endpoint with Bean Validation on inputs",
        "Load the model once in a @Bean and inject it into your controller — thread-safe by default",
        "Spring Actuator /health checks model loading status; Micrometer tracks prediction latency",
        "Use @Async + CompletableFuture for batch inference endpoints that score many items in parallel",
        "Spring Cloud Gateway routes traffic between model versions for canary/shadow deployments",
      ],
      codeSketch: `@RestController
@RequestMapping("/api/predict")
@RequiredArgsConstructor
public class PredictionController {

    private final Predictor<float[], float[]> model;

    @PostMapping
    public ResponseEntity<PredictionResponse> predict(
            @Valid @RequestBody PredictionRequest request) {
        float[] features = request.toFeatureArray();
        float[] scores = model.predict(features);
        return ResponseEntity.ok(
            new PredictionResponse(scores, request.id()));
    }
}

// Model loaded once at startup
@Configuration
public class ModelConfig {
    @Bean
    public Predictor<float[], float[]> predictor() {
        Criteria<float[], float[]> criteria = Criteria.builder()
            .setTypes(float[].class, float[].class)
            .optModelPath(Paths.get("models/fraud-v2.onnx"))
            .optEngine("OnnxRuntime")
            .build();
        return criteria.loadModel().newPredictor();
    }
}`,
    },
  },
  {
    id: "data-pipelines",
    name: "Data Pipelines",
    icon: "🔄",
    color: "from-blue-500 to-indigo-600",
    tagline: "Move, transform, and deliver data from source to model to API",
    paretoInsight: "80% of ML project time is spent on data, not models. A reliable pipeline that delivers clean features on time matters more than a 2% accuracy improvement.",
    why: "Models are only as good as their data. If your pipeline is late, stale, or silently dropping records, your 99%-accurate model becomes a random number generator. Pipeline engineering is the unglamorous foundation that makes everything else work.",
    howItFits: "Phase 3 covered event-driven architecture and message brokers. Data pipelines are the same pattern applied to ML: events flow through Kafka, get transformed, land in a feature store, and feed model training and inference.",
    connectedPhases: [
      { phase: 3, title: "Event-driven architecture and Kafka", link: "/phase-3" },
      { phase: 4, title: "System design for data-intensive applications", link: "/phase-4" },
      { phase: 5, title: "Sliding window and streaming algorithms", link: "/phase-5" },
    ],
    coreConcepts: [
      { term: "ETL vs ELT", definition: "ETL transforms before loading (warehouse). ELT loads raw data first, transforms in the warehouse. Modern stacks prefer ELT (cheaper storage, flexible transforms)." },
      { term: "Batch vs streaming", definition: "Batch processes data in scheduled chunks (hourly/daily). Streaming processes each event as it arrives (< 1 second). Most teams need both." },
      { term: "Idempotency", definition: "Re-running a pipeline on the same input produces the same output. Critical for recovery — if a job fails at 3am, you need to safely re-run it." },
      { term: "Data contract", definition: "Explicit schema + SLA between producer and consumer. If marketing changes a column name, your pipeline shouldn't silently break." },
      { term: "Backfill", definition: "Re-processing historical data through a new or fixed pipeline. Must be idempotent and bounded to avoid infinite reprocessing." },
      { term: "Data freshness", definition: "How recent the data is when it reaches the model. Real-time fraud detection needs seconds; weekly reports need days. Match freshness to use case." },
    ],
    pipeline: [
      { step: "Ingest from sources", detail: "CDC from databases, event streams from Kafka, API polling, file drops. Standardize on one ingestion pattern." },
      { step: "Store raw (bronze layer)", detail: "Land data as-is in a data lake (S3/GCS). Never transform raw data — you'll need it for debugging and backfills." },
      { step: "Clean and validate (silver layer)", detail: "Deduplicate, null-fill, type-cast, apply data contracts. Reject bad records to a dead-letter queue." },
      { step: "Aggregate and featurize (gold layer)", detail: "Join tables, compute rolling aggregates, build feature vectors. This is what models and dashboards consume." },
      { step: "Serve to consumers", detail: "Push to a feature store (online), a warehouse (analytics), or directly to a model training job." },
      { step: "Monitor and alert", detail: "Track row counts, schema changes, freshness, and null rates. Alert before the model sees bad data." },
    ],
    techStack: [
      { category: "Orchestration", tools: ["Apache Airflow", "Dagster", "Prefect", "dbt"] },
      { category: "Streaming", tools: ["Apache Kafka", "Apache Flink", "Spark Structured Streaming", "AWS Kinesis"] },
      { category: "Batch processing", tools: ["Apache Spark", "dbt (SQL transforms)", "Pandas (small scale)", "Polars"] },
      { category: "Storage", tools: ["Snowflake", "BigQuery", "Delta Lake", "Apache Iceberg", "S3/GCS"] },
    ],
    antiPatterns: [
      { mistake: "No data validation between stages", fix: "Add Great Expectations or dbt tests at each layer boundary. Catch nulls and schema drift early." },
      { mistake: "Transforming raw data in place", fix: "Keep an immutable raw layer. Transform into a separate clean layer. You'll need the originals." },
      { mistake: "Pipeline with no idempotency", fix: "Use MERGE/upsert instead of INSERT. Partition by date. Re-running should be safe." },
      { mistake: "Alerting only on pipeline failure", fix: "Also alert on data quality: unexpected nulls, row count drops > 20%, schema changes." },
    ],
    springContext: {
      headline: "Spring Batch + Spring Cloud Data Flow are enterprise-grade pipeline frameworks",
      points: [
        "Spring Batch for chunk-oriented ETL: ItemReader → ItemProcessor → ItemWriter with restart and skip policies",
        "Spring Cloud Data Flow orchestrates streaming and batch pipelines as composable microservices",
        "Spring Kafka for real-time ingestion — @KafkaListener consumers feed into processing pipelines",
        "Spring Data JPA bulk operations for loading transformed data into PostgreSQL/MySQL",
        "Use @Scheduled + Spring Batch to run daily feature computation jobs with built-in retry",
        "Micrometer metrics on pipeline throughput, error rate, and processing latency",
      ],
      codeSketch: `// Spring Batch job for daily feature computation
@Configuration
@RequiredArgsConstructor
public class FeaturePipelineConfig {

    @Bean
    public Job featureComputeJob(JobRepository repo,
            Step extractStep, Step transformStep, Step loadStep) {
        return new JobBuilder("featureComputeJob", repo)
            .start(extractStep)
            .next(transformStep)
            .next(loadStep)
            .build();
    }

    @Bean
    public Step transformStep(JobRepository repo,
            PlatformTransactionManager tx) {
        return new StepBuilder("transform", repo)
            .<RawEvent, FeatureVector>chunk(1000, tx)
            .reader(rawEventReader())
            .processor(featureProcessor())
            .writer(featureStoreWriter())
            .faultTolerant()
            .retryLimit(3)
            .retry(TransientDataAccessException.class)
            .build();
    }
}`,
    },
  },
  {
    id: "feature-engineering",
    name: "Feature Engineering",
    icon: "⚙️",
    color: "from-emerald-500 to-teal-600",
    tagline: "Turn raw data into the signals that make models smart",
    paretoInsight: "80% of model performance comes from good features, not clever algorithms. A logistic regression with great features beats a neural network with bad ones.",
    why: "Feature engineering is the highest-leverage activity in data science. The model is just math — the features are the intelligence. A well-engineered feature encodes domain knowledge that no algorithm can learn from raw data alone.",
    howItFits: "Phase 5 covered hash maps and sliding windows for API systems. Feature stores use the same patterns: hash lookups for real-time features, sliding windows for time-based aggregations. The infrastructure is the same — the intent is different.",
    connectedPhases: [
      { phase: 5, title: "Hash maps and sliding windows (same primitives)", link: "/phase-5" },
      { phase: 4, title: "Caching architecture (feature stores are specialized caches)", link: "/phase-4" },
      { phase: 3, title: "Event streaming feeds real-time features", link: "/phase-3" },
    ],
    coreConcepts: [
      { term: "Feature", definition: "A measurable property of the data fed to a model. user_total_purchases_30d, avg_session_duration, is_weekend — these are features." },
      { term: "Feature store", definition: "A system that computes, stores, and serves features consistently for training and inference. Ensures the model sees the same features in prod as it did in training." },
      { term: "Online vs offline features", definition: "Online: served in real-time (< 10ms lookup). Offline: computed in batch for training. The feature store bridges both." },
      { term: "Training-serving skew", definition: "When features computed during training differ from production. The #1 silent killer of ML models. Feature stores exist to prevent this." },
      { term: "Feature freshness", definition: "How recently the feature was computed. Fraud detection needs second-fresh features. Churn prediction is fine with daily." },
      { term: "Feature drift", definition: "When the statistical distribution of a feature changes over time. user_avg_spend shifting up 30% means the model's learned thresholds are stale." },
    ],
    pipeline: [
      { step: "Identify predictive signals", detail: "Talk to domain experts. What information would a human use to make this decision? Those become features." },
      { step: "Compute batch features", detail: "SQL or Spark jobs that aggregate historical data: 30-day totals, averages, counts, ratios." },
      { step: "Compute streaming features", detail: "Kafka consumers or Flink jobs that maintain real-time counters: events in last 5 minutes, session state." },
      { step: "Store in a feature store", detail: "Feast, Tecton, or a custom Redis/DynamoDB layer. Key by entity ID (user_id, item_id)." },
      { step: "Serve for inference", detail: "Online: point lookup by entity ID (< 5ms). Offline: bulk export for training datasets." },
      { step: "Monitor for drift", detail: "Track distributions weekly. Alert when mean/variance shifts > 2 standard deviations." },
    ],
    techStack: [
      { category: "Feature stores", tools: ["Feast (open-source)", "Tecton", "Hopsworks", "Custom Redis"] },
      { category: "Batch compute", tools: ["dbt", "Apache Spark", "SQL (BigQuery/Snowflake)", "Pandas"] },
      { category: "Streaming compute", tools: ["Apache Flink", "Kafka Streams", "Spark Structured Streaming"] },
      { category: "Online storage", tools: ["Redis", "DynamoDB", "Cassandra", "ScyllaDB"] },
    ],
    antiPatterns: [
      { mistake: "Computing features differently in training vs serving", fix: "Use a feature store that serves both. Same code path, same output." },
      { mistake: "Using future data in training features (data leakage)", fix: "Always compute features using only data available at prediction time. Use point-in-time joins." },
      { mistake: "Too many features without selection", fix: "Start with 10-20 features. Use SHAP or permutation importance to prune. More features = more maintenance." },
      { mistake: "No monitoring on feature distributions", fix: "Track mean, P50, P99, null rate per feature weekly. Drift = retraining trigger." },
    ],
    springContext: {
      headline: "Spring + Redis serves online features at microsecond latency",
      points: [
        "RedisTemplate with hash operations for O(1) feature lookups by entity ID",
        "@Cacheable on feature computation methods with TTL matching freshness requirements",
        "Spring Kafka @KafkaListener computes streaming features and writes to Redis in real-time",
        "Spring Batch jobs compute batch features nightly and bulk-load into Redis/PostgreSQL",
        "Spring Data JPA for point-in-time feature joins during offline training dataset generation",
        "Micrometer gauges on feature null rates and distribution statistics for drift detection",
      ],
      codeSketch: `@Service
@RequiredArgsConstructor
public class FeatureStoreService {

    private final RedisTemplate<String, Map<String, Double>> redis;

    // Online: serve features for real-time inference
    public Map<String, Double> getFeatures(String userId) {
        String key = "features:user:" + userId;
        Map<String, Double> features = redis.opsForHash()
            .entries(key);
        if (features.isEmpty()) {
            return computeAndCacheFallback(userId);
        }
        return features;
    }

    // Batch: nightly job writes pre-computed features
    @Scheduled(cron = "0 0 2 * * *")
    public void computeDailyFeatures() {
        List<UserFeatures> batch = featureQuery
            .computeAll(); // SQL aggregation
        batch.forEach(uf -> redis.opsForHash()
            .putAll("features:user:" + uf.userId(),
                    uf.toMap()));
    }
}`,
    },
  },
  {
    id: "experimentation",
    name: "Experimentation & A/B Testing",
    icon: "🧪",
    color: "from-amber-500 to-yellow-600",
    tagline: "Make decisions with statistical evidence, not opinions",
    paretoInsight: "80% of A/B tests show no significant difference. The value isn't in winners — it's in avoiding shipping things that don't work. Experimentation saves you from intuition bias.",
    why: "Every product decision is a hypothesis. Without A/B testing, you're guessing. With it, you're proving. The companies that experiment fastest learn fastest. Netflix runs hundreds of experiments simultaneously — that's their moat.",
    howItFits: "Phase 2 taught API integration with third parties. Your experimentation platform IS an API: assign variants, log exposures, compute results. Phase 4's architecture patterns (feature flags, traffic splitting) are the infrastructure that makes experiments possible.",
    connectedPhases: [
      { phase: 2, title: "Third-party analytics and flag APIs", link: "/phase-2" },
      { phase: 4, title: "Feature flags and traffic routing architecture", link: "/phase-4" },
      { phase: 7, title: "Experimentation drives monetisation decisions", link: "/phase-7" },
    ],
    coreConcepts: [
      { term: "Statistical significance", definition: "The probability that the observed difference isn't due to chance. Industry standard: p < 0.05 (95% confidence)." },
      { term: "Sample size", definition: "How many users you need per variant to detect a meaningful effect. Too few = inconclusive. Use a power calculator before starting." },
      { term: "Minimum Detectable Effect (MDE)", definition: "The smallest improvement you care about. If you need a 10% lift to justify the work, set MDE = 10%." },
      { term: "Guardrail metrics", definition: "Metrics that must NOT degrade (latency, error rate, revenue). Even if your experiment wins on the primary metric, guardrails can kill it." },
      { term: "Novelty effect", definition: "Users engage more with something just because it's new. Wait 2+ weeks before calling a winner." },
      { term: "Simpson's paradox", definition: "A trend that appears in groups reverses when combined. Always segment experiment results by key cohorts (new vs returning, mobile vs desktop)." },
    ],
    pipeline: [
      { step: "Form a hypothesis", detail: "'Changing the CTA from blue to green will increase click-through rate by 5%.' Specific, measurable, time-bound." },
      { step: "Calculate sample size", detail: "Use a power calculator. Inputs: baseline rate, MDE, significance level (0.05), power (0.8). This tells you how long to run." },
      { step: "Implement with feature flags", detail: "Flag gates the variant. Assignment must be deterministic (hash of user_id + experiment_id) so users see consistent experience." },
      { step: "Run and wait", detail: "Don't peek. Don't stop early. Multiple comparisons inflate false positives. Pre-commit to the duration." },
      { step: "Analyse results", detail: "Check primary metric, guardrails, and segments. Use Bayesian or frequentist analysis — pick one and be consistent." },
      { step: "Ship or kill", detail: "If significant and guardrails pass: ship. If not significant: kill and learn. Document either way." },
    ],
    techStack: [
      { category: "Feature flags", tools: ["LaunchDarkly", "Unleash", "Flagsmith", "GrowthBook"] },
      { category: "Analytics", tools: ["Amplitude", "Mixpanel", "PostHog (open-source)", "Snowflake + dbt"] },
      { category: "Statistics", tools: ["SciPy (Python)", "Apache Commons Math (Java)", "Stan (Bayesian)", "GrowthBook engine"] },
      { category: "Orchestration", tools: ["Eppo", "Statsig", "GrowthBook", "Custom (Kafka + warehouse)"] },
    ],
    antiPatterns: [
      { mistake: "Peeking at results daily and stopping early", fix: "Pre-commit to a run duration based on sample size calculation. Early stopping inflates false positive rate." },
      { mistake: "No guardrail metrics", fix: "Always track latency, error rate, and revenue alongside your primary metric. A 'winning' experiment that increases errors is a loser." },
      { mistake: "Testing too many things at once", fix: "One change per experiment. If you change copy, color, and layout simultaneously, you can't attribute the effect." },
      { mistake: "Ignoring Simpson's paradox", fix: "Always segment by key dimensions (platform, user tenure, geography). Overall results can hide opposite effects in subgroups." },
    ],
    springContext: {
      headline: "Spring + feature flags + event logging builds a full experimentation platform",
      points: [
        "HandlerInterceptor assigns experiment variants based on hash(userId + experimentId) — deterministic and stateless",
        "Spring AOP @Around advice logs experiment exposures to Kafka for warehouse analysis",
        "RedisTemplate caches variant assignments so the same user always sees the same experience",
        "@ConditionalOnProperty or custom @ExperimentVariant annotation to gate code paths",
        "Spring Actuator exposes experiment assignment counts as Prometheus metrics",
        "Apache Commons Math for server-side significance calculations (TTest, ChiSquareTest)",
      ],
      codeSketch: `@Component
@RequiredArgsConstructor
public class ExperimentService {

    private final RedisTemplate<String, String> redis;
    private final KafkaTemplate<String, Object> kafka;

    public String assignVariant(String userId, String experimentId) {
        String key = "exp:" + experimentId + ":" + userId;
        String cached = redis.opsForValue().get(key);
        if (cached != null) return cached;

        // Deterministic assignment via consistent hashing
        int hash = Math.abs((userId + experimentId).hashCode());
        String variant = (hash % 100 < 50) ? "control" : "treatment";

        redis.opsForValue().set(key, variant, Duration.ofDays(30));

        // Log exposure for analysis
        kafka.send("experiment.exposure", Map.of(
            "userId", userId,
            "experimentId", experimentId,
            "variant", variant,
            "timestamp", Instant.now().toString()
        ));
        return variant;
    }
}`,
    },
  },
  {
    id: "recommendations",
    name: "Recommendation Systems",
    icon: "🎯",
    color: "from-rose-500 to-pink-600",
    tagline: "Personalise what every user sees — the highest-ROI ML application",
    paretoInsight: "80% of recommendation value comes from collaborative filtering on implicit signals (clicks, views, purchases). Start there before touching content-based or deep learning approaches.",
    why: "Recommendations are the most deployed ML system in the world. Every e-commerce, streaming, social, and content platform uses them. They directly drive revenue, engagement, and retention — and they're simpler to start than you think.",
    howItFits: "Phase 1 taught REST APIs. A recommendation API is a GET /recommendations?userId=123 that returns ranked items. Phase 5's top-K algorithms power the final ranking step. Phase 7's SaaS and marketplace models depend on recommendations for retention.",
    connectedPhases: [
      { phase: 1, title: "REST API that serves recommendations", link: "/phase-1" },
      { phase: 5, title: "Top-K / heap algorithms for ranking", link: "/phase-5" },
      { phase: 7, title: "Recommendations drive SaaS retention and marketplace engagement", link: "/phase-7" },
    ],
    coreConcepts: [
      { term: "Collaborative filtering", definition: "Users who liked similar things will like the same new things. No content understanding needed — just interaction patterns." },
      { term: "Content-based filtering", definition: "Recommend items similar to what a user has liked. Uses item attributes (genre, tags, description embeddings)." },
      { term: "Hybrid approach", definition: "Combine collaborative + content-based. Collaborative for warm users, content-based for cold-start (new users with no history)." },
      { term: "Implicit vs explicit feedback", definition: "Implicit: clicks, views, time-spent (abundant, noisy). Explicit: ratings, likes (sparse, cleaner). Implicit wins at scale." },
      { term: "Cold start problem", definition: "New users or new items have no interaction history. Solve with content-based fallback, popularity, or onboarding quizzes." },
      { term: "Two-stage ranking", definition: "Stage 1 (retrieval): fast candidate generation (top 1000 from millions). Stage 2 (ranking): precise scoring of candidates. All production recsys use this." },
    ],
    pipeline: [
      { step: "Collect interaction events", detail: "Log every view, click, purchase, add-to-cart, search. Store in a data warehouse. This IS your training data." },
      { step: "Build a user-item matrix", detail: "Rows = users, columns = items, values = interaction strength. Sparse by nature — most entries are zero." },
      { step: "Train a retrieval model", detail: "ALS (Alternating Least Squares) or embedding-based (two-tower model). Generates candidate items per user." },
      { step: "Train a ranking model", detail: "XGBoost or a simple neural net that scores candidates using user features, item features, and context." },
      { step: "Serve via API", detail: "GET /recommendations?userId=X returns top-N items. Pre-compute for popular users, compute on-demand for the tail." },
      { step: "Measure and iterate", detail: "Track CTR, conversion rate, and diversity. A/B test model changes. Avoid filter bubbles by injecting exploration." },
    ],
    techStack: [
      { category: "Algorithms", tools: ["ALS (Spark MLlib)", "Two-tower (TensorFlow/PyTorch)", "XGBoost (ranking)", "Annoy/FAISS (nearest neighbor)"] },
      { category: "Feature store", tools: ["Feast", "Redis (user/item features)", "DynamoDB"] },
      { category: "Serving", tools: ["FastAPI", "Spring Boot + DJL", "TensorFlow Serving", "BentoML"] },
      { category: "Evaluation", tools: ["NDCG", "MAP@K", "A/B testing (Phase 8: Experimentation)", "Offline replay"] },
    ],
    antiPatterns: [
      { mistake: "Starting with deep learning", fix: "Start with ALS or item-based collaborative filtering. It's simpler, faster, and often just as good." },
      { mistake: "Optimizing only for clicks", fix: "Clicks without conversions = clickbait. Optimize for downstream value (purchase, retention, satisfaction)." },
      { mistake: "No diversity or exploration", fix: "Inject 10-20% non-personalized items to avoid filter bubbles and discover new user interests." },
      { mistake: "Ignoring the cold start", fix: "New users see garbage if you only use collaborative filtering. Fall back to popularity or content-based for < 5 interactions." },
    ],
    springContext: {
      headline: "Spring Boot serves recommendations as a standard REST microservice",
      points: [
        "@RestController GET /api/recommendations/{userId} returns ranked items — it's just a REST API",
        "Redis stores pre-computed recommendations per user; Spring @Cacheable with TTL for freshness",
        "FAISS or Annoy wrapped via JNI or a Python sidecar for nearest-neighbor retrieval",
        "Spring Kafka ingests interaction events for real-time candidate refreshing",
        "@Scheduled nightly batch re-trains the model and refreshes Redis recommendations",
        "A/B testing (ExperimentService from earlier) gates which model version serves each user",
      ],
      codeSketch: `@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recService;
    private final ExperimentService experiments;

    @GetMapping("/{userId}")
    public ResponseEntity<List<RecommendedItem>> recommend(
            @PathVariable String userId,
            @RequestParam(defaultValue = "20") int limit) {
        String modelVariant = experiments.assignVariant(
            userId, "rec-model-v3");
        List<RecommendedItem> items = recService
            .getRecommendations(userId, limit, modelVariant);
        return ResponseEntity.ok(items);
    }
}`,
    },
  },
  {
    id: "ml-monitoring",
    name: "ML Monitoring & Observability",
    icon: "📊",
    color: "from-cyan-500 to-blue-600",
    tagline: "Detect when your model silently degrades before users notice",
    paretoInsight: "80% of ML incidents are caught by monitoring input data distributions, not model outputs. If the inputs change, the outputs will follow. Watch the data, not just the predictions.",
    why: "A model that was 95% accurate at deploy time can quietly drop to 70% as the world changes. Unlike a crashed server (which alerts immediately), a degraded model keeps serving — just badly. ML monitoring is the immune system that catches this.",
    howItFits: "Phase 4 covered observability for APIs (metrics, logs, traces). ML monitoring adds a new dimension: statistical monitoring of data quality, prediction distributions, and model performance. Same infrastructure (Prometheus, Grafana), different signals.",
    connectedPhases: [
      { phase: 4, title: "API observability patterns (metrics, alerting)", link: "/phase-4" },
      { phase: 5, title: "Sliding window algorithms for drift detection", link: "/phase-5" },
      { phase: 3, title: "Event-driven architecture for monitoring pipelines", link: "/phase-3" },
    ],
    coreConcepts: [
      { term: "Data drift", definition: "Input feature distributions shift from what the model saw in training. E.g., average order value increases 40% during a sale — the model wasn't trained on this." },
      { term: "Concept drift", definition: "The relationship between features and the target changes. What used to predict churn no longer does because user behaviour evolved." },
      { term: "Prediction drift", definition: "The distribution of model outputs changes unexpectedly. If your fraud model suddenly flags 30% of transactions instead of 2%, something is wrong." },
      { term: "PSI (Population Stability Index)", definition: "Measures how much a distribution has shifted. PSI > 0.2 = significant drift, investigate immediately." },
      { term: "Shadow scoring", definition: "Run the new model alongside the old one, compare predictions on live data. Validates before switching traffic." },
      { term: "Retraining trigger", definition: "Automated rule: if PSI > threshold for 3 consecutive days, trigger model retraining pipeline. Human reviews before promotion." },
    ],
    pipeline: [
      { step: "Log everything", detail: "Every prediction request: input features, model version, prediction, latency, timestamp. This is your audit trail." },
      { step: "Compute baseline distributions", detail: "From the training data, compute mean, variance, quantiles for each feature. This is your reference." },
      { step: "Compare live vs baseline", detail: "Hourly or daily: compute the same stats on production data. Use PSI or KS-test to measure shift." },
      { step: "Monitor output distributions", detail: "Track prediction score histograms. If the distribution shape changes, the model is behaving differently." },
      { step: "Track business metrics", detail: "Connect model predictions to outcomes: did the fraud flag actually catch fraud? Conversion rate after recommendation?" },
      { step: "Automate retraining triggers", detail: "If drift exceeds threshold for N days, trigger pipeline. Never auto-deploy — always human-in-the-loop for promotion." },
    ],
    techStack: [
      { category: "Monitoring", tools: ["Evidently AI (open-source)", "WhyLabs", "Arize", "NannyML"] },
      { category: "Metrics & dashboards", tools: ["Prometheus + Grafana", "Datadog", "Custom (SQL + Looker)"] },
      { category: "Alerting", tools: ["PagerDuty", "Opsgenie", "Prometheus Alertmanager", "Custom Kafka consumers"] },
      { category: "Logging", tools: ["Kafka (prediction events)", "BigQuery/Snowflake (analysis)", "MLflow (model metadata)"] },
    ],
    antiPatterns: [
      { mistake: "Only monitoring API latency and error rates", fix: "Add data quality, prediction distribution, and feature drift checks. A model can be fast and wrong." },
      { mistake: "No baseline to compare against", fix: "Always store training data statistics. Without a baseline, you can't detect drift." },
      { mistake: "Auto-retraining without review", fix: "Automate the trigger and pipeline run. Always require human approval before promoting to production." },
      { mistake: "Monitoring model accuracy only in aggregate", fix: "Slice by cohort (new users, high-value, mobile). Accuracy can be great overall but terrible for a segment." },
    ],
    springContext: {
      headline: "Spring Actuator + Micrometer tracks ML-specific metrics alongside standard API observability",
      points: [
        "Custom Micrometer gauges for prediction distribution percentiles (P50, P95, P99 of scores)",
        "Spring AOP @Around advice on prediction methods logs feature vectors to Kafka for offline analysis",
        "Scheduled @Component computes PSI hourly by comparing Redis feature distributions to baseline",
        "Spring Actuator /health endpoint includes a custom ModelHealthIndicator (drift status, model age)",
        "Prometheus AlertManager rules on ml_feature_drift_psi > 0.2 trigger PagerDuty",
        "Spring Events publish DriftDetectedEvent that triggers retraining pipeline via Kafka",
      ],
      codeSketch: `@Component
@RequiredArgsConstructor
public class DriftMonitor {

    private final RedisTemplate<String, double[]> redis;
    private final MeterRegistry metrics;
    private final KafkaTemplate<String, Object> kafka;

    @Scheduled(cron = "0 0 * * * *") // hourly
    public void checkFeatureDrift() {
        double[] baseline = redis.opsForValue()
            .get("baseline:feature:avg_order_value");
        double[] live = redis.opsForValue()
            .get("live:feature:avg_order_value");

        double psi = computePSI(baseline, live);
        metrics.gauge("ml.feature.drift.psi",
            Tags.of("feature", "avg_order_value"), psi);

        if (psi > 0.2) {
            kafka.send("ml.drift.detected", Map.of(
                "feature", "avg_order_value",
                "psi", psi,
                "timestamp", Instant.now().toString()
            ));
        }
    }
}`,
    },
  },
]

export function getDSCategory(id: string): DSCategory | undefined {
  return dsCategories.find((c) => c.id === id)
}
