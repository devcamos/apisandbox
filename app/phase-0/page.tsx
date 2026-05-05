"use client";

import PhaseLayout from "@/components/PhaseLayout";
import ConceptCard from "@/components/ConceptCard";
import PhaseQuiz from "@/components/PhaseQuiz";
import { LessonTracker } from "@/components/LessonTracker";
import { BookOpen, Code, Server, Database, GitBranch, Zap, RefreshCw, Lock, type LucideIcon } from "lucide-react";
import { useState } from "react";

const springTabs: { id: string; label: string; icon: LucideIcon; items: { term: string; desc: string }[] }[] = [
  { id: "async", label: "Async", icon: RefreshCw, items: [
    { term: "@Async", desc: "Marks a method to run on a separate thread pool, returning CompletableFuture<T>" },
    { term: "WebClient", desc: "Spring WebFlux\u2019s non-blocking HTTP client — the reactive equivalent of fetch/promises" },
    { term: "@EventListener", desc: "Decoupled event callbacks within the application context (pub/sub in one JVM)" },
    { term: "@Scheduled", desc: "Cron and fixed-rate callbacks Spring invokes on a timer (analogous to setInterval)" },
  ]},
  { id: "data", label: "Data", icon: Database, items: [
    { term: "JPA Entities", desc: "POJOs with @Entity annotations; Jackson serialises them to/from JSON automatically" },
    { term: "ResponseEntity<T>", desc: "Wraps response body, headers, and status code into one object" },
    { term: "Stream API", desc: ".filter(), .map(), .collect() are Java\u2019s equivalent of array methods" },
    { term: "ConcurrentHashMap", desc: "Used everywhere for caches, config lookups, and in-memory state" },
  ]},
  { id: "http", label: "HTTP", icon: Zap, items: [
    { term: "@RestController", desc: "Marks a class as an HTTP endpoint; every method returns a response body" },
    { term: "@GetMapping / @PostMapping", desc: "Maps HTTP methods to Java methods (GET, POST, PUT, DELETE)" },
    { term: "@RequestBody / @PathVariable", desc: "Binds JSON body or URL parameters to method arguments" },
    { term: "HttpStatus", desc: "Enum with all status codes (OK, CREATED, BAD_REQUEST, NOT_FOUND)" },
  ]},
  { id: "cloud", label: "Cloud", icon: Server, items: [
    { term: "Embedded Tomcat", desc: "Spring Boot packages its own server inside the JAR; java -jar app.jar runs anywhere" },
    { term: "Docker + Spring", desc: "Multi-stage Dockerfile builds a slim JRE image; deploys to EC2, ECS, or Kubernetes" },
    { term: "Spring Profiles", desc: "application-dev.yml vs application-prod.yml swaps config per environment" },
    { term: "Actuator", desc: "/actuator/health endpoint for load balancer health checks on VMs and containers" },
  ]},
  { id: "algo", label: "Algorithms", icon: Code, items: [
    { term: "Collections.sort()", desc: "TimSort under the hood; pass a Comparator for custom ordering" },
    { term: "Stream pipeline", desc: "Declarative .filter().map().collect() that mirrors JS array methods" },
    { term: "HashMap O(1)", desc: "Spring\u2019s bean registry, @Cacheable, and config resolution all rely on hash maps" },
    { term: "Sort.by()", desc: "Translates to SQL ORDER BY, letting the database\u2019s own sort algorithm handle it" },
  ]},
  { id: "devops", label: "DevOps", icon: GitBranch, items: [
    { term: "Maven / Gradle", desc: "Spring Boot plugin builds a fat JAR; ./gradlew bootJar or mvn package" },
    { term: "GitHub Actions", desc: "CI pipeline: checkout \u2192 setup-java \u2192 gradle build \u2192 docker push \u2192 deploy" },
    { term: "Spring Cloud Config", desc: "Externalised configuration backed by a Git repository (config-as-code)" },
    { term: "Feature flags", desc: "Combine Spring Profiles + Git branches for feature toggles across environments" },
  ]},
];

