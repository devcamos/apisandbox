"use client";

import { useState, useEffect } from "react";
import { metricsCollector, Metric } from "@/lib/metrics";
import { Activity, AlertTriangle, Clock, TrendingUp, Zap, RefreshCw } from "lucide-react";

export default function ObservabilityDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [stats, setStats] = useState(metricsCollector.getStats());
  const [isLive] = useState(true);

  useEffect(() => {
    // Initial load
    setMetrics(metricsCollector.getMetrics());
    setStats(metricsCollector.getStats());

    // Subscribe to updates
    const unsubscribe = metricsCollector.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      setStats(metricsCollector.getStats());
    });

    return unsubscribe;
  }, []);

  const recentMetrics = metrics.slice(-20).reverse();
  const httpMetrics = metrics.filter(m => m.type === 'http_request');
  const errorMetrics = metrics.filter(m => m.type === 'error');
  const circuitBreakerMetrics = metrics.filter(m => m.type === 'circuit_breaker');

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 300 && status < 400) return "text-blue-400";
    if (status >= 400 && status < 500) return "text-yellow-400";
    return "text-red-400";
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📊 Observability Dashboard</h1>
            <p className="text-gray-400">Real-time metrics from your API integration demos</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isLive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              {isLive ? 'Live' : 'Paused'}
            </div>
            <button
              onClick={() => metricsCollector.clear()}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Clear Data
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Requests/min</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.requestsPerMinute}</div>
            <div className="text-xs text-gray-500">Last 5 minutes</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-gray-400">Error Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.errorRate}%</div>
            <div className="text-xs text-gray-500">{errorMetrics.length} errors</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Avg Latency</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.avgLatency}ms</div>
            <div className="text-xs text-gray-500">P95: {stats.p95Latency}ms</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Total Requests</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalRequests}</div>
            <div className="text-xs text-gray-500">{stats.successfulRequests} successful</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HTTP Requests */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Recent HTTP Requests
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentMetrics.filter(m => m.type === 'http_request').map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${getStatusColor(metric.data.status)}`}>
                      {metric.data.status}
                    </span>
                    <span className="text-sm text-gray-300 font-mono">{metric.data.method}</span>
                    <span className="text-sm text-gray-400 truncate max-w-32">{metric.data.url}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDuration(metric.data.duration)}</span>
                    <span>{formatTimestamp(metric.timestamp)}</span>
                  </div>
                </div>
              ))}
              {httpMetrics.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No HTTP requests yet. Try running some demos!
                </div>
              )}
            </div>
          </div>

          {/* Circuit Breaker & Retries */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              Circuit Breaker & Retries
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentMetrics.filter(m => m.type === 'circuit_breaker' || m.type === 'retry').map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {metric.type === 'circuit_breaker' ? (
                      <>
                        <Zap className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-gray-300">
                          Circuit {metric.data.state.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Failures: {metric.data.failureCount}
                        </span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-300">
                          Retry attempt {metric.data.attempt}
                        </span>
                        <span className={`text-xs ${metric.data.success ? 'text-green-400' : 'text-red-400'}`}>
                          {metric.data.success ? 'Success' : 'Failed'}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTimestamp(metric.timestamp)}
                  </div>
                </div>
              ))}
              {circuitBreakerMetrics.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No circuit breaker or retry activity yet. Try the resilience demos!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Docker Notice */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🐳</span>
            <h4 className="text-lg font-bold text-blue-400">Desktop + Docker Available</h4>
          </div>
          <p className="text-gray-300 text-sm">
            For the full observability experience with real tools like Grafana, Jaeger, and Prometheus, 
            run the desktop version with Docker. This dashboard shows simulated metrics from your demos.
          </p>
        </div>
      </div>
    </div>
  );
}
