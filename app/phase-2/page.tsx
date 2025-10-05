"use client";

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

      {/* Pareto Principle Summary */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6 mb-12">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <span className="text-3xl">📊</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Pareto Principle: The 20% That Matters</h2>
            <p className="text-gray-300 text-sm italic">Master these patterns to handle 80% of third-party integration challenges</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">🔐 Auth Essentials</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">1.</span>
                <span><strong>OAuth2 + API Keys</strong> - These two cover 95% of third-party auth needs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">2.</span>
                <span><strong>Never hardcode secrets</strong> - Use environment variables or secret managers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">3.</span>
                <span><strong>Token refresh logic</strong> - Handle expired tokens gracefully with retry</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">🛡️ Resilience Patterns</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span><strong>Timeouts</strong> - Set for every external call (typically 5-30 seconds)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">2.</span>
                <span><strong>Retries with exponential backoff</strong> - 3 retries covers most transient failures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">3.</span>
                <span><strong>Circuit breakers</strong> - Stop calling failing services to prevent cascading failures</span>
              </li>
            </ul>
          </div>
        </div>
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
            demoLink="/phase-2/demos/oauth2"
            documentation={{
              overview: "OAuth 2.0 is the industry-standard protocol for authorization. It enables applications to obtain limited access to user accounts on an HTTP service. OAuth2 works by delegating user authentication to the service that hosts the user account.",
              description: [
                "Authorization code flow is the most secure for server-side apps",
                "Client credentials flow for machine-to-machine communication",
                "Access tokens are short-lived (typically 1 hour)",
                "Refresh tokens can obtain new access tokens without re-authentication",
                "Scopes limit what the application can access",
                "State parameter prevents CSRF attacks"
              ],
              useCases: [
                "Social login (Sign in with Google, GitHub, Facebook)",
                "Third-party app authorization (e.g., Zapier accessing your Gmail)",
                "Mobile app authentication",
                "Single Sign-On (SSO) systems",
                "API access delegation"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Authorization Code Flow - use for web/mobile apps (95% of cases)",
                  "Never expose client_secret in frontend - always server-side",
                  "Always use HTTPS for OAuth flows - tokens are sensitive",
                  "Implement token refresh logic - access tokens expire",
                  "Use PKCE for mobile/SPA apps - prevents authorization code interception"
                ]
              },
              bestFor: [
                "User-facing applications requiring delegated access",
                "Third-party integrations",
                "Applications needing fine-grained permissions (scopes)",
                "Mobile and single-page applications",
                "When you need to avoid storing user passwords"
              ],
              notIdealFor: [
                "Simple internal services (use API keys)",
                "Machine-to-machine with no user context (use client credentials or mTLS)",
                "Real-time applications (adds latency)",
                "When you control both client and server (simpler auth may suffice)"
              ]
            }}
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
            demoLink="/phase-2/demos/api-keys"
            documentation={{
              overview: "API Keys are simple authentication tokens that identify the calling application. They're static strings passed in request headers or query parameters, providing a straightforward way to authenticate API requests.",
              description: [
                "Unique identifier for each application or user",
                "Can be passed in Authorization header (preferred) or query params",
                "Easy to implement and understand",
                "Supports rate limiting per key",
                "Should be rotated regularly for security",
                "Never commit keys to version control"
              ],
              useCases: [
                "Third-party API access (OpenWeatherMap, Stripe, SendGrid)",
                "Internal microservice authentication",
                "Development and testing environments",
                "Simple machine-to-machine communication",
                "APIs with basic security requirements"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Always use headers (X-API-Key) not query params - headers don't appear in logs",
                  "Store keys in environment variables - never hardcode",
                  "Implement rate limiting per key - prevents abuse",
                  "Use different keys for dev/staging/prod - isolate environments",
                  "Rotate keys regularly - monthly or after suspected compromise"
                ]
              },
              bestFor: [
                "Simple authentication needs",
                "Internal service-to-service calls",
                "Third-party API integration",
                "When OAuth is overkill",
                "Development and testing"
              ],
              notIdealFor: [
                "User-facing applications (use OAuth2)",
                "When you need fine-grained permissions",
                "High-security requirements (keys can be stolen)",
                "Browser-based apps (keys get exposed)",
                "When you need user context"
              ]
            }}
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
            demoLink="/phase-2/demos/retry"
            documentation={{
              overview: "Retry logic with exponential backoff is a resilience pattern that automatically retries failed requests with increasing delays between attempts. This handles transient failures gracefully without overwhelming the failing service.",
              description: [
                "Exponential backoff doubles delay each retry: 1s, 2s, 4s, 8s",
                "Jitter adds randomness to prevent thundering herd",
                "Only retry idempotent operations (GET, PUT, DELETE)",
                "Set maximum retry attempts (typically 3-5)",
                "Retry on transient errors (5xx, timeouts, connection errors)",
                "Don't retry client errors (4xx except 429)"
              ],
              useCases: [
                "Network glitches and temporary connectivity issues",
                "Service temporarily overloaded",
                "Rate limiting (429 Too Many Requests)",
                "Database connection failures",
                "Distributed system temporary inconsistencies"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "3 retries covers 99% of transient failures - more is usually excessive",
                  "Exponential backoff prevents overwhelming recovering services",
                  "Add jitter (random ±25%) to prevent synchronized retries",
                  "Only retry safe operations (GET, PUT, DELETE) - not POST unless idempotent",
                  "Use libraries (Axios interceptors, Polly, retry-axios) - don't roll your own"
                ]
              },
              bestFor: [
                "Transient network failures",
                "Services with occasional hiccups",
                "Idempotent operations",
                "Distributed systems",
                "Third-party API calls"
              ],
              notIdealFor: [
                "User-interactive operations (too slow)",
                "Non-idempotent operations without special handling",
                "When immediate failure feedback is needed",
                "Operations with strict time constraints",
                "Permanent failures (will just delay error)"
              ]
            }}
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
            demoLink="/phase-2/demos/circuit-breaker"
            documentation={{
              overview: "Circuit Breaker is a resilience pattern that prevents cascading failures by stopping requests to a failing service. It monitors for failures and 'opens the circuit' to fail fast, giving the downstream service time to recover.",
              description: [
                "Closed state: Requests flow normally",
                "Open state: All requests fail immediately (circuit 'tripped')",
                "Half-Open state: Test requests to check if service recovered",
                "Opens after threshold consecutive failures (e.g., 5 failures)",
                "Stays open for timeout period (e.g., 60 seconds)",
                "Transitions to half-open to test recovery"
              ],
              useCases: [
                "Microservices calling other microservices",
                "Third-party API integrations",
                "Database connection pools",
                "Payment gateway calls",
                "Any external dependency that might fail"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Threshold of 5 failures works for most cases - adjust based on traffic",
                  "Open timeout of 30-60 seconds gives service time to recover",
                  "Always have fallback behavior - cached data, default values, or friendly error",
                  "Use circuit breaker libraries (Resilience4j, Polly, Hystrix) - complex to implement",
                  "Monitor circuit state - if often open, investigate root cause"
                ]
              },
              bestFor: [
                "Services with cascading failure risk",
                "External dependencies (third-party APIs)",
                "High-traffic applications",
                "Microservice architectures",
                "When fast failure is better than slow failure"
              ],
              notIdealFor: [
                "Single-service applications",
                "When you need to try every request (e.g., financial transactions)",
                "Low-traffic services (not enough data for good decisions)",
                "When failures are always transient (use retries)",
                "Simple request-response with no cascading risk"
              ]
            }}
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