export default function Phase0() {
  const [activeSpringTab, setActiveSpringTab] = useState("async");
  const activePanel = springTabs.find((t) => t.id === activeSpringTab)!;
  const ActiveIcon = activePanel.icon;

  return (
    <PhaseLayout
      phaseNumber={0}
      title="Fundamentals"
      description="Essential building blocks for API integration and cloud development"
      icon={BookOpen}
      color="from-green-500 to-emerald-500"
    >
      {/* Goal Section */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold text-white mb-3">🎯 Phase Goal</h2>
        <p className="text-gray-300 text-lg">
          Master the fundamental concepts that form the foundation of API integration, cloud computing, and modern software development. 
          These are the building blocks you'll use in every phase.
        </p>
      </div>

      <LessonTracker phase={0} />

      {/* Pareto Principle Summary */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6 mb-12">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <span className="text-3xl">📊</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Pareto Principle: The 20% That Matters</h2>
            <p className="text-gray-300 text-sm italic">Focus on these core fundamentals to understand 80% of integration and cloud scenarios</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">🎯 Master These First</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">1.</span>
                <span><strong>Callbacks & Promises</strong> - Essential for async operations and authentication flows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">2.</span>
                <span><strong>Basic Data Structures</strong> - Arrays, Objects, Maps. These cover 90% of data handling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">3.</span>
                <span><strong>Virtual Machines (VMs)</strong> - Foundation for understanding EC2 and cloud compute</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">4.</span>
                <span><strong>HTTP Basics</strong> - Request/Response cycle, methods, status codes</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">🧭 Why These Matter</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">→</span>
                <span><strong>Callbacks</strong> - Used in OAuth flows, event handlers, async operations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span><strong>Data Structures</strong> - Every API response is structured data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">→</span>
                <span><strong>VMs</strong> - EC2 instances are VMs. Understanding VMs = understanding cloud compute</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">→</span>
                <span><strong>HTTP</strong> - The foundation of all REST APIs and web communication</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Core Concepts */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Core Fundamentals</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Callbacks & Async Programming */}
          <ConceptCard
            icon={RefreshCw}
            title="Callbacks & Async Programming"
            description="Understanding asynchronous operations, callbacks, promises, and async/await - essential for authentication flows and API calls"
            items={[
              "Callback functions and higher-order functions",
              "Promises and promise chaining",
              "Async/await syntax",
              "Error handling in async code",
              "OAuth callback flows",
              "Event-driven programming"
            ]}
            color="from-blue-500 to-cyan-500"
            usedBy={["Google OAuth", "GitHub OAuth", "Stripe", "NextAuth.js"]}
            documentation={{
              overview: "Asynchronous programming is fundamental to modern web development. Callbacks, promises, and async/await are the building blocks for handling API calls, authentication flows, and event-driven operations. Notable example: Google OAuth uses callbacks for authentication redirects.",
              description: [
                "Callbacks: Functions passed as arguments to be executed later (used in OAuth redirects, event handlers)",
                "Promises: Represent eventual completion of async operations (API calls, file operations)",
                "Async/await: Syntactic sugar for promises, making async code look synchronous",
                "Error handling: Try/catch blocks for async operations, promise rejection handling",
                "OAuth callbacks: Understanding redirect URIs and callback handling in authentication flows (Google OAuth, GitHub OAuth)",
                "Event-driven: Reacting to events (user clicks, API responses, system events)"
              ],
              useCases: [
                "OAuth2 authentication flows (Google OAuth, GitHub OAuth - redirect callbacks)",
                "API request/response handling",
                "File upload/download operations",
                "Database queries",
                "WebSocket connections",
                "Timer-based operations (setTimeout, setInterval)"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Callback = function passed to another function to execute later",
                  "Promise = object representing async operation (pending, fulfilled, rejected)",
                  "async/await = cleaner syntax for promises (use async function, await promise)",
                  "OAuth callback = URL where OAuth provider redirects after authentication (e.g., Google OAuth redirects to your callback URL)",
                  "Error handling = always use try/catch with async/await or .catch() with promises",
                  "Promise.all() = wait for multiple promises to complete",
                  "Real example: Google OAuth uses callback URLs - user authenticates, Google redirects to your callback with auth code"
                ]
              },
              bestFor: [
                "Handling API responses",
                "OAuth authentication flows",
                "Event-driven applications",
                "Operations that take time (network, I/O)"
              ],
              notIdealFor: [
                "Synchronous operations",
                "Simple calculations",
                "Immediate return values"
              ]
            }}
          />

          {/* Data Structures */}
          <ConceptCard
            icon={Database}
            title="Essential Data Structures"
            description="Arrays, objects, maps, sets - the data structures you'll use in 90% of API integration scenarios"
            items={[
              "Arrays and array methods",
              "Objects and object manipulation",
              "Maps and Sets",
              "JSON data structures",
              "Nested data handling",
              "Data transformation"
            ]}
            color="from-purple-500 to-pink-500"
            usedBy={["REST APIs", "GraphQL", "MongoDB", "PostgreSQL"]}
            documentation={{
              overview: "Data structures are how we organize and manipulate data. Understanding arrays, objects, and maps is essential for working with API responses and building integrations.",
              description: [
                "Arrays: Ordered collections (lists, queues, stacks) - used for API response arrays",
                "Objects: Key-value pairs (dictionaries, records) - used for API request/response bodies",
                "Maps: Key-value collections with better performance for frequent additions/deletions",
                "Sets: Collections of unique values - useful for deduplication",
                "JSON: JavaScript Object Notation - the standard format for API data exchange",
                "Nested structures: Objects within objects, arrays within objects - common in API responses"
              ],
              useCases: [
                "Parsing API responses",
                "Building API request payloads",
                "Data transformation and mapping",
                "Filtering and searching data",
                "Grouping and aggregating data",
                "Caching and storing data"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Array methods: map(), filter(), reduce(), find(), forEach() - cover 90% of array operations",
                  "Object access: dot notation (obj.key) and bracket notation (obj['key'])",
                  "JSON.parse() = convert JSON string to JavaScript object",
                  "JSON.stringify() = convert JavaScript object to JSON string",
                  "Destructuring = extract values from arrays/objects ({name, email} = user)",
                  "Spread operator = copy arrays/objects ([...arr], {...obj})"
                ]
              },
              bestFor: [
                "Working with API data",
                "Data transformation",
                "Storing and retrieving information",
                "Building request/response structures"
              ],
              notIdealFor: [
                "Complex mathematical computations",
                "Graph algorithms",
                "Tree structures (unless specifically needed)"
              ]
            }}
          />

          {/* Virtual Machines */}
          <ConceptCard
            icon={Server}
            title="Virtual Machines (VMs) & EC2"
            description="Understanding VMs is the foundation for understanding EC2 and cloud computing. Learn how virtualization works and how EC2 uses VMs."
            items={[
              "What is a virtual machine?",
              "VM vs physical servers",
              "EC2 instances as VMs",
              "Instance types and sizing",
              "VM lifecycle management",
              "Resource allocation"
            ]}
            color="from-orange-500 to-red-500"
            usedBy={["AWS EC2", "Google Compute", "Azure VMs", "Docker"]}
            documentation={{
              overview: "A Virtual Machine (VM) is a software emulation of a physical computer. EC2 instances are VMs running in AWS's cloud infrastructure. Understanding VMs helps you understand cloud computing. Notable example: AWS EC2 = Virtual Machines in the cloud.",
              description: [
                "Virtualization: Running multiple VMs on a single physical server",
                "Hypervisor: Software that creates and manages VMs (AWS uses Xen and Nitro)",
                "EC2 instances: VMs in AWS cloud with configurable CPU, memory, storage, networking",
                "Instance types: Different VM configurations (t3.micro, m5.large, etc.)",
                "VM lifecycle: Launch, start, stop, terminate - understanding resource allocation",
                "Resource isolation: Each VM has isolated CPU, memory, and storage"
              ],
              useCases: [
                "Running applications in the cloud (EC2)",
                "Development and testing environments",
                "Hosting web servers and APIs",
                "Running databases",
                "Container hosts (Docker on EC2)",
                "Legacy application migration"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "VM = software computer running on physical hardware",
                  "EC2 instance = VM in AWS cloud (this is what you're using when you launch an EC2 instance)",
                  "Instance type = VM configuration (CPU, RAM, storage)",
                  "t3.micro = smallest, cheapest instance (free tier eligible)",
                  "Stop vs Terminate: Stop = pause (keeps data), Terminate = delete (loses data)",
                  "AMI = Amazon Machine Image = template for creating VMs",
                  "Real example: When you launch an EC2 instance, AWS creates a VM for you - understanding VMs = understanding EC2"
                ]
              },
              bestFor: [
                "Running applications that need full OS control",
                "Long-running workloads",
                "Applications requiring specific software/OS",
                "Traditional server-based architectures"
              ],
              notIdealFor: [
                "Short-lived tasks (use Lambda instead)",
                "Simple file storage (use S3)",
                "Managed services (use RDS, DynamoDB)"
              ]
            }}
          />

          {/* Algorithms Basics */}
          <ConceptCard
            icon={Code}
            title="Essential Algorithms"
            description="The core algorithms you'll use in API integration: searching, sorting, filtering, and data transformation"
            items={[
              "Searching algorithms",
              "Sorting basics",
              "Filtering and mapping",
              "Time complexity basics",
              "Common patterns",
              "Algorithm selection"
            ]}
            color="from-green-500 to-emerald-500"
            usedBy={["Array.filter()", "Array.map()", "Array.sort()"]}
            documentation={{
              overview: "Algorithms are step-by-step procedures for solving problems. While you don't need to implement complex algorithms, understanding basic ones helps with data processing in API integrations.",
              description: [
                "Linear search: Check each element until found (O(n)) - used in array.find()",
                "Binary search: Divide and conquer for sorted arrays (O(log n))",
                "Sorting: Arranging data in order (array.sort())",
                "Filtering: Selecting elements that meet criteria (array.filter())",
                "Mapping: Transforming each element (array.map())",
                "Time complexity: Understanding O(n), O(log n), O(n²) - helps choose right approach"
              ],
              useCases: [
                "Searching API response data",
                "Sorting results by date, name, etc.",
                "Filtering data based on criteria",
                "Transforming API data formats",
                "Finding duplicates",
                "Grouping and aggregating data"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "Array.find() = linear search (O(n)) - use for small arrays",
                  "Array.filter() = O(n) - creates new array with matching elements",
                  "Array.map() = O(n) - transforms each element",
                  "Array.sort() = O(n log n) - sorts in place",
                  "For large datasets, consider indexing or using Maps for O(1) lookups",
                  "Time complexity = how algorithm performance scales with input size"
                ]
              },
              bestFor: [
                "Data processing in API integrations",
                "Searching and filtering responses",
                "Data transformation",
                "Small to medium datasets"
              ],
              notIdealFor: [
                "Very large datasets (consider database queries)",
                "Real-time performance-critical operations",
                "Complex mathematical computations"
              ]
            }}
          />

          {/* HTTP Fundamentals */}
          <ConceptCard
            icon={Zap}
            title="HTTP Fundamentals"
            description="The foundation of all REST APIs: understanding requests, responses, methods, and status codes"
            items={[
              "HTTP request/response cycle",
              "HTTP methods (GET, POST, PUT, DELETE)",
              "Status codes (200, 404, 500, etc.)",
              "Headers and body",
              "URLs and query parameters",
              "HTTPS and security"
            ]}
            color="from-indigo-500 to-blue-500"
            usedBy={["REST APIs", "Express.js", "FastAPI", "Spring Boot"]}
            documentation={{
              overview: "HTTP (Hypertext Transfer Protocol) is the foundation of web communication and REST APIs. Understanding HTTP is essential for working with any API.",
              description: [
                "Request/Response: Client sends request, server sends response",
                "HTTP Methods: GET (read), POST (create), PUT (update), DELETE (remove)",
                "Status Codes: 200 (success), 201 (created), 400 (bad request), 404 (not found), 500 (server error)",
                "Headers: Metadata about request/response (Content-Type, Authorization, etc.)",
                "Body: Data sent with request (POST/PUT) or returned in response",
                "URLs: Resource identifiers with paths and query parameters"
              ],
              useCases: [
                "Making API calls",
                "Building REST APIs",
                "Web scraping",
                "API testing",
                "Understanding API documentation",
                "Debugging API issues"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "GET = retrieve data (no body, safe, idempotent)",
                  "POST = create new resource (has body, not idempotent)",
                  "PUT = update/replace resource (has body, idempotent)",
                  "DELETE = remove resource (no body, idempotent)",
                  "200 = success, 201 = created, 400 = bad request, 404 = not found, 500 = server error",
                  "Content-Type header = format of body (application/json, application/xml)"
                ]
              },
              bestFor: [
                "REST API communication",
                "Web applications",
                "API integration",
                "Standard web protocols"
              ],
              notIdealFor: [
                "Real-time bidirectional communication (use WebSocket)",
                "High-performance internal services (use gRPC)",
                "Complex queries (consider GraphQL)"
              ]
            }}
          />

          {/* Version Control Basics */}
          <ConceptCard
            icon={GitBranch}
            title="Version Control (Git) Basics"
            description="Essential Git commands and workflows for managing code, especially when working with APIs and cloud deployments"
            items={[
              "Git basics (clone, add, commit, push)",
              "Branching and merging",
              "Pull requests",
              "GitHub/GitLab workflows",
              "Common commands",
              "Best practices"
            ]}
            color="from-teal-500 to-cyan-500"
            usedBy={["GitHub Actions", "AWS CodePipeline", "GitLab CI", "Vercel"]}
            documentation={{
              overview: "Version control (Git) is essential for managing code changes, collaborating, and deploying applications. Understanding Git basics is crucial for modern development.",
              description: [
                "Repository: Storage for your code and its history",
                "Commit: Snapshot of code at a point in time",
                "Branch: Parallel version of code for features/fixes",
                "Merge: Combining changes from different branches",
                "Pull Request: Request to merge changes (code review)",
                "Clone/Pull/Push: Getting and sending code to/from remote repositories"
              ],
              useCases: [
                "Managing code changes",
                "Collaborating with teams",
                "Deploying applications",
                "Rolling back changes",
                "Code review processes",
                "CI/CD pipelines"
              ],
              paretoKnowledge: {
                title: "The 20% You Need to Know",
                points: [
                  "git clone = download repository",
                  "git add = stage changes",
                  "git commit = save snapshot with message",
                  "git push = upload changes to remote",
                  "git pull = download and merge remote changes",
                  "git branch = create/switch branches",
                  "git merge = combine branches"
                ]
              },
              bestFor: [
                "Code management",
                "Team collaboration",
                "Version tracking",
                "Deployment workflows"
              ],
              notIdealFor: [
                "Binary files (large files)",
                "Sensitive data (use environment variables)",
                "Dependencies (use package managers)"
              ]
            }}
          />
        </div>
      </section>

      {/* Notable Technologies Using Core Concepts */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/30 rounded-xl p-6 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">🔗 Notable Technologies Using Core Concepts</h2>
          <p className="text-gray-300 mb-6 text-lg">
            These fundamentals power real-world technologies you'll use every day. Understanding the core concepts helps you master these technologies faster.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Callbacks → OAuth */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Callbacks → Authentication</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Callbacks are the foundation of OAuth authentication flows
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <strong className="text-blue-400">Google OAuth:</strong> Uses callback URLs for redirect after authentication
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <strong className="text-blue-400">GitHub OAuth:</strong> Callback handles authorization code exchange
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <strong className="text-blue-400">Stripe:</strong> Webhook callbacks for payment events
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <strong className="text-blue-400">NextAuth.js:</strong> Callback functions for session management
                </div>
              </div>
            </div>

            {/* Data Structures → APIs */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Database className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Data Structures → REST APIs</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Arrays and objects are the foundation of API request/response formats
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <strong className="text-purple-400">REST APIs:</strong> JSON objects and arrays in request/response bodies
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <strong className="text-purple-400">GraphQL:</strong> Nested objects and arrays for complex queries
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <strong className="text-purple-400">MongoDB:</strong> Documents stored as JSON objects
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <strong className="text-purple-400">PostgreSQL:</strong> JSON/JSONB columns for flexible data
                </div>
              </div>
            </div>

            {/* VMs → EC2 */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Server className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">VMs → Cloud Computing</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Understanding VMs is essential for cloud platforms
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  <strong className="text-orange-400">AWS EC2:</strong> Virtual machines in the cloud (instances)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  <strong className="text-orange-400">Google Compute Engine:</strong> VMs for running applications
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  <strong className="text-orange-400">Azure VMs:</strong> Virtual machines on Microsoft Azure
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  <strong className="text-orange-400">Docker:</strong> Containers (lightweight VMs) for applications
                </div>
              </div>
            </div>

            {/* HTTP → REST */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-indigo-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">HTTP → REST APIs</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    HTTP is the foundation of all REST API communication
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <strong className="text-indigo-400">REST APIs:</strong> Built on HTTP methods (GET, POST, PUT, DELETE)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <strong className="text-indigo-400">Express.js:</strong> HTTP server framework for Node.js
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <strong className="text-indigo-400">FastAPI:</strong> Python framework using HTTP for APIs
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <strong className="text-indigo-400">Spring Boot:</strong> Java framework for HTTP-based REST APIs
                </div>
              </div>
            </div>

            {/* Algorithms → Data Processing */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Code className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Algorithms → Data Processing</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Algorithms power data processing in API integrations
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <strong className="text-green-400">Array.filter():</strong> Search and filter API response data
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <strong className="text-green-400">Array.map():</strong> Transform API data formats
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <strong className="text-green-400">Array.sort():</strong> Organize API results by date, name, etc.
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <strong className="text-green-400">Search algorithms:</strong> Find data in API responses efficiently
                </div>
              </div>
            </div>

            {/* Git → DevOps */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-teal-500/20 rounded-lg">
                  <GitBranch className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Git → DevOps & CI/CD</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Version control is essential for deploying APIs and cloud services
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <strong className="text-teal-400">GitHub Actions:</strong> CI/CD pipelines for API deployments
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <strong className="text-teal-400">AWS CodePipeline:</strong> Automated deployments using Git
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <strong className="text-teal-400">GitLab CI:</strong> Continuous integration for API projects
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <strong className="text-teal-400">Vercel/Netlify:</strong> Auto-deploy from Git repositories
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spring Framework Perspective — tabbed */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-2 border-green-500/30 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 pt-5 pb-3">
            <span className="text-2xl">☕</span>
            <h2 className="text-xl font-bold text-white">Spring Framework Perspective</h2>
          </div>

          <div className="flex items-center gap-1 px-5 pb-3 overflow-x-auto">
            {springTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSpringTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSpringTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    isActive
                      ? "bg-green-500/20 text-green-300 border border-green-500/40"
                      : "text-gray-400 hover:text-gray-200 border border-transparent hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="px-6 pb-5">
            <div className="bg-slate-800/60 rounded-lg border border-slate-700 divide-y divide-slate-700/60">
              {activePanel.items.map((item) => (
                <div key={item.term} className="flex items-start gap-3 px-4 py-3">
                  <code className="text-green-300 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded shrink-0 mt-0.5">{item.term}</code>
                  <span className="text-sm text-gray-300">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PhaseQuiz phaseNumber={0} accentClass="from-green-500 to-emerald-500" />

      {/* Next Steps */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">✅ What's Next?</h2>
          <p className="text-gray-300 mb-4">
            Once you've mastered these fundamentals, you're ready to move on to Phase 1: Integration Mindset. 
            These concepts will be used throughout all phases.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/phase-1"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Continue to Phase 1
              <Zap className="w-5 h-5" />
            </a>
            <span className="text-gray-400 text-sm">
              Phase 1 is also free and builds on these fundamentals
            </span>
          </div>
        </div>
      </section>
    </PhaseLayout>
  );
}
