"use client";

import PhaseLayout from "@/components/PhaseLayout";
import ConceptCard from "@/components/ConceptCard";
import PhaseQuiz from "@/components/PhaseQuiz";
import ProjectCard from "@/components/ProjectCard";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { LessonTracker } from "@/components/LessonTracker";
import { Plug, Key, Shield, RefreshCw, Zap, Database, CreditCard, Mail, Folder } from "lucide-react";

import { ExpandableCodeBlock } from "@/components/HighlightedCodeBlock"
export default function Phase2() {
  return (
    <SubscriptionGate phaseNumber={2} lockedContentName="Phase 2: Third-Party Integrations">
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

      <LessonTracker phase={2} />

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
            demoLink="/phase-2/demos/jwt"
            documentation={{
              overview: "JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims between two parties. They are self-contained: the token carries identity and optional payload (claims), and can be verified using a shared secret or public key, so servers don't need to store session state.",
              description: [
                "Three parts: header (algorithm), payload (claims), signature",
                "Signed with HMAC (shared secret) or RSA/ECDSA (public/private key)",
                "Standard claims: sub (subject), exp (expiration), iat (issued at)",
                "Stateless: server verifies signature instead of looking up session",
                "Short-lived access tokens (minutes to hours) reduce risk",
                "Often used with OAuth2 as the format for access tokens"
              ],
              useCases: [
                "API authentication (Bearer token in Authorization header)",
                "Stateless sessions (no server-side session store)",
                "OAuth2 access tokens and OpenID Connect ID tokens",
                "Microservice-to-microservice authentication",
                "Single Sign-On (SSO) and session sharing across domains"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Verify on every request - check signature and exp (expiration)",
                  "Use HTTPS only - tokens are sensitive",
                  "Keep access tokens short-lived (e.g. 15 min); use refresh tokens for longer sessions",
                  "Never put secrets in the payload - it's base64-encoded, not encrypted",
                  "Store signing secret server-side only; use strong keys (e.g. 256-bit for HS256)"
                ]
              },
              bestFor: [
                "Stateless API authentication",
                "Distributed systems (no shared session store)",
                "Mobile and SPA backends",
                "When OAuth2 issues tokens in JWT format",
                "Service-to-service auth with key pairs"
              ],
              notIdealFor: [
                "Revocation before expiry (no built-in revoke; use short expiry or token blocklist)",
                "Very large claims (token size grows)",
                "Highly sensitive data in payload (use encryption or avoid)",
                "Legacy systems that expect cookies or API keys only"
              ]
            }}
          />
        </div>
      </section>

      {/* Auth Code Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Implementation Examples</h2>
        
        {/* OAuth2 Examples */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">OAuth2 Flow</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚛️</span>
                <h4 className="text-lg font-bold text-white">TypeScript/Node.js</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`// 1. Redirect to authorization endpoint
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
  await tokenResponse.json();`} />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">☕</span>
                <h4 className="text-lg font-bold text-white">Java Spring Boot</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`@RestController
@RequestMapping("/api/auth")
public class OAuth2Controller {
    
    @Autowired
    private OAuth2AuthorizedClientService clientService;
    
    @GetMapping("/authorize")
    public String authorize() {
        // Build authorization URL
        String authUrl = "https://auth.example.com/authorize" +
            "?client_id=" + clientId +
            "&redirect_uri=" + redirectUri +
            "&response_type=code" +
            "&scope=read write";
        return authUrl;
    }
    
    @GetMapping("/callback")
    public ResponseEntity<TokenResponse> callback(
        @RequestParam String code) {
        
        // Exchange code for token
        OAuth2AccessTokenResponse response = 
            oauth2Service.getAccessToken(code);
        
        return ResponseEntity.ok(new TokenResponse(
            response.getAccessToken().getTokenValue(),
            response.getRefreshToken().getTokenValue()
        ));
    }
}`} />
              </div>
            </div>
          </div>
        </div>

        {/* JWT Validation Examples */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">JWT Validation</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚛️</span>
                <h4 className="text-lg font-bold text-white">TypeScript/Node.js</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import jwt from 'jsonwebtoken';

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
});`} />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">☕</span>
                <h4 className="text-lg font-bold text-white">Java Spring Boot</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;

@Service
public class JwtService {
    
    private String secret = System.getenv("JWT_SECRET");
    
    public Claims verifyToken(String token) {
        try {
            return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
        } catch (Exception e) {
            throw new InvalidTokenException("Invalid token");
        }
    }
}

// Filter/Interceptor
@Component
public class JwtAuthenticationFilter 
    extends OncePerRequestFilter {
    
    @Autowired
    private JwtService jwtService;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain) {
        
        String token = extractToken(request);
        if (token != null) {
            Claims claims = jwtService.verifyToken(token);
            // Set authentication context
        }
        filterChain.doFilter(request, response);
    }
}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where Backend Meets Frontend: React + Java */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          Where Backend Meets Frontend: React + Java
        </h2>
        
        {/* Introduction */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <span className="text-3xl">🤝</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">The Meeting Point</h3>
              <p className="text-gray-300">
                Your <strong>React frontend</strong> and <strong>Java backend</strong> don't need to know 
                about each other's internal implementation. They meet at the <strong>API contract</strong> - 
                a simple agreement on HTTP methods, endpoints, and JSON structure. This contract is what 
                enables them to communicate seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* The Contract - Visual Representation */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">📋 The API Contract</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚛️</div>
              <div className="font-semibold text-white mb-1">React Frontend</div>
              <div className="text-gray-400 text-xs">Makes HTTP requests</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📡</div>
              <div className="font-semibold text-white mb-1">API Contract</div>
              <div className="text-gray-400 text-xs">HTTP + JSON</div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">☕</div>
              <div className="font-semibold text-white mb-1">Java Backend</div>
              <div className="text-gray-400 text-xs">Returns JSON responses</div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
            <div className="text-green-400 mb-2">Contract Definition:</div>
            <div className="space-y-1">
              <div>GET /api/users/{`{id}`} → Returns User JSON</div>
              <div>POST /api/users → Accepts User JSON, Returns Created User</div>
              <div>PUT /api/users/{`{id}`} → Accepts User JSON, Returns Updated User</div>
              <div>DELETE /api/users/{`{id}`} → Returns 204 No Content</div>
            </div>
          </div>
        </div>

        {/* Complete Example: Get User */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Complete Example: Fetching a User</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* React Frontend */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚛️</span>
                <h4 className="text-lg font-bold text-white">React Frontend</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Making request to API contract
    fetch(\`http://localhost:8080/api/users/\${userId}\`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      return response.json(); // Expecting JSON from contract
    })
    .then(data => {
      setUser(data);  // data matches contract structure
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}`} />
              </div>
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-gray-300">
                <strong className="text-blue-400">Key Point:</strong> React doesn't care if the backend 
                is Java, Python, or Node.js. It only cares about the HTTP + JSON contract.
              </div>
            </div>

            {/* Java Backend */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">☕</span>
                <h4 className="text-lg font-bold text-white">Java Backend</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(
        @PathVariable String id,
        @RequestHeader("Authorization") String auth) {
        
        // Validate token (internal logic)
        if (!isValidToken(auth)) {
            return ResponseEntity.status(401).build();
        }
        
        // Business logic (internal implementation)
        User user = userService.findById(id);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Return JSON matching contract
        // Spring Boot automatically serializes to JSON
        return ResponseEntity.ok(user);
    }
}

