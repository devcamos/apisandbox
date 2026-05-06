"use client";

import { useState } from "react";
import { Play, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface OAuth2SimulatorProps {
  title: string;
  description: string;
}

type FlowStep = "idle" | "authorize" | "redirect" | "token" | "complete";

export default function OAuth2Simulator({ title, description }: OAuth2SimulatorProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("idle");
  const [authCode, setAuthCode] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const startFlow = async () => {
    setIsAnimating(true);
    setCurrentStep("idle");
    setAuthCode("");
    setAccessToken("");

    // Step 1: Authorization Request
    await delay(500);
    setCurrentStep("authorize");
    
    // Step 2: User redirected with code
    await delay(2000);
    const code = generateRandomCode();
    setAuthCode(code);
    setCurrentStep("redirect");
    
    // Step 3: Exchange code for token
    await delay(2000);
    setCurrentStep("token");
    
    // Step 4: Receive access token
    await delay(1500);
    const token = generateRandomToken();
    setAccessToken(token);
    setCurrentStep("complete");
    setIsAnimating(false);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const randomBase36 = (length: number) => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => (byte % 36).toString(36)).join("");
  };

  const generateRandomCode = () => {
    return `AUTH_${randomBase36(13)}`;
  };

  const generateRandomToken = () => {
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${randomBase36(13)}`;
  };

  const steps = [
    {
      step: "authorize",
      title: "1. Authorization Request",
      description: "User clicks 'Login', app redirects to OAuth provider",
      active: currentStep === "authorize",
      completed: ["redirect", "token", "complete"].includes(currentStep),
    },
    {
      step: "redirect",
      title: "2. User Authorizes & Redirects",
      description: "User approves, provider returns authorization code",
      active: currentStep === "redirect",
      completed: ["token", "complete"].includes(currentStep),
    },
    {
      step: "token",
      title: "3. Exchange Code for Token",
      description: "App exchanges code for access token (server-side)",
      active: currentStep === "token",
      completed: currentStep === "complete",
    },
    {
      step: "complete",
      title: "4. Access Granted",
      description: "App uses access token to call protected APIs",
      active: currentStep === "complete",
      completed: false,
    },
  ];

  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-purple-500/30 bg-purple-500/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-purple-400 mb-2">{title}</h4>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <button
          onClick={startFlow}
          disabled={isAnimating}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnimating ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start OAuth Flow
            </>
          )}
        </button>
      </div>

      {/* Flow Visualization */}
      <div className="space-y-3 mt-6">
        {steps.map((step, idx) => (
          <div key={idx}>
            <div
              className={`p-4 rounded-lg border-2 transition-all ${
                step.active
                  ? "border-purple-500 bg-purple-500/20 scale-105"
                  : step.completed
                  ? "border-green-500 bg-green-500/10"
                  : "border-slate-700 bg-slate-800/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed
                    ? "bg-green-500"
                    : step.active
                    ? "bg-purple-500 animate-pulse"
                    : "bg-slate-700"
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h5 className={`font-semibold ${
                    step.active ? "text-purple-400" : step.completed ? "text-green-400" : "text-gray-400"
                  }`}>
                    {step.title}
                  </h5>
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  
                  {/* Show code/token when available */}
                  {step.step === "redirect" && authCode && (
                    <div className="mt-2 p-2 bg-slate-900 rounded border border-slate-700">
                      <span className="text-xs text-gray-400">Authorization Code:</span>
                      <p className="text-xs font-mono text-green-400">{authCode}</p>
                    </div>
                  )}
                  
                  {step.step === "complete" && accessToken && (
                    <div className="mt-2 p-2 bg-slate-900 rounded border border-slate-700">
                      <span className="text-xs text-gray-400">Access Token:</span>
                      <p className="text-xs font-mono text-green-400 break-all">{accessToken}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Arrow between steps */}
            {idx < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowRight className={`w-5 h-5 ${
                  step.completed ? "text-green-500" : "text-gray-600"
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Concepts */}
      <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <h5 className="font-semibold text-purple-400 mb-2">🔑 Key Concepts</h5>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Authorization code is short-lived (expires in ~10 minutes)</li>
          <li>• Token exchange happens server-side (protects client secret)</li>
          <li>• Access token is used for API calls (expires in ~1 hour)</li>
          <li>• Refresh token can get new access token without re-auth</li>
        </ul>
      </div>
    </div>
  );
}

