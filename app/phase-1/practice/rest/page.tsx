"use client";

import { useState } from "react";
import { ArrowLeft, Play, BookOpen, Copy, Check, ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  const handleDemoSelect = (demo: any) => {
    const foundDemo = restDemos.find(d => d.id === demo.id);
    if (foundDemo) {
      setSelectedDemo(foundDemo);
      setSelectedEndpoint(null);
      setResponse(null);
    }
    setIsDropdownOpen(false);
  };

  const makeApiCall = async (method: string, url: string, body?: any) => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = selectedDemo.examples[method as keyof typeof selectedDemo.examples]?.response || {
        message: "API call successful",
        method,
        url,
        timestamp: new Date().toISOString()
      };
      
      setResponse(mockResponse);
    } catch (error) {
      setResponse({ error: "Failed to make API call" });
    } finally {
      setLoading(false);
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
          <div className="relative">
            {/* Demo Selector Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold flex items-center justify-between hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span>🎮 Try Interactive Demo</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-400 mb-2 px-2">Choose a demo to explore:</div>
                  {restDemos.map((demo) => (
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
          </div>
        </div>

        {/* Selected Demo Preview */}
        {selectedDemo && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Selected Demo: {selectedDemo.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {selectedDemo.endpoint}
                  </span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    {selectedDemo.method}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400">{selectedDemo.description}</p>
            </div>
          </div>
        )}

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
                    Test the API endpoints directly. Select an endpoint and make a request to see the response.
                  </p>
                  
                  {/* Endpoint Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Endpoint to Test:
                    </label>
                    <div className="space-y-2">
                      {Object.entries(selectedDemo.examples).map(([method, example]) => (
                        <button
                          key={method}
                          onClick={() => {
                            setSelectedEndpoint(method);
                            makeApiCall(method, example.url, example.body);
                          }}
                          disabled={loading}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            selectedEndpoint === method
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-slate-600 hover:border-slate-500 hover:bg-slate-600/50'
                          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-white">{example.url}</div>
                              <div className="text-sm text-gray-400">{example.description}</div>
                            </div>
                            <div className="text-xs bg-slate-700 px-2 py-1 rounded">
                              {method.toUpperCase()}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Response Display */}
                  {response && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Response:</h4>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(response, null, 2), 'response')}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm transition-colors"
                        >
                          {copiedStates.response ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <pre className="bg-slate-900 p-3 rounded text-sm text-gray-300 overflow-x-auto">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </div>
                  )}

                  {loading && (
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-2 text-blue-400">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        Making API call...
                      </div>
                    </div>
                  )}
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