// User entity - automatically serialized to JSON
@Entity
public class User {
    private String id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    
    // Getters and setters
    // Spring Boot uses these to create JSON
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    // ...
}`} />
              </div>
              <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded text-xs text-gray-300">
                <strong className="text-orange-400">Key Point:</strong> Java doesn't care if the frontend 
                is React, Vue, or Angular. It only needs to fulfill the HTTP + JSON contract.
              </div>
            </div>
          </div>
        </div>

        {/* The JSON Contract */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">📦 The JSON Contract Structure</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2 text-sm">Request (React → Java)</h4>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`// POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com"
}`} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2 text-sm">Response (Java → React)</h4>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`// 200 OK
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}`} />
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded">
            <p className="text-gray-300 text-sm">
              <strong className="text-green-400">This JSON structure is the contract.</strong> As long as 
              both React and Java agree on this structure, they can work together regardless of their 
              internal implementations.
            </p>
          </div>
        </div>

        {/* More Examples */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Create User Example */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Creating a User</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-xs mb-2">React:</p>
                <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};`} />
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-xs mb-2">Java:</p>
                <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`@PostMapping
public ResponseEntity<User> createUser(
    @RequestBody User user) {
    User created = userService.save(user);
    return ResponseEntity
        .status(201)
        .body(created);
}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Error Handling Example */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Error Handling</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-xs mb-2">React:</p>
                <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`try {
  const response = await fetch('/api/users/123');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  const user = await response.json();
} catch (error) {
  console.error('Failed:', error);
}`} />
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-xs mb-2">Java:</p>
                <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`@GetMapping("/{id}")
