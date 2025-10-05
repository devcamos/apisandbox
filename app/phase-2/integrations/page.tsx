"use client";

import PhaseLayout from "@/components/PhaseLayout";
import InteractiveCategory from "@/components/InteractiveCategory";
import OAuth2Simulator from "@/components/OAuth2Simulator";
import ApiKeyTester from "@/components/ApiKeyTester";
import RetryDemo from "@/components/RetryDemo";
import CircuitBreakerDemo from "@/components/CircuitBreakerDemo";
import { Plug, Shield, Key, RefreshCw, Zap } from "lucide-react";

export default function Phase2Integrations() {
  // OAuth2 Demo Content
  const oauth2Demo = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">🔐 OAuth2 Authorization Flow</h4>
      <p className="text-gray-300 mb-4">
        See how OAuth2 authorization works step-by-step with visual animations!
      </p>

      <OAuth2Simulator
        title="OAuth2 Flow Simulator"
        description="Watch the complete OAuth2 authorization code flow in action"
      />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">✨ Key Features</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Authorization code is temporary (~10 min)</li>
            <li>• Token exchange happens server-side</li>
            <li>• Access tokens expire (~1 hour)</li>
            <li>• Refresh tokens get new access tokens</li>
          </ul>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">📱 Use Cases</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Social login (Google, GitHub)</li>
            <li>• Third-party app authorization</li>
            <li>• Delegated access to user data</li>
            <li>• Secure mobile app authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // API Key Demo Content
  const apiKeyDemo = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">🔑 API Key Authentication</h4>
      <p className="text-gray-300 mb-4">
        Test API key authentication with mock or real APIs - you control your keys!
      </p>

      <ApiKeyTester
        title="API Key Tester"
        description="Try API key authentication in headers or query parameters"
      />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">✨ Key Features</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Simple to implement</li>
            <li>• Header vs query param comparison</li>
            <li>• Rate limiting per key</li>
            <li>• Your keys stored locally only</li>
          </ul>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">📱 Use Cases</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Internal service authentication</li>
            <li>• Third-party API access</li>
            <li>• Development and testing</li>
            <li>• Simple machine-to-machine auth</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Retry Demo Content
  const retryDemoContent = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">🔄 Retry with Exponential Backoff</h4>
      <p className="text-gray-300 mb-4">
        See how retry logic with exponential backoff handles transient failures gracefully!
      </p>

      <RetryDemo
        title="Retry Mechanism Demo"
        description="Watch retries with configurable delays and failure rates"
      />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">✨ Key Features</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Exponential delays (1s, 2s, 4s, 8s)</li>
            <li>• Prevents thundering herd</li>
            <li>• Configurable max retries</li>
            <li>• Jitter for distributed systems</li>
          </ul>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">📱 Use Cases</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Network glitches</li>
            <li>• Temporary service overload</li>
            <li>• Rate limit handling</li>
            <li>• Database connection issues</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Circuit Breaker Demo Content
  const circuitBreakerContent = (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-white mb-3">⚡ Circuit Breaker Pattern</h4>
      <p className="text-gray-300 mb-4">
        Watch the circuit breaker prevent cascading failures with state machine visualization!
      </p>

      <CircuitBreakerDemo
        title="Circuit Breaker Demo"
        description="Interactive circuit breaker with Closed → Open → Half-Open states"
      />

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">✨ Key Features</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Prevents cascading failures</li>
            <li>• Fast-fail when service is down</li>
            <li>• Auto-recovery testing</li>
            <li>• Configurable thresholds</li>
          </ul>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">📱 Use Cases</h5>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Microservices communication</li>
            <li>• Third-party API calls</li>
            <li>• Database connections</li>
            <li>• Payment gateways</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <PhaseLayout
      phaseNumber={2}
      title="Interactive Integrations"
      description="Hands-on demos for authentication and resilience patterns"
      icon={Plug}
      color="from-purple-500 to-pink-500"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Phase 2", href: "/phase-2" },
      ]}
    >
      {/* Goal Section */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold text-white mb-3">🎯 Interactive Learning</h2>
        <p className="text-gray-300 text-lg">
          Click on each pattern below to explore interactive demos. Test authentication flows,
          resilience patterns, and see how production systems handle failures!
        </p>
      </div>

      {/* Interactive Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Authentication & Resilience - Click to Explore</h2>
        <div className="space-y-6">
          <div id="oauth2" className="scroll-mt-24">
            <InteractiveCategory
              icon={Shield}
              title="OAuth2"
              description="Industry-standard protocol for authorization"
              items={[
                "Authorization Code Flow",
                "Token exchange and refresh",
                "Visual step-by-step flow",
                "No real credentials needed"
              ]}
              color="from-purple-500 to-pink-500"
              demoContent={oauth2Demo}
            />
          </div>

          <div id="api-keys" className="scroll-mt-24">
            <InteractiveCategory
              icon={Key}
              title="API Keys"
              description="Simple authentication using static keys"
              items={[
                "Mock and real API modes",
                "Header vs query param testing",
                "Your keys stay local",
                "Rate limiting demonstration"
              ]}
              color="from-blue-500 to-cyan-500"
              demoContent={apiKeyDemo}
            />
          </div>

          <div id="retry" className="scroll-mt-24">
            <InteractiveCategory
              icon={RefreshCw}
              title="Retry with Exponential Backoff"
              description="Handle transient failures gracefully"
              items={[
                "Visual retry attempts",
                "Exponential vs linear backoff",
                "Configurable failure rates",
                "Real-time delay visualization"
              ]}
              color="from-green-500 to-emerald-500"
              demoContent={retryDemoContent}
            />
          </div>

          <div id="circuit-breaker" className="scroll-mt-24">
            <InteractiveCategory
              icon={Zap}
              title="Circuit Breaker"
              description="Prevent cascading failures with state machine"
              items={[
                "Closed → Open → Half-Open states",
                "Failure threshold configuration",
                "Auto-recovery testing",
                "Request blocking visualization"
              ]}
              color="from-orange-500 to-red-500"
              demoContent={circuitBreakerContent}
            />
          </div>
        </div>
      </section>
    </PhaseLayout>
  );
}

