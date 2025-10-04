import PhaseLayout from "@/components/PhaseLayout";
import ConceptCard from "@/components/ConceptCard";
import ProjectCard from "@/components/ProjectCard";
import { Network, Zap, MessageSquare, GitBranch, Activity, Eye } from "lucide-react";

export default function Phase3() {
  return (
    <PhaseLayout
      phaseNumber={3}
      title="Inter-Service Communication"
      description="Master service-to-service patterns"
      icon={Network}
      color="from-orange-500 to-red-500"
    >
      {/* Goal Section */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold text-white mb-3">🕸️ Phase Goal</h2>
        <p className="text-gray-300 text-lg">
          Master service-to-service communication patterns, event-driven architectures, 
          and distributed system observability for building scalable microservices.
        </p>
      </div>

      {/* Sync vs Async */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Synchronous vs Asynchronous Communication</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4">⚡ Synchronous (Request-Response)</h3>
            <p className="text-gray-300 mb-4">Immediate response required, blocking operation</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                <span>Simple to implement and debug</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                <span>Immediate feedback</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-red-400">✗</span>
                <span>Tight coupling between services</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-red-400">✗</span>
                <span>Cascading failures</span>
              </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
              <pre>{`// REST API call
const user = await fetch(
  'http://user-service/api/users/123'
).then(r => r.json());

// gRPC call
const user = await userClient
  .getUser({ userId: '123' });`}</pre>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4">📨 Asynchronous (Event-Driven)</h3>
            <p className="text-gray-300 mb-4">Fire and forget, processed later, non-blocking</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                <span>Loose coupling, better scalability</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                <span>Fault isolation and resilience</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-red-400">✗</span>
                <span>Complex debugging and tracing</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-red-400">✗</span>
                <span>Eventual consistency challenges</span>
              </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
              <pre>{`// Kafka producer
await producer.send({
  topic: 'user.created',
  messages: [{
    value: JSON.stringify({
      userId: '123',
      email: 'user@example.com'
    })
  }]
});

// Consumer handles it later
consumer.on('message', async (msg) => {
  await processUser(msg.value);
});`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* gRPC and Protobufs */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">gRPC & Protocol Buffers</h2>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <p className="text-gray-300 mb-4">
            gRPC is a high-performance RPC framework that uses HTTP/2 and Protocol Buffers for 
            efficient service-to-service communication.
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-900/50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold text-white mb-1">10x Faster</div>
              <p className="text-gray-400">Than JSON REST</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-semibold text-white mb-1">Streaming</div>
              <p className="text-gray-400">Bi-directional</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🔒</div>
              <div className="font-semibold text-white mb-1">Type Safe</div>
              <p className="text-gray-400">Strong typing</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold text-white mb-1">Multi-Lang</div>
              <p className="text-gray-400">Code generation</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Proto Definition</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <pre>{`syntax = "proto3";

package user.v1;

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) 
    returns (stream User);
  rpc CreateUser(CreateUserRequest) 
    returns (User);
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int64 created_at = 4;
}

message GetUserRequest {
  string id = 1;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}`}</pre>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">gRPC Server Implementation</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <pre>{`import * as grpc from '@grpc/grpc-js';
import { UserService } from './generated/user';

const server = new grpc.Server();

server.addService(UserService, {
  async getUser(call, callback) {
    const { id } = call.request;
    
    try {
      const user = await db.users.findById(id);
      callback(null, user);
    } catch (error) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found'
      });
    }
  },
  
  listUsers(call) {
    // Server streaming
    db.users.stream().on('data', user => {
      call.write(user);
    }).on('end', () => {
      call.end();
    });
  }
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => server.start()
);`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Event-Driven Architecture */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Event-Driven Architecture with Kafka</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <ConceptCard
            icon={MessageSquare}
            title="Kafka Topics"
            description="Distributed, partitioned logs for messages"
            items={[
              "Ordered message streams",
              "Partitioning for parallelism",
              "Replication for fault tolerance",
              "Retention policies"
            ]}
            color="from-orange-500 to-red-500"
          />
          <ConceptCard
            icon={GitBranch}
            title="Producer & Consumer"
            description="Publish and subscribe to event streams"
            items={[
              "At-least-once delivery",
              "Consumer groups for scaling",
              "Offset management",
              "Idempotent producers"
            ]}
            color="from-purple-500 to-pink-500"
          />
          <ConceptCard
            icon={Activity}
            title="Event Sourcing"
            description="Store state changes as events"
            items={[
              "Complete audit trail",
              "Time travel debugging",
              "Event replay capability",
              "CQRS pattern"
            ]}
            color="from-green-500 to-emerald-500"
          />
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Kafka Implementation Example</h3>
          <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
            <pre>{`import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka1:9092', 'kafka2:9092']
});

// Producer
const producer = kafka.producer();
await producer.connect();

await producer.send({
  topic: 'order.created',
  messages: [{
    key: orderId,
    value: JSON.stringify({
      orderId,
      userId,
      items: orderItems,
      total: orderTotal,
      timestamp: new Date().toISOString()
    }),
    headers: {
      'correlation-id': correlationId
    }
  }]
});

// Consumer
const consumer = kafka.consumer({ 
  groupId: 'inventory-service' 
});
await consumer.connect();
await consumer.subscribe({ 
  topic: 'order.created' 
});

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const order = JSON.parse(message.value.toString());
    
    // Process order - reserve inventory
    await reserveInventory(order);
    
    // Emit next event
    await producer.send({
      topic: 'inventory.reserved',
      messages: [{
        key: order.orderId,
        value: JSON.stringify({
          orderId: order.orderId,
          status: 'reserved'
        })
      }]
    });
  }
});`}</pre>
          </div>
        </div>
      </section>

      {/* API Gateway & Service Mesh */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">API Gateway & Service Mesh</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">API Gateway</h3>
            <p className="text-gray-400 mb-4">Single entry point for all client requests</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-blue-400 font-bold">•</span>
                <span>Request routing and load balancing</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-blue-400 font-bold">•</span>
                <span>Authentication and authorization</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-blue-400 font-bold">•</span>
                <span>Rate limiting and throttling</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-blue-400 font-bold">•</span>
                <span>Request/response transformation</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-blue-400 font-bold">•</span>
                <span>SSL termination</span>
              </li>
            </ul>
            <div className="text-sm text-gray-400">
              Popular: Kong, AWS API Gateway, Azure API Management
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">Service Mesh</h3>
            <p className="text-gray-400 mb-4">Infrastructure layer for service-to-service communication</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-purple-400 font-bold">•</span>
                <span>Service discovery and load balancing</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-purple-400 font-bold">•</span>
                <span>Mutual TLS (mTLS) encryption</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-purple-400 font-bold">•</span>
                <span>Circuit breaking and retries</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-purple-400 font-bold">•</span>
                <span>Observability and tracing</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-purple-400 font-bold">•</span>
                <span>Traffic management</span>
              </li>
            </ul>
            <div className="text-sm text-gray-400">
              Popular: Istio, Linkerd, Consul
            </div>
          </div>
        </div>
      </section>

      {/* Observability */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Distributed Tracing & Observability</h2>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <p className="text-gray-300 mb-4">
            OpenTelemetry provides standardized instrumentation for distributed tracing across microservices.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-4 rounded-lg">
              <div className="font-semibold text-white mb-2">📊 Traces</div>
              <p className="text-gray-400">End-to-end request flow across services</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4 rounded-lg">
              <div className="font-semibold text-white mb-2">📈 Metrics</div>
              <p className="text-gray-400">Performance counters and aggregated stats</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-4 rounded-lg">
              <div className="font-semibold text-white mb-2">📝 Logs</div>
              <p className="text-gray-400">Structured logging with correlation IDs</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">OpenTelemetry Implementation</h3>
          <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
            <pre>{`import { trace } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

