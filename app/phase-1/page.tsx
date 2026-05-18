"use client";

import PhaseLayout from "@/components/PhaseLayout";
import ConceptCard from "@/components/ConceptCard";
import PhaseQuiz from "@/components/PhaseQuiz";
import { LessonTracker } from "@/components/LessonTracker";
import { Brain, Network, GitBranch, Zap, RefreshCw, Database } from "lucide-react";

export default function Phase1() {
  return (
    <PhaseLayout
      phaseNumber={1}
      title="Integration Mindset"
      description="Understand the 'why' behind integrations"
      icon={Brain}
      color="from-blue-500 to-cyan-500"
    >
      {/* Goal Section */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold text-white mb-3">🎯 Phase Goal</h2>
        <p className="text-gray-300 text-lg">
          You can evaluate when to use API calls vs async messaging and understand the fundamental
          concepts behind modern integration patterns.
        </p>
      </div>

      <LessonTracker phase={1} />

      {/* Pareto Principle Summary */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6 mb-12">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <span className="text-3xl">📊</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Pareto Principle: The 20% That Matters</h2>
            <p className="text-gray-300 text-sm italic">Focus on these core concepts to understand 80% of integration scenarios</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">🎯 Master These First</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">1.</span>
                <span><strong>REST for CRUD</strong> - 90% of APIs use REST for basic operations (GET, POST, PUT, DELETE)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">2.</span>
                <span><strong>HTTP Status Codes</strong> - Know 200, 201, 400, 404, 500. These cover most scenarios</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">3.</span>
                <span><strong>JSON Format</strong> - De facto standard for data exchange. Master it first</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">🧭 Decision Framework</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">→</span>
                <span><strong>Need real-time bidirectional?</strong> Use WebSocket</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span><strong>Complex nested queries?</strong> Use GraphQL</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">→</span>
                <span><strong>High-performance internal?</strong> Use gRPC</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">→</span>
                <span><strong>Decouple services?</strong> Use Event-Driven</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">→</span>
                <span><strong>Everything else?</strong> Start with REST</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Universal Standards Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Universal Standards: The Foundation of Modern APIs</h2>
        
        {/* Introduction */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/30 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg">
              <span className="text-3xl">🌍</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">What Are Universal Technologies?</h3>
              <p className="text-gray-300">
                <strong>Universal technologies</strong> are standards that work everywhere, regardless of 
                programming language, operating system, or infrastructure. They form the foundation 
                that enables different systems to communicate seamlessly. Think of them as the "common 
                language" that allows Java, Python, JavaScript, Go, and any other technology to 
                understand each other.
              </p>
            </div>
          </div>
        </div>

        {/* Core Universal Technologies */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* HTTP */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-white">HTTP - Universal Protocol</h3>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              The universal protocol for web communication. Every language, every platform, 
              every infrastructure supports HTTP. It's the transport layer that carries data 
              between systems.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 mb-4">
              <div className="text-green-400 mb-2">✓ Works with: Java, Python, JavaScript, Go, C#, Ruby, PHP...</div>
              <div className="text-green-400 mb-2">✓ Works on: Web, Mobile, Desktop, Cloud, IoT...</div>
              <div className="text-green-400">✓ Works across: AWS, Azure, GCP, On-premise...</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
              <div className="text-blue-400 mb-2">Standard Methods:</div>
              <div>GET    /api/users</div>
              <div>POST   /api/users</div>
              <div>PUT    /api/users/123</div>
              <div>DELETE /api/users/123</div>
            </div>
          </div>

          {/* JSON */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-white">JSON - Universal Data Format</h3>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              The universal data interchange format. Every language can read and write JSON. 
              It's the "language" that all systems understand, regardless of their internal 
              data structures.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 mb-4">
              <div className="text-green-400 mb-2">✓ Human-readable and lightweight</div>
              <div className="text-green-400 mb-2">✓ Language-independent</div>
              <div className="text-green-400">✓ Standard across all modern APIs</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <pre>{`{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com"
}`}</pre>
            </div>
          </div>
        </div>

        {/* HTTP + JSON Together */}
        <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">
            🔗 HTTP + JSON = Universal API Communication
          </h3>
          <p className="text-gray-300 mb-4">
            When you combine HTTP (universal protocol) with JSON (universal data format), 
            you create a communication system that works across <strong>any</strong> technology stack:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="font-semibold text-white mb-2 text-sm">Languages:</p>
              <p className="text-gray-400 text-xs">Java, Python, JavaScript, Go, C#, Ruby, PHP, Rust...</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="font-semibold text-white mb-2 text-sm">Platforms:</p>
              <p className="text-gray-400 text-xs">Web, Mobile (iOS/Android), Desktop, Cloud, IoT...</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="font-semibold text-white mb-2 text-sm">Infrastructures:</p>
              <p className="text-gray-400 text-xs">AWS, Azure, GCP, On-premise, Hybrid, Multi-cloud...</p>
            </div>
          </div>
          
          {/* Example: Java + React */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h4 className="font-semibold text-white mb-3">Example: Java Backend + React Frontend</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-2">Java Backend (Spring Boot):</p>
                <div className="bg-slate-900/50 p-3 rounded font-mono text-xs text-gray-300 overflow-x-auto">
                  <pre>{`@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(
        @PathVariable String id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
        // Automatically serialized to JSON
    }
}`}</pre>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-2">React Frontend:</p>
                <div className="bg-slate-900/50 p-3 rounded font-mono text-xs text-gray-300 overflow-x-auto">
                  <pre>{`function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())  // HTTP + JSON
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);
  
  return <div>{user?.name}</div>;
}`}</pre>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-3">
              <strong>Key Point:</strong> Java and React don't need to know about each other's 
              internal implementation. They only need to agree on the HTTP + JSON contract.
            </p>
          </div>
        </div>

        {/* JSON Communicator Subsection */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">📡 JSON Communicator: The Universal Data Interchange Format</h3>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl p-4 mb-4">
            <p className="text-gray-300 text-sm">
              <strong>JSON Communicator</strong> refers to JSON's role as the <strong>universal data interchange format</strong> 
              that enables different systems, languages, and infrastructures to exchange data seamlessly. 
              It's the "translator" that allows Java, Python, Node.js, React, and any other technology 
              to understand each other.
            </p>
          </div>

          {/* Why JSON in Large Infrastructures */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-2xl mb-2">🌐</div>
              <h4 className="text-lg font-bold text-white mb-2">Language Agnostic</h4>
              <p className="text-gray-400 text-xs">
                Every major language has JSON support. Java, Python, JavaScript, Go, C# - 
                they all speak JSON fluently.
              </p>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="text-lg font-bold text-white mb-2">Lightweight</h4>
              <p className="text-gray-400 text-xs">
                Human-readable, compact format. Perfect for APIs where bandwidth and 
                parsing speed matter.
              </p>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-2xl mb-2">🔗</div>
              <h4 className="text-lg font-bold text-white mb-2">Universal Standard</h4>
              <p className="text-gray-400 text-xs">
                Works across networks, protocols, and infrastructures. The de facto 
                standard for modern APIs.
              </p>
            </div>
          </div>

          {/* JSON in Large Infrastructures */}
          <div className="space-y-4">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2 text-sm">1. Microservices Communication</h4>
              <p className="text-gray-300 text-xs mb-3">
                In microservices architectures, JSON enables services written in different 
                languages to communicate:
              </p>
              <div className="bg-slate-800/50 p-3 rounded font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`Service A (Java) → HTTP + JSON → Service B (Python)
Service B (Python) → HTTP + JSON → Service C (Node.js)
Service C (Node.js) → HTTP + JSON → Service D (Go)`}</pre>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2 text-sm">2. Frontend-Backend Separation</h4>
              <p className="text-gray-300 text-xs mb-3">
                JSON allows frontend and backend teams to work independently:
              </p>
              <div className="bg-slate-800/50 p-3 rounded font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`React Team → Defines expected JSON structure
Java Team → Implements API returning that JSON structure
Both teams agree on the contract, work independently`}</pre>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2 text-sm">3. Third-Party Integrations</h4>
              <p className="text-gray-300 text-xs mb-3">
                JSON is the standard for integrating with external services:
              </p>
              <div className="bg-slate-800/50 p-3 rounded font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`Your Java App → JSON → Stripe API (Ruby)
Your Java App → JSON → GitHub API (Go)
Your Java App → JSON → AWS API (Various)`}</pre>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2 text-sm">4. Event-Driven Systems</h4>
              <p className="text-gray-300 text-xs mb-3">
                JSON messages flow through message queues and event streams:
              </p>
              <div className="bg-slate-800/50 p-3 rounded font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{`Kafka Topic: "user.created"
Message: {"userId": "123", "email": "user@example.com"}

Any service can consume this JSON message, regardless of language`}</pre>
              </div>
            </div>
          </div>

          {/* JSON Schema Example */}
          <div className="mt-6 bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <h4 className="font-semibold text-white mb-3 text-sm">JSON Schema: The Contract Definition</h4>
            <p className="text-gray-300 text-xs mb-4">
              JSON Schema defines the structure of JSON data, serving as the contract 
              between systems:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-2">JSON Schema Definition:</p>
                <div className="bg-slate-800/50 p-3 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <pre>{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "createdAt": { "type": "string", "format": "date-time" }
  },
  "required": ["id", "name", "email"]
}`}</pre>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-2">Actual JSON Data:</p>
                <div className="bg-slate-800/50 p-3 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <pre>{`{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Universal Technologies */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Other Universal Technologies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-semibold text-white mb-2 text-sm">REST</h4>
              <p className="text-gray-400 text-xs">
                Universal architectural style for APIs
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-2xl mb-2">🔐</div>
              <h4 className="font-semibold text-white mb-2 text-sm">OAuth2</h4>
              <p className="text-gray-400 text-xs">
                Universal authorization protocol
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-2xl mb-2">🎫</div>
              <h4 className="font-semibold text-white mb-2 text-sm">JWT</h4>
              <p className="text-gray-400 text-xs">
                Universal token format
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-semibold text-white mb-2 text-sm">OpenAPI</h4>
              <p className="text-gray-400 text-xs">
                Universal API specification format
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-2xl mb-2">🐳</div>
              <h4 className="font-semibold text-white mb-2 text-sm">Docker</h4>
              <p className="text-gray-400 text-xs">
                Universal containerization standard
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-2xl mb-2">☁️</div>
              <h4 className="font-semibold text-white mb-2 text-sm">Cloud APIs</h4>
              <p className="text-gray-400 text-xs">
                Universal cloud service interfaces
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-2xl mb-2">🔌</div>
              <h4 className="font-semibold text-white mb-2 text-sm">WebSocket</h4>
              <p className="text-gray-400 text-xs">
                Universal real-time protocol
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <div className="text-2xl mb-2">📡</div>
              <h4 className="font-semibold text-white mb-2 text-sm">gRPC</h4>
              <p className="text-gray-400 text-xs">
                Universal RPC framework
              </p>
            </div>
          </div>
        </div>

        {/* Why Universal Technologies Matter */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-3">💡 Why Universal Technologies Matter</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 text-sm mb-2">
                <strong className="text-yellow-400">1. Language Independence:</strong> Write your backend in Java, 
                frontend in React, and they communicate seamlessly through HTTP + JSON.
              </p>
              <p className="text-gray-300 text-sm mb-2">
                <strong className="text-yellow-400">2. Platform Flexibility:</strong> Deploy on AWS, Azure, or 
                on-premise - universal technologies work everywhere.
              </p>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-2">
                <strong className="text-yellow-400">3. Team Autonomy:</strong> Frontend and backend teams can work 
                independently, agreeing only on the API contract.
              </p>
              <p className="text-gray-300 text-sm mb-2">
                <strong className="text-yellow-400">4. Future-Proof:</strong> Universal standards evolve slowly, 
                ensuring long-term compatibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">API Categories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ConceptCard
            icon={Network}
            title="REST"
            description="Resource-oriented architecture using HTTP methods"
            items={[
              "Stateless communication",
              "Standard HTTP methods (GET, POST, PUT, DELETE)",
              "JSON/XML response formats",
              "Wide adoption and tooling support"
            ]}
            color="from-blue-500 to-cyan-500"
            demoLink="/phase-1/categories#rest"
            documentation={{
              overview: "REST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP protocols and standard methods to create, read, update, and delete resources. REST APIs are stateless, meaning each request contains all information needed to process it.",
              description: [
                "Resources are identified by URLs (e.g., /users/123)",
                "Uses standard HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove)",
                "Stateless - server doesn't store client context between requests",
                "Responses typically in JSON or XML format",
                "Cacheable responses improve performance",
                "Layered system architecture for scalability"
              ],
              corePrinciples: {
                title: "Core Principles",
                points: [
                  "🔗 Loose Coupling: Services interact through well-defined HTTP interfaces, enabling independent evolution",
                  "🔄 Idempotency: PUT and DELETE operations should be idempotent for reliable retries",
                  "📊 Stateless: Each request contains all information needed to process it",
                  "🎯 Uniform Interface: Consistent interaction patterns across all resources"
                ]
              },
              contractStyles: {
                title: "Contract Styles",
                points: [
                  "📋 OpenAPI: Standard specification format for REST API documentation and code generation",
                  "🔧 Swagger UI: Interactive API documentation and testing interface",
                  "📝 JSON Schema: Data validation and documentation for request/response formats"
                ]
              },
              useCases: [
                "Public APIs for web and mobile apps",
                "CRUD operations on database resources",
                "Microservices communication",
                "Third-party integrations (Stripe, Twilio)",
                "Content management systems",
                "E-commerce platforms"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Master GET, POST, PUT, DELETE - these cover 95% of operations",
                  "Understand status codes: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Server Error)",
                  "Use nouns for endpoints (/users not /getUsers) and HTTP methods for actions",
                  "Always return appropriate status codes and consistent JSON structures",
                  "Implement pagination for large datasets (limit, offset or cursor-based)"
                ]
              },
              bestFor: [
                "Public-facing APIs with broad client support",
                "Simple CRUD operations",
                "Cacheable data and idempotent operations",
                "When HTTP infrastructure is already in place",
                "Stateless operations"
              ],
              notIdealFor: [
                "Real-time bidirectional communication (use WebSockets)",
                "Complex queries with nested data (consider GraphQL)",
                "High-performance internal microservices (consider gRPC)",
                "Operations requiring streaming data",
                "When you need strong typing guarantees"
              ],
              notableTechnologies: {
                title: "REST APIs Power These Technologies",
                technologies: [
                  {
                    name: "Stripe API",
                    description: "Payment processing with RESTful endpoints for charges, customers, and subscriptions",
                    category: "Payments"
                  },
                  {
                    name: "GitHub API",
                    description: "Repository management, issues, pull requests, and webhooks using REST principles",
                    category: "Developer Tools"
                  },
                  {
                    name: "Slack API",
                    description: "Chat, channels, and messaging with REST endpoints and real-time WebSocket events",
                    category: "Communication"
                  },
                  {
                    name: "AWS S3",
                    description: "Object storage with RESTful HTTP interface for file operations",
                    category: "Cloud Storage"
                  },
                  {
                    name: "Twilio API",
                    description: "SMS, voice, and communication services with RESTful endpoints",
                    category: "Telecommunications"
                  },
                  {
                    name: "Shopify API",
                    description: "E-commerce platform with REST endpoints for products, orders, and customers",
                    category: "E-commerce"
                  }
                ]
              }
            }}
          />
          <ConceptCard
            icon={GitBranch}
            title="GraphQL"
            description="Query language for APIs with flexible data fetching"
            items={[
              "Request exactly what you need",
              "Single endpoint for all operations",
              "Strong typing system",
              "Real-time updates with subscriptions"
            ]}
            color="from-purple-500 to-pink-500"
            demoLink="/phase-1/categories#graphql"
            documentation={{
              overview: "GraphQL is a query language and runtime for APIs that enables clients to request exactly the data they need. Unlike REST, which has multiple endpoints, GraphQL uses a single endpoint with a powerful query syntax to fetch nested and related data in one request.",
              description: [
                "Single endpoint for all operations (/graphql)",
                "Clients specify exact data requirements in queries",
                "Strong type system with schema definition",
                "No over-fetching or under-fetching of data",
                "Real-time capabilities through subscriptions",
                "Built-in introspection for API exploration"
              ],
              useCases: [
                "Mobile apps with limited bandwidth",
                "Complex UIs requiring data from multiple sources",
                "Dashboards with customizable data views",
                "Applications with frequently changing data requirements",
                "APIs consumed by multiple different clients",
                "Real-time collaboration tools"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Master Queries (read), Mutations (write), and Subscriptions (real-time)",
                  "Understand schema definition language (SDL) for types, fields, and relationships",
                  "Know how to use variables and fragments to avoid repetitive queries",
                  "Implement proper error handling - GraphQL always returns 200, check errors field",
                  "Use DataLoader pattern to prevent N+1 query problems"
                ]
              },
              bestFor: [
                "Mobile applications where bandwidth matters",
                "Complex data requirements with nested relationships",
                "APIs with many different client types",
                "When clients need flexibility in data fetching",
                "Applications requiring real-time updates"
              ],
              notIdealFor: [
                "Simple CRUD operations (REST is simpler)",
                "File uploads and binary data",
                "Caching scenarios (more complex than REST)",
                "When HTTP caching is critical",
                "Teams unfamiliar with GraphQL paradigm"
              ],
              notableTechnologies: {
                title: "GraphQL Powers Modern Applications",
                technologies: [
                  {
                    name: "GitHub GraphQL API",
                    description: "Query repository data, issues, and pull requests with precise field selection",
                    category: "Developer Tools"
                  },
                  {
                    name: "Shopify Admin API",
                    description: "Flexible queries for e-commerce data including products, orders, and inventory",
                    category: "E-commerce"
                  },
                  {
                    name: "Facebook Marketing API",
                    description: "Complex ad campaign management with nested data relationships",
                    category: "Advertising"
                  },
                  {
                    name: "Apollo GraphQL",
                    description: "Client-side GraphQL library with caching and state management",
                    category: "Libraries"
                  },
                  {
                    name: "Hasura",
                    description: "Instant GraphQL APIs over PostgreSQL with real-time subscriptions",
                    category: "Backend as a Service"
                  },
                  {
                    name: "Relay",
                    description: "React framework for building data-driven applications with GraphQL",
                    category: "Frontend Framework"
                  }
                ]
              }
            }}
          />
          <ConceptCard
            icon={Zap}
            title="gRPC"
            description="High-performance RPC framework using Protocol Buffers"
            items={[
              "Binary protocol for efficiency",
              "Bi-directional streaming",
              "Strong typing with protobuf",
              "Ideal for microservices"
            ]}
            color="from-orange-500 to-red-500"
            demoLink="/phase-1/categories#grpc"
            documentation={{
              overview: "gRPC (Google Remote Procedure Call) is a high-performance, language-agnostic RPC framework that uses Protocol Buffers for serialization and HTTP/2 for transport. It's designed for efficient communication between microservices.",
              description: [
                "Binary serialization with Protocol Buffers (10x smaller than JSON)",
                "HTTP/2 transport for multiplexing and streaming",
                "Bi-directional streaming support",
                "Strong typing enforced by .proto files",
                "Automatic client and server code generation",
                "Built-in authentication, load balancing, and health checking"
              ],
              corePrinciples: {
                title: "Core Principles",
                points: [
                  "🔗 Loose Coupling: Protocol Buffers provide strong contracts between services",
                  "⚡ High Performance: Binary serialization and HTTP/2 for maximum efficiency",
                  "🛡️ Strong Typing: Compile-time type safety with automatic code generation",
                  "🔄 Streaming: Support for real-time bidirectional communication"
                ]
              },
              contractStyles: {
                title: "Contract Styles",
                points: [
                  "📋 Protocol Buffers (.proto): Interface definition language with schema evolution",
                  "🔧 gRPC Reflection: Runtime service discovery and debugging capabilities",
                  "📊 Binary Format: Efficient serialization with backward/forward compatibility"
                ]
              },
              useCases: [
                "High-performance internal microservices",
                "Real-time streaming applications",
                "IoT devices with limited resources",
                "Low-latency distributed systems",
                "Polyglot microservice architectures",
                "Mobile clients communicating with backends"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Learn Protocol Buffer syntax - it's simpler than you think",
                  "Understand 4 types of RPCs: Unary, Server Streaming, Client Streaming, Bidirectional",
                  "Use code generation tools to create type-safe clients/servers",
                  "Implement proper error handling with gRPC status codes",
                  "Add deadlines/timeouts to all requests to prevent hanging"
                ]
              },
              bestFor: [
                "Internal microservice communication",
                "High-throughput, low-latency requirements",
                "Streaming data in both directions",
                "Strong typing and code generation",
                "Polyglot systems (multiple languages)"
              ],
              notIdealFor: [
                "Browser-based applications (limited support)",
                "Public-facing APIs (REST is more standard)",
                "When HTTP caching is important",
                "Small, simple services (overhead not worth it)",
                "Teams unfamiliar with binary protocols"
              ],
              notableTechnologies: {
                title: "gRPC Powers High-Performance Systems",
                technologies: [
                  {
                    name: "Google Cloud APIs",
                    description: "Internal microservice communication across Google's infrastructure",
                    category: "Cloud Services"
                  },
                  {
                    name: "Netflix Zuul",
                    description: "API gateway with gRPC for high-throughput internal communication",
                    category: "Microservices"
                  },
                  {
                    name: "Istio Service Mesh",
                    description: "Service-to-service communication in Kubernetes environments",
                    category: "Infrastructure"
                  },
                  {
                    name: "TensorFlow Serving",
                    description: "High-performance model inference with gRPC endpoints",
                    category: "Machine Learning"
                  },
                  {
                    name: "Kubernetes Control Plane",
                    description: "Internal API communication between kubelet and API server",
                    category: "Container Orchestration"
                  },
                  {
                    name: "Apache Kafka Streams",
                    description: "Real-time stream processing with gRPC for service communication",
                    category: "Data Streaming"
                  }
                ]
              }
            }}
          />
          <ConceptCard
            icon={RefreshCw}
            title="WebSocket"
            description="Full-duplex communication for real-time applications"
            items={[
              "Persistent connection",
              "Low latency messaging",
              "Server push capabilities",
              "Perfect for chat and live updates"
            ]}
            color="from-green-500 to-emerald-500"
            demoLink="/phase-1/categories#websocket"
            documentation={{
              overview: "WebSocket is a protocol providing full-duplex communication channels over a single TCP connection. Unlike HTTP's request-response model, WebSocket enables real-time, bidirectional communication between client and server.",
              description: [
                "Persistent connection after initial handshake",
                "Bidirectional communication (client and server can both initiate)",
                "Low latency - no HTTP overhead for each message",
                "Works over standard HTTP ports (80/443)",
                "Protocol upgrade from HTTP to WebSocket",
                "Event-driven programming model"
              ],
              useCases: [
                "Chat applications and messaging platforms",
                "Live sports scores and financial tickers",
                "Real-time collaboration tools (Google Docs)",
                "Online gaming and multiplayer experiences",
                "Live notifications and alerts",
                "IoT dashboards with sensor data"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Understand connection lifecycle: open, message, close, error events",
                  "Implement reconnection logic with exponential backoff",
                  "Use heartbeat/ping-pong to detect dead connections",
                  "Handle connection failures gracefully and queue messages",
                  "Consider using Socket.io or similar libraries for easier implementation"
                ]
              },
              bestFor: [
                "Real-time bidirectional communication",
                "High-frequency updates (100+ per second)",
                "Low latency requirements",
                "Server-initiated updates to clients",
                "Persistent connection scenarios"
              ],
              notIdealFor: [
                "Simple request-response operations (use REST)",
                "When you need HTTP caching",
                "One-way communication (consider Server-Sent Events)",
                "RESTful CRUD operations",
                "When scalability of connections is a concern"
              ]
            }}
          />
          <ConceptCard
            icon={Database}
            title="Event-Driven"
            description="Asynchronous messaging using event streams"
            items={[
              "Loose coupling between services",
              "Scalable event processing",
              "Message brokers (Kafka, RabbitMQ)",
              "Event sourcing patterns"
            ]}
            color="from-yellow-500 to-amber-500"
            demoLink="/phase-1/categories#event-driven"
            documentation={{
              overview: "Event-Driven Architecture is a design pattern where services communicate through events - significant changes in state. Services publish events to message brokers, and interested services subscribe to these events, enabling loose coupling and asynchronous processing.",
              description: [
                "Asynchronous communication through event streams",
                "Publishers don't know about subscribers (loose coupling)",
                "Message brokers (Kafka, RabbitMQ, SQS) handle delivery",
                "Events represent state changes (user.created, order.placed)",
                "Support for replay and event sourcing",
                "At-least-once or exactly-once delivery guarantees"
              ],
              corePrinciples: {
                title: "Core Principles",
                points: [
                  "⏱️ Eventual Consistency: Systems converge to consistency over time, enabling high availability",
                  "🔗 Loose Coupling: Publishers and subscribers are completely decoupled",
                  "📊 Event Sourcing: Store state changes as a sequence of events",
                  "🔄 Asynchronous Processing: Non-blocking communication for better scalability"
                ]
              },
              contractStyles: {
                title: "Contract Styles",
                points: [
                  "📋 AsyncAPI: Standard specification format for event-driven APIs (like OpenAPI for events)",
                  "🔧 Schema Registry: Centralized schema management for event evolution",
                  "📝 Event Schema: JSON Schema or Avro for event payload validation"
                ]
              },
              useCases: [
                "Microservices requiring loose coupling",
                "Event sourcing and CQRS implementations",
                "Real-time data pipelines and streaming",
                "Audit logs and compliance tracking",
                "Async workflows (order processing, notifications)",
                "Distributed transactions with saga pattern"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Design events as immutable facts about what happened (past tense)",
                  "Make consumers idempotent - assume duplicate messages will arrive",
                  "Use topics/exchanges to categorize events logically",
                  "Implement dead-letter queues for failed message processing",
                  "Monitor consumer lag - falling behind indicates scaling issues"
                ]
              },
              bestFor: [
                "Microservices needing loose coupling",
                "Scalable, async processing workflows",
                "Event sourcing and audit requirements",
                "Fan-out scenarios (one event, many consumers)",
                "When eventual consistency is acceptable"
              ],
              notIdealFor: [
                "Immediate response required (use sync APIs)",
                "Simple request-response patterns",
                "Strong consistency requirements",
                "When debugging needs to be straightforward",
                "Small applications with few services"
              ]
            }}
          />
        </div>
      </section>



      {/* Decision Framework */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">When to Use What?</h2>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="pb-4 text-white font-semibold">Use Case</th>
                <th className="pb-4 text-white font-semibold">Best Choice</th>
                <th className="pb-4 text-white font-semibold">Why?</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-slate-700">
                <td className="py-4">Public API</td>
                <td className="py-4 font-semibold text-blue-400">REST</td>
                <td className="py-4">Wide adoption, easy to consume, HTTP-based</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-4">Complex queries, mobile apps</td>
                <td className="py-4 font-semibold text-purple-400">GraphQL</td>
                <td className="py-4">Flexible data fetching, reduces over-fetching</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-4">High-performance microservices</td>
                <td className="py-4 font-semibold text-orange-400">gRPC</td>
                <td className="py-4">Binary protocol, streaming, strong typing</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-4">Real-time updates</td>
                <td className="py-4 font-semibold text-green-400">WebSocket</td>
                <td className="py-4">Persistent connection, bi-directional</td>
              </tr>
              <tr>
                <td className="py-4">Decoupled services, async processing</td>
                <td className="py-4 font-semibold text-yellow-400">Event-Driven</td>
                <td className="py-4">Scalability, resilience, loose coupling</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <PhaseQuiz phaseNumber={1} accentClass="from-blue-500 to-cyan-500" />
    </PhaseLayout>
  );
}