public ResponseEntity<?> getUser(@PathVariable String id) {
    try {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    } catch (UserNotFoundException e) {
        return ResponseEntity
            .status(404)
            .body(new ErrorResponse("User not found"));
    }
}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">💡 Key Takeaways</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 text-sm mb-2">
                <strong className="text-yellow-400">1. Contract First:</strong> Define the API contract 
                (HTTP methods, endpoints, JSON structure) before implementation.
              </p>
              <p className="text-gray-300 text-sm mb-2">
                <strong className="text-yellow-400">2. Independence:</strong> React and Java teams can 
                work independently as long as they agree on the contract.
              </p>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-2">
                <strong className="text-yellow-400">3. Universal Standards:</strong> HTTP + JSON are 
                universal technologies that work across all platforms.
              </p>
              <p className="text-gray-300 text-sm mb-2">
                <strong className="text-yellow-400">4. Internal Details Don't Matter:</strong> React 
                doesn't need to know about Spring Boot, and Java doesn't need to know about React hooks.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Portability Disclaimer */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mt-6">
          <h3 className="text-xl font-bold text-white mb-4">💡 Key Technology Benefit: Platform Independence</h3>
          <p className="text-gray-300 text-sm mb-4">
            One of the major benefits of using modern, standardized technologies like <strong className="text-blue-400">Next.js</strong>, 
            <strong className="text-blue-400"> Spring Boot</strong>, and <strong className="text-blue-400">Prisma</strong>: 
            <strong> your application code doesn't care where services live.</strong>
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-blue-400 font-semibold mb-2">Next.js</p>
              <p className="text-gray-300">Runs identically on local dev, Vercel, AWS, Docker - same codebase, different deployment targets.</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-blue-400 font-semibold mb-2">Spring Boot</p>
              <p className="text-gray-300">Deploy anywhere Java runs: local, Docker, AWS, Azure, GCP - just configure environment variables.</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-blue-400 font-semibold mb-2">Prisma</p>
              <p className="text-gray-300">Works with SQLite locally, PostgreSQL in production - only `DATABASE_URL` changes, zero code changes.</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-500/20 rounded border border-blue-500/30">
            <p className="text-gray-300 text-sm">
              <strong>The key principle:</strong> Configure through environment variables, not code changes. 
              This enables seamless local development and flexible deployment options.
            </p>
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
              transientFailureCauses: {
                title: "Leading Causes of Transient Failures",
                points: [
                  "Short-lived network instability: packet loss, DNS lookup hiccups, TLS handshake failures, and temporary connection resets.",
                  "Dependency overload: downstream service is saturated, queue depth spikes, or a database pool is exhausted for a brief period.",
                  "Rate limiting and protection controls: 429 responses, burst caps, WAF throttles, and provider-side concurrency limits.",
                  "Cold starts and rolling deploys: new instances warming up, pods draining, or one zone recovering while others stay healthy.",
                  "Timeout mismatches: your client deadline is shorter than the dependency's temporary latency spike, even though the dependency is not permanently broken."
                ]
              },
              retryConfigs: {
                title: "Best Retry Configs (Good Defaults)",
                profiles: [
                  {
                    label: "Read-heavy external APIs",
                    config: "3 attempts, 250ms base delay, exponential factor 2, full jitter, max delay 2s",
                    why: "Fast recovery for brief provider hiccups without stretching user latency too far."
                  },
                  {
                    label: "Background jobs and webhooks",
                    config: "5 attempts, 1s base delay, exponential factor 2, full jitter, max delay 30s",
                    why: "Async work can tolerate a wider retry window and should trade speed for delivery success."
                  },
                  {
                    label: "Rate-limited providers",
                    config: "Honor Retry-After first, otherwise 3 attempts, 1s base delay, exponential factor 2, max delay 60s",
                    why: "Provider guidance beats guesswork. Retrying too early just burns quota and extends incidents."
                  },
                  {
                    label: "User-facing writes with idempotency keys",
                    config: "2 to 3 attempts, 500ms base delay, exponential factor 2, jitter, strict overall deadline",
                    why: "Keep duplicate-side-effect risk low and fail fast enough that the caller can still recover sensibly."
                  }
                ],
                rules: [
                  "Always set an overall deadline or retry budget, not just max attempts.",
                  "Retry only transient classes: 5xx, connection resets, timeouts, and 429 when policy allows it.",
                  "Do not retry validation/auth failures or business-logic rejections.",
                  "Prefer full jitter over synchronized fixed waits during outages.",
                  "Pair retries with idempotency keys or safe HTTP semantics when writes are involved."
                ]
              },
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
        
        {/* Retry with Exponential Backoff */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Retry with Exponential Backoff</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚛️</span>
                <h4 className="text-lg font-bold text-white">TypeScript/Node.js</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`async function fetchWithRetry(
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
}`} />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">☕</span>
                <h4 className="text-lg font-bold text-white">Java Spring Boot (Resilience4j)</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.retry.RetryConfig;

