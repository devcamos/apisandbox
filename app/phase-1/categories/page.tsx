"use client";

import PhaseLayout from "@/components/PhaseLayout";
import InteractiveCategory from "@/components/InteractiveCategory";
import ApiEndpointTester from "@/components/ApiEndpointTester";
import GraphQLTester from "@/components/GraphQLTester";
import WebSocketTester from "@/components/WebSocketTester";
import EventDrivenTester from "@/components/EventDrivenTester";
import ApiArchitecturePattern from "@/components/ApiArchitecturePattern";
import { Brain, Network, GitBranch, Zap, RefreshCw, Database } from "lucide-react";
import { useState } from "react";

export default function Phase1Categories() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  // REST Demo Content
  const restDemo = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">🌐 REST API Demo</h4>
      <p className="text-gray-300 mb-4">
        RESTful APIs use HTTP methods to perform CRUD operations on resources.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h5 className="font-semibold text-white mb-2">Request Example</h5>
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-gray-300">
            <pre>{`GET /api/users/123 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGc...
Accept: application/json

// Response
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}`}</pre>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3">Interactive Endpoints - Try Them Live!</h5>
          <div className="space-y-3">
            <ApiEndpointTester
              method="GET"
              path="/users"
              description="Fetch a list of all users"
            />
            <ApiEndpointTester
              method="GET"
              path="/users/:id"
              description="Get a specific user by ID"
            />
            <ApiEndpointTester
              method="POST"
              path="/users"
              description="Create a new user"
              defaultBody={JSON.stringify({
                name: "John Doe",
                email: "john@example.com",
                username: "johndoe"
              }, null, 2)}
            />
            <ApiEndpointTester
              method="PUT"
              path="/users/:id"
              description="Update an existing user"
              defaultBody={JSON.stringify({
                name: "Jane Doe",
                email: "jane@example.com"
              }, null, 2)}
            />
            <ApiEndpointTester
              method="DELETE"
              path="/users/:id"
              description="Delete a user by ID"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">✨ Key Features</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Stateless client-server communication</li>
            <li>• Standard HTTP methods (GET, POST, PUT, DELETE)</li>
            <li>• Cacheable responses for performance</li>
            <li>• Resource-based URLs (/users/123)</li>
          </ul>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">📱 Use Cases</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Public-facing APIs</li>
            <li>• CRUD operations on resources</li>
            <li>• Mobile and web app backends</li>
            <li>• Third-party integrations</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-gray-300 text-sm">
          <span className="font-semibold text-blue-400">💡 Tip:</span> These are live API calls to JSONPlaceholder (a free test API). 
          Click &ldquo;Try API&rdquo; on any endpoint to see real responses!
        </p>
      </div>

      <ApiArchitecturePattern categoryId="rest" accentColor="from-blue-500 to-cyan-500" />
    </div>
  );

  // GraphQL Demo Content
  const graphqlDemo = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">🔍 GraphQL Demo</h4>
      <p className="text-gray-300 mb-4">
        GraphQL allows clients to request exactly the data they need. Try these interactive queries!
      </p>
      
      <div>
        <h5 className="font-semibold text-white mb-3">Interactive GraphQL Queries - Try Them Live!</h5>
        <div className="space-y-3">
          <GraphQLTester
            title="Get User with Posts"
            description="Fetch user data with nested posts in a single query"
            defaultQuery={`query GetUser {
  user(id: "123") {
    id
    name
    email
    posts {
      id
      title
      createdAt
    }
  }
}`}
          />
          
          <GraphQLTester
            title="Create Post Mutation"
            description="Create a new post and return the result"
            defaultQuery={`mutation CreatePost {
  createPost(
    title: "Building with GraphQL"
    content: "GraphQL is amazing!"
    userId: "123"
  ) {
    id
    title
    author {
      id
      name
    }
    createdAt
  }
}`}
          />

          <GraphQLTester
            title="Flexible Query with Variables"
            description="Query users with dynamic filtering"
            defaultQuery={`query GetUsers($limit: Int, $offset: Int) {
  users(limit: $limit, offset: $offset) {
    id
    name
    email
    postsCount
  }
}`}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">✨ Key Features</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Request exactly the data you need</li>
            <li>• Single endpoint for all operations</li>
            <li>• Strong type system with SDL</li>
            <li>• Real-time updates with subscriptions</li>
          </ul>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">📱 Use Cases</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Mobile apps (bandwidth sensitive)</li>
            <li>• Complex UIs with nested data</li>
            <li>• APIs with multiple client types</li>
            <li>• Dashboards and analytics tools</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p className="text-gray-300 text-sm">
          <span className="font-semibold text-purple-400">💡 Tip:</span> GraphQL uses a single endpoint (/graphql) for all operations. 
          Notice how you can request exactly the fields you need - no over-fetching!
        </p>
      </div>

      <ApiArchitecturePattern categoryId="graphql" accentColor="from-purple-500 to-pink-500" />
    </div>
  );

  // gRPC Demo Content
  const grpcDemo = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">⚡ gRPC Demo</h4>
      <p className="text-gray-300 mb-4">
        High-performance RPC framework using HTTP/2 and Protocol Buffers.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h5 className="font-semibold text-white mb-2">Proto Definition</h5>
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-gray-300">
            <pre>{`syntax = "proto3";

service UserService {
  rpc GetUser(UserId) 
    returns (User);
  
  rpc ListUsers(Empty)
    returns (stream User);
}

message UserId {
  string id = 1;
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}`}</pre>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-2">Client Usage</h5>
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-gray-300">
            <pre>{`import { UserServiceClient } 
  from './generated/user_grpc_pb';

const client = new UserServiceClient(
  'localhost:50051'
);

// Unary call
const user = await client
  .getUser({ id: '123' });

// Server streaming
const stream = client.listUsers({});
stream.on('data', (user) => {
  console.log(user);
});`}</pre>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">✨ Key Features</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Binary protocol (10x faster)</li>
            <li>• HTTP/2 multiplexing and streaming</li>
            <li>• Strong typing with Protocol Buffers</li>
            <li>• Automatic code generation</li>
          </ul>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">📱 Use Cases</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Internal microservices communication</li>
            <li>• High-performance systems</li>
            <li>• Real-time streaming data</li>
            <li>• Polyglot architectures</li>
          </ul>
        </div>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mt-4">
        <h5 className="font-semibold text-white mb-3">🚀 Performance Metrics</h5>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-orange-400">10x</div>
            <div className="text-gray-400">Faster than REST</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">90%</div>
            <div className="text-gray-400">Smaller payload</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">4</div>
            <div className="text-gray-400">Streaming modes</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
        <p className="text-gray-300 text-sm">
          <span className="font-semibold text-orange-400">💡 Tip:</span> gRPC is ideal for internal services where performance matters. 
          Use REST for public APIs where browser support is needed!
        </p>
      </div>

      <ApiArchitecturePattern categoryId="grpc" accentColor="from-orange-500 to-red-500" />
    </div>
  );

  // WebSocket Demo Content
  const websocketDemo = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">🔄 WebSocket Demo</h4>
      <p className="text-gray-300 mb-4">
        Real-time, bi-directional communication! Connect and start messaging.
      </p>
      
      <div>
        <h5 className="font-semibold text-white mb-3">Interactive WebSocket Chat - Try It Live!</h5>
        <WebSocketTester
          title="Real-Time Chat Connection"
          description="Experience bidirectional communication - both client and server can send messages anytime"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">✨ Key Features</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Persistent connection (no reconnecting)</li>
            <li>• Server can push messages anytime</li>
            <li>• Low latency (no HTTP overhead)</li>
            <li>• Perfect for real-time apps</li>
          </ul>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">📱 Use Cases</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Chat and messaging apps</li>
            <li>• Live sports/stock tickers</li>
            <li>• Real-time collaboration</li>
            <li>• Online gaming</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-gray-300 text-sm">
          <span className="font-semibold text-green-400">💡 Tip:</span> WebSocket maintains a persistent connection. 
          Once connected, both client and server can send messages instantly without request overhead!
        </p>
      </div>

      <ApiArchitecturePattern categoryId="websocket" accentColor="from-green-500 to-emerald-500" />
    </div>
  );

  // Event-Driven Demo Content
  const eventDrivenDemo = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">📨 Event-Driven Demo</h4>
      <p className="text-gray-300 mb-4">
        Asynchronous, decoupled communication! Publish events and watch them flow through the system.
      </p>
      
      <div>
        <h5 className="font-semibold text-white mb-3">Interactive Event Publishing - Try It Live!</h5>
        <div className="space-y-3">
          <EventDrivenTester
            title="user.created"
            description="Publish user creation events - multiple services can consume this event"
            eventType="user.created"
          />
          <EventDrivenTester
            title="order.placed"
            description="Publish order events - triggers inventory, payment, and email services"
            eventType="order.placed"
          />
          <EventDrivenTester
            title="payment.processed"
            description="Publish payment events - update order status and send confirmations"
            eventType="payment.processed"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">✨ Key Features</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Asynchronous, non-blocking communication</li>
            <li>• Loose coupling between services</li>
            <li>• Event replay and audit trail</li>
            <li>• Multiple consumers per event</li>
          </ul>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">📱 Use Cases</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Microservices orchestration</li>
            <li>• Event sourcing and CQRS</li>
            <li>• Real-time data pipelines</li>
            <li>• Distributed transactions (Sagas)</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <h5 className="font-semibold text-white mb-3">🎯 Event Flow</h5>
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">1</div>
            <div className="text-gray-300">Publisher</div>
          </div>
          <div className="text-2xl text-gray-500">→</div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">2</div>
            <div className="text-gray-300">Message Broker</div>
          </div>
          <div className="text-2xl text-gray-500">→</div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">3</div>
            <div className="text-gray-300">Consumers</div>
          </div>
        </div>
        <p className="text-gray-300 text-sm">
          Events are processed asynchronously - publishers don&apos;t wait for consumers!
        </p>
      </div>

      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-gray-300 text-sm">
          <span className="font-semibold text-yellow-400">💡 Tip:</span> Event-driven architecture enables loose coupling. 
          One event can trigger multiple independent services without the publisher knowing about them!
        </p>
      </div>

      <ApiArchitecturePattern categoryId="event-driven" accentColor="from-yellow-500 to-amber-500" />
    </div>
  );

  return (
    <PhaseLayout
      phaseNumber={1}
      title="Interactive Categories"
      description="Explore each API category with live demos and examples"
      icon={Brain}
      color="from-blue-500 to-cyan-500"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Phase 1", href: "/phase-1" },
      ]}
    >

      {/* Goal Section */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold text-white mb-3">🎯 Interactive Learning</h2>
        <p className="text-gray-300 text-lg">
          Click on each category below to explore interactive demos, code examples, and use cases.
          Build hands-on experience with each API type!
        </p>
      </div>

      {/* Interactive Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">API Categories - Click to Explore</h2>
        <div className="space-y-6">
          <div id="rest" className="scroll-mt-24">
            <InteractiveCategory
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
              demoContent={restDemo}
            />
          </div>

          <div id="graphql" className="scroll-mt-24">
            <InteractiveCategory
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
              demoContent={graphqlDemo}
            />
          </div>

          <div id="grpc" className="scroll-mt-24">
            <InteractiveCategory
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
              demoContent={grpcDemo}
            />
          </div>

          <div id="websocket" className="scroll-mt-24">
            <InteractiveCategory
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
              demoContent={websocketDemo}
            />
          </div>

          <div id="event-driven" className="scroll-mt-24">
            <InteractiveCategory
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
              demoContent={eventDrivenDemo}
            />
          </div>
        </div>
      </section>

    </PhaseLayout>
  );
}

