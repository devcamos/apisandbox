"use client";

import PhaseLayout from "@/components/PhaseLayout";
import ApiKeyTester from "@/components/ApiKeyTester";
import { Key } from "lucide-react";

export default function ApiKeysDemo() {
  return (
    <PhaseLayout
      phaseNumber={2}
      title="API Key Authentication Demo"
      description="Test API key authentication with mock or real APIs"
      icon={Key}
      color="from-blue-500 to-cyan-500"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Phase 2", href: "/phase-2" },
      ]}
    >
      <div className="max-w-4xl mx-auto">
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
    </PhaseLayout>
  );
}