@Service
public class ExternalApiService {
    
    @Retry(name = "externalApi", fallbackMethod = "fallback")
    public ResponseEntity<String> callExternalApi(String url) {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForEntity(url, String.class);
    }
    
    // Fallback method
    public ResponseEntity<String> fallback(
        String url, Exception ex) {
        return ResponseEntity
            .status(503)
            .body("Service temporarily unavailable");
    }
}

// Configuration
@Configuration
public class RetryConfig {
    @Bean
    public RetryConfig retryConfiguration() {
        return RetryConfig.custom()
            .maxAttempts(3)
            .waitDuration(Duration.ofSeconds(1))
            .intervalFunction(IntervalFunction
                .ofExponentialBackoff(
                    Duration.ofSeconds(1), 2))
            .retryOnException(e -> 
                e instanceof HttpServerErrorException)
            .build();
    }
}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Circuit Breaker Pattern */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Circuit Breaker Pattern</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚛️</span>
                <h4 className="text-lg font-bold text-white">TypeScript/Node.js</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`class CircuitBreaker {
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
}`} />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">☕</span>
                <h4 className="text-lg font-bold text-white">Java Spring Boot (Resilience4j)</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;

@Service
public class PaymentService {
    
    @CircuitBreaker(
        name = "paymentService",
        fallbackMethod = "fallbackPayment"
    )
    public PaymentResult processPayment(
        PaymentRequest request) {
        // Call external payment gateway
        return paymentGateway.charge(request);
    }
    
    // Fallback when circuit is open
    public PaymentResult fallbackPayment(
        PaymentRequest request, Exception ex) {
        // Return cached/default response
        return PaymentResult.failed("Service unavailable");
    }
}

