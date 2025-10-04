"use client";

import { useState } from "react";
import { Play, Loader2, CheckCircle, XCircle } from "lucide-react";

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

    try {
      // Using JSONPlaceholder as a test API
      const baseUrl = "https://jsonplaceholder.typicode.com";
      const url = `${baseUrl}${path.replace(":id", "1")}`;

      const options: RequestInit = {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (method !== "GET" && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-slate-900 p-4 rounded-lg border ${methodColors[method]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className={`font-mono text-sm font-bold px-3 py-1 rounded border ${methodColors[method]}`}>
            {method}
          </span>
          <span className="text-blue-400 font-mono text-sm">{path}</span>
        </div>
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

      <p className="text-gray-400 text-xs mb-3">{description}</p>

      {(method === "POST" || method === "PUT") && (
        <div className="mb-3">
          <label className="text-gray-400 text-xs font-semibold mb-2 block">
            Request Body (JSON):
          </label>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="w-full bg-slate-800 text-gray-300 border border-slate-700 rounded-lg p-2 font-mono text-xs"
            rows={4}
            placeholder='{"title": "foo", "body": "bar", "userId": 1}'
          />
        </div>
      )}

      {response && (
        <div className="mt-3 p-3 bg-slate-800 rounded-lg border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs font-semibold">
              Response: {response.status} {response.statusText}
            </span>
          </div>
          <pre className="text-gray-300 text-xs overflow-x-auto">
            {JSON.stringify(response.data, null, 2)}
          </pre>
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

