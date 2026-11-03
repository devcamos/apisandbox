"use client";

import PhaseLayout from "@/components/PhaseLayout";
import OAuth2Simulator from "@/components/OAuth2Simulator";
import { Shield } from "lucide-react";

export default function OAuth2Demo() {
  return (
    <PhaseLayout
      phaseNumber={2}
      title="OAuth2 Demo"
      description="Interactive OAuth2 authorization flow simulator"
      icon={Shield}
      color="from-purple-500 to-pink-500"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Phase 2", href: "/phase-2" },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <OAuth2Simulator
          title="OAuth2 Authorization Flow"
          description="Watch the complete OAuth2 authorization code flow step-by-step"
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
    </PhaseLayout>
  );
}

