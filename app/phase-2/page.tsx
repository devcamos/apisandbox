import PhaseLayout from "@/components/PhaseLayout";
import ConceptCard from "@/components/ConceptCard";
import ProjectCard from "@/components/ProjectCard";
import { Plug, Key, Shield, RefreshCw, Zap, Database } from "lucide-react";

export default function Phase2() {
  return (
    <PhaseLayout
      phaseNumber={2}
      title="Third-Party Integrations"
      description="Safely connect and maintain external APIs"
      icon={Plug}
      color="from-purple-500 to-pink-500"
    >
      {/* Goal Section */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold text-white mb-3">⚙️ Phase Goal</h2>
        <p className="text-gray-300 text-lg">
          Learn to safely integrate with external APIs, handle authentication flows, implement resilience patterns,
          and manage data transformation across different service boundaries.
        </p>
      </div>

      {/* Auth Flows */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Authentication Flows</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ConceptCard
            icon={Shield}
            title="OAuth2"
            description="Industry-standard protocol for authorization"
            items={[
              "Authorization Code Flow",
              "Client Credentials Flow",
              "Access & Refresh Tokens",
              "Scope-based permissions"
            ]}
            color="from-purple-500 to-pink-500"
          />
          <ConceptCard
            icon={Key}
            title="API Keys"
            description="Simple authentication using static keys"
            items={[
              "Easy to implement",
              "Passed in headers or query params",
              "Rate limiting per key",
              "Key rotation strategies"
            ]}
            color="from-blue-500 to-cyan-500"
          />
          <ConceptCard
            icon={Shield}
            title="JWT (JSON Web Tokens)"
            description="Self-contained tokens for stateless auth"
            items={[
              "Signed and optionally encrypted",
              "Contains claims about user",
              "No server-side session storage",
              "Expiration handling"
            ]}
            color="from-orange-500 to-red-500"
          />
        </div>
      </section>

      {/* Auth Code Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Implementation Examples</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">OAuth2 Flow</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <pre>{`// 1. Redirect to authorization endpoint
const authUrl = \`https://auth.example.com/authorize?
  client_id=\${clientId}&
  redirect_uri=\${redirectUri}&
  response_type=code&
  scope=read write\`;

// 2. Exchange code for token
const tokenResponse = await fetch(
  'https://auth.example.com/token',
  {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  }
);

const { access_token, refresh_token } = 
  await tokenResponse.json();`}</pre>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">JWT Validation</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <pre>{`import jwt from 'jsonwebtoken';

// Verify JWT token
function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET!
    );
    
    // Check expiration
    if (decoded.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Middleware
app.use((req, res, next) => {
  const token = req.headers.authorization
    ?.split(' ')[1];
  
  req.user = verifyToken(token);
  next();
});`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Resilience Patterns */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Resilience Patterns</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <ConceptCard
            icon={RefreshCw}
            title="Retries & Exponential Backoff"
            description="Automatically retry failed requests with increasing delays"
            items={[
              "Retry transient failures (5xx, timeouts)",
              "Exponential backoff: 1s, 2s, 4s, 8s...",
              "Maximum retry attempts",
              "Jitter to prevent thundering herd"
            ]}
            color="from-green-500 to-emerald-500"
          />
          
          <ConceptCard
            icon={Zap}
            title="Circuit Breaker"
            description="Prevent cascading failures by failing fast"
            items={[
              "States: Closed, Open, Half-Open",
              "Open after threshold failures",
              "Periodic recovery attempts",
              "Resilience4j implementation"
            ]}
            color="from-red-500 to-pink-500"
          />
          
          <ConceptCard
            icon={Database}
            title="Caching"
            description="Reduce load and improve response times"
            items={[
              "In-memory (Redis) or CDN caching",
              "Cache-Control headers",
              "TTL (Time To Live) strategies",
              "Cache invalidation patterns"
            ]}
            color="from-yellow-500 to-amber-500"
          />
          
          <ConceptCard
            icon={Shield}
            title="Rate Limiting"
            description="Protect APIs from overuse"
            items={[
              "Token bucket algorithm",
              "Sliding window counters",
              "Per-user or per-IP limits",
              "429 Too Many Requests response"
            ]}
            color="from-indigo-500 to-purple-500"
          />
        </div>
      </section>

      {/* Resilience Code Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Resilience Implementation</h2>
        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Retry with Exponential Backoff</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <pre>{`async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  maxRetries = 3
) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(\`Client error: \${response.status}\`);
      }
      
      // Success!
      if (response.ok) return response;
      
      // Server error, will retry
      lastError = new Error(\`Server error: \${response.status}\`);
    } catch (error) {
      lastError = error;
    }
    
    // Don't wait after last attempt
    if (attempt < maxRetries) {
      // Exponential backoff with jitter
      const baseDelay = Math.pow(2, attempt) * 1000;
      const jitter = Math.random() * 1000;
      await new Promise(resolve => 
        setTimeout(resolve, baseDelay + jitter)
      );
    }
  }
  
  throw lastError;
}`}</pre>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Circuit Breaker Pattern</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <pre>{`class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: number;
  
  constructor(
    private threshold = 5,
    private timeout = 60000 // 1 minute
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime! > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Data Transformation */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Data Transformation</h2>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <p className="text-gray-300 mb-6">
            Transform external API responses into internal domain models to maintain clean architecture
            and protect against external changes.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">External API Response</h4>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
                <pre>{`{
  "user_id": "ext_123",
  "full_name": "John Doe",
  "email_address": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "subscription": {
    "plan_name": "premium",
    "expires": "2024-12-31"
  }
}`}</pre>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Internal Domain Model</h4>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
                <pre>{`interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  subscription: {
    tier: 'free' | 'premium' | 'enterprise';
    expiresAt: Date;
  };
}

// Adapter/Mapper
function mapToUser(external: any): User {
  return {
    id: external.user_id,
    name: external.full_name,
    email: external.email_address,
    createdAt: new Date(external.created_at),
    subscription: {
      tier: external.subscription.plan_name,
      expiresAt: new Date(external.subscription.expires)
    }
  };
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">🧩 Phase Project</h2>
        <ProjectCard
          title="Third-Party API Integration"
          description="Integrate with a public API (Stripe, GitHub, or OpenWeather) with full error handling, retries, caching, and logging."
          requirements={[
            "Choose a public API (Stripe payment, GitHub repos, or OpenWeather data)",
            "Implement OAuth2 or API key authentication",
            "Add retry logic with exponential backoff",
            "Implement circuit breaker pattern",
            "Add response caching with TTL",
            "Create data transformation layer (external -> internal models)",
            "Add comprehensive error handling and logging",
            "Display results in a clean UI"
          ]}
        />
      </section>
    </PhaseLayout>
  );
}

