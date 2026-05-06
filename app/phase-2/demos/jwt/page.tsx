"use client";

import PhaseLayout from "@/components/PhaseLayout";
import { Shield } from "lucide-react";
import { useState } from "react";

function base64UrlDecode(str: string): string {
  try {
    const base64 = str.replaceAll("-", "+").replaceAll("_", "/");
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
    return decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

function base64UrlEncode(obj: object): string {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  const b64 = btoa(String.fromCharCode(...bytes));
  return b64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export default function JwtDemo() {
  const [tokenInput, setTokenInput] = useState("");
  const [decoded, setDecoded] = useState<{ header: string; payload: string } | null>(null);
  const [decodeError, setDecodeError] = useState("");

  const handleDecode = () => {
    setDecodeError("");
    setDecoded(null);
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      setDecodeError("Invalid JWT: expected 3 parts (header.payload.signature)");
      return;
    }
    try {
      const header = base64UrlDecode(parts[0]);
      const payload = base64UrlDecode(parts[1]);
      if (!header || !payload) {
        setDecodeError("Invalid base64url in header or payload");
        return;
      }
      // Pretty-print JSON
      const headerParsed = JSON.parse(header);
      const payloadParsed = JSON.parse(payload);
      setDecoded({
        header: JSON.stringify(headerParsed, null, 2),
        payload: JSON.stringify(payloadParsed, null, 2),
      });
    } catch (e) {
      setDecodeError("Decode failed: " + (e instanceof Error ? e.message : "Invalid JSON in token"));
    }
  };

  const handleGenerateSample = () => {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: "user-123",
      email: "demo@example.com",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const headerB64 = base64UrlEncode(header);
    const payloadB64 = base64UrlEncode(payload);
    const signatureB64 = base64UrlEncode({ placeholder: "signature-not-computed-in-demo" });
    const token = `${headerB64}.${payloadB64}.${signatureB64}`;
    setTokenInput(token);
    setDecoded({
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
    });
    setDecodeError("");
  };

  return (
    <PhaseLayout
      phaseNumber={2}
      title="JWT Demo"
      description="Decode and explore JSON Web Tokens"
      icon={Shield}
      color="from-orange-500 to-red-500"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Phase 2", href: "/phase-2" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-2">Decode JWT</h3>
          <p className="text-gray-400 text-sm mb-4">
            Paste a JWT below to decode its header and payload (signature is not verified in this demo).
          </p>
          <textarea
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="w-full h-24 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-gray-200 font-mono text-sm placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={handleDecode}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all"
            >
              Decode
            </button>
            <button
              type="button"
              onClick={handleGenerateSample}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold transition-all"
            >
              Generate sample JWT
            </button>
          </div>
          {decodeError && (
            <p className="mt-3 text-red-400 text-sm">{decodeError}</p>
          )}
          {decoded && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-semibold text-orange-400 mb-2">Header</h4>
                <pre className="p-3 bg-slate-900 rounded-lg text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {decoded.header}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-orange-400 mb-2">Payload (claims)</h4>
                <pre className="p-3 bg-slate-900 rounded-lg text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {decoded.payload}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <h5 className="font-semibold text-white mb-2">✨ JWT structure</h5>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Header: algorithm (e.g. HS256) and type</li>
              <li>• Payload: claims (sub, exp, iat, custom)</li>
              <li>• Signature: ensures token wasn’t tampered with</li>
              <li>• Sent as: <code className="text-orange-400">Authorization: Bearer &lt;token&gt;</code></li>
            </ul>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <h5 className="font-semibold text-white mb-2">📱 Use cases</h5>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• API authentication (Bearer token)</li>
              <li>• Stateless sessions</li>
              <li>• OAuth2 / OpenID Connect tokens</li>
              <li>• Service-to-service auth</li>
            </ul>
          </div>
        </div>
      </div>
    </PhaseLayout>
  );
}
