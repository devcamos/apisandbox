"use client";

import { useState } from "react";
import { Play, Settings, ChevronDown, ChevronUp, Copy, Check, Key } from "lucide-react";

interface ApiKeyTesterProps {
  title: string;
  description: string;
}

export default function ApiKeyTester({ title, description }: ApiKeyTesterProps) {
  const [mode, setMode] = useState<"mock" | "real">("mock");
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("openweather_api_key_session") || "";
    }
    return "";
  });
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [keyLocation, setKeyLocation] = useState<"header" | "query">("header");
  const [copied, setCopied] = useState(false);

  const saveApiKey = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('openweather_api_key_session', apiKey);
    }
  };

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      if (mode === "mock") {
        // Mock response
        await new Promise(resolve => setTimeout(resolve, 500));
        setResponse({
          mock: true,
          weather: {
            main: "Clouds",
            description: "overcast clouds",
            temp: 15.3,
            humidity: 72
          },
          location: "London, GB"
        });
      } else {
        // Real API call
        if (!apiKey) {
          throw new Error("API key is required for real mode");
        }

        const url = keyLocation === "query"
          ? `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`
          : `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric`;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (keyLocation === "header") {
          headers['X-API-Key'] = apiKey;
        }

        const res = await fetch(url, { headers });
        
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setResponse(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-blue-400 mb-1">{title}</h4>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setMode("mock")}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
            mode === "mock"
              ? "bg-blue-500 text-white"
              : "bg-slate-800 text-gray-400 hover:bg-slate-700"
          }`}
        >
          🎭 Mock API
        </button>
        <button
          onClick={() => setMode("real")}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
            mode === "real"
              ? "bg-blue-500 text-white"
              : "bg-slate-800 text-gray-400 hover:bg-slate-700"
          }`}
        >
          🌐 Real API
        </button>
      </div>

      {/* Configuration Panel */}
      {mode === "real" && (
        <div className="mb-4 bg-slate-800 rounded-lg border border-slate-700">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="w-full p-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-300">
                API Configuration {!apiKey && "(Required)"}
              </span>
            </div>
            {showConfig ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {showConfig && (
            <div className="p-4 border-t border-slate-700 space-y-3 animate-slideDown">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  OpenWeatherMap API Key:
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="flex-1 bg-black text-gray-300 border border-slate-600 rounded px-3 py-2 text-sm"
                  />
                  <button
                    onClick={saveApiKey}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-semibold"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  API Key Location:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setKeyLocation("header")}
                    className={`flex-1 py-2 px-3 rounded text-sm font-semibold ${
                      keyLocation === "header"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-900 text-gray-400"
                    }`}
                  >
                    Header (X-API-Key)
                  </button>
                  <button
                    onClick={() => setKeyLocation("query")}
                    className={`flex-1 py-2 px-3 rounded text-sm font-semibold ${
                      keyLocation === "query"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-900 text-gray-400"
                    }`}
                  >
                    Query Param (?appid=)
                  </button>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                <p className="text-xs text-gray-300">
                  <Key className="w-3 h-3 inline mr-1" />
                  <strong>Privacy:</strong> Your API key is stored in session storage for this tab only.
                  Get a free key at{" "}
                  <a
                    href="https://openweathermap.org/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    openweathermap.org
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Button */}
      <button
        onClick={testAPI}
        disabled={loading || (mode === "real" && !apiKey)}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Testing...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Test API Call
          </>
        )}
      </button>

      {/* Response */}
      {response && (
        <div className="bg-slate-800 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-green-400 text-sm font-semibold">
              ✓ Success {response.mock && "(Mock Data)"}
            </span>
            <button
              onClick={copyResponse}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-slate-700 rounded transition-all"
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
          <pre className="text-xs text-gray-300 overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <span className="text-red-400 text-sm font-semibold">✗ Error: {error}</span>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-gray-300">
          <strong>💡 Tip:</strong> API keys in headers are more secure than query params.
          They don&apos;t appear in logs or browser history.
        </p>
      </div>
    </div>
  );
}

