"use client";

import Link from "next/link";
import PhaseLayout from "@/components/PhaseLayout";
import ConceptCard from "@/components/ConceptCard";
import ConceptVisuals from "@/components/ConceptVisuals";
import PhaseQuiz from "@/components/PhaseQuiz";
import ProjectCard from "@/components/ProjectCard";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { LessonTracker } from "@/components/LessonTracker";
import SystemDesignTracker from "@/components/SystemDesignTracker";
import { Compass, AlertTriangle, Shield, GitMerge, Clock, Archive, Target, Workflow, Gauge, Siren, Scale, BrainCircuit, ArrowRight } from "lucide-react";

import { ExpandableCodeBlock } from "@/components/HighlightedCodeBlock"
export default function Phase4() {
  return (
    <SubscriptionGate phaseNumber={4} lockedContentName="Phase 4: Principal-Level Architecture">
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

      <LessonTracker phase={4} />

      <section className="mb-12">
        <div className="bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-semibold mb-3">
                <BrainCircuit className="w-4 h-4" />
                API Algorithms
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Master theory, then prove it in project systems</h2>
              <p className="text-gray-300 max-w-3xl">
                Continue into Phase 5 for API Algorithms: a dedicated theory track that connects LeetCode-style thinking to
                caching, queueing, rate limiting, idempotency, and operations decisions.
              </p>
            </div>
            <Link
              href="/phase-5"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:opacity-95 transition-opacity"
            >
              Open Phase 5
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <ConceptVisuals conceptId="caching" />

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

      {/* Constraint-Driven Thinking */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border-2 border-emerald-500/30 rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <Target className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Constraint-Driven System Design Thinking</h2>
              <p className="text-gray-300 max-w-4xl">
                This fits at the start of system design, before caching, load balancing, queues, rate limiting, or replication.
                Those systems are implementation choices. This framework determines whether they should exist at all, what
                problem they are solving, and what trade-offs you are accepting.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-emerald-300 mb-3">Recommended order for the tracker</h3>
            <p className="text-gray-300 mb-3">
              Put this before the concrete systems as the reasoning layer that drives the rest of the sequence.
            </p>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-300">
              <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">0. Constraint-Driven System Design Thinking</div>
              <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">1. Caching Layer</div>
              <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">2. Load Balancer</div>
              <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">3. Queue / Async Processing</div>
              <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">4. Rate Limiter</div>
              <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">5. Database Replication</div>
              <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">6. Notification System</div>
              <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">7. URL Shortener</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <ConceptCard
              icon={Target}
              title="1. Existence"
              description="Prove the system deserves to exist before discussing implementation."
              items={[
                "What real-world failure happens if this system does not exist?",
                "Who is hurt first when it fails or is missing?",
                "What resource is being protected or optimised?",
                "What constraint forced this system into existence?",
                "What happens if we remove it tomorrow?"
              ]}
              color="from-emerald-500 to-teal-500"
            />
            <ConceptCard
              icon={Workflow}
              title="2. Mechanics"
              description="Trace the exact implementation path. No vague architecture talk."
              items={[
                "Where does state live, and why there?",
                "What is the exact request flow from start to finish?",
                "What algorithm or pattern is used, and why this one?",
                "What are the core components and interactions?",
                "What assumptions exist around consistency, ordering, or timing?"
              ]}
              color="from-cyan-500 to-blue-500"
            />
            <ConceptCard
              icon={Gauge}
              title="3. Stress"
              description="Model the first cracks instead of assuming the system scales."
              items={[
                "What happens at 10x traffic?",
                "What becomes the first bottleneck?",
                "Where does latency increase, and why?",
                "Which component becomes a hotspot?",
                "How does the system behave under bursts or uneven traffic?"
              ]}
              color="from-blue-500 to-indigo-500"
            />
            <ConceptCard
              icon={Siren}
              title="4. Failure"
              description="Understand breakdown modes, especially partial failure and dependency loss."
              items={[
                "What happens if the core dependency disappears?",
                "What happens under partial failure, not total outage?",
                "How does the system behave during network partitions?",
                "Can this create a cascade failure?",
                "What is the fallback behaviour, and is it acceptable?"
              ]}
              color="from-amber-500 to-red-500"
            />
            <ConceptCard
              icon={Scale}
              title="5. Trade-offs"
              description="Defend the design against the best alternatives and changing constraints."
              items={[
                "Why this design over the top two alternatives?",
                "What did you optimise for?",
                "What did you sacrifice?",
                "When would this design become the wrong choice?",
                "How does the design change under 100x traffic, 90% lower budget, or tighter latency?"
              ]}
              color="from-fuchsia-500 to-pink-500"
            />
            <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">How to use it</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <span>Start every system design by answering Existence before you name technologies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span>Move to Mechanics only after the system&apos;s reason for existing is concrete.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Use Stress and Failure to expose weak assumptions early.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">4.</span>
                  <span>Close with Trade-offs so the design is argued, not guessed.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="system-design-tracker" className="mb-12">
        <SystemDesignTracker />
      </section>

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
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Consumer Contract</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <ExpandableCodeBlock code={`const { Pact } = require('@pact-foundation/pact');

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
});`} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Provider Verification</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <ExpandableCodeBlock code={`const { Verifier } = require('@pact-foundation/pact');

describe('Pact Verification', () => {
  it('validates pacts', () => {
    return new Verifier({
      provider: 'UserService',
      providerBaseUrl: 'http://localhost:4000',
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
});`} />
            </div>
          </div>
        </div>

        {/* Java Pact Examples */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Java Contract Testing with Pact</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">☕</span>
                <h4 className="text-lg font-bold text-white">Java Consumer (JUnit)</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import au.com.dius.pact.consumer.MockServer;
import au.com.dius.pact.consumer.dsl.PactDslWithProvider;
import au.com.dius.pact.consumer.junit5.PactConsumerTestExt;
import au.com.dius.pact.consumer.junit5.PactTestFor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(PactConsumerTestExt.class)
public class UserServiceContractTest {
    
    @Test
    @PactTestFor(providerName = "UserService")
    void testGetUser(PactDslWithProvider builder) {
        builder
            .given("user 123 exists")
            .uponReceiving("get user 123")
            .path("/api/users/123")
            .method("GET")
            .willRespondWith()
            .status(200)
            .body(new PactDslJsonBody()
                .stringType("id", "123")
                .stringType("name", "John Doe")
                .stringType("email", "john@example.com"));
        
        // Test consumer code
        UserServiceClient client = 
            new UserServiceClient(mockServer.getUrl());
        User user = client.getUser("123");
        
        assertEquals("John Doe", user.getName());
    }
}`} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">☕</span>
                <h4 className="text-lg font-bold text-white">Java Provider Verification</h4>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junit5.PactVerificationInvocationContextProvider;
import au.com.dius.pact.provider.junitsupport.Provider;
import au.com.dius.pact.provider.junitsupport.State;
import au.com.dius.pact.provider.junitsupport.loader.PactFolder;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;

@Provider("UserService")
@PactFolder("pacts")
@SpringBootTest(webEnvironment = 
    SpringBootTest.WebEnvironment.DEFINED_PORT)
public class UserServiceProviderTest {
    
    @TestTemplate
    @ExtendWith(PactVerificationInvocationContextProvider.class)
    void pactVerificationTestTemplate(
        PactVerificationContext context) {
        context.verifyInteraction();
    }
    
    @State("user 123 exists")
    void setupUser123() {
        // Setup test data
        userRepository.save(new User(
            "123", "John Doe", "john@example.com"));
    }
}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Versioning */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">API Versioning Strategies</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">URL Versioning</h3>
            <ExpandableCodeBlock
              label="URL versioning example"
              code={`/api/v1/users
/api/v2/users`}
              className="mb-3"
            />
            <p className="text-sm text-gray-400">Most explicit and widely used</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">Header Versioning</h3>
            <ExpandableCodeBlock
              label="Header versioning example"
              code={`Accept: application/vnd.api+json;
       version=2`}
              className="mb-3"
            />
            <p className="text-sm text-gray-400">Clean URLs, follows REST principles</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">Query Param</h3>
            <ExpandableCodeBlock
              label="Query param versioning example"
              code={`/api/users?version=2`}
              className="mb-3"
            />
            <p className="text-sm text-gray-400">Simple, easy to test in browser</p>
          </div>
        </div>

        {/* Java API Versioning Examples */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Java Spring Boot API Versioning</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-3">URL Versioning</h4>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 {
    
    @GetMapping("/{id}")
    public ResponseEntity<UserV1> getUser(@PathVariable String id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(
            new UserV1(user.getId(), user.getName()));
    }
}

@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 {
    
    @GetMapping("/{id}")
    public ResponseEntity<UserV2> getUser(@PathVariable String id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(new UserV2(
            user.getId(), 
            user.getName(), 
            user.getEmail(),
            user.getCreatedAt()));
    }
}`} />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-3">Header Versioning</h4>
              <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <ExpandableCodeBlock code={`@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping(value = "/{id}", 
        headers = "API-Version=1")
    public ResponseEntity<UserV1> getUserV1(
        @PathVariable String id) {
        // V1 response
    }
    
    @GetMapping(value = "/{id}", 
        headers = "API-Version=2")
    public ResponseEntity<UserV2> getUserV2(
        @PathVariable String id) {
        // V2 response
    }
    
    // Or using Accept header
    @GetMapping(value = "/{id}",
        produces = {
            "application/vnd.api.v1+json",
            "application/vnd.api.v2+json"
        })
    public ResponseEntity<?> getUser(
        @PathVariable String id,
        @RequestHeader("Accept") String accept) {
        if (accept.contains("v2")) {
            return ResponseEntity.ok(getUserV2(id));
        }
        return ResponseEntity.ok(getUserV1(id));
    }
}`} />
              </div>
            </div>
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
              <ExpandableCodeBlock code={`// Anti-corruption layer
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
}`} />
            </div>
          </div>
        </div>
      </section>

      <PhaseQuiz phaseNumber={4} accentClass="from-green-500 to-emerald-500" />

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
    </SubscriptionGate>
  );
}
