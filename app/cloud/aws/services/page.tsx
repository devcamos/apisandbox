"use client";

import ConceptCard from "@/components/ConceptCard";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import Link from "next/link";
import { Server, Database, Zap, Shield, Network, BarChart3, Home } from "lucide-react";

import { ExpandableCodeBlock } from "@/components/HighlightedCodeBlock"
export default function AwsServicesPage() {
  return (
    <SubscriptionGate phaseNumber="cloud" lockedContentName="AWS Cloud Services">
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-16">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <span className="text-white/50">/</span>
            <Link href="/cloud" className="text-white/70 hover:text-white transition-colors">Cloud</Link>
            <span className="text-white/50">/</span>
            <Link href="/cloud/aws" className="text-white/70 hover:text-white transition-colors">AWS</Link>
            <span className="text-white/50">/</span>
            <span className="text-white font-semibold">Services</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <Server className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">AWS Services Overview</h1>
              <p className="text-xl text-white/90 mt-2">Comprehensive guide to AWS core services</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Goal Section */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-bold text-white mb-3">🎯 Learning Goal</h2>
          <p className="text-gray-300 text-lg">
            Understand AWS core services and when to use each one for your cloud migration. Master the 20% of services that cover 80% of use cases.
          </p>
        </div>

        {/* AWS Services */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Core AWS Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ConceptCard
              icon={Server}
              title="EC2 (Elastic Compute Cloud)"
              description="Virtual servers in the cloud - the foundation of AWS compute"
              items={[
                "On-demand virtual servers",
                "Multiple instance types",
                "Auto-scaling capabilities",
                "Pay-as-you-go pricing"
              ]}
              color="from-orange-500 to-red-500"
              documentation={{
                overview: "EC2 provides resizable compute capacity in the cloud. It's the most fundamental AWS service for running applications.",
                description: [
                  "Virtual machines (instances) with various configurations",
                  "Choose from hundreds of instance types optimized for different workloads",
                  "Auto Scaling groups for automatic capacity management",
                  "Elastic IP addresses for static IPs",
                  "Security groups for firewall rules",
                  "Key pairs for secure SSH access"
                ],
                useCases: [
                  "Web applications and websites",
                  "Application servers",
                  "Development and testing environments",
                  "High-performance computing",
                  "Machine learning training",
                  "Gaming servers"
                ],
                paretoKnowledge: {
                  title: "The 20% You Need to Know",
                  points: [
                    "Understand instance types: t3.micro (free tier), t3.medium (general purpose), m5.large (balanced)",
                    "Security Groups = firewall rules (inbound/outbound)",
                    "Key Pairs = SSH access credentials",
                    "Elastic IP = static public IP address",
                    "Auto Scaling = automatically add/remove instances based on demand"
                  ]
                },
                bestFor: [
                  "Applications needing full control",
                  "Traditional server-based architectures",
                  "When you need specific OS or software",
                  "Long-running workloads"
                ],
                notIdealFor: [
                  "Short-lived tasks (use Lambda)",
                  "Simple file storage (use S3)",
                  "Managed databases (use RDS)",
                  "When you want serverless"
                ]
              }}
            />

            <ConceptCard
              icon={Database}
              title="S3 (Simple Storage Service)"
              description="Object storage for any amount of data, accessible from anywhere"
              items={[
                "Unlimited storage capacity",
                "99.999999999% durability",
                "Multiple storage classes",
                "Versioning and lifecycle policies"
              ]}
              color="from-blue-500 to-cyan-500"
              documentation={{
                overview: "S3 is object storage built to store and retrieve any amount of data from anywhere. It's the foundation of AWS storage services.",
                description: [
                  "Store files (objects) in buckets",
                  "99.999999999% (11 9's) durability",
                  "Multiple storage classes for cost optimization",
                  "Versioning for backup and recovery",
                  "Lifecycle policies for automatic transitions",
                  "Static website hosting"
                ],
                useCases: [
                  "Backup and archival",
                  "Content delivery and media storage",
                  "Data lakes and analytics",
                  "Static website hosting",
                  "Disaster recovery",
                  "Application data storage"
                ],
                paretoKnowledge: {
                  title: "The 20% You Need to Know",
                  points: [
                    "Buckets = containers for objects (globally unique names)",
                    "Storage classes: Standard (frequent access), IA (infrequent), Glacier (archive)",
                    "Versioning = keep multiple versions of same object",
                    "Lifecycle policies = automatically move objects to cheaper storage",
                    "Pre-signed URLs = temporary public access to private objects"
                  ]
                },
                bestFor: [
                  "File storage and backups",
                  "Static website hosting",
                  "Data lakes",
                  "Content delivery"
                ],
                notIdealFor: [
                  "Database storage (use RDS)",
                  "Block storage for EC2 (use EBS)",
                  "Real-time data processing",
                  "When you need file system access"
                ]
              }}
            />

            <ConceptCard
              icon={Database}
              title="RDS (Relational Database Service)"
              description="Managed relational databases - MySQL, PostgreSQL, SQL Server, Oracle, MariaDB"
              items={[
                "Managed database service",
                "Automated backups",
                "Multi-AZ for high availability",
                "Read replicas for scaling"
              ]}
              color="from-green-500 to-emerald-500"
              documentation={{
                overview: "RDS makes it easy to set up, operate, and scale relational databases in the cloud. It handles database administration tasks automatically.",
                description: [
                  "Supports MySQL, PostgreSQL, MariaDB, Oracle, SQL Server",
                  "Automated backups and point-in-time recovery",
                  "Multi-AZ deployment for high availability",
                  "Read replicas for read scaling",
                  "Automated software patching",
                  "Monitoring and performance insights"
                ],
                useCases: [
                  "Web applications with relational data",
                  "E-commerce platforms",
                  "Content management systems",
                  "Enterprise applications",
                  "Analytics and reporting",
                  "Multi-tenant SaaS applications"
                ],
                paretoKnowledge: {
                  title: "The 20% You Need to Know",
                  points: [
                    "Multi-AZ = automatic failover to standby in different availability zone",
                    "Read Replicas = copy of database for read-heavy workloads",
                    "Automated Backups = daily backups with 7-35 day retention",
                    "Parameter Groups = database configuration settings",
                    "Security Groups = firewall rules for database access"
                  ]
                },
                bestFor: [
                  "Applications needing relational databases",
                  "When you want managed database service",
                  "High availability requirements",
                  "Compliance and security needs"
                ],
                notIdealFor: [
                  "NoSQL data (use DynamoDB)",
                  "Simple key-value storage",
                  "When you need full database control",
                  "Very large scale (consider Aurora)"
                ]
              }}
            />

            <ConceptCard
              icon={Zap}
              title="Lambda (Serverless Functions)"
              description="Run code without provisioning or managing servers"
              items={[
                "Pay per request",
                "Automatic scaling",
                "No server management",
                "Event-driven execution"
              ]}
              color="from-yellow-500 to-amber-500"
              documentation={{
                overview: "Lambda lets you run code without provisioning or managing servers. You pay only for the compute time you consume.",
                description: [
                  "Upload your code and Lambda handles everything",
                  "Automatic scaling from zero to thousands of requests",
                  "Pay only for compute time consumed",
                  "Event-driven: triggered by API Gateway, S3, DynamoDB, etc.",
                  "Supports multiple languages (Node.js, Python, Java, Go, etc.)",
                  "15-minute maximum execution time"
                ],
                useCases: [
                  "API backends",
                  "Data processing",
                  "Real-time file processing",
                  "Scheduled tasks (cron jobs)",
                  "IoT backends",
                  "Chatbots and voice assistants"
                ],
                paretoKnowledge: {
                  title: "The 20% You Need to Know",
                  points: [
                    "Cold Start = first invocation takes longer (100-1000ms)",
                    "Timeout = maximum 15 minutes execution",
                    "Memory = 128MB to 10GB (affects CPU and cost)",
                    "Triggers = API Gateway, S3, DynamoDB, EventBridge, etc.",
                    "Layers = share code and dependencies across functions"
                  ]
                },
                bestFor: [
                  "Event-driven applications",
                  "API backends",
                  "Short-running tasks",
                  "Microservices"
                ],
                notIdealFor: [
                  "Long-running processes (>15 min)",
                  "Applications needing persistent connections",
                  "When you need full control over environment",
                  "CPU-intensive workloads"
                ]
              }}
            />

            <ConceptCard
              icon={Network}
              title="API Gateway"
              description="Fully managed service for creating, publishing, and managing REST and WebSocket APIs"
              items={[
                "REST and WebSocket APIs",
                "Request throttling",
                "API versioning",
                "Integration with Lambda, EC2, etc."
              ]}
              color="from-purple-500 to-pink-500"
              documentation={{
                overview: "API Gateway is a fully managed service that makes it easy to create, publish, maintain, monitor, and secure APIs at any scale.",
                description: [
                  "RESTful APIs and WebSocket APIs",
                  "Request throttling and rate limiting",
                  "API versioning and stages",
                  "Integration with Lambda, EC2, HTTP endpoints",
                  "Custom authorizers for authentication",
                  "API keys for usage plans"
                ],
                useCases: [
                  "Building REST APIs",
                  "Microservices architecture",
                  "Mobile app backends",
                  "Serverless applications",
                  "Third-party integrations",
                  "API monetization"
                ],
                paretoKnowledge: {
                  title: "The 20% You Need to Know",
                  points: [
                    "Stages = environments (dev, staging, prod)",
                    "Throttling = limit requests per second",
                    "Integration Types = Lambda, HTTP, Mock, AWS Service",
                    "Authorizers = custom authentication (Lambda functions)",
                    "API Keys = identify and control API usage"
                  ]
                },
                bestFor: [
                  "Building REST APIs",
                  "Serverless architectures",
                  "Microservices",
                  "Mobile backends"
                ],
                notIdealFor: [
                  "Simple internal APIs (use ALB)",
                  "When you need gRPC",
                  "Very high throughput (consider ALB)",
                  "Complex routing requirements"
                ]
              }}
            />

            <ConceptCard
              icon={BarChart3}
              title="CloudWatch"
              description="Monitoring and observability service for AWS resources and applications"
              items={[
                "Metrics and logs",
                "Alarms and notifications",
                "Dashboards",
                "Application insights"
              ]}
              color="from-indigo-500 to-blue-500"
              documentation={{
                overview: "CloudWatch provides monitoring and observability for AWS resources and applications. It collects and tracks metrics, logs, and events.",
                description: [
                  "Collect metrics from AWS services automatically",
                  "Store and search log files",
                  "Set alarms based on thresholds",
                  "Create custom dashboards",
                  "Application insights for troubleshooting",
                  "Synthetic monitoring"
                ],
                useCases: [
                  "Application monitoring",
                  "Infrastructure monitoring",
                  "Log aggregation and analysis",
                  "Performance optimization",
                  "Cost optimization",
                  "Security monitoring"
                ],
                paretoKnowledge: {
                  title: "The 20% You Need to Know",
                  points: [
                    "Metrics = numerical data points (CPU, memory, request count)",
                    "Logs = text-based log files from applications",
                    "Alarms = notifications when thresholds are breached",
                    "Dashboards = visual representation of metrics",
                    "Retention = metrics kept for 15 months, logs configurable"
                  ]
                },
                bestFor: [
                  "AWS resource monitoring",
                  "Application performance monitoring",
                  "Log management",
                  "Alerting and notifications"
                ],
                notIdealFor: [
                  "Advanced APM (consider X-Ray or third-party)",
                  "Complex log analytics (consider Elasticsearch)",
                  "Real-time streaming analytics",
                  "When you need advanced ML-based insights"
                ]
              }}
            />
          </div>
        </section>

        {/* Service Selection Guide */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">When to Use What?</h2>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 overflow-x-auto">
            <table className="w-full text-left min-w-[32rem]">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="pb-4 text-white font-semibold">Use Case</th>
                  <th className="pb-4 text-white font-semibold">Best AWS Service</th>
                  <th className="pb-4 text-white font-semibold">Why?</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-slate-700">
                  <td className="py-4">Web application server</td>
                  <td className="py-4 font-semibold text-orange-400">EC2</td>
                  <td className="py-4">Full control, traditional architecture</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4">File storage and backups</td>
                  <td className="py-4 font-semibold text-blue-400">S3</td>
                  <td className="py-4">Unlimited, durable, cost-effective</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4">Relational database</td>
                  <td className="py-4 font-semibold text-green-400">RDS</td>
                  <td className="py-4">Managed, automated backups, high availability</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4">Event-driven processing</td>
                  <td className="py-4 font-semibold text-yellow-400">Lambda</td>
                  <td className="py-4">Serverless, pay per use, auto-scaling</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4">REST API endpoint</td>
                  <td className="py-4 font-semibold text-purple-400">API Gateway</td>
                  <td className="py-4">Managed, integrated with Lambda, throttling</td>
                </tr>
                <tr>
                  <td className="py-4">Monitoring and alerts</td>
                  <td className="py-4 font-semibold text-indigo-400">CloudWatch</td>
                  <td className="py-4">Native AWS integration, comprehensive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Java + AWS Examples */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Java + AWS Implementation Examples</h2>
          
          {/* AWS Lambda with Java */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">☕ AWS Lambda with Java</h3>
            <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
              <ExpandableCodeBlock code={`import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

public class UserHandler implements 
    RequestHandler<APIGatewayProxyRequestEvent, 
                   APIGatewayProxyResponseEvent> {
    
    private ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public APIGatewayProxyResponseEvent handleRequest(
        APIGatewayProxyRequestEvent input, 
        Context context) {
        
        try {
            String userId = input.getPathParameters()
                .get("userId");
            
            // Business logic
            User user = userService.findById(userId);
            
            String body = objectMapper
                .writeValueAsString(user);
            
            return new APIGatewayProxyResponseEvent()
                .withStatusCode(200)
                .withBody(body)
                .withHeaders(Map.of(
                    "Content-Type", "application/json"
                ));
        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent()
                .withStatusCode(500)
                .withBody("{\"error\": \"" + 
                    e.getMessage() + "\"}");
        }
    }
}

// Handler class for Lambda
public class User {
    private String id;
    private String name;
    private String email;
    // getters/setters
}`} />
            </div>
          </div>

          {/* Docker + ECS Deployment */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">🐳 Docker + AWS ECS Deployment</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-3">Dockerfile</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`# Multi-stage build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`} />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-3">ECS Task Definition</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`{
  "family": "java-api",
  "containerDefinitions": [{
    "name": "java-api",
    "image": "your-account.dkr.ecr.region.amazonaws.com/java-api:latest",
    "portMappings": [{
      "containerPort": 8080,
      "protocol": "tcp"
    }],
    "environment": [
      {"name": "SPRING_PROFILES_ACTIVE", "value": "prod"},
      {"name": "DATABASE_URL", "value": "jdbc:postgresql://rds-endpoint:5432/mydb"}
    ],
    "memory": 512,
    "cpu": 256
  }]
}`} />
                </div>
              </div>
            </div>
          </div>

          {/* API Gateway + Java Backend */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">🔌 API Gateway + Java Spring Boot</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-3">Java Spring Boot Controller</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(
        @PathVariable String id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(
        @RequestBody User user) {
        User created = userService.save(user);
        return ResponseEntity
            .status(201)
            .body(created);
    }
}

// Application properties for API Gateway
// server.port=8080
// spring.application.name=user-service`} />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-3">API Gateway Integration</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`// API Gateway REST API Configuration
// Endpoint: https://api.example.com/users/{id}
// Integration Type: HTTP Proxy
// Integration URL: http://ecs-service:8080/api/users/{id}
// Method: GET

// API Gateway can forward to:
// 1. ECS Service (HTTP integration)
// 2. Lambda Function (Lambda integration)
// 3. EC2 Instance (HTTP integration)

// Request/Response transformation
// API Gateway can transform requests before
// forwarding to Java backend

// Example: Add CORS headers
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE`} />
                </div>
              </div>
            </div>
          </div>

          {/* React + S3 + CloudFront */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">⚛️ React Frontend + AWS S3 + CloudFront</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-3">React App Configuration</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`// .env.production
REACT_APP_API_URL=https://api.example.com

// App.js
function App() {
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    fetch(\`\${API_URL}/api/users/123\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);
  
  return <div>{user?.name}</div>;
}

// Build for production
// npm run build
// Output: build/ folder with static files`} />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-3">AWS Deployment</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  <ExpandableCodeBlock code={`# Deploy React to S3 + CloudFront
# 1. Build React app
npm run build

# 2. Upload to S3
aws s3 sync build/ s3://my-react-app-bucket

# 3. Configure CloudFront
# Origin: S3 bucket
# Default root object: index.html
# Cache behaviors: Cache static assets, 
#   don't cache index.html

# 4. Update API endpoint
# CloudFront Distribution URL:
# https://d1234567890.cloudfront.net

# React app calls:
# https://api.example.com/api/users
# (API Gateway endpoint)`} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    </SubscriptionGate>
  );
}

