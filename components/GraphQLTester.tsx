"use client";

import { useState } from "react";
import { Play, Loader2, CheckCircle, XCircle, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface GraphQLTesterProps {
  title: string;
  defaultQuery: string;
  description: string;
}

export default function GraphQLTester({ title, defaultQuery, description }: GraphQLTesterProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(defaultQuery);
  const [isResponseExpanded, setIsResponseExpanded] = useState(true);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      // Simulate GraphQL response
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      // Mock GraphQL response
      const mockData = {
        data: {
          user: {
            id: "123",
            name: "John Doe",
            email: "john@example.com",
            posts: [
              { id: "1", title: "GraphQL is Amazing", createdAt: "2024-01-15" },
              { id: "2", title: "Building APIs", createdAt: "2024-01-20" }
            ]
          }
        }
      };

      setResponseTime(duration);
      setResponse(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (response) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-purple-500/30 bg-purple-500/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="font-mono text-sm font-bold px-3 py-1 rounded border border-purple-500/30 bg-purple-500/10 text-purple-400">
            QUERY
          </span>
          <span className="text-purple-400 font-semibold text-sm">{title}</span>
          {responseTime !== null && (
            <span className="text-gray-400 text-xs">⚡ {responseTime}ms</span>
          )}
        </div>
        <button
          onClick={handleExecute}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Execute
            </>
          )}
        </button>
      </div>

      <p className="text-gray-400 text-xs mb-3">{description}</p>

      <div className="mb-3">
        <label className="text-gray-400 text-xs font-semibold mb-2 block">GraphQL Query:</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-800 text-gray-300 border border-slate-700 rounded-lg p-3 font-mono text-xs"
          rows={8}
        />
      </div>

      {response && (
        <div className="mt-3 bg-slate-800 rounded-lg border border-green-500/30">
          <div className="p-3 flex items-center justify-between border-b border-green-500/20">
            <button
              onClick={() => setIsResponseExpanded(!isResponseExpanded)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs font-semibold">Response: 200 OK</span>
              {isResponseExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            <button onClick={copyToClipboard} className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-slate-700 rounded transition-all">
              {copied ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied!</span></> : <><Copy className="w-3 h-3" /><span>Copy</span></>}
            </button>
          </div>
          {isResponseExpanded && (
            <div className="p-3 animate-slideDown">
              <pre className="text-gray-300 text-xs overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-xs font-semibold">Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

