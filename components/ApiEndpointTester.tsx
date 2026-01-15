"use client";

import { useState } from "react";
import { Play, Loader2, CheckCircle, XCircle, ChevronDown, ChevronUp, Copy, Check, Settings } from "lucide-react";
import { collectHttpRequest, collectError } from "@/lib/metrics";

interface ApiEndpointTesterProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  defaultBody?: string;
  color?: string;
}

export default function ApiEndpointTester({
  method,
  path,
  description,
  defaultBody,
  color = "blue"
}: ApiEndpointTesterProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestBody, setRequestBody] = useState(defaultBody || "");
  const [isResponseExpanded, setIsResponseExpanded] = useState(true);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isHeadersExpanded, setIsHeadersExpanded] = useState(false);
  const [headers, setHeaders] = useState<Record<string, string>>({
    "Content-Type": "application/json",
    "Accept": "application/json"
  });

  const methodColors = {
    GET: "text-green-400 border-green-500/30 bg-green-500/10",
    POST: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    PUT: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    DELETE: "text-red-400 border-red-500/30 bg-red-500/10"
  };

  const buttonColors = {
    GET: "bg-green-500 hover:bg-green-600",
    POST: "bg-blue-500 hover:bg-blue-600",
    PUT: "bg-orange-500 hover:bg-orange-600",
    DELETE: "bg-red-500 hover:bg-red-600"
  };

  const handleTryApi = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      // Using JSONPlaceholder as a test API
      const baseUrl = "https://jsonplaceholder.typicode.com";
      const url = `${baseUrl}${path.replace(":id", "1")}`;

      const options: RequestInit = {
        method: method,
        headers: headers,
      };

      if (method !== "GET" && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      setResponseTime(duration);
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data,
      });

      // Collect metrics for observability dashboard
      collectHttpRequest({
        method: method,
        url: url,
        status: res.status,
        duration: duration,
        timestamp: Date.now(),
        phase: "Phase 1",
        demo: `${method} ${path}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);

      // Collect error metrics
      collectError({
        message: errorMessage,
        type: "API_ERROR",
        timestamp: Date.now(),
        phase: "Phase 1",
        demo: `${method} ${path}`
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (response) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const addHeader = () => {
    const key = prompt("Header name:");
    const value = prompt("Header value:");
    if (key && value) {
      setHeaders({ ...headers, [key]: value });
    }
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...headers };
    delete newHeaders[key];
    setHeaders(newHeaders);
  };

  return (
    <div className={`bg-slate-900 p-4 rounded-lg border ${methodColors[method]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className={`font-mono text-sm font-bold px-3 py-1 rounded border ${methodColors[method]}`}>
            {method}
          </span>
          <span className="text-blue-400 font-mono text-sm">{path}</span>
          {responseTime !== null && (
            <span className="text-gray-400 text-xs">
              ⚡ {responseTime}ms
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleTryApi}
            disabled={loading}
            className={`px-4 py-2 ${buttonColors[method]} text-white rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Try API
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-xs mb-3">{description}</p>

      {/* Request Headers - Always visible, collapseable */}
      <div className="mb-3 bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-3 flex items-center justify-between border-b border-slate-700">
          <button
            onClick={() => setIsHeadersExpanded(!isHeadersExpanded)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-xs font-semibold">
              Request Headers ({Object.keys(headers).length})
            </span>
            {isHeadersExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {isHeadersExpanded && (
            <button
              onClick={addHeader}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add Header
            </button>
          )}
        </div>
        {isHeadersExpanded && (
          <div className="p-3 space-y-2 animate-slideDown">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-mono w-32 flex-shrink-0">{key}:</span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setHeaders({ ...headers, [key]: e.target.value })}
                  className="flex-1 bg-black text-gray-300 border border-slate-600 rounded px-2 py-1 font-mono"
                />
                <button
                  onClick={() => removeHeader(key)}
                  className="text-red-400 hover:text-red-300 transition-colors px-2"
                  title="Remove header"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {(method === "POST" || method === "PUT") && (
        <div className="mb-3">
          <label className="text-gray-400 text-xs font-semibold mb-2 block">
            Request Body (JSON):
          </label>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="w-full bg-black text-gray-300 border border-slate-700 rounded-lg p-2 font-mono text-xs"
            rows={4}
            placeholder='{"title": "foo", "body": "bar", "userId": 1}'
          />
        </div>
      )}

      {response && (
        <div className="mt-3 bg-slate-800 rounded-lg border border-green-500/30">
          <div className="p-3 flex items-center justify-between border-b border-green-500/20">
            <button
              onClick={() => setIsResponseExpanded(!isResponseExpanded)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs font-semibold">
                Response: {response.status} {response.statusText}
              </span>
              {isResponseExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-slate-700 rounded transition-all"
              title="Copy response"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          {isResponseExpanded && (
            <div className="p-3 animate-slideDown">
              <pre className="text-gray-300 text-xs overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-xs font-semibold">
              Error: {error}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

