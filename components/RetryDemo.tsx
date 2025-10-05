"use client";

import { useState } from "react";
import { Play, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

interface RetryDemoProps {
  title: string;
  description: string;
}

interface Attempt {
  number: number;
  status: "pending" | "success" | "failed";
  delay: number;
  timestamp: string;
}

export default function RetryDemo({ title, description }: RetryDemoProps) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [maxRetries, setMaxRetries] = useState(3);
  const [failureRate, setFailureRate] = useState(70); // % chance of failure
  const [backoffType, setBackoffType] = useState<"exponential" | "linear">("exponential");

  const calculateDelay = (attemptNumber: number): number => {
    if (backoffType === "exponential") {
      return Math.pow(2, attemptNumber) * 1000; // 1s, 2s, 4s, 8s
    } else {
      return attemptNumber * 1000; // 1s, 2s, 3s, 4s
    }
  };

  const startRetryDemo = async () => {
    setIsRunning(true);
    setAttempts([]);

    for (let i = 0; i <= maxRetries; i++) {
      const delay = i === 0 ? 0 : calculateDelay(i);
      const attempt: Attempt = {
        number: i + 1,
        status: "pending",
        delay,
        timestamp: new Date().toLocaleTimeString(),
      };

      // Add pending attempt
      setAttempts(prev => [...prev, attempt]);

      // Wait for delay if not first attempt
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Randomly succeed or fail based on failure rate
      const shouldFail = Math.random() * 100 < failureRate;

      if (!shouldFail || i === maxRetries) {
        // Success or final attempt
        setAttempts(prev =>
          prev.map((a, idx) =>
            idx === prev.length - 1 ? { ...a, status: !shouldFail ? "success" : "failed" } : a
          )
        );
        
        if (!shouldFail) {
          break; // Success, stop retrying
        }
      } else {
        // Failed, will retry
        setAttempts(prev =>
          prev.map((a, idx) =>
            idx === prev.length - 1 ? { ...a, status: "failed" } : a
          )
        );
      }
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: Attempt["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: Attempt["status"]) => {
    switch (status) {
      case "pending":
        return "border-yellow-500/30 bg-yellow-500/10";
      case "success":
        return "border-green-500/30 bg-green-500/10";
      case "failed":
        return "border-red-500/30 bg-red-500/10";
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-green-500/30 bg-green-500/10">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-green-400 mb-1">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Max Retries:</label>
          <select
            value={maxRetries}
            onChange={(e) => setMaxRetries(Number(e.target.value))}
            disabled={isRunning}
            className="w-full bg-slate-800 text-gray-300 border border-slate-700 rounded px-3 py-2 text-sm"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Failure Rate:</label>
          <select
            value={failureRate}
            onChange={(e) => setFailureRate(Number(e.target.value))}
            disabled={isRunning}
            className="w-full bg-slate-800 text-gray-300 border border-slate-700 rounded px-3 py-2 text-sm"
          >
            <option value={30}>30% (Easy)</option>
            <option value={50}>50% (Medium)</option>
            <option value={70}>70% (Hard)</option>
            <option value={90}>90% (Very Hard)</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-2 block">Backoff Strategy:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setBackoffType("exponential")}
            disabled={isRunning}
            className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-all ${
              backoffType === "exponential"
                ? "bg-green-500 text-white"
                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
            }`}
          >
            Exponential (1s, 2s, 4s, 8s)
          </button>
          <button
            onClick={() => setBackoffType("linear")}
            disabled={isRunning}
            className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition-all ${
              backoffType === "linear"
                ? "bg-green-500 text-white"
                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
            }`}
          >
            Linear (1s, 2s, 3s, 4s)
          </button>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={startRetryDemo}
        disabled={isRunning}
        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isRunning ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Start Retry Demo
          </>
        )}
      </button>

      {/* Attempts Log */}
      {attempts.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-semibold text-gray-300">Retry Attempts:</h5>
          {attempts.map((attempt, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border transition-all ${getStatusColor(attempt.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(attempt.status)}
                  <span className="text-sm font-semibold text-gray-300">
                    Attempt {attempt.number}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{attempt.timestamp}</span>
              </div>
              {attempt.delay > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  ⏱️ Waited {(attempt.delay / 1000).toFixed(1)}s before retry
                </p>
              )}
              {attempt.status === "success" && (
                <p className="text-xs text-green-400 mt-1">✓ Request succeeded!</p>
              )}
              {attempt.status === "failed" && idx < attempts.length - 1 && (
                <p className="text-xs text-orange-400 mt-1">
                  ↻ Failed, retrying in {(calculateDelay(attempt.number) / 1000).toFixed(1)}s...
                </p>
              )}
              {attempt.status === "failed" && idx === attempts.length - 1 && (
                <p className="text-xs text-red-400 mt-1">✗ All retries exhausted</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-xs text-gray-300">
          <strong>💡 Best Practice:</strong> Exponential backoff with jitter prevents thundering herd problem.
          3 retries covers most transient failures (network glitches, rate limits).
        </p>
      </div>
    </div>
  );
}

