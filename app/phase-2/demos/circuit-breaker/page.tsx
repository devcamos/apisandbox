"use client";

import PhaseLayout from "@/components/PhaseLayout";
import CircuitBreakerDemo from "@/components/CircuitBreakerDemo";
import { Zap } from "lucide-react";

export default function CircuitBreakerDemoPage() {
  return (
    <PhaseLayout
      phaseNumber={2}
      title="Circuit Breaker Demo"
      description="Watch the circuit breaker prevent cascading failures"
      icon={Zap}
      color="from-orange-500 to-red-500"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Phase 2", href: "/phase-2" },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <CircuitBreakerDemo
          title="Circuit Breaker Pattern"
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
    </PhaseLayout>
  );
}

