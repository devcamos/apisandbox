"use client";

import { useState } from "react";
import { Play, Zap, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { collectCircuitBreaker } from "@/lib/metrics";

interface CircuitBreakerDemoProps {
  title: string;
  description: string;
}

type CircuitState = "closed" | "open" | "half-open";

interface Request {
  id: number;
  status: "success" | "failed" | "blocked";
  timestamp: string;
}

export default function CircuitBreakerDemo({ title, description }: CircuitBreakerDemoProps) {
  const [circuitState, setCircuitState] = useState<CircuitState>("closed");
  const [requests, setRequests] = useState<Request[]>([]);
  const [failureCount, setFailureCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [failureThreshold] = useState(3);
  const [failureRate, setFailureRate] = useState(80); // % chance of failure

  const sendRequest = async () => {
    const requestId = Date.now();
    const timestamp = new Date().toLocaleTimeString();

    // If circuit is open, reject immediately
    if (circuitState === "open") {
      const blockedRequest: Request = {
        id: requestId,
        status: "blocked",
        timestamp,
      };
      setRequests(prev => [blockedRequest, ...prev].slice(0, 10));
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    const shouldFail = Math.random() * 100 < failureRate;

    if (shouldFail) {
      // Request failed
      const failedRequest: Request = {
        id: requestId,
        status: "failed",
        timestamp,
      };
      setRequests(prev => [failedRequest, ...prev].slice(0, 10));
      
      const newFailureCount = failureCount + 1;
      setFailureCount(newFailureCount);

      // Check if we should open the circuit
      if (newFailureCount >= failureThreshold && circuitState === "closed") {
        setCircuitState("open");
        
        // Collect circuit breaker metric
        collectCircuitBreaker({
          state: "open",
          failureCount: newFailureCount,
          timestamp: Date.now(),
          service: "demo-service"
        });
        
        // Auto-transition to half-open after 5 seconds
        setTimeout(() => {
          setCircuitState("half-open");
          setFailureCount(0);
          setSuccessCount(0);
          
          // Collect half-open metric
          collectCircuitBreaker({
            state: "half-open",
            failureCount: 0,
            timestamp: Date.now(),
            service: "demo-service"
          });
        }, 5000);
      }
    } else {
      // Request succeeded
      const successRequest: Request = {
        id: requestId,
        status: "success",
        timestamp,
      };
      setRequests(prev => [successRequest, ...prev].slice(0, 10));
      
      const newSuccessCount = successCount + 1;
      setSuccessCount(newSuccessCount);

      // If in half-open and got success, close circuit
      if (circuitState === "half-open" && newSuccessCount >= 2) {
        setCircuitState("closed");
        setFailureCount(0);
        setSuccessCount(0);
        
        // Collect circuit closed metric
        collectCircuitBreaker({
          state: "closed",
          failureCount: 0,
          timestamp: Date.now(),
          service: "demo-service"
        });
      }
    }
  };

  const autoSend = async () => {
    setIsRunning(true);
    
    for (let i = 0; i < 10; i++) {
      await sendRequest();
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setIsRunning(false);
  };

  const reset = () => {
    setCircuitState("closed");
    setRequests([]);
    setFailureCount(0);
    setSuccessCount(0);
  };

  const getStateColor = (state: CircuitState) => {
    switch (state) {
      case "closed":
        return "border-green-500 bg-green-500/20 text-green-400";
      case "open":
        return "border-red-500 bg-red-500/20 text-red-400";
      case "half-open":
        return "border-yellow-500 bg-yellow-500/20 text-yellow-400";
    }
  };

  const getStateIcon = (state: CircuitState) => {
    switch (state) {
      case "closed":
        return <CheckCircle className="w-6 h-6" />;
      case "open":
        return <XCircle className="w-6 h-6" />;
      case "half-open":
        return <AlertCircle className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-red-400 mb-1">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>

      {/* Circuit State Visualization */}
      <div className={`p-4 rounded-lg border-2 mb-4 transition-all ${getStateColor(circuitState)}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getStateIcon(circuitState)}
            <span className="text-xl font-bold uppercase">{circuitState}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Failures: </span>
            <span className="font-bold">{failureCount}/{failureThreshold}</span>
          </div>
        </div>
        <p className="text-sm opacity-80">
          {circuitState === "closed" && "Requests flowing normally"}
          {circuitState === "open" && "Blocking all requests (cooling down for 5s)"}
          {circuitState === "half-open" && "Testing service recovery"}
        </p>
      </div>

      {/* State Machine Diagram */}
      <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <h5 className="text-sm font-semibold text-gray-300 mb-3">State Transitions:</h5>
        <div className="flex items-center justify-between text-xs">
          <div className={`px-3 py-2 rounded-lg ${circuitState === "closed" ? "bg-green-500/20 text-green-400 font-bold" : "bg-slate-700 text-gray-500"}`}>
            CLOSED
          </div>
          <span className="text-gray-500">→</span>
          <div className={`px-3 py-2 rounded-lg ${circuitState === "open" ? "bg-red-500/20 text-red-400 font-bold" : "bg-slate-700 text-gray-500"}`}>
            OPEN
          </div>
          <span className="text-gray-500">→</span>
          <div className={`px-3 py-2 rounded-lg ${circuitState === "half-open" ? "bg-yellow-500/20 text-yellow-400 font-bold" : "bg-slate-700 text-gray-500"}`}>
            HALF-OPEN
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400 space-y-1">
          <p>• CLOSED → OPEN: {failureThreshold} consecutive failures</p>
          <p>• OPEN → HALF-OPEN: After 5 second timeout</p>
          <p>• HALF-OPEN → CLOSED: 2 successful requests</p>
          <p>• HALF-OPEN → OPEN: Any failure</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-2 block">Failure Rate (Simulated Service Health):</label>
        <select
          value={failureRate}
          onChange={(e) => setFailureRate(Number(e.target.value))}
          disabled={isRunning}
          className="w-full bg-slate-800 text-gray-300 border border-slate-700 rounded px-3 py-2 text-sm"
        >
          <option value={20}>20% - Healthy Service</option>
          <option value={50}>50% - Degraded Service</option>
          <option value={80}>80% - Failing Service</option>
          <option value={95}>95% - Critical Failure</option>
        </select>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={sendRequest}
          disabled={isRunning}
          className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          <Zap className="w-4 h-4 inline mr-1" />
          Send Single Request
        </button>
        <button
          onClick={autoSend}
          disabled={isRunning}
          className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          <Play className="w-4 h-4 inline mr-1" />
          Auto Send 10
        </button>
        <button
          onClick={reset}
          disabled={isRunning}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
        >
          Reset
        </button>
      </div>

      {/* Request Log */}
      {requests.length > 0 && (
        <div className="space-y-1">
          <h5 className="text-sm font-semibold text-gray-300 mb-2">Request Log (last 10):</h5>
          {requests.map((request) => (
            <div
              key={request.id}
              className={`p-2 rounded text-xs flex items-center justify-between ${
                request.status === "success"
                  ? "bg-green-500/10 text-green-400"
                  : request.status === "failed"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gray-500/10 text-gray-400"
              }`}
            >
              <span>
                {request.status === "success" && "✓ Request succeeded"}
                {request.status === "failed" && "✗ Request failed"}
                {request.status === "blocked" && "🚫 Blocked by circuit breaker"}
              </span>
              <span className="text-gray-500">{request.timestamp}</span>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-xs text-gray-300">
          <strong>💡 Key Benefit:</strong> Circuit breaker prevents cascading failures by stopping requests
          to a failing service, giving it time to recover. This protects your system from being overwhelmed.
        </p>
      </div>
    </div>
  );
}