// Configuration
@Configuration
public class CircuitBreakerConfig {
    @Bean
    public CircuitBreakerConfig circuitBreaker() {
        return CircuitBreakerConfig.custom()
            .failureRateThreshold(50) // Open after 50% failures
            .waitDurationInOpenState(
                Duration.ofSeconds(60))
            .slidingWindowSize(10)
            .minimumNumberOfCalls(5)
            .build();
    }
}`} />
              </div>
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
                <ExpandableCodeBlock code={`{
  "user_id": "ext_123",
  "full_name": "John Doe",
  "email_address": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "subscription": {
    "plan_name": "premium",
    "expires": "2024-12-31"
  }
}`} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Internal Domain Model</h4>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
                <ExpandableCodeBlock code={`interface User {
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
}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Integration */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Payment Integration (Stripe)</h2>
        <ConceptCard
          icon={Shield}
          title="Stripe Payments"
          description="Industry-standard payment processing for subscriptions and one-time payments"
          items={[
            "Checkout sessions",
            "Webhook handling",
            "Subscription management",
            "Customer portal"
          ]}
          color="from-indigo-500 to-purple-500"
          documentation={{
            overview: "Stripe is the industry standard for payment processing. It handles PCI compliance, fraud detection, and global payments automatically.",
            description: [
              "Checkout sessions for secure payment collection",
              "Webhooks for real-time payment events",
              "Subscription management with automatic billing",
              "Customer portal for self-service",
              "Multi-currency support",
              "PCI compliance handled automatically"
            ],
            useCases: [
              "SaaS subscriptions",
              "One-time purchases",
              "Marketplace payments",
              "Donations",
              "Invoicing"
            ],
            paretoKnowledge: {
              title: "The 20% You Need to Know",
              points: [
                "Pricing: 2.9% + $0.30 per transaction",
                "Checkout sessions = secure payment pages",
                "Webhooks = real-time payment events",
                "Customer portal = self-service billing",
                "Test mode = use test cards for development"
              ]
            },
            bestFor: [
              "Most payment needs",
              "Subscriptions",
              "International payments",
              "When you need PCI compliance"
            ],
            notIdealFor: [
              "Very high volume (consider direct processors)",
              "When you need to handle tax/VAT (consider Paddle)",
              "Simple donation-only apps"
            ]
          }}
        />
        
        {/* Stripe Code Examples */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-bold text-white mb-3">Create Checkout Session</h4>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <ExpandableCodeBlock code={`import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price: 'price_xxx', // From Stripe dashboard
    quantity: 1,
  }],
  mode: 'subscription',
  success_url: 'https://yourapp.com/success',
  cancel_url: 'https://yourapp.com/cancel',
})