// Setup tracer
const provider = new NodeTracerProvider();
provider.addSpanProcessor(
  new SimpleSpanProcessor(new JaegerExporter())
);
provider.register();

const tracer = trace.getTracer('order-service');

// Instrument your code
async function processOrder(orderId: string) {
  const span = tracer.startSpan('processOrder');
  span.setAttribute('orderId', orderId);
  
  try {
    // Call payment service
    const paymentSpan = tracer.startSpan('callPaymentService', {
      parent: span
    });
    const payment = await paymentService.charge(orderId);
    paymentSpan.end();
    
    // Call inventory service
    const inventorySpan = tracer.startSpan('callInventoryService', {
      parent: span
    });
    await inventoryService.reserve(orderId);
    inventorySpan.end();
    
    span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw error;
  } finally {
    span.end();
  }
}`}</pre>
          </div>
        </div>
      </section>

      {/* Project */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">🧩 Phase Project</h2>
        <ProjectCard
          title="Microservices Communication System"
          description="Build two microservices that communicate via REST and Kafka, with circuit breaker, retry logic, and distributed tracing."
          requirements={[
            "Create two services: Order Service and Inventory Service",
            "REST endpoint: GET /orders/:id (sync communication)",
            "Kafka: order.created event → inventory service reserves items",
            "Implement circuit breaker pattern for REST calls",
            "Add retry logic with exponential backoff",
            "Setup OpenTelemetry for distributed tracing",
            "Export traces to Jaeger or Zipkin",
            "Add structured logging with correlation IDs",
            "Create a dashboard UI showing service status and traces"
          ]}
        />
      </section>
    </PhaseLayout>
  );
}

