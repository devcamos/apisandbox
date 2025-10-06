"use client";

import PhaseLayout from "@/components/PhaseLayout";
import ConceptCard from "@/components/ConceptCard";
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
                "Layered system architecture for scalability",
                "🔗 Loose Coupling: Services interact through well-defined HTTP interfaces",
                "🔄 Idempotency: PUT and DELETE operations should be idempotent for reliable retries",
                "📋 OpenAPI: Standard specification format for REST API documentation"
              ],
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
              ]
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
              ]
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
                "Built-in authentication, load balancing, and health checking",
                "🔗 Loose Coupling: Protocol Buffers provide strong contracts between services",
                "📋 Protobuf: Binary serialization format with schema definition"
              ],
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
              ]
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
                "At-least-once or exactly-once delivery guarantees",
                "⏱️ Eventual Consistency: Systems converge to consistency over time",
                "📋 AsyncAPI: Standard specification format for event-driven APIs"
              ],
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
    </PhaseLayout>
  );
}

