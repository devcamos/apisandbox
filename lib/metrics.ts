// Observability metrics collection system
export interface Metric {
  id: string;
  timestamp: number;
  type: 'http_request' | 'circuit_breaker' | 'retry' | 'error';
  data: any;
}

export interface HttpRequestMetric {
  method: string;
  url: string;
  status: number;
  duration: number;
  timestamp: number;
  phase: string;
  demo: string;
}

export interface CircuitBreakerMetric {
  state: 'closed' | 'open' | 'half-open';
  failureCount: number;
  timestamp: number;
  service: string;
}

export interface RetryMetric {
  attempt: number;
  success: boolean;
  delay: number;
  timestamp: number;
  demo: string;
}

export interface ErrorMetric {
  message: string;
  type: string;
  timestamp: number;
  phase: string;
  demo: string;
}

class MetricsCollector {
  private metrics: Metric[] = [];
  private listeners: ((metrics: Metric[]) => void)[] = [];

  constructor() {
    // Add some sample metrics to demonstrate the dashboard
    this.addSampleMetrics();
  }

  private addSampleMetrics() {
    const now = Date.now();
    const sampleMetrics = [
      {
        type: 'http_request' as const,
        data: {
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/posts',
          status: 200,
          duration: 245,
          timestamp: now - 30000,
          phase: 'Phase 1',
          demo: 'GET /posts'
        }
      },
      {
        type: 'http_request' as const,
        data: {
          method: 'POST',
          url: 'https://jsonplaceholder.typicode.com/posts',
          status: 201,
          duration: 189,
          timestamp: now - 25000,
          phase: 'Phase 1',
          demo: 'POST /posts'
        }
      },
      {
        type: 'http_request' as const,
        data: {
          method: 'WS_CONNECT',
          url: 'ws://localhost:8080/websocket',
          status: 200,
          duration: 50,
          timestamp: now - 20000,
          phase: 'Phase 1',
          demo: 'WebSocket Connection'
        }
      },
      {
        type: 'http_request' as const,
        data: {
          method: 'EVENT_PUBLISH',
          url: 'kafka://localhost:9092/user.created',
          status: 200,
          duration: 15,
          timestamp: now - 15000,
          phase: 'Phase 1',
          demo: 'Event: user.created'
        }
      },
      {
        type: 'error' as const,
        data: {
          message: 'Connection timeout',
          type: 'TIMEOUT_ERROR',
          timestamp: now - 10000,
          phase: 'Phase 1',
          demo: 'GET /users'
        }
      }
    ];

    sampleMetrics.forEach(metric => {
      this.addMetric(metric.type, metric.data);
    });
  }

  // Add a new metric
  addMetric(type: Metric['type'], data: any) {
    const metric: Metric = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      data
    };

    this.metrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener([...this.metrics]));
  }

  // Get all metrics
  getMetrics(): Metric[] {
    return [...this.metrics];
  }

  // Get metrics by type
  getMetricsByType(type: Metric['type']): Metric[] {
    return this.metrics.filter(m => m.type === type);
  }

  // Get metrics from last N minutes
  getRecentMetrics(minutes: number = 5): Metric[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.metrics.filter(m => m.timestamp > cutoff);
  }

  // Subscribe to metric updates
  subscribe(listener: (metrics: Metric[]) => void) {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Clear all metrics
  clear() {
    this.metrics = [];
    this.listeners.forEach(listener => listener([]));
  }

  // Get aggregated stats
  getStats() {
    const httpMetrics = this.getMetricsByType('http_request');
    const errorMetrics = this.getMetricsByType('error');
    const recentMetrics = this.getRecentMetrics(5);

    const totalRequests = httpMetrics.length;
    const successfulRequests = httpMetrics.filter(m => m.data.status >= 200 && m.data.status < 400).length;
    const errorRate = totalRequests > 0 ? (errorMetrics.length / totalRequests) * 100 : 0;
    
    const latencies = httpMetrics.map(m => m.data.duration).filter(d => d != null);
    const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
    const p95Latency = latencies.length > 0 ? this.percentile(latencies, 0.95) : 0;

    const requestsPerMinute = recentMetrics.filter(m => m.type === 'http_request').length;

    return {
      totalRequests,
      successfulRequests,
      errorRate: Math.round(errorRate * 100) / 100,
      avgLatency: Math.round(avgLatency),
      p95Latency: Math.round(p95Latency),
      requestsPerMinute,
      lastUpdated: Date.now()
    };
  }

  private percentile(arr: number[], p: number): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index] || 0;
  }
}

// Global metrics collector instance
export const metricsCollector = new MetricsCollector();

// Helper functions for easy metric collection
export const collectHttpRequest = (data: HttpRequestMetric) => {
  metricsCollector.addMetric('http_request', data);
};

export const collectCircuitBreaker = (data: CircuitBreakerMetric) => {
  metricsCollector.addMetric('circuit_breaker', data);
};

export const collectRetry = (data: RetryMetric) => {
  metricsCollector.addMetric('retry', data);
};

export const collectError = (data: ErrorMetric) => {
  metricsCollector.addMetric('error', data);
};
