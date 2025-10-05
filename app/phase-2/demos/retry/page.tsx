"use client";

import PhaseLayout from "@/components/PhaseLayout";
import RetryDemo from "@/components/RetryDemo";
import { RefreshCw } from "lucide-react";

export default function RetryDemoPage() {
  return (
    <PhaseLayout
      phaseNumber={2}
      title="Retry with Exponential Backoff Demo"
      description="See how retry logic handles transient failures gracefully"
      icon={RefreshCw}
      color="from-green-500 to-emerald-500"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Phase 2", href: "/phase-2" },
      ]}
    >
      <div className="max-w-4xl mx-auto">
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
    </PhaseLayout>
  );
}