// Redirect user to session.url`} />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-bold text-white mb-3">Webhook Handler</h4>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <ExpandableCodeBlock code={`// app/api/stripe/webhook/route.ts
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!
  
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful payment
      break
    case 'customer.subscription.updated':
      // Handle subscription changes
      break
  }
  
  return Response.json({ received: true })
}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Email Integration */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Email Integration (Resend)</h2>
        <ConceptCard
          icon={Zap}
          title="Resend Email Service"
          description="Modern email API for transactional and marketing emails"
          items={[
            "React Email support",
            "TypeScript SDK",
            "Webhooks for delivery",
            "Simple API"
          ]}
          color="from-blue-500 to-cyan-500"
          documentation={{
            overview: "Resend provides the best developer experience for sending emails. It supports React Email templates and has excellent TypeScript support.",
            description: [
              "React Email support (component-based templates)",
              "TypeScript SDK with full type safety",
              "Webhooks for delivery tracking",
              "Domain verification for production",
              "Email analytics and insights",
              "Simple, intuitive API"
            ],
            useCases: [
              "Email verification",
              "Password reset",
              "Welcome emails",
              "Transaction notifications",
              "Marketing emails"
            ],
            paretoKnowledge: {
              title: "The 20% You Need to Know",
              points: [
                "Free tier: 3,000 emails/month",
                "React Email = component-based templates",
                "Webhooks = delivery status updates",
                "Domain verification = required for production",
                "Simple API = sendEmail({ to, subject, html })"
              ]
            },
            bestFor: [
              "Modern applications",
              "React/Next.js apps",
              "When you want great DX",
              "Transactional emails"
            ],
            notIdealFor: [
              "Very high volume (>100k/month - use AWS SES)",
              "Enterprise features (consider SendGrid)",
              "Simple SMTP needs"
            ]
          }}
        />
        
        {/* Resend Code Examples */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-bold text-white mb-3">Send Email</h4>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <ExpandableCodeBlock code={`import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'onboarding@yourdomain.com',
  to: user.email,
  subject: 'Welcome!',
  html: '<h1>Welcome to our app!</h1>',
})`} />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h4 className="text-lg font-bold text-white mb-3">Email Service Wrapper</h4>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <ExpandableCodeBlock code={`// lib/email.ts
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Email not sent - API key missing')
    return { success: false }
  }
  
  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    html,
  })
  
  return { success: true, id: result.data?.id }
}`} />
            </div>
          </div>
        </div>
      </section>

      {/* File Storage Integration */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">File Storage Integration</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ConceptCard
            icon={Database}
            title="AWS S3"
            description="Industry-standard object storage"
            items={[
              "Unlimited storage",
              "99.999999999% durability",
              "Multiple storage classes",
              "Global CDN integration"
            ]}
            color="from-orange-500 to-red-500"
            documentation={{
              overview: "Amazon S3 is the industry standard for object storage. It provides unlimited, durable storage with multiple storage classes for cost optimization.",
              description: [
                "Unlimited storage capacity",
                "99.999999999% (11 9's) durability",
                "Multiple storage classes (Standard, IA, Glacier)",
                "Versioning and lifecycle policies",
                "Static website hosting",
                "Global CDN integration (CloudFront)"
              ],
              useCases: [
                "File uploads",
                "Backup and archival",
                "Static website hosting",
                "Data lakes",
                "Content delivery"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Buckets = containers (globally unique names)",
                  "Storage classes = cost optimization",
                  "Pre-signed URLs = temporary public access",
                  "Lifecycle policies = automatic transitions",
                  "CloudFront = global CDN"
                ]
              },
              bestFor: [
                "Enterprise applications",
                "High volume storage",
                "When you need AWS integration",
                "Compliance requirements"
              ],
              notIdealFor: [
                "Simple apps (use Vercel Blob)",
                "When you want simpler pricing",
                "Non-AWS infrastructure"
              ]
            }}
          />
          <ConceptCard
            icon={Zap}
            title="Vercel Blob"
            description="Simple file storage for Vercel apps"
            items={[
              "Zero configuration",
              "Automatic CDN",
              "Simple API",
              "Integrated with Vercel"
            ]}
            color="from-black to-gray-700"
            documentation={{
              overview: "Vercel Blob is the simplest way to store files in Vercel applications. It requires zero configuration and provides automatic CDN.",
              description: [
                "Zero configuration needed",
                "Automatic global CDN",
                "Simple, intuitive API",
                "Integrated with Vercel",
                "Automatic optimization",
                "Built-in security"
              ],
              useCases: [
                "File uploads in Next.js apps",
                "Image storage",
                "Document storage",
                "Simple file hosting"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Zero config = works out of the box",
                  "Automatic CDN = fast global delivery",
                  "Simple API = put() and get()",
                  "Integrated = works with Vercel deployments",
                  "Free tier available"
                ]
              },
              bestFor: [
                "Vercel applications",
                "Simple file storage needs",
                "When you want zero config",
                "Next.js apps"
              ],
              notIdealFor: [
                "Very high volume",
                "Complex storage requirements",
                "Non-Vercel deployments"
              ]
            }}
          />
          <ConceptCard
            icon={Database}
            title="Cloudflare R2"
            description="S3-compatible storage with no egress fees"
            items={[
              "S3-compatible API",
              "No egress fees",
              "Global distribution",
              "Cost-effective"
            ]}
            color="from-orange-500 to-amber-500"
            documentation={{
              overview: "Cloudflare R2 is S3-compatible object storage with no egress fees. It's cost-effective for high-traffic applications.",
              description: [
                "S3-compatible API (drop-in replacement)",
                "No egress fees (unlike S3)",
                "Global distribution",
                "Automatic scaling",
                "Cost-effective pricing",
                "Integrated with Cloudflare CDN"
              ],
              useCases: [
                "High-traffic file serving",
                "S3 replacement",
                "Cost optimization",
                "Global content delivery"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "S3-compatible = use S3 SDKs",
                  "No egress fees = save on bandwidth",
                  "Global = fast everywhere",
                  "Cost-effective = cheaper than S3 for high traffic",
                  "Cloudflare integration = automatic CDN"
                ]
              },
              bestFor: [
                "High-traffic applications",
                "When egress costs matter",
                "Cloudflare users",
                "S3-compatible needs"
              ],
              notIdealFor: [
                "Simple apps (use Vercel Blob)",
                "AWS-only infrastructure",
                "When you need AWS-specific features"
              ]
            }}
          />
        </div>
      </section>

      <PhaseQuiz phaseNumber={2} accentClass="from-purple-500 to-pink-500" />

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
    </SubscriptionGate>
  );
}
