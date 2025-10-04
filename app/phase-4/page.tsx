"use client";

import PhaseLayout from "@/components/PhaseLayout";
import ConceptCard from "@/components/ConceptCard";
import ProjectCard from "@/components/ProjectCard";
import { Compass, AlertTriangle, Shield, GitMerge, Clock, Archive } from "lucide-react";

export default function Phase4() {
  return (
    <PhaseLayout
      phaseNumber={4}
      title="Principal-Level Architecture"
      description="Think like an integration architect"
      icon={Compass}
      color="from-green-500 to-emerald-500"
    >
      {/* Goal Section */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold text-white mb-3">🧭 Phase Goal</h2>
        <p className="text-gray-300 text-lg">
          Design enterprise-scale integration architectures with 50k+ TPS, multiple third-party services,
          and robust patterns for versioning, testing, and legacy system integration.
        </p>
      </div>

      {/* Pareto Principle Summary */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6 mb-12">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <span className="text-3xl">📊</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Pareto Principle: The 20% That Matters</h2>
            <p className="text-gray-300 text-sm italic">These architectural decisions prevent 80% of production issues at scale</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">🏗️ Architecture Principles</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">1.</span>
                <span><strong>API versioning from day 1</strong> - Use /v1/ prefix, plan for breaking changes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">2.</span>
                <span><strong>Rate limiting + caching</strong> - Protect APIs and reduce costs by 80%+</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">3.</span>
                <span><strong>Idempotency keys</strong> - Prevent duplicate operations (critical for payments)</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">⚠️ Avoid These Anti-Patterns</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">1.</span>
                <span><strong>Chatty APIs</strong> - Batch requests, use GraphQL for complex queries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">2.</span>
                <span><strong>No circuit breakers</strong> - One slow service kills everything</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">3.</span>
                <span><strong>Shared databases</strong> - Services should own their data, communicate via APIs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anti-Patterns */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">⚠️ Anti-Patterns to Avoid</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Chatty APIs</h3>
                <p className="text-gray-300 mb-3">Making too many small requests instead of batching</p>
                <div className="space-y-2 text-sm">
                  <div className="text-red-400">❌ Bad: N+1 queries (1 + N requests)</div>
                  <div className="text-green-400">✅ Good: Single batch request</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Cascading Failures</h3>
                <p className="text-gray-300 mb-3">One service failure brings down entire system</p>
                <div className="space-y-2 text-sm">
                  <div className="text-red-400">❌ Bad: No circuit breakers</div>
                  <div className="text-green-400">✅ Good: Fault isolation & fallbacks</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">No Backpressure</h3>
                <p className="text-gray-300 mb-3">System overwhelmed by too many requests</p>
                <div className="space-y-2 text-sm">
                  <div className="text-red-400">❌ Bad: Unlimited queue growth</div>
                  <div className="text-green-400">✅ Good: Rate limiting & throttling</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Breaking Changes</h3>
                <p className="text-gray-300 mb-3">Deploying incompatible API versions</p>
                <div className="space-y-2 text-sm">
                  <div className="text-red-400">❌ Bad: Changing contracts without versioning</div>
                  <div className="text-green-400">✅ Good: Semantic versioning & deprecation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backpressure */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Backpressure & Flow Control</h2>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <p className="text-gray-300 mb-6">
            Backpressure mechanisms prevent system overload by controlling the rate of data flow.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <ConceptCard
              icon={Shield}
              title="Rate Limiting"
              description="Limit requests per time window"
              items={["Token bucket", "Sliding window", "Per-user limits"]}
              color="from-blue-500 to-cyan-500"
            />
            <ConceptCard
              icon={Clock}
              title="Queue Management"
              description="Bounded queues with timeouts"
              items={["Max queue size", "Request timeout", "Priority queues"]}
              color="from-purple-500 to-pink-500"
            />
            <ConceptCard
              icon={Archive}
              title="Load Shedding"
              description="Drop requests when overwhelmed"
              items={["Health checks", "Graceful degradation", "503 responses"]}
              color="from-orange-500 to-red-500"
            />
          </div>
        </div>
      </section>

      {/* Contract Testing */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Contract Testing with Pact</h2>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
          <p className="text-gray-300 mb-4">
            Consumer-driven contract testing ensures API compatibility between services.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Consumer Contract</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <pre>{`const { Pact } = require('@pact-foundation/pact');

const provider = new Pact({
  consumer: 'OrderService',
  provider: 'UserService'
});

describe('User API', () => {
  it('gets user by ID', async () => {
    await provider.addInteraction({
      state: 'user 123 exists',
      uponReceiving: 'get user 123',
      withRequest: {
        method: 'GET',
        path: '/users/123'
      },
      willRespondWith: {
        status: 200,
        body: {
          id: '123',
          name: 'John Doe'
        }
      }
    });
    
    const user = await fetchUser('123');
    expect(user.name).toBe('John Doe');
  });
});`}</pre>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Provider Verification</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <pre>{`const { Verifier } = require('@pact-foundation/pact');

describe('Pact Verification', () => {
  it('validates pacts', () => {
    return new Verifier({
      provider: 'UserService',
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: ['./pacts/order-user.json'],
      stateHandlers: {
        'user 123 exists': () => {
          // Setup: create test user 123
          return createUser({
            id: '123',
            name: 'John Doe'
          });
        }
      }
    }).verifyProvider();
  });
});`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Versioning */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">API Versioning Strategies</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">URL Versioning</h3>
            <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-xs text-gray-300 mb-3">
              <pre>/api/v1/users{'\n'}/api/v2/users</pre>
            </div>
            <p className="text-sm text-gray-400">Most explicit and widely used</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">Header Versioning</h3>
            <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-xs text-gray-300 mb-3">
              <pre>Accept: application/vnd.api+json;{'\n'}       version=2</pre>
            </div>
            <p className="text-sm text-gray-400">Clean URLs, follows REST principles</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">Query Param</h3>
            <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-xs text-gray-300 mb-3">
              <pre>/api/users?version=2</pre>
            </div>
            <p className="text-sm text-gray-400">Simple, easy to test in browser</p>
          </div>
        </div>
      </section>

      {/* Legacy Integration */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Integrating with Legacy Systems</h2>
        <div className="space-y-6">
          <ConceptCard
            icon={GitMerge}
            title="Strangler Fig Pattern"
            description="Gradually replace legacy system with new implementation"
            items={[
              "Route new features to new system",
              "Proxy existing features to legacy",
              "Incrementally migrate over time",
              "Eventually decommission legacy"
            ]}
            color="from-green-500 to-emerald-500"
          />

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Anti-Corruption Layer</h3>
            <p className="text-gray-300 mb-4">
              Create an adapter layer to translate between legacy and modern systems, protecting your new code from legacy constraints.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300">
              <pre>{`// Anti-corruption layer
class LegacyUserAdapter {
  async getUser(id: string): Promise<User> {
    // Legacy SOAP call
    const legacyXml = await soapClient.getUserById(id);
    
    // Parse XML to object
    const legacyUser = parseXML(legacyXml);
    
    // Transform to modern domain model
    return {
      id: legacyUser.USER_ID,
      name: \`\${legacyUser.FIRST_NAME} \${legacyUser.LAST_NAME}\`,
      email: legacyUser.EMAIL_ADDR,
      createdAt: new Date(legacyUser.CREATE_TS)
    };
  }
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Design */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">🧩 Phase Project</h2>
        <ProjectCard
          title="Financial Platform Integration Architecture"
          description="Design a comprehensive integration architecture for a financial platform supporting 50k TPS with multiple third-party services."
          requirements={[
            "Architecture diagram for payment processing, fraud detection, and account management",
            "Define API contracts (OpenAPI specs) for all services",
            "Design event-driven flows using Kafka topics",
            "Plan versioning strategy for backward compatibility",
            "Implement contract testing between 2 services",
            "Add circuit breakers, retries, and rate limiting",
            "Design observability stack (logs, metrics, traces)",
            "Create runbook for handling cascading failures",
            "Document integration patterns and decision rationale"
          ]}
        />
      </section>
    </PhaseLayout>
  );
}

