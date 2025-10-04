"use client";

import PhaseLayout from "@/components/PhaseLayout";
import InteractiveCategory from "@/components/InteractiveCategory";
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
          <h5 className="font-semibold text-white mb-2">Endpoints</h5>
          <div className="space-y-2">
            {[
              { method: 'GET', path: '/users', desc: 'List all users' },
              { method: 'POST', path: '/users', desc: 'Create user' },
              { method: 'PUT', path: '/users/:id', desc: 'Update user' },
              { method: 'DELETE', path: '/users/:id', desc: 'Delete user' }
            ].map((endpoint, idx) => (
              <div key={idx} className="bg-slate-900 p-3 rounded-lg">
                <span className="text-green-400 font-mono text-sm font-bold">{endpoint.method}</span>
                <span className="text-blue-400 font-mono text-sm ml-2">{endpoint.path}</span>
                <p className="text-gray-400 text-xs mt-1">{endpoint.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all w-full">
        Try REST API Sandbox
      </button>
    </div>
  );

  // GraphQL Demo Content
  const graphqlDemo = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">🔍 GraphQL Demo</h4>
      <p className="text-gray-300 mb-4">
        GraphQL allows clients to request exactly the data they need.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h5 className="font-semibold text-white mb-2">Query Example</h5>
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-gray-300">
            <pre>{`query GetUser {
  user(id: "123") {
    id
    name
    email
    posts {
      title
      createdAt
    }
  }
}

// Response
{
  "data": {
    "user": {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com",
      "posts": [
        {
          "title": "GraphQL Intro",
          "createdAt": "2024-01-15"
        }
      ]
    }
  }
}`}</pre>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-2">Mutation Example</h5>
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-gray-300">
            <pre>{`mutation CreatePost {
  createPost(
    title: "New Post"
    content: "Content here"
  ) {
    id
    title
    author {
      name
    }
  }
}`}</pre>
          </div>
        </div>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
        <h5 className="font-semibold text-white mb-2">✨ Benefits</h5>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• No over-fetching or under-fetching of data</li>
          <li>• Single endpoint for all operations</li>
          <li>• Strong type system and introspection</li>
          <li>• Real-time subscriptions support</li>
        </ul>
      </div>

      <button className="mt-4 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all w-full">
        Try GraphQL Playground
      </button>
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

      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
        <h5 className="font-semibold text-white mb-2">🚀 Performance</h5>
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

      <button className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all w-full">
        Try gRPC Example
      </button>
    </div>
  );

  // WebSocket Demo Content
  const websocketDemo = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">🔄 WebSocket Demo</h4>
      <p className="text-gray-300 mb-4">
        Real-time, bi-directional communication between client and server.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h5 className="font-semibold text-white mb-2">Client Code</h5>
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-gray-300">
            <pre>{`const ws = new WebSocket(
  'ws://localhost:8080'
);

ws.onopen = () => {
  console.log('Connected!');
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'notifications'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onclose = () => {
  console.log('Disconnected');
};`}</pre>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-2">Server Code (Node.js)</h5>
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-gray-300">
            <pre>{`const WebSocket = require('ws');
const wss = new WebSocket.Server({ 
  port: 8080 
});

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    // Handle message
  });
  
  // Broadcast to all clients
  wss.clients.forEach((client) => {
    client.send(JSON.stringify({
      type: 'update',
      data: 'New data'
    }));
  });
});`}</pre>
          </div>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h5 className="font-semibold text-white mb-2">📱 Use Cases</h5>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Chat applications and messaging</li>
          <li>• Live sports scores and updates</li>
          <li>• Real-time collaboration (Google Docs)</li>
          <li>• Stock market tickers</li>
          <li>• Gaming and multiplayer experiences</li>
        </ul>
      </div>

      <button className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all w-full">
        Launch WebSocket Demo
      </button>
    </div>
  );

  // Event-Driven Demo Content
  const eventDrivenDemo = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">📨 Event-Driven Demo</h4>
      <p className="text-gray-300 mb-4">
        Asynchronous, decoupled communication via message brokers.
      </p>
      
      <div className="space-y-4">
        <div>
          <h5 className="font-semibold text-white mb-2">Producer (Publish Event)</h5>
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-gray-300">
            <pre>{`// Kafka Producer
const producer = kafka.producer();
await producer.connect();

await producer.send({
  topic: 'user.created',
  messages: [{
    key: userId,
    value: JSON.stringify({
      userId: '123',
      email: 'user@example.com',
      timestamp: new Date()
    })
  }]
});

console.log('Event published!');`}</pre>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-2">Consumer (Subscribe to Events)</h5>
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-gray-300">
            <pre>{`// Kafka Consumer
const consumer = kafka.consumer({ 
  groupId: 'email-service' 
});

await consumer.subscribe({ 
  topic: 'user.created' 
});

await consumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(
      message.value.toString()
    );
    
    // Send welcome email
    await sendEmail(event.email);
  }
});`}</pre>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <h5 className="font-semibold text-white mb-2">🎯 Event Flow</h5>
        <div className="flex items-center justify-between text-sm">
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
      </div>

      <button className="mt-4 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all w-full">
        Try Event-Driven Example
      </button>
    </div>
  );

  return (
    <PhaseLayout
      phaseNumber={1}
      title="Integration Mindset - Interactive Categories"
      description="Explore each API category with live demos and examples"
      icon={Brain}
      color="from-blue-500 to-cyan-500"
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

      {/* Back Button */}
      <div className="text-center">
        <a 
          href="/phase-1"
          className="inline-block px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
        >
          ← Back to Phase 1 Overview
        </a>
      </div>
    </PhaseLayout>
  );
}

