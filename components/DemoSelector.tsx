"use client";

import { useState } from "react";
import { ChevronDown, Play, ExternalLink } from "lucide-react";

interface DemoOption {
  id: string;
  title: string;
  description: string;
  type: "rest" | "graphql" | "grpc" | "websocket" | "event-driven";
  endpoint?: string;
  method?: string;
  link: string;
}

interface DemoSelectorProps {
  apiType: "rest" | "graphql" | "grpc" | "websocket" | "event-driven";
  onDemoSelect: (demo: DemoOption) => void;
}

const demoOptions: Record<string, DemoOption[]> = {
  rest: [
    {
      id: "users-crud",
      title: "Users CRUD API",
      description: "Create, read, update, and delete user records",
      type: "rest",
      endpoint: "/api/users",
      method: "GET, POST, PUT, DELETE",
      link: "/phase-1/categories#rest"
    },
    {
      id: "posts-api",
      title: "Posts & Comments API",
      description: "Blog posts with nested comments and relationships",
      type: "rest",
      endpoint: "/api/posts",
      method: "GET, POST, PUT, DELETE",
      link: "/phase-1/categories#rest"
    },
    {
      id: "products-api",
      title: "E-commerce Products API",
      description: "Product catalog with categories and inventory",
      type: "rest",
      endpoint: "/api/products",
      method: "GET, POST, PUT, DELETE",
      link: "/phase-1/categories#rest"
    }
  ],
  graphql: [
    {
      id: "social-graphql",
      title: "Social Media GraphQL",
      description: "Query users, posts, and relationships in one request",
      type: "graphql",
      endpoint: "/graphql",
      method: "POST (Query/Mutation)",
      link: "/phase-1/categories#graphql"
    },
    {
      id: "ecommerce-graphql",
      title: "E-commerce GraphQL",
      description: "Flexible product and order queries with nested data",
      type: "graphql",
      endpoint: "/graphql",
      method: "POST (Query/Mutation)",
      link: "/phase-1/categories#graphql"
    }
  ],
  grpc: [
    {
      id: "user-service-grpc",
      title: "User Service gRPC",
      description: "High-performance user management with streaming",
      type: "grpc",
      endpoint: "UserService",
      method: "Unary & Streaming",
      link: "/phase-1/categories#grpc"
    },
    {
      id: "chat-service-grpc",
      title: "Real-time Chat gRPC",
      description: "Bidirectional streaming for real-time messaging",
      type: "grpc",
      endpoint: "ChatService",
      method: "Bidirectional Streaming",
      link: "/phase-1/categories#grpc"
    }
  ],
  websocket: [
    {
      id: "live-chat",
      title: "Live Chat WebSocket",
      description: "Real-time messaging with room management",
      type: "websocket",
      endpoint: "ws://localhost:8080/chat",
      method: "WebSocket",
      link: "/phase-1/categories#websocket"
    },
    {
      id: "live-dashboard",
      title: "Live Dashboard WebSocket",
      description: "Real-time metrics and monitoring updates",
      type: "websocket",
      endpoint: "ws://localhost:8080/metrics",
      method: "WebSocket",
      link: "/phase-1/categories#websocket"
    }
  ],
  "event-driven": [
    {
      id: "order-events",
      title: "Order Processing Events",
      description: "Order lifecycle events with multiple consumers",
      type: "event-driven",
      endpoint: "order-events",
      method: "Event Publishing",
      link: "/phase-1/categories#event-driven"
    },
    {
      id: "user-events",
      title: "User Lifecycle Events",
      description: "User registration, updates, and analytics events",
      type: "event-driven",
      endpoint: "user-events",
      method: "Event Publishing",
      link: "/phase-1/categories#event-driven"
    }
  ]
};

export default function DemoSelector({ apiType, onDemoSelect }: DemoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<DemoOption | null>(null);

  const demos = demoOptions[apiType] || [];

  const handleDemoSelect = (demo: DemoOption) => {
    setSelectedDemo(demo);
    setIsOpen(false);
    onDemoSelect(demo);
  };

  const getApiTypeColor = (type: string) => {
    const colors = {
      rest: "from-blue-500 to-cyan-500",
      graphql: "from-pink-500 to-purple-500", 
      grpc: "from-orange-500 to-red-500",
      websocket: "from-green-500 to-emerald-500",
      "event-driven": "from-yellow-500 to-amber-500"
    };
    return colors[type as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="relative">
      {/* Demo Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-gradient-to-r ${getApiTypeColor(apiType)} text-white rounded-lg font-semibold flex items-center justify-between hover:shadow-lg transition-all hover:scale-105`}
      >
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          <span>🎮 Try Interactive Demo</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">Choose a demo to explore:</div>
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => handleDemoSelect(demo)}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-700 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {demo.title}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {demo.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="bg-slate-700 px-2 py-1 rounded">
                        {demo.endpoint}
                      </span>
                      <span className="bg-slate-700 px-2 py-1 rounded">
                        {demo.method}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors ml-2" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Demo Preview */}
      {selectedDemo && (
        <div className="mt-4 p-4 bg-slate-800/50 border border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-white">Selected Demo: {selectedDemo.title}</h4>
            <a
              href={selectedDemo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
            >
              Open Demo
            </a>
          </div>
          <p className="text-sm text-gray-400 mb-2">{selectedDemo.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="bg-slate-700 px-2 py-1 rounded">
              {selectedDemo.endpoint}
            </span>
            <span className="bg-slate-700 px-2 py-1 rounded">
              {selectedDemo.method}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
