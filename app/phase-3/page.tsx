"use client";

import PhaseLayout from "@/components/PhaseLayout";
import ConceptCard from "@/components/ConceptCard";
import PhaseQuiz from "@/components/PhaseQuiz";
import ProjectCard from "@/components/ProjectCard";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { LessonTracker } from "@/components/LessonTracker";
import { Network, Zap, MessageSquare, GitBranch, Activity, Eye } from "lucide-react";

import { ExpandableCodeBlock } from "@/components/HighlightedCodeBlock"
export default function Phase3() {
  return (
    <SubscriptionGate phaseNumber={3} lockedContentName="Phase 3: Inter-Service Communication">
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

      <LessonTracker phase={3} />

      {/* Pareto Principle Summary */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6 mb-12">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <span className="text-3xl">📊</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Pareto Principle: The 20% That Matters</h2>
            <p className="text-gray-300 text-sm italic">These patterns solve 80% of microservices communication challenges</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">⚡ Communication Patterns</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">1.</span>
                <span><strong>Sync for reads, Async for writes</strong> - Simple rule covers most cases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">2.</span>
                <span><strong>Message queues for reliability</strong> - Kafka/RabbitMQ handle 99% of event needs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">3.</span>
                <span><strong>API Gateway</strong> - Single entry point simplifies auth, routing, rate limiting</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">🔍 Observability Essentials</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span><strong>Correlation IDs</strong> - Track requests across services (request-id header)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">2.</span>
                <span><strong>Structured logging</strong> - JSON logs with consistent fields enable debugging</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">3.</span>
                <span><strong>Health checks</strong> - /health and /ready endpoints are mandatory</span>
              </li>
            </ul>
          </div>
        </div>
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
              <ExpandableCodeBlock code={`// REST API call
const user = await fetch(
  'http://user-service/api/users/123'
).then(r => r.json());

// gRPC call
const user = await userClient
  .getUser({ userId: '123' });`} />
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
              <ExpandableCodeBlock code={`// Kafka producer
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
});`} />
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

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Proto Definition</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <ExpandableCodeBlock code={`syntax = "proto3";

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
}`} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">gRPC Server Implementation</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <ExpandableCodeBlock code={`import * as grpc from '@grpc/grpc-js';
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
);`} />
            </div>
          </div>
        </div>

        {/* Java gRPC Examples */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Java gRPC Implementation</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">☕</span>
                <h4 className="text-lg font-bold text-white">Java gRPC Server</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import io.grpc.Server;
import io.grpc.ServerBuilder;
import user.v1.UserServiceGrpc;
import user.v1.UserOuterClass.*;

@GrpcService
public class UserServiceImpl 
    extends UserServiceGrpc.UserServiceImplBase {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void getUser(
        GetUserRequest request,
        StreamObserver<User> responseObserver) {
        
        try {
            UserEntity entity = userRepository
                .findById(request.getId());
            
            User user = User.newBuilder()
                .setId(entity.getId())
                .setName(entity.getName())
                .setEmail(entity.getEmail())
                .setCreatedAt(entity.getCreatedAt())
                .build();
            
            responseObserver.onNext(user);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(
                Status.NOT_FOUND
                    .withDescription("User not found")
                    .asRuntimeException());
        }
    }
    
    @Override
    public void listUsers(
        ListUsersRequest request,
        StreamObserver<User> responseObserver) {
        // Server streaming
        userRepository.findAll().forEach(user -> {
            responseObserver.onNext(
                convertToProto(user));
        });
        responseObserver.onCompleted();
    }
}

// Server startup
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        Server server = ServerBuilder
            .forPort(50051)
            .addService(new UserServiceImpl())
            .build();
        server.start();
    }
}`} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">☕</span>
                <h4 className="text-lg font-bold text-white">Java gRPC Client</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import user.v1.UserServiceGrpc;
import user.v1.UserOuterClass.*;

@Service
public class UserClientService {
    
    private ManagedChannel channel;
    private UserServiceGrpc.UserServiceBlockingStub stub;
    
    @PostConstruct
    public void init() {
        channel = ManagedChannelBuilder
            .forAddress("localhost", 50051)
            .usePlaintext()
            .build();
        stub = UserServiceGrpc.newBlockingStub(channel);
    }
    
    public User getUser(String id) {
        GetUserRequest request = GetUserRequest
            .newBuilder()
            .setId(id)
            .build();
        
        return stub.getUser(request);
    }
    
    public List<User> listUsers() {
        ListUsersRequest request = 
            ListUsersRequest.getDefaultInstance();
        
        Iterator<User> users = stub.listUsers(request);
        return StreamSupport.stream(
            Spliterators.spliteratorUnknownSize(
                users, Spliterator.ORDERED), false)
            .collect(Collectors.toList());
    }
}`} />
              </div>
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

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Kafka Implementation Example</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚛️</span>
                <h4 className="text-lg font-bold text-white">TypeScript/Node.js</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import { Kafka } from 'kafkajs';

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
});`} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">☕</span>
                <h4 className="text-lg font-bold text-white">Java Spring Boot</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;

@Service
public class OrderService {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    // Producer
    public void createOrder(Order order) {
        OrderEvent event = new OrderEvent(
            order.getId(),
            order.getUserId(),
            order.getItems(),
            order.getTotal()
        );
        
        kafkaTemplate.send(
            "order.created",
            order.getId(),
            objectMapper.writeValueAsString(event)
        );
    }
}

// Consumer
@Component
public class InventoryService {
    
    @Autowired
    private InventoryRepository inventoryRepo;
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    @KafkaListener(
        topics = "order.created",
        groupId = "inventory-service"
    )
    public void handleOrderCreated(
        @Payload String message,
        @Header(KafkaHeaders.RECEIVED_KEY) String key) {
        
        OrderEvent order = objectMapper
            .readValue(message, OrderEvent.class);
        
        // Process order - reserve inventory
        reserveInventory(order);
        
        // Emit next event
        InventoryReservedEvent event = 
            new InventoryReservedEvent(
                order.getOrderId(), "reserved");
        
        kafkaTemplate.send(
            "inventory.reserved",
            order.getOrderId(),
            objectMapper.writeValueAsString(event)
        );
    }
}

// Configuration
@Configuration
public class KafkaConfig {
    @Bean
    public ProducerFactory<String, String> 
        producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(
            ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,
            "kafka1:9092,kafka2:9092");
        config.put(
            ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
            StringSerializer.class);
        config.put(
            ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
            StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }
}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Docker Examples */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">🐳 Docker Containerization</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Dockerfile for Java Spring Boot</h4>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`# Multi-stage build for Java
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`} />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-3">Docker Compose for Microservices</h4>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`version: '3.8'

services:
  java-api:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
    depends_on:
      - kafka
      - postgres
  
  react-frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://java-api:8080
    depends_on:
      - java-api
  
  kafka:
    image: confluentinc/cp-kafka:latest
    ports:
      - "9092:9092"
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka:9092
  
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password`} />
              </div>
            </div>
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
            <ExpandableCodeBlock code={`import { trace } from '@opentelemetry/api';
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
}`} />
          </div>
        </div>
      </section>

      <PhaseQuiz phaseNumber={3} accentClass="from-orange-500 to-red-500" />

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
    </SubscriptionGate>
  );
}
