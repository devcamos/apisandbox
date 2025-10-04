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
          />
        </div>
      </section>

      {/* Contract Styles */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Contract Styles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">OpenAPI</h3>
            <p className="text-gray-400 mb-4">Standard specification for REST APIs with interactive documentation</p>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-sm text-gray-300">
              <pre>{`openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          description: Success`}</pre>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">Protobuf</h3>
            <p className="text-gray-400 mb-4">Binary serialization format for gRPC with strong typing</p>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-sm text-gray-300">
              <pre>{`syntax = "proto3";

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
}

service UserService {
  rpc GetUser(UserId) 
    returns (User);
}`}</pre>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">AsyncAPI</h3>
            <p className="text-gray-400 mb-4">Specification for event-driven and asynchronous APIs</p>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-sm text-gray-300">
              <pre>{`asyncapi: 2.6.0
info:
  title: Order Events
  version: 1.0.0
channels:
  order/created:
    publish:
      message:
        payload:
          type: object
          properties:
            orderId: string`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Core Principles</h2>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">🔗 Loose Coupling</h3>
            <p className="text-gray-300 mb-4">
              Services should be independent and interact through well-defined interfaces. 
              Changes in one service shouldn't require changes in others.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="font-semibold text-green-400 mb-2">✓ Good Practice</div>
                <p className="text-gray-300">Use abstract interfaces and dependency injection</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="font-semibold text-red-400 mb-2">✗ Avoid</div>
                <p className="text-gray-300">Tight coupling with direct class dependencies</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">🔄 Idempotency</h3>
            <p className="text-gray-300 mb-4">
              An operation that can be performed multiple times without changing the result beyond the initial application.
              Critical for reliable distributed systems.
            </p>
            <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm text-gray-300">
              <pre>{`// Idempotent: Safe to retry
PUT /users/123 { "name": "John" }

// NOT Idempotent: Multiple calls create different results
POST /orders { "item": "widget" }`}</pre>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">⏱️ Eventual Consistency</h3>
            <p className="text-gray-300 mb-4">
              In distributed systems, data doesn't need to be immediately consistent across all nodes.
              Systems converge to consistency over time.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm mt-4">
              <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">1️⃣</div>
                <p className="text-gray-300">User updates profile</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">2️⃣</div>
                <p className="text-gray-300">Event propagates</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">3️⃣</div>
                <p className="text-gray-300">All services sync</p>
              </div>
            </div>
          </div>
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

