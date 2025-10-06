"use client";

import { useState } from "react";
import { ArrowLeft, Play, BookOpen, Copy, Check } from "lucide-react";
import Link from "next/link";
import DemoSelector from "@/components/DemoSelector";

const restDemos = [
  {
    id: "users-crud",
    title: "Users CRUD API",
    description: "Create, read, update, and delete user records",
    endpoint: "/api/users",
    method: "GET, POST, PUT, DELETE",
    examples: {
      get: {
        url: "GET /api/users",
        description: "Retrieve all users",
        response: {
          "users": [
            { "id": 1, "name": "John Doe", "email": "john@example.com" },
            { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
          ]
        }
      },
      post: {
        url: "POST /api/users",
        description: "Create a new user",
        body: { "name": "New User", "email": "new@example.com" },
        response: { "id": 3, "name": "New User", "email": "new@example.com" }
      }
    }
  },
  {
    id: "posts-api",
    title: "Posts & Comments API",
    description: "Blog posts with nested comments and relationships",
    endpoint: "/api/posts",
    method: "GET, POST, PUT, DELETE",
    examples: {
      get: {
        url: "GET /api/posts/1",
        description: "Get a specific post with comments",
        response: {
          "id": 1,
          "title": "Understanding REST APIs",
          "content": "REST is an architectural style...",
          "comments": [
            { "id": 1, "text": "Great article!", "author": "Alice" }
          ]
        }
      }
    }
  },
  {
    id: "products-api",
    title: "E-commerce Products API",
    description: "Product catalog with categories and inventory",
    endpoint: "/api/products",
    method: "GET, POST, PUT, DELETE",
    examples: {
      get: {
        url: "GET /api/products?category=electronics",
        description: "Get products by category",
        response: {
          "products": [
            { "id": 1, "name": "Laptop", "price": 999.99, "category": "electronics" }
          ]
        }
      }
    }
  }
];

export default function RestPracticePage() {
  const [selectedDemo, setSelectedDemo] = useState(restDemos[0]);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/phase-1"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Phase 1
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            REST API Practice Lab
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hands-on practice with REST API concepts. Choose a demo scenario and explore real API interactions.
          </p>
        </div>

        {/* Demo Selector */}
        <div className="max-w-4xl mx-auto mb-12">
          <DemoSelector 
            apiType="rest" 
            onDemoSelect={(demo) => {
              const foundDemo = restDemos.find(d => d.id === demo.id);
              if (foundDemo) setSelectedDemo(foundDemo);
            }} 
          />
        </div>

        {/* Selected Demo Content */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">{selectedDemo.title}</h2>
            <p className="text-gray-400 mb-6">{selectedDemo.description}</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* API Examples */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-400" />
                  API Examples
                </h3>
                
                {Object.entries(selectedDemo.examples).map(([method, example]) => (
                  <div key={method} className="mb-6 bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{example.url}</h4>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(example, null, 2), `${selectedDemo.id}-${method}`)}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm transition-colors"
                      >
                        {copiedStates[`${selectedDemo.id}-${method}`] ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{example.description}</p>
                    
                    {example.body && (
                      <div className="mb-3">
                        <h5 className="text-sm font-semibold text-gray-300 mb-1">Request Body:</h5>
                        <pre className="bg-slate-900 p-3 rounded text-sm text-gray-300 overflow-x-auto">
                          {JSON.stringify(example.body, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    <div>
                      <h5 className="text-sm font-semibold text-gray-300 mb-1">Response:</h5>
                      <pre className="bg-slate-900 p-3 rounded text-sm text-gray-300 overflow-x-auto">
                        {JSON.stringify(example.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Demo */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-400" />
                  Try It Live
                </h3>
                
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <p className="text-gray-400 mb-4">
                    This demo shows how REST APIs work in practice. Click the button below to see the live demo.
                  </p>
                  
                  <Link
                    href="/phase-1/categories#rest"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all hover:scale-105"
                  >
                    <Play className="w-4 h-4" />
                    Launch Interactive Demo
                  </Link>
                </div>

                {/* Key Concepts */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Key REST Concepts Demonstrated:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                      <span><strong>Resource-based URLs:</strong> Each endpoint represents a resource</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                      <span><strong>HTTP Methods:</strong> GET, POST, PUT, DELETE for different operations</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                      <span><strong>Stateless:</strong> Each request contains all necessary information</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                      <span><strong>JSON Responses:</strong> Structured data format for easy parsing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
