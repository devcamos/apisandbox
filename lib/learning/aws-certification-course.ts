import {
  AWS_CERTIFICATION_MASTERY_THRESHOLD,
  AWS_AI_PRACTITIONER_COURSE_ID,
  AWS_CLOUD_PRACTITIONER_COURSE_ID,
  AWS_SOLUTIONS_ARCHITECT_ASSOCIATE_COURSE_ID,
  AWS_SOLUTIONS_ARCHITECT_PROFESSIONAL_COURSE_ID,
} from "@/lib/learning/course-ids"
import type {
  AssessmentQuestion,
  LearningCourse,
  LearningDifficulty,
  LearningUnit,
} from "@/lib/learning/api-foundations-course"

export type AwsCertificationTrackSlug = "practitioner" | "ai-practitioner" | "associate" | "professional"

export interface AwsExamDomain {
  id: string
  title: string
  weight: number
  focus: string[]
}

export interface AwsReadinessRequirement {
  id: string
  label: string
  detail: string
}

export interface AwsCertificationTrack {
  slug: AwsCertificationTrackSlug
  level: "Foundational" | "Associate" | "Professional"
  examCode: "CLF-C02" | "AIF-C01" | "SAA-C03" | "SAP-C02"
  shortTitle: string
  description: string
  audience: string
  examFormat: string
  experienceGuidance: string
  accent: "sky" | "orange" | "violet"
  officialExamGuideUrl: string
  officialPrepUrl: string
  domains: AwsExamDomain[]
  readinessRequirements: AwsReadinessRequirement[]
  capstone: string
  course: LearningCourse
}

interface UnitInput {
  id: string
  sequence: number
  difficulty?: LearningDifficulty
  title: string
  subtitle: string
  principle: string
  goal: string
  concepts: string[]
  sections: Array<{ title: string; body: string }>
  scenario: LearningUnit["scenario"]
  assessmentTitle: string
  assessmentDescription: string
  reflectionPrompt: string
  questions: AssessmentQuestion[]
}

function difficultyForSequence(sequence: number): LearningDifficulty {
  if (sequence === 1) return "Easy"
  if (sequence <= 3) return "Medium"
  if (sequence === 4) return "Hard"
  return "Expert"
}

function certificationUnit(input: UnitInput): LearningUnit {
  return {
    id: input.id,
    phase: input.sequence,
    difficulty: input.difficulty ?? difficultyForSequence(input.sequence),
    title: input.title,
    subtitle: input.subtitle,
    principle: input.principle,
    goal: input.goal,
    concepts: input.concepts,
    sections: input.sections,
    scenario: input.scenario,
    assessment: {
      title: input.assessmentTitle,
      description: input.assessmentDescription,
      reflectionPrompt: input.reflectionPrompt,
      questions: input.questions,
    },
  }
}

const sharedReadinessRequirements: AwsReadinessRequirement[] = [
  {
    id: "exam-guide",
    label: "Latest official exam guide reviewed",
    detail: "Check every domain task statement and confirm that no objective remains unreviewed.",
  },
  {
    id: "official-questions",
    label: "Official Practice Question Set completed",
    detail: "Use the current AWS set to learn the wording and reasoning style used by the exam.",
  },
  {
    id: "official-practice-exam",
    label: "AWS Official Practice Exam passed",
    detail: "Take it late in preparation, under timed conditions, without notes or pauses.",
  },
  {
    id: "fresh-mocks",
    label: "Three fresh timed mocks at 85% or above",
    detail: "Use unseen questions, leave 48–72 hours between the final attempts, and avoid memorised banks.",
  },
  {
    id: "domain-floor",
    label: "No exam domain below 80%",
    detail: "A strong overall average must not hide a weak security, resilience, performance, or cost domain.",
  },
  {
    id: "error-log",
    label: "Every incorrect answer explained",
    detail: "Record the wrong assumption, the correct AWS rule, and why each distractor fails the stated requirements.",
  },
]

const practitionerUnits: LearningUnit[] = [
  certificationUnit({
    id: "cloud-concepts",
    sequence: 1,
    title: "Cloud value, economics, and global infrastructure",
    subtitle: "Explain why organisations use AWS before choosing a service.",
    principle: "Cloud architecture begins with business outcomes: agility, elasticity, resilience, reach, and variable cost.",
    goal: "Connect AWS global infrastructure and cloud economics to an API Sandbox migration decision.",
    concepts: ["Regions", "Availability Zones", "edge locations", "elasticity", "agility", "AWS CAF", "Well-Architected"],
    sections: [
      {
        title: "Value before vocabulary",
        body: "Cloud value is not simply renting somebody else’s server. Teams can provision capacity faster, scale with demand, reach more locations, and replace some capital planning with measured consumption. A good answer connects the benefit to the workload constraint.",
      },
      {
        title: "Regions, Availability Zones, and the edge",
        body: "A Region is a geographic deployment boundary. Availability Zones are isolated locations within it that enable highly available regional designs. Edge locations bring content and network services nearer to users but do not replace a workload Region.",
      },
      {
        title: "Frameworks organise decisions",
        body: "The AWS Cloud Adoption Framework helps organisations plan people, process, and technology change. The Well-Architected Framework reviews operational excellence, security, reliability, performance efficiency, cost optimisation, and sustainability.",
      },
    ],
    scenario: {
      title: "Choose the deployment boundary",
      prompt: "API Sandbox serves UK learners and needs resilience against one data-centre failure. What is the clearest starting design?",
      options: [
        { id: "multi-az", label: "One Region across multiple Availability Zones", consequence: "This keeps the workload near its main audience while removing a single-AZ dependency." },
        { id: "many-regions", label: "Deploy to every AWS Region immediately", consequence: "Global duplication adds cost and operational complexity before a multi-Region requirement exists." },
      ],
      trace: [
        { id: "users", label: "Locate the audience", system: "Business requirement", detail: "Latency and data-residency needs guide the home Region." },
        { id: "failure", label: "Define tolerated failure", system: "Reliability", detail: "The workload should survive a single Availability Zone outage." },
        { id: "region", label: "Choose one Region", system: "AWS global infrastructure", detail: "A nearby Region becomes the primary deployment boundary." },
        { id: "az", label: "Distribute across AZs", system: "Regional architecture", detail: "Application and data services use multiple Availability Zones where required." },
      ],
    },
    assessmentTitle: "Cloud concepts checkpoint",
    assessmentDescription: "Distinguish global infrastructure, cloud value, and architecture frameworks.",
    reflectionPrompt: "Explain why multiple Availability Zones and multiple Regions solve different business problems.",
    questions: [
      {
        id: "cloud-elasticity",
        prompt: "Which cloud benefit means adding and removing resources as demand changes?",
        options: ["Elasticity", "Data sovereignty", "Capital expenditure", "Dedicated tenancy"],
        correctAnswer: "Elasticity",
        explanation: "Elasticity adjusts capacity to the workload rather than permanently provisioning for a possible peak.",
        reviewLabel: "Cloud benefits",
      },
      {
        id: "az-role",
        prompt: "What is the primary architecture reason to use multiple Availability Zones in one Region?",
        options: ["Regional high availability", "Lower every service price", "Replace IAM", "Create a global DNS namespace"],
        correctAnswer: "Regional high availability",
        explanation: "AZ separation reduces the chance that one facility-level failure removes the entire regional workload.",
        reviewLabel: "Global infrastructure",
      },
      {
        id: "well-architected-purpose",
        prompt: "What does the AWS Well-Architected Framework provide?",
        options: ["A consistent way to review architecture trade-offs", "A fixed monthly AWS invoice", "A source-code licence", "A replacement for business requirements"],
        correctAnswer: "A consistent way to review architecture trade-offs",
        explanation: "The framework structures architecture reviews around six quality pillars.",
        reviewLabel: "Well-Architected Framework",
      },
    ],
  }),
  certificationUnit({
    id: "security-compliance",
    sequence: 2,
    title: "Security, identity, and compliance",
    subtitle: "Separate AWS responsibilities from customer responsibilities.",
    principle: "AWS secures the cloud; customers configure and protect what they run in the cloud.",
    goal: "Classify responsibilities and select identity, encryption, detection, and compliance services.",
    concepts: ["shared responsibility", "IAM", "MFA", "least privilege", "KMS", "CloudTrail", "Artifact", "Shield"],
    sections: [
      {
        title: "Shared responsibility changes by service",
        body: "AWS protects facilities, hardware, and managed-service foundations. Customers remain responsible for identities, data, configuration, and application code. Managed services move more operational work to AWS, but they do not remove customer accountability.",
      },
      {
        title: "Identity is the first control plane",
        body: "Use the root user only for root-only tasks, protect it with MFA, prefer temporary role credentials, and grant only required actions on required resources. IAM policies express permissions; AWS Organizations and SCPs set broader account guardrails.",
      },
      {
        title: "Protection, detection, and evidence",
        body: "KMS supports encryption-key control, CloudTrail records account API activity, CloudWatch observes workload behaviour, AWS Artifact provides compliance reports, and Shield/WAF address different network and application-layer threats.",
      },
    ],
    scenario: {
      title: "Protect the deployment pipeline",
      prompt: "GitHub Actions needs to deploy API Sandbox to AWS. Which credential design best follows AWS guidance?",
      options: [
        { id: "oidc", label: "Exchange GitHub OIDC identity for a scoped IAM role", consequence: "The workflow receives short-lived permissions without storing a long-lived AWS access key." },
        { id: "admin-key", label: "Store a root access key in repository secrets", consequence: "Root credentials are excessive, long-lived, and create severe account compromise risk." },
      ],
      trace: [
        { id: "trust", label: "Establish trust", system: "IAM identity provider", detail: "AWS trusts tokens from the approved GitHub repository and branch context." },
        { id: "assume", label: "Assume a role", system: "STS", detail: "The workflow exchanges identity for temporary credentials." },
        { id: "scope", label: "Apply least privilege", system: "IAM policy", detail: "The role can update only the required deployment resources." },
        { id: "audit", label: "Record activity", system: "CloudTrail", detail: "Role assumption and deployment API calls become auditable events." },
      ],
    },
    assessmentTitle: "Security and compliance checkpoint",
    assessmentDescription: "Apply shared responsibility, identity, encryption, and audit controls.",
    reflectionPrompt: "Describe three security responsibilities API Sandbox retains when deployed to a managed AWS service.",
    questions: [
      {
        id: "shared-rds",
        prompt: "For Amazon RDS, who is responsible for protecting database credentials and application access?",
        options: ["The customer", "AWS Support", "The hardware manufacturer", "The domain registrar"],
        correctAnswer: "The customer",
        explanation: "AWS manages the service infrastructure while the customer controls identities, credentials, data access, and application behaviour.",
        reviewLabel: "Shared responsibility",
      },
      {
        id: "api-audit",
        prompt: "Which service records AWS account API activity for audit and investigation?",
        options: ["AWS CloudTrail", "Amazon CloudFront", "AWS Direct Connect", "Amazon Route 53"],
        correctAnswer: "AWS CloudTrail",
        explanation: "CloudTrail records control-plane activity and related identity context.",
        reviewLabel: "Detection and audit",
      },
      {
        id: "least-privilege",
        prompt: "What does least privilege require?",
        options: ["Grant only the permissions needed for the task", "Give every engineer AdministratorAccess", "Use the root user for automation", "Disable logging to reduce cost"],
        correctAnswer: "Grant only the permissions needed for the task",
        explanation: "Least privilege limits the actions and resources available to an identity.",
        reviewLabel: "IAM",
      },
    ],
  }),
  certificationUnit({
    id: "cloud-services",
    sequence: 3,
    title: "Core AWS technology and services",
    subtitle: "Match workload requirements to compute, storage, database, and networking families.",
    principle: "Certification questions reward the managed service that satisfies the requirement with the least unnecessary operational work.",
    goal: "Choose appropriate service families for common API Sandbox components.",
    concepts: ["EC2", "Lambda", "ECS", "S3", "EBS", "EFS", "RDS", "DynamoDB", "VPC", "Route 53", "CloudFront"],
    sections: [
      {
        title: "Compute choices express an operating model",
        body: "EC2 provides virtual-machine control, Lambda runs event-driven functions, ECS orchestrates containers, and managed application platforms reduce infrastructure decisions further. Choose from the requirement, not from familiarity.",
      },
      {
        title: "Storage and databases are not interchangeable",
        body: "S3 stores objects, EBS provides block storage for compute, and EFS provides shared file storage. RDS manages relational engines while DynamoDB provides a managed key-value and document database with different access-pattern trade-offs.",
      },
      {
        title: "Networks connect and deliver",
        body: "A VPC is a regional network boundary, Route 53 provides DNS and routing policies, Elastic Load Balancing distributes traffic, and CloudFront caches content through a global edge network.",
      },
    ],
    scenario: {
      title: "Place API Sandbox components",
      prompt: "The application is already a container and uses relational PostgreSQL data. Which pairing requires the least redesign?",
      options: [
        { id: "ecs-rds", label: "ECS Fargate with RDS for PostgreSQL", consequence: "The container and relational schema can move with limited application redesign." },
        { id: "lambda-dynamo", label: "Rewrite everything for Lambda and DynamoDB", consequence: "This may be valid for a new access pattern, but it introduces unnecessary migration work for the stated requirement." },
      ],
      trace: [
        { id: "package", label: "Inspect the package", system: "Application", detail: "API Sandbox already builds a standalone container." },
        { id: "data", label: "Inspect the data model", system: "Prisma/PostgreSQL", detail: "The workload depends on relational constraints and queries." },
        { id: "compute", label: "Select managed containers", system: "ECS Fargate", detail: "Fargate removes host management while retaining the container model." },
        { id: "database", label: "Select managed PostgreSQL", system: "Amazon RDS", detail: "RDS preserves the relational engine while reducing database administration." },
      ],
    },
    assessmentTitle: "Cloud technology checkpoint",
    assessmentDescription: "Choose service families from workload requirements.",
    reflectionPrompt: "Compare EC2, ECS Fargate, and Lambda as compute options for API Sandbox.",
    questions: [
      {
        id: "object-storage",
        prompt: "Which AWS service is designed for durable object storage?",
        options: ["Amazon S3", "Amazon EBS", "Amazon EC2", "AWS IAM"],
        correctAnswer: "Amazon S3",
        explanation: "S3 stores objects in buckets and supports lifecycle, replication, and multiple storage classes.",
        reviewLabel: "Storage services",
      },
      {
        id: "relational-database",
        prompt: "Which managed service is the natural fit for an existing PostgreSQL application?",
        options: ["Amazon RDS", "Amazon SQS", "Amazon CloudFront", "AWS Artifact"],
        correctAnswer: "Amazon RDS",
        explanation: "RDS supports managed PostgreSQL while retaining the relational database model.",
        reviewLabel: "Database services",
      },
      {
        id: "dns-service",
        prompt: "Which AWS service provides authoritative DNS and routing policies?",
        options: ["Amazon Route 53", "AWS KMS", "Amazon ECR", "AWS CloudFormation"],
        correctAnswer: "Amazon Route 53",
        explanation: "Route 53 hosts DNS records and supports health-aware routing policies.",
        reviewLabel: "Networking services",
      },
    ],
  }),
  certificationUnit({
    id: "operations-billing-support",
    sequence: 4,
    title: "Operations, billing, pricing, and support",
    subtitle: "Observe usage, control cost, and know where to seek help.",
    principle: "Cloud cost is an architecture signal: measure it, allocate it, forecast it, and alert before it surprises you.",
    goal: "Select monitoring, cost-management, pricing, and support mechanisms for a small AWS workload.",
    concepts: ["CloudWatch", "Health Dashboard", "Cost Explorer", "AWS Budgets", "tags", "On-Demand", "Savings Plans", "Spot", "Support plans"],
    sections: [
      {
        title: "Monitoring and account health answer different questions",
        body: "CloudWatch collects workload metrics, logs, and alarms. CloudTrail records API activity. AWS Health communicates events affecting AWS resources, while the public Service Health Dashboard communicates broader service status.",
      },
      {
        title: "Cost tools form a feedback loop",
        body: "Cost Explorer analyses historical spend, AWS Budgets alerts against thresholds, the Pricing Calculator estimates proposed designs, and tags or cost categories allocate spend to owners and environments.",
      },
      {
        title: "Pricing models exchange flexibility for savings",
        body: "On-Demand preserves flexibility, Savings Plans trade a usage commitment for lower eligible compute prices, and Spot uses spare capacity with interruption risk. Support plans differ in response times, guidance, and technical support access.",
      },
    ],
    scenario: {
      title: "Prevent a learning-account bill shock",
      prompt: "A learner is about to create RDS, NAT Gateway, and load-balancing resources. What should happen first?",
      options: [
        { id: "budget", label: "Estimate cost, tag resources, and configure budget alerts", consequence: "The learner establishes ownership and early warning before chargeable resources run." },
        { id: "wait", label: "Wait for the monthly invoice", consequence: "The first feedback arrives too late to prevent avoidable spend." },
      ],
      trace: [
        { id: "estimate", label: "Estimate the design", system: "AWS Pricing Calculator", detail: "The proposed architecture gets an explicit cost model." },
        { id: "tag", label: "Assign ownership", system: "Cost allocation tags", detail: "Resources are associated with the certification lab and learner." },
        { id: "alert", label: "Create thresholds", system: "AWS Budgets", detail: "Forecast and actual-spend alerts notify the learner early." },
        { id: "review", label: "Review usage", system: "Cost Explorer", detail: "Historical cost and service drivers guide cleanup and optimisation." },
      ],
    },
    assessmentTitle: "Operations and billing checkpoint",
    assessmentDescription: "Distinguish observability, cost, pricing, and support tools.",
    reflectionPrompt: "Design a simple cost-control loop for a learner running temporary AWS labs.",
    questions: [
      {
        id: "budget-alert",
        prompt: "Which service sends alerts when actual or forecast AWS spend crosses a threshold?",
        options: ["AWS Budgets", "Amazon Route 53", "AWS Shield", "Amazon Inspector"],
        correctAnswer: "AWS Budgets",
        explanation: "Budgets evaluates configured cost or usage thresholds and sends notifications.",
        reviewLabel: "Cost management",
      },
      {
        id: "workload-metrics",
        prompt: "Which service collects workload metrics and supports alarms?",
        options: ["Amazon CloudWatch", "AWS Artifact", "AWS Organizations", "Amazon Cognito"],
        correctAnswer: "Amazon CloudWatch",
        explanation: "CloudWatch provides metrics, logs, dashboards, and alarms for AWS workloads.",
        reviewLabel: "Management and governance",
      },
      {
        id: "spot-tradeoff",
        prompt: "What is the defining trade-off of Spot capacity?",
        options: ["Lower price with interruption risk", "Fixed capacity with no discount", "Global DNS with higher latency", "Permanent root credentials"],
        correctAnswer: "Lower price with interruption risk",
        explanation: "Spot uses spare AWS capacity and is appropriate only when the workload can tolerate interruption.",
        reviewLabel: "Pricing models",
      },
    ],
  }),
  certificationUnit({
    id: "practitioner-readiness",
    sequence: 5,
    title: "Practitioner capstone and exam readiness",
    subtitle: "Turn service recognition into defensible cloud recommendations.",
    principle: "Readiness means explaining the requirement-service relationship, not recognising a logo or memorising a question.",
    goal: "Produce a foundational API Sandbox cloud proposal and complete the external readiness gate.",
    concepts: ["architecture brief", "shared responsibility", "service map", "cost estimate", "domain score", "error log"],
    sections: [
      {
        title: "The capstone",
        body: "Create a one-page proposal that identifies the users, Region, major AWS service families, security responsibilities, cost controls, and support path for API Sandbox. The proposal should be understandable without implementation detail.",
      },
      {
        title: "The external gate",
        body: "Complete AWS Cloud Practitioner Essentials, the official question set, an official practice exam, and independent timed mocks. Record weak domains and revisit documentation until no domain remains below the readiness floor.",
      },
    ],
    scenario: {
      title: "Explain AWS to a product owner",
      prompt: "A product owner asks why API Sandbox should use managed AWS services instead of managing every server itself. What is the strongest answer?",
      options: [
        { id: "outcomes", label: "Connect managed services to reliability, delivery speed, and reduced undifferentiated operations", consequence: "The recommendation explains business and operational outcomes without claiming that responsibility disappears." },
        { id: "magic", label: "Say AWS automatically makes every application secure and cheap", consequence: "Cloud services still require correct architecture, configuration, ownership, and cost control." },
      ],
      trace: [
        { id: "requirement", label: "Start with outcomes", system: "Product context", detail: "Reliability, delivery speed, and team capacity define the decision." },
        { id: "service", label: "Map service families", system: "AWS", detail: "Managed compute, database, and edge services address specific operational needs." },
        { id: "responsibility", label: "Retain accountability", system: "Shared responsibility", detail: "The team still protects identity, configuration, code, and data." },
        { id: "measure", label: "Measure results", system: "Operations and cost", detail: "Availability, delivery, security, and spend validate the proposal." },
      ],
    },
    assessmentTitle: "Practitioner capstone checkpoint",
    assessmentDescription: "Combine cloud value, security, services, and cost into one recommendation.",
    reflectionPrompt: "Give a two-minute explanation of the proposed API Sandbox cloud architecture to a non-technical stakeholder.",
    questions: [
      {
        id: "managed-value",
        prompt: "What is the strongest reason to choose a managed AWS service?",
        options: ["It satisfies the requirement while reducing relevant operational work", "It always has the lowest possible invoice", "It removes all customer security responsibilities", "It never experiences failure"],
        correctAnswer: "It satisfies the requirement while reducing relevant operational work",
        explanation: "Managed services can shift undifferentiated operations to AWS, but the architecture must still fit the requirements.",
        reviewLabel: "Cloud value",
      },
      {
        id: "readiness-evidence",
        prompt: "Which result is the strongest readiness evidence?",
        options: ["Consistent scores on fresh timed exams with explained mistakes", "Repeating one memorised mock until it reaches 100%", "Watching every video without practice", "Recognising most service icons"],
        correctAnswer: "Consistent scores on fresh timed exams with explained mistakes",
        explanation: "Fresh, timed, domain-balanced results test transfer and reveal unresolved reasoning gaps.",
        reviewLabel: "Exam readiness",
      },
      {
        id: "capstone-scope",
        prompt: "What should a foundational architecture proposal lead with?",
        options: ["Business and workload requirements", "The largest possible service list", "A root access key", "An assumption that every workload is serverless"],
        correctAnswer: "Business and workload requirements",
        explanation: "Requirements provide the basis for every service and architecture recommendation.",
        reviewLabel: "Architecture communication",
      },
    ],
  }),
]

const associateUnits: LearningUnit[] = [
  certificationUnit({
    id: "secure-architectures",
    sequence: 1,
    title: "Design secure architectures",
    subtitle: "Protect access, workloads, networks, and data with layered controls.",
    principle: "Use temporary identity, least privilege, network boundaries, encryption, and detection together; no single control is the architecture.",
    goal: "Design the identity, network, and data-protection model for API Sandbox on AWS.",
    concepts: ["IAM roles", "STS", "Organizations", "SCP", "security groups", "NACL", "TLS", "mTLS", "KMS", "Secrets Manager", "WAF", "CloudTrail"],
    sections: [
      {
        title: "Secure access at human and workload boundaries",
        body: "Federate workforce access, use MFA, prefer roles and temporary credentials, and separate permissions by job and environment. Workloads receive task or function roles rather than embedded access keys.",
      },
      {
        title: "Layer network and application protection",
        body: "Place only intended entry points in public subnets, keep application and database resources private where practical, reference security groups between tiers, and use WAF for application-layer filtering at the edge.",
      },
      {
        title: "Protect data through its lifecycle",
        body: "Use KMS-backed encryption where key control is required, TLS in transit, Secrets Manager for rotated secrets, S3 Block Public Access, and logging that supports investigation without leaking sensitive values.",
      },
      {
        title: "Place TLS and mTLS at the transport boundary",
        body: "TLS encrypts traffic and authenticates the server at an HTTPS or API endpoint. Use mTLS when both sides of a trusted service-to-service connection must authenticate with certificates; it belongs at the transport or service-mesh boundary and complements, rather than replaces, IAM authorization and application identity.",
      },
    ],
    scenario: {
      title: "Let an ECS task read one secret",
      prompt: "The API Sandbox task needs the production database credential. Which design best limits exposure?",
      options: [
        { id: "task-role", label: "Grant the ECS task role access to one Secrets Manager secret", consequence: "The running task receives temporary permission scoped to the required secret." },
        { id: "image-secret", label: "Bake the database password into the container image", consequence: "The secret becomes long-lived, broadly replicated, and difficult to rotate safely." },
      ],
      trace: [
        { id: "store", label: "Store the secret", system: "Secrets Manager", detail: "The credential is encrypted and independently managed." },
        { id: "identity", label: "Identify the workload", system: "ECS task role", detail: "The running task receives temporary AWS credentials." },
        { id: "policy", label: "Scope access", system: "IAM", detail: "The policy permits only the required secret action and resource." },
        { id: "audit", label: "Audit retrieval", system: "CloudTrail", detail: "Secret-access API activity can be investigated." },
      ],
    },
    assessmentTitle: "Secure architecture checkpoint",
    assessmentDescription: "Select identity, network, and data controls from scenario requirements.",
    reflectionPrompt: "Trace how a request and its data are protected from CloudFront to RDS.",
    questions: [
      {
        id: "temporary-workload-access",
        prompt: "How should an ECS task normally receive AWS API permissions?",
        options: ["An ECS task IAM role", "A root access key in the image", "A public S3 bucket", "An inbound security-group rule"],
        correctAnswer: "An ECS task IAM role",
        explanation: "Task roles provide temporary credentials directly to the workload and can be scoped by policy.",
        reviewLabel: "Secure access",
      },
      {
        id: "tier-security-group",
        prompt: "How should RDS inbound access be limited for the API tier?",
        options: ["Allow the ECS task security group on the database port", "Allow 0.0.0.0/0 on every port", "Use an S3 bucket policy", "Create an IAM user for each HTTP request"],
        correctAnswer: "Allow the ECS task security group on the database port",
        explanation: "Security-group references express tier-to-tier access without relying on changing task IP addresses.",
        reviewLabel: "Secure workloads",
      },
      {
        id: "secret-location",
        prompt: "Which service is designed to store and rotate application secrets?",
        options: ["AWS Secrets Manager", "Amazon CloudFront", "Amazon Athena", "AWS Direct Connect"],
        correctAnswer: "AWS Secrets Manager",
        explanation: "Secrets Manager stores encrypted secret values and supports managed or application-driven rotation.",
        reviewLabel: "Data security controls",
      },
    ],
  }),
  certificationUnit({
    id: "resilient-architectures",
    sequence: 2,
    title: "Design resilient architectures",
    subtitle: "Remove single points of failure and decouple work that should fail independently.",
    principle: "Resilience comes from explicit failure boundaries, redundant capacity, durable state, and tested recovery.",
    goal: "Make API Sandbox tolerate task, Availability Zone, dependency, and database failures.",
    concepts: ["multi-AZ", "ALB", "Auto Scaling", "SQS", "SNS", "EventBridge", "DLQ", "RDS Multi-AZ", "Route 53 failover", "backup"],
    sections: [
      {
        title: "Availability requires redundant healthy capacity",
        body: "Run stateless application tasks across multiple AZs behind an ALB, use health checks to remove failed targets, and scale within explicit minimum and maximum capacity. Store durable state outside replaceable tasks.",
      },
      {
        title: "Loose coupling controls failure propagation",
        body: "Queues absorb bursts and let producers succeed independently of consumers. Visibility timeouts, idempotent consumers, retries, dead-letter queues, and alarms determine whether asynchronous work is recoverable.",
      },
      {
        title: "Backups are incomplete until restore is tested",
        body: "RDS Multi-AZ addresses availability, not every corruption or deletion scenario. Automated backups, point-in-time recovery, snapshots, and restore exercises address different recovery needs defined by RTO and RPO.",
      },
    ],
    scenario: {
      title: "Protect Stripe webhook follow-up",
      prompt: "A valid Stripe webhook updates entitlement and then triggers non-critical email work. How should the email step be isolated?",
      options: [
        { id: "queue", label: "Publish durable work to SQS and acknowledge the webhook promptly", consequence: "Email retries and provider outages no longer extend the critical webhook response path." },
        { id: "inline", label: "Wait indefinitely for the email provider before responding", consequence: "A secondary dependency can cause webhook retries and duplicate pressure on the critical path." },
      ],
      trace: [
        { id: "verify", label: "Verify and deduplicate", system: "Webhook route", detail: "Signature and event identity protect the critical write." },
        { id: "commit", label: "Commit entitlement", system: "RDS transaction", detail: "The authoritative subscription state is updated." },
        { id: "enqueue", label: "Publish follow-up", system: "Amazon SQS", detail: "Non-critical work crosses a durable asynchronous boundary." },
        { id: "consume", label: "Retry independently", system: "Worker and DLQ", detail: "Email failures follow a bounded retry and investigation path." },
      ],
    },
    assessmentTitle: "Resilient architecture checkpoint",
    assessmentDescription: "Apply high availability, loose coupling, and recovery patterns.",
    reflectionPrompt: "Describe how API Sandbox responds to an ECS task failure, an AZ failure, and a poisoned queue message.",
    questions: [
      {
        id: "multi-az-app",
        prompt: "What removes a single-AZ dependency from the stateless application tier?",
        options: ["Healthy tasks in multiple AZs behind a load balancer", "One larger task in one subnet", "A longer DNS TTL", "One manually assigned public IP"],
        correctAnswer: "Healthy tasks in multiple AZs behind a load balancer",
        explanation: "Redundant tasks and health-aware load balancing allow traffic to continue when one task or AZ is unavailable.",
        reviewLabel: "Highly available architectures",
      },
      {
        id: "queue-decoupling",
        prompt: "Why place SQS between a request path and non-critical background work?",
        options: ["To absorb bursts and isolate consumer failures", "To make all processing synchronous", "To replace every database", "To provide DNS resolution"],
        correctAnswer: "To absorb bursts and isolate consumer failures",
        explanation: "A durable queue separates producer availability and rate from consumer availability and rate.",
        reviewLabel: "Loosely coupled architectures",
      },
      {
        id: "multi-az-vs-backup",
        prompt: "Why are RDS automated backups still needed with Multi-AZ?",
        options: ["Multi-AZ availability does not replace point-in-time recovery", "Multi-AZ stores no data", "Backups provide application load balancing", "Backups create IAM policies"],
        correctAnswer: "Multi-AZ availability does not replace point-in-time recovery",
        explanation: "A standby can fail over, but logical deletion or corruption may require recovery to an earlier point.",
        reviewLabel: "Recovery strategies",
      },
    ],
  }),
  certificationUnit({
    id: "high-performing-architectures",
    sequence: 3,
    title: "Design high-performing architectures",
    subtitle: "Select scalable compute, storage, database, and network services from access patterns.",
    principle: "Performance efficiency starts by measuring the bottleneck and choosing a service whose scaling model matches the access pattern.",
    goal: "Design API Sandbox for responsive global delivery and predictable database behaviour.",
    concepts: ["CloudFront", "Global Accelerator", "EBS", "EFS", "S3", "RDS Proxy", "read replica", "Aurora", "DynamoDB", "ElastiCache", "Auto Scaling"],
    sections: [
      {
        title: "Compute and network performance",
        body: "Select instance or task resources from measured CPU and memory needs, scale horizontally for stateless traffic, cache suitable content at CloudFront, and distinguish CDN caching from network-path acceleration.",
      },
      {
        title: "Storage follows the I/O model",
        body: "Choose S3 for objects, EBS for instance-attached block storage, and EFS for shared POSIX file access. Performance modes, throughput, durability, and access locality matter more than familiar names.",
      },
      {
        title: "Database scaling begins with reads, writes, and connections",
        body: "Indexes and query design come first. Read replicas scale eligible reads, Multi-AZ targets availability, caches reduce repeated reads, and RDS Proxy helps bursty clients reuse database connections.",
      },
    ],
    scenario: {
      title: "Reduce global lesson latency",
      prompt: "Most lesson assets are cacheable, while authenticated progress APIs remain dynamic. What is the best first optimisation?",
      options: [
        { id: "cloudfront", label: "Cache static assets with CloudFront and forward dynamic requests to the application", consequence: "Cacheable content moves closer to learners without incorrectly caching personalised API responses." },
        { id: "replicate-db", label: "Create a writable database in every Region immediately", consequence: "This adds consistency and operational complexity before the measured bottleneck requires it." },
      ],
      trace: [
        { id: "measure", label: "Separate request types", system: "Observability", detail: "Asset and dynamic API latency are measured independently." },
        { id: "classify", label: "Classify cacheability", system: "HTTP", detail: "Versioned public assets are safe to cache; private responses are not." },
        { id: "edge", label: "Serve assets at the edge", system: "CloudFront", detail: "Edge caches reduce origin work and network distance for hits." },
        { id: "origin", label: "Preserve dynamic origin", system: "ALB and ECS", detail: "Authenticated requests continue to the application and RDS." },
      ],
    },
    assessmentTitle: "Performance architecture checkpoint",
    assessmentDescription: "Choose performance patterns from compute, storage, database, and network requirements.",
    reflectionPrompt: "Explain how you would locate and address a p95 latency regression in API Sandbox.",
    questions: [
      {
        id: "read-scaling",
        prompt: "Which RDS feature scales eligible read-only database traffic?",
        options: ["Read replicas", "Multi-AZ standby alone", "AWS WAF", "S3 lifecycle rules"],
        correctAnswer: "Read replicas",
        explanation: "Read replicas asynchronously replicate data and can serve read traffic; Multi-AZ primarily supports availability.",
        reviewLabel: "High-performing databases",
      },
      {
        id: "shared-files",
        prompt: "Which storage service provides a managed shared POSIX file system across multiple AZs?",
        options: ["Amazon EFS", "Amazon EBS", "Amazon S3 Glacier", "Amazon SQS"],
        correctAnswer: "Amazon EFS",
        explanation: "EFS provides managed network file systems that can be mounted by multiple compute resources.",
        reviewLabel: "High-performing storage",
      },
      {
        id: "edge-cache",
        prompt: "Which service caches suitable content at edge locations?",
        options: ["Amazon CloudFront", "AWS CloudTrail", "AWS KMS", "Amazon RDS Proxy"],
        correctAnswer: "Amazon CloudFront",
        explanation: "CloudFront distributes and caches content through AWS edge locations.",
        reviewLabel: "High-performing networking",
      },
    ],
  }),
  certificationUnit({
    id: "cost-optimized-architectures",
    sequence: 4,
    title: "Design cost-optimised architectures",
    subtitle: "Remove idle cost, select the right pricing model, and include data movement in the design.",
    principle: "The cheapest unit price is not the cheapest architecture when it increases waste, transfer, failure, or operations.",
    goal: "Create a cost model and optimisation plan for learning, staging, and production API Sandbox environments.",
    concepts: ["rightsizing", "Savings Plans", "Spot", "S3 lifecycle", "Graviton", "serverless", "NAT Gateway", "data transfer", "Cost Explorer", "Budgets"],
    sections: [
      {
        title: "Match payment model to workload certainty",
        body: "Use On-Demand for flexibility, commitments for stable eligible usage, and Spot for interrupt-tolerant work. Rightsize measured resources, scale to demand, and remove abandoned non-production capacity.",
      },
      {
        title: "Storage cost changes over time",
        body: "Select storage classes from access frequency and retrieval needs, automate transitions with lifecycle policies, and delete expired data. Include request, retrieval, replication, and transfer charges in comparisons.",
      },
      {
        title: "Network architecture has a bill",
        body: "NAT gateways, public IPv4 addresses, cross-AZ traffic, cross-Region traffic, and internet egress can become material. Use VPC endpoints or colocated dependencies when they reduce total cost without violating resilience needs.",
      },
    ],
    scenario: {
      title: "Choose a certification-lab environment",
      prompt: "A learner needs the full ECS/RDS architecture for four hours each weekend. What is the strongest cost approach?",
      options: [
        { id: "ephemeral", label: "Provision from IaC for the lab and tear down chargeable resources afterward", consequence: "The design preserves realistic practice without paying for a mostly idle environment all month." },
        { id: "always-on", label: "Run production-sized Multi-AZ resources continuously", consequence: "This pays an availability premium even when no learning workload is active." },
      ],
      trace: [
        { id: "profile", label: "Profile usage", system: "Workload schedule", detail: "The environment is idle for most of the week." },
        { id: "codify", label: "Codify resources", system: "CloudFormation/CDK", detail: "Infrastructure can be recreated consistently." },
        { id: "operate", label: "Run the exercise", system: "Temporary stack", detail: "The learner practises on the required architecture." },
        { id: "destroy", label: "Remove ongoing charges", system: "Cost control", detail: "Teardown eliminates avoidable idle compute, database, load balancer, and NAT cost." },
      ],
    },
    assessmentTitle: "Cost optimisation checkpoint",
    assessmentDescription: "Optimise compute, storage, database, and network cost without ignoring requirements.",
    reflectionPrompt: "Identify the largest fixed and variable cost drivers in the proposed API Sandbox AWS design.",
    questions: [
      {
        id: "interruptible-compute",
        prompt: "Which pricing option fits fault-tolerant batch work that can be interrupted?",
        options: ["Spot capacity", "Dedicated Hosts only", "A larger On-Demand database", "Route 53 health checks"],
        correctAnswer: "Spot capacity",
        explanation: "Spot can reduce compute cost when the workload handles interruption and capacity variability.",
        reviewLabel: "Cost-optimised compute",
      },
      {
        id: "archive-objects",
        prompt: "What is the normal way to lower cost for S3 objects that become archival over time?",
        options: ["Use lifecycle transitions to an appropriate storage class", "Attach larger EBS volumes", "Increase NAT gateways", "Disable all encryption"],
        correctAnswer: "Use lifecycle transitions to an appropriate storage class",
        explanation: "Lifecycle policies automate movement or expiration based on the object’s access and retention requirements.",
        reviewLabel: "Cost-optimised storage",
      },
      {
        id: "nat-cost",
        prompt: "Which design can reduce NAT Gateway processing for private-subnet access to S3?",
        options: ["An S3 gateway VPC endpoint", "An additional public IPv4 address", "A longer database backup window", "An IAM password policy"],
        correctAnswer: "An S3 gateway VPC endpoint",
        explanation: "An S3 gateway endpoint provides private VPC routing to S3 without sending that traffic through a NAT gateway.",
        reviewLabel: "Cost-optimised networking",
      },
    ],
  }),
  certificationUnit({
    id: "associate-capstone-readiness",
    sequence: 5,
    title: "SAA-C03 API Sandbox capstone and readiness",
    subtitle: "Deploy, break, recover, measure, and defend one complete AWS workload.",
    principle: "An associate architect must choose the best solution under constraints, not merely assemble valid services.",
    goal: "Produce a tested AWS reference deployment and meet the independent high-confidence readiness gate.",
    concepts: ["CDK", "ECR", "ECS Fargate", "ALB", "RDS", "SQS", "CloudFront", "WAF", "CloudWatch", "RTO", "RPO", "ADR"],
    sections: [
      {
        title: "Build and prove the workload",
        body: "Deploy API Sandbox from infrastructure as code, use GitHub OIDC for delivery, run migrations as a controlled task, validate health checks, inject a task failure, restore RDS into a clean target, and capture cost and observability evidence.",
      },
      {
        title: "Defend architecture decisions",
        body: "Write short ADRs for compute, database, network egress, caching, asynchronous work, and recovery. Each decision must name the requirement, rejected alternatives, failure modes, and cost consequence.",
      },
      {
        title: "Complete independent exam preparation",
        body: "Use the official question set and practice exam, AWS labs, an independent course, fresh timed mocks, and an error log. Consistent domain-balanced performance matters more than one high score.",
      },
    ],
    scenario: {
      title: "Choose the final architecture",
      prompt: "API Sandbox needs managed containers, PostgreSQL, two-AZ availability, global asset delivery, and bounded asynchronous retries. Which design best fits?",
      options: [
        { id: "reference", label: "CloudFront/WAF → ALB → multi-AZ ECS, with RDS Multi-AZ and SQS/DLQ", consequence: "Each service maps directly to a stated delivery, compute, data, availability, or decoupling requirement." },
        { id: "service-sprawl", label: "Use EKS, five databases, and multi-Region active-active without additional requirements", consequence: "Technically powerful services create cost and complexity that the scenario does not justify." },
      ],
      trace: [
        { id: "edge", label: "Protect and deliver", system: "CloudFront and WAF", detail: "Cacheable assets are served globally and application traffic receives edge controls." },
        { id: "compute", label: "Distribute compute", system: "ALB and ECS", detail: "Healthy stateless tasks run across multiple AZs." },
        { id: "data", label: "Protect relational state", system: "RDS Multi-AZ", detail: "PostgreSQL remains managed and highly available within the Region." },
        { id: "async", label: "Bound background failure", system: "SQS and DLQ", detail: "Retries, backpressure, and poison messages have explicit paths." },
      ],
    },
    assessmentTitle: "SAA-C03 capstone checkpoint",
    assessmentDescription: "Integrate security, resilience, performance, and cost decisions.",
    reflectionPrompt: "Present the final API Sandbox AWS architecture and defend the three most important trade-offs.",
    questions: [
      {
        id: "best-answer",
        prompt: "When several answers are technically possible, how should the best SAA answer be selected?",
        options: ["Choose the option that meets every stated requirement with the best managed trade-off", "Choose the option with the most services", "Always choose EC2", "Ignore cost unless the word cheap appears"],
        correctAnswer: "Choose the option that meets every stated requirement with the best managed trade-off",
        explanation: "SAA scenarios test requirement-driven architecture across security, resilience, performance, operations, and cost.",
        reviewLabel: "Architecture reasoning",
      },
      {
        id: "restore-evidence",
        prompt: "What proves that the database recovery design works?",
        options: ["A timed restore exercise that validates data and application access", "A diagram containing the word backup", "Multi-AZ by itself", "A successful container build"],
        correctAnswer: "A timed restore exercise that validates data and application access",
        explanation: "Recovery evidence requires performing and measuring the restore, not only configuring backup creation.",
        reviewLabel: "Resilience evidence",
      },
      {
        id: "mock-readiness",
        prompt: "Which practice pattern best supports a high-confidence readiness decision?",
        options: ["Three fresh timed mocks at 85%+ with no domain below 80%", "One familiar mock repeated daily", "Only watching solution videos", "Skipping explanations after correct guesses"],
        correctAnswer: "Three fresh timed mocks at 85%+ with no domain below 80%",
        explanation: "Fresh, consistent, domain-balanced results reduce the risk that recall of one bank is mistaken for transferable knowledge.",
        reviewLabel: "Exam readiness",
      },
    ],
  }),
]

const aiPractitionerUnits: LearningUnit[] = [
  certificationUnit({
    id: "ai-ml-fundamentals",
    sequence: 1,
    title: "AI and machine learning fundamentals",
    subtitle: "Choose the right learning approach for the business problem.",
    principle: "Start with the problem, data, and success measure before choosing an AI or ML technique.",
    goal: "Distinguish AI, ML, deep learning, supervised learning, unsupervised learning, and common evaluation measures.",
    concepts: ["AI and ML", "training and inference", "supervised learning", "unsupervised learning", "classification", "regression", "overfitting"],
    sections: [
      {
        title: "Match the technique to the task",
        body: "Classification predicts a category, regression predicts a numeric value, clustering groups similar examples, and generative AI creates new content. The right choice depends on the desired output and the available labelled or unlabelled data.",
      },
      {
        title: "Measure what matters",
        body: "Accuracy can hide an imbalanced-class problem. Precision, recall, F1 score, and a confusion matrix expose different error costs, while a validation set helps reveal overfitting before a model is used in production.",
      },
    ],
    scenario: {
      title: "Classify support requests",
      prompt: "API Sandbox wants to route incoming support requests into billing, access, or technical categories. Which approach fits the stated output?",
      options: [
        { id: "classification", label: "Train or use a classification model", consequence: "The model predicts one of the known categories so each request can be routed." },
        { id: "regression", label: "Use regression to predict a category name", consequence: "Regression predicts numeric values and does not naturally represent a discrete support category." },
      ],
      trace: [
        { id: "task", label: "Define the output", system: "Business requirement", detail: "Each request needs one or more known routing labels." },
        { id: "data", label: "Prepare examples", system: "Training data", detail: "Historical requests are labelled consistently and checked for bias." },
        { id: "train", label: "Fit the model", system: "ML workflow", detail: "The model learns patterns from training examples." },
        { id: "measure", label: "Evaluate errors", system: "Validation set", detail: "Precision and recall are reviewed against the cost of misrouting." },
      ],
    },
    assessmentTitle: "AI and ML fundamentals checkpoint",
    assessmentDescription: "Identify core AI and ML concepts and select useful evaluation measures.",
    reflectionPrompt: "Explain which error matters more for a support router: a false escalation or a missed urgent request.",
    questions: [
      {
        id: "ai-classification",
        prompt: "Which ML task predicts a label such as billing, access, or technical?",
        options: ["Classification", "Regression", "Clustering only", "Dimensionality reduction"],
        correctAnswer: "Classification",
        explanation: "Classification predicts one or more discrete categories.",
        reviewLabel: "ML task selection",
      },
      {
        id: "ai-overfitting",
        prompt: "What is overfitting?",
        options: ["A model memorises training patterns and performs poorly on new data", "A model has no training data", "A model always predicts the majority class correctly", "A model is encrypted at rest"],
        correctAnswer: "A model memorises training patterns and performs poorly on new data",
        explanation: "Overfitting occurs when a model learns training-specific noise rather than patterns that generalise.",
        reviewLabel: "Model quality",
      },
      {
        id: "ai-imbalanced-metrics",
        prompt: "Which measures are useful when false positives and false negatives have different costs?",
        options: ["Precision and recall", "Only training accuracy", "Storage capacity and latency", "Region count and instance size"],
        correctAnswer: "Precision and recall",
        explanation: "Precision and recall expose different classes of prediction error and are more informative than accuracy alone in many imbalanced problems.",
        reviewLabel: "Evaluation metrics",
      },
    ],
  }),
  certificationUnit({
    id: "generative-ai-fundamentals",
    sequence: 2,
    title: "Generative AI and foundation models",
    subtitle: "Understand how generative systems create useful but fallible outputs.",
    principle: "A foundation model is a capable starting point, not a guarantee that an answer is factual, safe, or fit for a business process.",
    goal: "Explain tokens, embeddings, transformers, inference, hallucinations, and the trade-offs among model capabilities and costs.",
    concepts: ["generative AI", "foundation models", "tokens", "embeddings", "transformers", "inference", "hallucinations", "temperature"],
    sections: [
      {
        title: "From tokens to generated content",
        body: "Text is processed as tokens. Transformer-based foundation models use learned relationships among tokens to generate a likely continuation. Embeddings represent semantic relationships in a numeric space and support similarity search.",
      },
      {
        title: "Capabilities have boundaries",
        body: "A model can produce fluent but incorrect content, reflect training-data bias, or fail on a task outside its context. Latency, context length, quality, and token cost should be measured against the actual business use case.",
      },
    ],
    scenario: {
      title: "Explain a generated lesson",
      prompt: "A learner asks an AI assistant for the current API Sandbox refund policy. What should the product do before presenting a definitive answer?",
      options: [
        { id: "ground", label: "Ground the response in an approved policy source and show uncertainty when needed", consequence: "Retrieval and review reduce unsupported claims and make the answer traceable." },
        { id: "trust", label: "Treat fluent model output as the policy automatically", consequence: "Fluency does not prove that the model knows the current business rule." },
      ],
      trace: [
        { id: "question", label: "Receive the request", system: "Application", detail: "The assistant identifies a policy question that needs authoritative context." },
        { id: "retrieve", label: "Find approved context", system: "Knowledge base", detail: "The current policy is retrieved from a controlled source." },
        { id: "generate", label: "Generate a response", system: "Foundation model", detail: "The model uses the question and relevant context to draft an answer." },
        { id: "verify", label: "Check the claim", system: "Application policy", detail: "The response is evaluated, cited, or escalated when confidence is insufficient." },
      ],
    },
    assessmentTitle: "Generative AI fundamentals checkpoint",
    assessmentDescription: "Apply the basic concepts and limitations of generative AI systems.",
    reflectionPrompt: "Describe one useful AI assistant capability and one control required before users rely on it.",
    questions: [
      {
        id: "genai-token",
        prompt: "What is a token in a language-model workflow?",
        options: ["A unit of text or other input processed by the model", "A permanent IAM credential", "A database backup", "A network Availability Zone"],
        correctAnswer: "A unit of text or other input processed by the model",
        explanation: "Models process input and output as tokens, which also commonly influence context and usage cost.",
        reviewLabel: "Generative AI concepts",
      },
      {
        id: "genai-hallucination",
        prompt: "What is a hallucination in a generative AI response?",
        options: ["Plausible-sounding content that is unsupported or incorrect", "A model refusing every request", "A successful database failover", "An encrypted training example"],
        correctAnswer: "Plausible-sounding content that is unsupported or incorrect",
        explanation: "Generative models optimise likely output, so a fluent answer can still contain unsupported claims.",
        reviewLabel: "Model limitations",
      },
      {
        id: "genai-embedding",
        prompt: "What are embeddings commonly used for?",
        options: ["Representing semantic relationships for similarity or retrieval", "Replacing all IAM policies", "Encrypting an AWS account root user", "Measuring CPU temperature"],
        correctAnswer: "Representing semantic relationships for similarity or retrieval",
        explanation: "Embeddings map content to vectors that can be compared for semantic similarity.",
        reviewLabel: "Foundation-model components",
      },
    ],
  }),
  certificationUnit({
    id: "foundation-model-applications",
    sequence: 3,
    title: "Applications of foundation models",
    subtitle: "Design prompts, retrieval, fine-tuning, and evaluations around a real use case.",
    principle: "Reliable AI applications are systems around a model: context, instructions, tools, evaluation, guardrails, and observability all matter.",
    goal: "Choose prompt engineering, retrieval-augmented generation, fine-tuning, and evaluation techniques for a grounded assistant.",
    concepts: ["prompt engineering", "zero-shot", "few-shot", "RAG", "fine-tuning", "Amazon Bedrock", "guardrails", "evaluation"],
    sections: [
      {
        title: "Give the model the right context",
        body: "Clear instructions, delimiters, examples, output schemas, and explicit constraints improve consistency. Retrieval-augmented generation supplies current domain context at request time, while fine-tuning adapts behaviour from curated examples rather than supplying a live knowledge source.",
      },
      {
        title: "Evaluate the whole application",
        body: "Test factuality, relevance, safety, latency, cost, and refusal behaviour with representative examples. Amazon Bedrock provides managed access to foundation models and features such as model evaluation and guardrails that can support production workflows.",
      },
    ],
    scenario: {
      title: "Build a grounded AWS tutor",
      prompt: "The tutor must answer from a changing set of AWS notes and cite the note used. Which first design is most appropriate?",
      options: [
        { id: "rag", label: "Retrieve relevant notes, then prompt the model with that context", consequence: "The answer can use current source material without retraining the model for every note change." },
        { id: "fine-tune-all", label: "Fine-tune once and assume it will know every future note", consequence: "Fine-tuning is not a live knowledge synchronisation mechanism and still needs evaluation." },
      ],
      trace: [
        { id: "index", label: "Prepare the notes", system: "Embeddings and vector store", detail: "Approved notes are chunked and indexed for semantic retrieval." },
        { id: "retrieve", label: "Retrieve evidence", system: "Application", detail: "Relevant note sections are selected for the learner's question." },
        { id: "prompt", label: "Compose instructions", system: "Prompt", detail: "The model receives the question, source context, and citation rules." },
        { id: "evaluate", label: "Assess the answer", system: "Evaluation set", detail: "Grounding, relevance, safety, and citation quality are measured." },
      ],
    },
    assessmentTitle: "Foundation-model applications checkpoint",
    assessmentDescription: "Select practical patterns for prompting, retrieval, model adaptation, and evaluation.",
    reflectionPrompt: "Explain why retrieval is preferable to retraining when the source documents change daily.",
    questions: [
      {
        id: "fm-rag",
        prompt: "What is the main purpose of retrieval-augmented generation?",
        options: ["Provide relevant external context to the model at inference time", "Guarantee every generated answer is true", "Replace authentication", "Eliminate the need for evaluation"],
        correctAnswer: "Provide relevant external context to the model at inference time",
        explanation: "RAG retrieves information from a source and includes it in the generation context; it still requires quality and safety checks.",
        reviewLabel: "RAG",
      },
      {
        id: "fm-prompt-constraint",
        prompt: "Which prompt practice most improves structured API output?",
        options: ["Specify the required schema, constraints, and an example", "Ask for anything without describing the output", "Remove all context", "Use a random temperature for every request"],
        correctAnswer: "Specify the required schema, constraints, and an example",
        explanation: "Explicit output requirements and examples make the desired response shape clearer to the model and the application.",
        reviewLabel: "Prompt engineering",
      },
      {
        id: "fm-finetuning",
        prompt: "What is fine-tuning best described as?",
        options: ["Adapting a pretrained model with curated examples for a target behaviour", "Adding live documents to a prompt at request time", "Increasing an IAM policy's permissions", "A replacement for monitoring"],
        correctAnswer: "Adapting a pretrained model with curated examples for a target behaviour",
        explanation: "Fine-tuning changes model behaviour from training examples; it is distinct from retrieving current knowledge at inference time.",
        reviewLabel: "Model adaptation",
      },
    ],
  }),
  certificationUnit({
    id: "responsible-ai",
    sequence: 4,
    title: "Responsible AI and explainability",
    subtitle: "Make AI behaviour fair, transparent, robust, and accountable.",
    principle: "Responsible AI is an ongoing product and governance practice, not a final checkbox after the model ships.",
    goal: "Recognise bias, fairness, transparency, explainability, human oversight, and model monitoring responsibilities.",
    concepts: ["bias", "fairness", "transparency", "explainability", "human-in-the-loop", "robustness", "Amazon SageMaker Clarify", "Model Monitor"],
    sections: [
      {
        title: "Risk enters through data and decisions",
        body: "Training data can encode historical bias, missing groups, or proxy variables. Teams should document intended use, inspect data, test subgroup outcomes, and define escalation paths for high-impact decisions.",
      },
      {
        title: "Keep humans and evidence in the loop",
        body: "Explainability helps stakeholders understand relevant factors; it does not prove a model is correct. Human review, feedback, drift monitoring, and repeatable evaluation keep accountability with the organisation using the system.",
      },
    ],
    scenario: {
      title: "Review an AI access recommendation",
      prompt: "An AI system recommends whether a learner should receive elevated API access. What is the safest first release pattern?",
      options: [
        { id: "human-review", label: "Use the recommendation as an input to documented human review", consequence: "A trained reviewer can challenge errors while the team measures subgroup outcomes before automation expands." },
        { id: "auto-grant", label: "Automatically grant access from the model score", consequence: "A model score alone can amplify bias and create an uncontrolled high-impact decision." },
      ],
      trace: [
        { id: "document", label: "Define intended use", system: "Product governance", detail: "The team records who may be affected and what the model must not decide." },
        { id: "test", label: "Test groups and edge cases", system: "Evaluation", detail: "Quality and error rates are compared across relevant cohorts." },
        { id: "review", label: "Route to a reviewer", system: "Human oversight", detail: "A trained person can approve, reject, or escalate the recommendation." },
        { id: "monitor", label: "Monitor after launch", system: "Model operations", detail: "Feedback, drift, and adverse outcomes trigger investigation and improvement." },
      ],
    },
    assessmentTitle: "Responsible AI checkpoint",
    assessmentDescription: "Apply fairness, transparency, explainability, and human-oversight principles.",
    reflectionPrompt: "Name two groups that could be affected by an automated learner-access decision and how you would test for disparate outcomes.",
    questions: [
      {
        id: "responsible-bias",
        prompt: "Where can bias enter an ML system?",
        options: ["Data, labels, features, modelling choices, and the way outputs are used", "Only the model's colour scheme", "Only after a database backup", "It cannot enter a trained system"],
        correctAnswer: "Data, labels, features, modelling choices, and the way outputs are used",
        explanation: "Bias can be introduced or amplified throughout the data, modelling, deployment, and decision lifecycle.",
        reviewLabel: "Bias and fairness",
      },
      {
        id: "responsible-human",
        prompt: "Why use human oversight for a high-impact AI decision?",
        options: ["A reviewer can challenge uncertain or harmful recommendations", "Humans make every model prediction mathematically identical", "It removes the need for testing", "It guarantees the model has no bias"],
        correctAnswer: "A reviewer can challenge uncertain or harmful recommendations",
        explanation: "Human review provides accountability and a path to challenge model output; it complements rather than replaces evaluation.",
        reviewLabel: "Human oversight",
      },
      {
        id: "responsible-explainability",
        prompt: "What does explainability help a team do?",
        options: ["Understand factors contributing to a model output and investigate errors", "Prove every prediction is correct", "Remove the need for access control", "Turn a classifier into a database"],
        correctAnswer: "Understand factors contributing to a model output and investigate errors",
        explanation: "Explainability supports review and debugging but is not a guarantee of correctness or fairness.",
        reviewLabel: "Transparency and explainability",
      },
    ],
  }),
  certificationUnit({
    id: "ai-security-governance",
    sequence: 5,
    title: "Security, compliance, and governance for AI",
    subtitle: "Protect data, control access, and govern AI workloads across their lifecycle.",
    principle: "AI security extends familiar cloud controls with data lineage, prompt and output risks, model access, privacy, and continuous governance.",
    goal: "Apply least privilege, encryption, secure data handling, monitoring, and governance to an Amazon Bedrock-based assistant.",
    concepts: ["Amazon Bedrock", "IAM", "KMS", "TLS", "mTLS", "CloudTrail", "Guardrails", "data privacy", "prompt injection", "governance", "auditability"],
    sections: [
      {
        title: "Protect the data and the interfaces",
        body: "Classify training and retrieval data, minimise sensitive content, encrypt data, restrict model and knowledge-base access, validate inputs, and treat prompts and model outputs as untrusted application data. Prompt injection and data leakage need application-layer controls as well as IAM.",
      },
      {
        title: "Govern the lifecycle",
        body: "Record model and prompt versions, approval owners, evaluation results, and access events. AWS services such as IAM, KMS, CloudTrail, and Amazon Bedrock Guardrails can contribute controls, but the organisation remains responsible for its compliance obligations and intended use.",
      },
      {
        title: "Secure AI transport and workload identity",
        body: "Use TLS for encrypted client-to-API and API-to-service transport. Where AI services communicate across a trusted service boundary and both workloads must prove identity, mTLS provides mutual certificate authentication; keep authorization, data filtering, and model guardrails at their respective application and policy layers.",
      },
    ],
    scenario: {
      title: "Release a private course assistant",
      prompt: "The assistant can access paid course notes and learner records. Which launch plan best protects the system?",
      options: [
        { id: "controlled", label: "Use scoped roles, encrypted approved data, guardrails, audit logs, and evaluation gates", consequence: "Access, privacy, safety, and evidence are addressed across the application lifecycle." },
        { id: "public-prompt", label: "Put all records in one public prompt so the model has maximum context", consequence: "Broad exposure creates privacy, security, and governance risk and does not guarantee better answers." },
      ],
      trace: [
        { id: "classify", label: "Classify and minimise", system: "Data governance", detail: "Only the approved fields and course material enter the AI workflow." },
        { id: "authorize", label: "Scope access", system: "IAM and KMS", detail: "The application role can access only the required encrypted resources." },
        { id: "guard", label: "Filter and constrain", system: "Bedrock Guardrails", detail: "Configured policies reduce unsafe content and unwanted disclosure." },
        { id: "audit", label: "Retain evidence", system: "CloudTrail and evaluation", detail: "Access, versions, test results, and incidents support review and improvement." },
      ],
    },
    assessmentTitle: "AI security and governance checkpoint",
    assessmentDescription: "Select security, privacy, compliance, and governance controls for AI solutions.",
    reflectionPrompt: "Describe how you would prevent learner records from being exposed through an AI assistant response.",
    questions: [
      {
        id: "ai-least-privilege",
        prompt: "Which IAM approach is most appropriate for an AI application?",
        options: ["A scoped workload role with only the required model and data permissions", "A root access key embedded in the prompt", "AdministratorAccess for every user", "A public bucket containing all learner data"],
        correctAnswer: "A scoped workload role with only the required model and data permissions",
        explanation: "Least privilege limits the blast radius of application compromise and accidental misuse.",
        reviewLabel: "AI security",
      },
      {
        id: "ai-data-privacy",
        prompt: "What is a sound first step before using learner records in an AI workflow?",
        options: ["Classify and minimise the data, then confirm the approved purpose and controls", "Copy every record into a public prompt", "Disable audit logging", "Assume a model makes private data safe automatically"],
        correctAnswer: "Classify and minimise the data, then confirm the approved purpose and controls",
        explanation: "Data minimisation and purpose-driven governance reduce privacy exposure before a model is involved.",
        reviewLabel: "Data governance",
      },
      {
        id: "ai-audit",
        prompt: "Why retain model, prompt, access, and evaluation records?",
        options: ["To support accountability, investigation, reproducibility, and compliance review", "To guarantee outputs never change", "To replace encryption", "To make the model larger"],
        correctAnswer: "To support accountability, investigation, reproducibility, and compliance review",
        explanation: "Lifecycle evidence helps teams understand what was deployed, who used it, how it performed, and why decisions were made.",
        reviewLabel: "Governance evidence",
      },
    ],
  }),
]

const professionalUnits: LearningUnit[] = [
  certificationUnit({
    id: "organizational-complexity",
    sequence: 1,
    title: "Design for organisational complexity",
    subtitle: "Create account, identity, network, and governance boundaries that scale beyond one team.",
    principle: "At organisational scale, architecture includes ownership, guardrails, delegated administration, and shared-platform boundaries.",
    goal: "Place API Sandbox inside a governed multi-account AWS organisation.",
    concepts: ["Organizations", "OUs", "SCPs", "Control Tower", "IAM Identity Center", "RAM", "Transit Gateway", "central logging", "delegated administration"],
    sections: [
      {
        title: "Accounts are isolation and ownership boundaries",
        body: "Separate production, non-production, security, logging, and shared services according to blast radius and operating ownership. Organisational units group accounts for policy application; SCPs set permission guardrails without granting permissions themselves.",
      },
      {
        title: "Federate people and centralise evidence",
        body: "Use IAM Identity Center or enterprise federation for workforce access, delegate service administration to appropriate accounts, centralise immutable audit evidence, and retain break-glass access with controlled procedures.",
      },
      {
        title: "Share platforms deliberately",
        body: "Resource Access Manager, Transit Gateway, shared DNS, central inspection, and deployment services can reduce duplication, but they also create dependencies whose ownership, quotas, and failure domains must be explicit.",
      },
    ],
    scenario: {
      title: "Place API Sandbox in the organisation",
      prompt: "Security requires immutable logs, developers need self-service non-production, and production changes need stricter control. What is the strongest account design?",
      options: [
        { id: "multi-account", label: "Separate workload environments and central security/logging accounts under governed OUs", consequence: "Account boundaries reduce blast radius while central guardrails and evidence remain consistent." },
        { id: "single-account", label: "Put every environment and security log in one administrator-owned account", consequence: "A single compromise or policy mistake can affect production, development, and audit evidence together." },
      ],
      trace: [
        { id: "boundaries", label: "Define boundaries", system: "AWS Organizations", detail: "Workloads, security, logs, and shared services receive explicit accounts." },
        { id: "guardrails", label: "Apply guardrails", system: "OUs and SCPs", detail: "Preventive controls constrain accounts by organisational purpose." },
        { id: "access", label: "Federate access", system: "IAM Identity Center", detail: "Permission sets map job functions to accounts." },
        { id: "evidence", label: "Centralise evidence", system: "Log archive", detail: "Security logs are copied to a tightly controlled destination." },
      ],
    },
    assessmentTitle: "Organisational complexity checkpoint",
    assessmentDescription: "Apply multi-account, identity, governance, and shared-platform patterns.",
    reflectionPrompt: "Draw the API Sandbox organisation and explain why each account boundary exists.",
    questions: [
      {
        id: "scp-effect",
        prompt: "What does an AWS Organizations SCP do?",
        options: ["Sets the maximum available permissions for affected accounts", "Grants permissions directly to every user", "Encrypts RDS storage", "Distributes HTTP traffic"],
        correctAnswer: "Sets the maximum available permissions for affected accounts",
        explanation: "SCPs are guardrails; identities still need IAM permissions within the allowed boundary.",
        reviewLabel: "Organisational governance",
      },
      {
        id: "log-account",
        prompt: "Why centralise audit logs in a dedicated account?",
        options: ["To reduce the ability of a compromised workload account to alter its evidence", "To make all logs public", "To replace CloudTrail", "To avoid defining retention"],
        correctAnswer: "To reduce the ability of a compromised workload account to alter its evidence",
        explanation: "A separate, tightly controlled log archive improves evidence isolation and retention enforcement.",
        reviewLabel: "Centralised security",
      },
      {
        id: "account-boundary",
        prompt: "What is a principal benefit of separate AWS accounts for production and development?",
        options: ["A stronger isolation and blast-radius boundary", "Automatic zero-cost networking", "Elimination of IAM", "Guaranteed multi-Region recovery"],
        correctAnswer: "A stronger isolation and blast-radius boundary",
        explanation: "Accounts provide strong resource, quota, billing, and access boundaries when organised and governed correctly.",
        reviewLabel: "Multi-account strategy",
      },
    ],
  }),
  certificationUnit({
    id: "new-solutions",
    sequence: 2,
    title: "Design new solutions at enterprise scale",
    subtitle: "Translate complex global requirements into secure, reliable, and operable architectures.",
    principle: "A professional design makes consistency, regional independence, quotas, deployment, and operational ownership explicit.",
    goal: "Extend API Sandbox into a global learning platform without hiding multi-Region trade-offs.",
    concepts: ["multi-Region", "Route 53", "Global Accelerator", "Aurora Global Database", "DynamoDB global tables", "CloudFront", "Step Functions", "event-driven", "service quotas"],
    sections: [
      {
        title: "Start with recovery and consistency requirements",
        body: "Active-active, active-passive, pilot light, and backup/restore designs exchange cost and complexity for different RTO and RPO outcomes. Data-write topology and conflict behaviour usually determine whether a global design is credible.",
      },
      {
        title: "Separate synchronous and asynchronous boundaries",
        body: "Keep user-critical synchronous paths short, use durable events for work that can complete later, define idempotency and replay, and ensure regional dependencies do not silently undermine the intended failure boundary.",
      },
      {
        title: "Design deployment and quotas with the workload",
        body: "Plan service quotas, regional feature availability, certificate and DNS changes, schema compatibility, progressive delivery, rollback, observability, and support ownership before calling the architecture production-ready.",
      },
    ],
    scenario: {
      title: "Choose the global recovery posture",
      prompt: "API Sandbox can tolerate one hour of recovery time and five minutes of data loss. Cost matters more than continuous cross-Region writes. What is the strongest posture?",
      options: [
        { id: "warm-passive", label: "Use a tested passive or warm-standby Region sized to the stated RTO/RPO", consequence: "The design meets the recovery objective without paying the complexity premium of active-active writes." },
        { id: "active-active", label: "Use active-active writes in every Region regardless of need", consequence: "Conflict handling, deployment, data consistency, and cost exceed the stated recovery requirement." },
      ],
      trace: [
        { id: "objectives", label: "Set RTO and RPO", system: "Business continuity", detail: "One hour and five minutes constrain acceptable recovery mechanisms." },
        { id: "data", label: "Select replication", system: "Data architecture", detail: "Replication and backup cadence satisfy the data-loss objective." },
        { id: "capacity", label: "Choose standby capacity", system: "Compute", detail: "Warm capacity shortens recovery without serving all traffic continuously." },
        { id: "exercise", label: "Test failover", system: "Operations", detail: "A timed exercise verifies DNS, secrets, data, dependencies, and application health." },
      ],
    },
    assessmentTitle: "New solutions checkpoint",
    assessmentDescription: "Reason about global, event-driven, and operationally complete designs.",
    reflectionPrompt: "Compare active-active and warm-standby designs for API Sandbox using RTO, RPO, consistency, and cost.",
    questions: [
      {
        id: "rpo-definition",
        prompt: "What does recovery point objective describe?",
        options: ["The maximum acceptable data-loss window", "The maximum monthly invoice", "The HTTP request timeout", "The number of AWS accounts"],
        correctAnswer: "The maximum acceptable data-loss window",
        explanation: "RPO determines how far back in time recovery may need to go and drives replication or backup frequency.",
        reviewLabel: "Business continuity",
      },
      {
        id: "global-write-risk",
        prompt: "What must be explicit in a multi-Region active-active write design?",
        options: ["Conflict detection and resolution semantics", "Only the colour of the architecture diagram", "A single-AZ database", "Long-lived root credentials"],
        correctAnswer: "Conflict detection and resolution semantics",
        explanation: "Concurrent writes can conflict; the data model and business rules must define a deterministic outcome.",
        reviewLabel: "Global data architecture",
      },
      {
        id: "async-contract",
        prompt: "Which property is essential for replaying asynchronous work safely?",
        options: ["Idempotent processing", "An unlimited retry loop", "Public database access", "A disabled dead-letter queue"],
        correctAnswer: "Idempotent processing",
        explanation: "At-least-once delivery and operator replay can produce duplicates, so consumers must protect side effects.",
        reviewLabel: "Event-driven design",
      },
    ],
  }),
  certificationUnit({
    id: "continuous-improvement",
    sequence: 3,
    title: "Continuously improve existing solutions",
    subtitle: "Use evidence to evolve security, reliability, performance, operations, and cost.",
    principle: "Professional architecture is a continuous control loop: observe, prioritise, change safely, verify, and retain learning.",
    goal: "Run a Well-Architected improvement cycle and production game day for API Sandbox.",
    concepts: ["Well-Architected Tool", "CloudWatch", "X-Ray", "CloudTrail Lake", "Config", "Security Hub", "blue/green", "canary", "SLO", "error budget"],
    sections: [
      {
        title: "Prioritise from risk and evidence",
        body: "Combine Well-Architected findings, SLOs, incidents, security detections, cost allocation, dependency health, and customer outcomes. Rank improvements by exposure and value instead of upgrading services because they are newer.",
      },
      {
        title: "Change without expanding blast radius",
        body: "Use immutable artifacts, automated tests, progressive traffic shifts, backwards-compatible data changes, rollback criteria, and feature flags. A deployment strategy must protect both application and data compatibility.",
      },
      {
        title: "Game days convert assumptions into evidence",
        body: "Inject controlled failures, observe alarms and runbooks, measure recovery, record decision latency, and turn findings into owned work. Avoid experiments whose blast radius or stop conditions are not understood.",
      },
    ],
    scenario: {
      title: "Release a risky runtime change",
      prompt: "A new API Sandbox image changes authentication behaviour. How should production exposure increase?",
      options: [
        { id: "canary", label: "Use a small canary, monitor explicit auth/error metrics, then expand or roll back", consequence: "Progressive exposure limits blast radius and makes rollback evidence-driven." },
        { id: "all-at-once", label: "Replace every task and wait for customer reports", consequence: "The deployment maximises blast radius and delays detection until users experience the failure." },
      ],
      trace: [
        { id: "artifact", label: "Build one artifact", system: "CI/CD", detail: "The tested image is immutable across environments." },
        { id: "canary", label: "Shift small traffic", system: "Deployment controller", detail: "A limited target population receives the new version." },
        { id: "observe", label: "Evaluate guardrails", system: "CloudWatch", detail: "Authentication success, 4xx/5xx rates, latency, and business signals are compared." },
        { id: "decide", label: "Expand or roll back", system: "Runbook", detail: "Predefined thresholds determine the next action." },
      ],
    },
    assessmentTitle: "Continuous improvement checkpoint",
    assessmentDescription: "Prioritise, deliver, and verify architecture improvements safely.",
    reflectionPrompt: "Design a game day and progressive deployment for one high-risk API Sandbox change.",
    questions: [
      {
        id: "canary-purpose",
        prompt: "What is the principal benefit of a canary deployment?",
        options: ["It limits initial exposure while real signals are evaluated", "It removes the need for monitoring", "It guarantees database compatibility", "It grants IAM permissions"],
        correctAnswer: "It limits initial exposure while real signals are evaluated",
        explanation: "A canary reduces blast radius and supports evidence-based expansion or rollback.",
        reviewLabel: "Safe change",
      },
      {
        id: "config-purpose",
        prompt: "Which service evaluates AWS resource configuration against recorded rules?",
        options: ["AWS Config", "Amazon CloudFront", "Amazon SQS", "AWS Direct Connect"],
        correctAnswer: "AWS Config",
        explanation: "AWS Config records resource configuration and evaluates it against managed or custom rules.",
        reviewLabel: "Governance and compliance",
      },
      {
        id: "game-day-result",
        prompt: "What should a game day produce?",
        options: ["Measured findings, runbook improvements, and owned remediation", "Unbounded production disruption", "A claim that failure is impossible", "A list of services with no observations"],
        correctAnswer: "Measured findings, runbook improvements, and owned remediation",
        explanation: "Controlled experiments validate assumptions and turn gaps into accountable improvement work.",
        reviewLabel: "Operational improvement",
      },
    ],
  }),
  certificationUnit({
    id: "migration-modernization",
    sequence: 4,
    title: "Accelerate migration and modernisation",
    subtitle: "Discover dependencies, choose migration strategies, move data safely, and modernise where value justifies it.",
    principle: "Migration is a controlled business transition, not a bulk copy; waves, validation, rollback, and operating readiness matter as much as transfer speed.",
    goal: "Plan and rehearse the Vercel/Neon-to-AWS migration for API Sandbox.",
    concepts: ["Migration Hub", "Application Discovery Service", "Application Migration Service", "DMS", "DataSync", "Snow Family", "7 Rs", "waves", "cutover", "rollback"],
    sections: [
      {
        title: "Discover before sequencing",
        body: "Inventory applications, data, owners, dependencies, usage, compliance, and change windows. Group migration waves by dependency and risk rather than moving arbitrary resource lists together.",
      },
      {
        title: "Choose a strategy per component",
        body: "Retire, retain, relocate, rehost, replatform, repurchase, or refactor based on business value and constraint. API Sandbox can replatform its container to ECS and PostgreSQL to RDS while retaining external providers until later waves.",
      },
      {
        title: "Cutover needs proof and reversal",
        body: "Baseline data, rehearse transfer, validate counts and behaviour, control write ownership, lower DNS TTL when appropriate, monitor business signals, and preserve a time-bounded rollback path.",
      },
    ],
    scenario: {
      title: "Move the production database",
      prompt: "API Sandbox has a small PostgreSQL database and can accept a short maintenance window. Which initial migration approach is proportionate?",
      options: [
        { id: "dump-restore", label: "Rehearse pg_dump/restore, validate, then perform a controlled cutover", consequence: "The simple approach matches the database size and acceptable downtime while retaining a clear rollback window." },
        { id: "complex-dms", label: "Build a long-lived multi-account DMS topology regardless of need", consequence: "DMS may suit low-downtime or large migrations, but the scenario does not justify its added moving parts." },
      ],
      trace: [
        { id: "baseline", label: "Baseline source", system: "Migration plan", detail: "Schema, row counts, extensions, users, and performance are recorded." },
        { id: "rehearse", label: "Rehearse restore", system: "RDS target", detail: "Timing, compatibility, migrations, and application behaviour are validated." },
        { id: "cutover", label: "Control writes", system: "Maintenance window", detail: "Source writes pause while the final copy and validation complete." },
        { id: "switch", label: "Switch and observe", system: "Application configuration", detail: "Traffic moves to RDS with rollback criteria and monitoring active." },
      ],
    },
    assessmentTitle: "Migration and modernisation checkpoint",
    assessmentDescription: "Select migration strategies, services, waves, and cutover controls.",
    reflectionPrompt: "Write the migration wave plan, validation checks, and rollback trigger for moving API Sandbox to AWS.",
    questions: [
      {
        id: "replatform-definition",
        prompt: "Which migration strategy makes targeted platform changes without redesigning the whole application?",
        options: ["Replatform", "Retire", "Retain", "Repurchase"],
        correctAnswer: "Replatform",
        explanation: "Replatforming changes selected infrastructure or managed-service layers while preserving most application architecture.",
        reviewLabel: "Migration strategies",
      },
      {
        id: "dms-purpose",
        prompt: "What is AWS Database Migration Service designed to support?",
        options: ["Database migration and ongoing replication between supported engines", "Global static-content caching", "Workforce federation", "Container image scanning only"],
        correctAnswer: "Database migration and ongoing replication between supported engines",
        explanation: "DMS moves and replicates data, often alongside schema conversion or engine-specific preparation.",
        reviewLabel: "Migration services",
      },
      {
        id: "wave-order",
        prompt: "What should primarily determine migration-wave grouping?",
        options: ["Application dependencies, risk, and business timing", "Alphabetical resource names", "Random account order", "The largest instance type"],
        correctAnswer: "Application dependencies, risk, and business timing",
        explanation: "Waves should preserve dependency correctness and fit business, technical, and rollback constraints.",
        reviewLabel: "Migration planning",
      },
    ],
  }),
  certificationUnit({
    id: "professional-capstone-readiness",
    sequence: 5,
    title: "SAP-C02 enterprise capstone and readiness",
    subtitle: "Present a governed, global, continuously improved migration and operating model.",
    principle: "Professional readiness requires broad experience and architecture judgement under ambiguity; practice scores cannot substitute for operating complex systems.",
    goal: "Defend an enterprise API Sandbox platform and meet the professional external-experience gate.",
    concepts: ["multi-account", "multi-Region", "hybrid", "migration waves", "Well-Architected review", "game day", "executive brief", "two years experience"],
    sections: [
      {
        title: "The enterprise capstone",
        body: "Produce an organisation diagram, global recovery design, network model, security control map, migration wave plan, cost-allocation model, operating ownership matrix, deployment strategy, and improvement backlog. Run at least one timed recovery or game-day exercise.",
      },
      {
        title: "Independent review",
        body: "Have an experienced engineer challenge assumptions, failure domains, quotas, data consistency, deployment, incident response, cost, and migration reversal. Revise the design from evidence rather than defending the first answer.",
      },
      {
        title: "Professional readiness",
        body: "AWS targets candidates with two or more years designing and implementing cloud solutions. Complete official preparation and fresh timed mocks, but treat real migrations, incidents, governance decisions, and production trade-offs as required evidence rather than optional enrichment.",
      },
    ],
    scenario: {
      title: "Recommend the transformation programme",
      prompt: "Leadership wants global growth, lower operational risk, and controlled cost without a high-risk rewrite. What is the strongest recommendation?",
      options: [
        { id: "phased", label: "Use governed accounts, dependency-based migration waves, targeted replatforming, tested DR, and measured modernisation", consequence: "The programme reduces risk while creating evidence for each later investment." },
        { id: "rewrite", label: "Rewrite every component and migrate every account in one weekend", consequence: "The programme combines application, data, organisational, and operating-model risk into one irreversible event." },
      ],
      trace: [
        { id: "govern", label: "Establish the landing zone", system: "Organisation", detail: "Accounts, identity, guardrails, logging, and ownership exist before workload scale increases." },
        { id: "discover", label: "Discover and sequence", system: "Migration portfolio", detail: "Dependencies and business risk define migration waves." },
        { id: "migrate", label: "Replatform deliberately", system: "Workloads and data", detail: "Components move with rehearsed validation and rollback." },
        { id: "improve", label: "Optimise from evidence", system: "Well-Architected loop", detail: "Operations, game days, security, performance, and cost data drive modernisation." },
      ],
    },
    assessmentTitle: "SAP-C02 capstone checkpoint",
    assessmentDescription: "Integrate organisational complexity, new solutions, continuous improvement, and migration.",
    reflectionPrompt: "Deliver a five-minute architecture review explaining the transformation sequence and the risks deliberately deferred.",
    questions: [
      {
        id: "professional-signal",
        prompt: "What is the strongest SAP-C02 readiness signal?",
        options: ["Consistent fresh exam performance plus evidence from complex real or rigorously rehearsed AWS decisions", "Memorising one question bank", "Deploying one EC2 instance", "Holding Practitioner without further practice"],
        correctAnswer: "Consistent fresh exam performance plus evidence from complex real or rigorously rehearsed AWS decisions",
        explanation: "Professional scenarios require broad judgement built through architecture, migration, governance, and operating experience.",
        reviewLabel: "Professional readiness",
      },
      {
        id: "review-response",
        prompt: "What should happen when an independent architecture review exposes a flawed assumption?",
        options: ["Revise the design and record the decision", "Hide the finding", "Add unrelated services", "Remove monitoring"],
        correctAnswer: "Revise the design and record the decision",
        explanation: "Professional practice improves systems from evidence and retains why decisions changed.",
        reviewLabel: "Architecture review",
      },
      {
        id: "transformation-sequence",
        prompt: "Which transformation sequence best controls enterprise migration risk?",
        options: ["Govern and discover, migrate in waves, validate, then modernise from evidence", "Rewrite and cut over everything simultaneously", "Modernise before identifying owners", "Disable rollback to simplify the plan"],
        correctAnswer: "Govern and discover, migrate in waves, validate, then modernise from evidence",
        explanation: "A staged programme establishes control, reduces unknowns, preserves reversal, and separates migration from optional redesign risk.",
        reviewLabel: "Migration leadership",
      },
    ],
  }),
]

const cloudPractitionerCourse: LearningCourse = {
  id: AWS_CLOUD_PRACTITIONER_COURSE_ID,
  title: "AWS Certified Cloud Practitioner",
  description: "Build an accurate AWS mental model through API Sandbox: cloud value, security, services, operations, billing, and a foundational architecture capstone.",
  audience: "Learners building broad AWS literacy before a technical role-based certification.",
  masteryThreshold: AWS_CERTIFICATION_MASTERY_THRESHOLD,
  units: practitionerUnits,
}

const aiPractitionerCourse: LearningCourse = {
  id: AWS_AI_PRACTITIONER_COURSE_ID,
  title: "AWS Certified AI Practitioner",
  description: "Build practical AI and machine learning literacy through an AWS-powered learning assistant: fundamentals, generative AI, foundation-model applications, responsible AI, and governance.",
  audience: "Developers, product professionals, and technical practitioners building foundational AI fluency before a deeper ML or AI engineering role.",
  masteryThreshold: AWS_CERTIFICATION_MASTERY_THRESHOLD,
  units: aiPractitionerUnits,
}

const solutionsArchitectAssociateCourse: LearningCourse = {
  id: AWS_SOLUTIONS_ARCHITECT_ASSOCIATE_COURSE_ID,
  title: "AWS Certified Solutions Architect – Associate",
  description: "Design and prove a secure, resilient, high-performing, and cost-optimised AWS deployment of API Sandbox.",
  audience: "Developers and architects ready to make requirement-driven AWS design decisions.",
  masteryThreshold: AWS_CERTIFICATION_MASTERY_THRESHOLD,
  units: associateUnits,
}

const solutionsArchitectProfessionalCourse: LearningCourse = {
  id: AWS_SOLUTIONS_ARCHITECT_PROFESSIONAL_COURSE_ID,
  title: "AWS Certified Solutions Architect – Professional",
  description: "Evolve API Sandbox into a governed enterprise platform spanning organisational complexity, global solutions, continuous improvement, and migration.",
  audience: "Experienced AWS practitioners preparing to design and improve complex multi-account cloud estates.",
  masteryThreshold: AWS_CERTIFICATION_MASTERY_THRESHOLD,
  units: professionalUnits,
}

export const awsCertificationTracks: AwsCertificationTrack[] = [
  {
    slug: "practitioner",
    level: "Foundational",
    examCode: "CLF-C02",
    shortTitle: "Cloud Practitioner",
    description: "Understand AWS value, responsibility, services, operations, billing, and support.",
    audience: cloudPractitionerCourse.audience,
    examFormat: "65 questions · 90 minutes",
    experienceGuidance: "No prior AWS experience is required; console familiarity and basic labs make the concepts durable.",
    accent: "sky",
    officialExamGuideUrl: "https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html",
    officialPrepUrl: "https://aws.amazon.com/certification/certification-prep/",
    domains: [
      { id: "cloud-concepts", title: "Cloud Concepts", weight: 24, focus: ["cloud value", "global infrastructure", "AWS CAF", "economics"] },
      { id: "security", title: "Security and Compliance", weight: 30, focus: ["shared responsibility", "IAM", "compliance", "protection"] },
      { id: "technology", title: "Cloud Technology and Services", weight: 34, focus: ["compute", "storage", "database", "networking", "operations"] },
      { id: "billing", title: "Billing, Pricing, and Support", weight: 12, focus: ["cost tools", "pricing models", "support plans"] },
    ],
    readinessRequirements: [
      ...sharedReadinessRequirements,
      { id: "essentials", label: "AWS Cloud Practitioner Essentials completed", detail: "Finish the current AWS foundational digital course and revisit weak service families." },
      { id: "console", label: "Basic console and billing exploration completed", detail: "Locate Regions, IAM, Budgets, Cost Explorer, CloudWatch, and service documentation in a sandbox account." },
    ],
    capstone: "A one-page API Sandbox AWS proposal covering Region, service families, shared responsibility, cost controls, and support.",
    course: cloudPractitionerCourse,
  },
  {
    slug: "ai-practitioner",
    level: "Foundational",
    examCode: "AIF-C01",
    shortTitle: "AI Practitioner",
    description: "Understand AI, ML, generative AI, foundation-model applications, responsible AI, and AI security on AWS.",
    audience: aiPractitionerCourse.audience,
    examFormat: "65 questions · 90 minutes",
    experienceGuidance: "No prior AI or ML experience is required; basic AWS and software-development familiarity makes the examples easier to apply.",
    accent: "violet",
    officialExamGuideUrl: "https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01.html",
    officialPrepUrl: "https://aws.amazon.com/certification/certified-ai-practitioner/",
    domains: [
      { id: "ai-ml-fundamentals", title: "Fundamentals of AI and ML", weight: 20, focus: ["AI and ML concepts", "data", "model evaluation", "use cases"] },
      { id: "genai-fundamentals", title: "Fundamentals of GenAI", weight: 24, focus: ["foundation models", "tokens", "embeddings", "capabilities and limitations"] },
      { id: "foundation-models", title: "Applications of Foundation Models", weight: 28, focus: ["prompt engineering", "RAG", "fine-tuning", "evaluation"] },
      { id: "responsible-ai", title: "Guidelines for Responsible AI", weight: 14, focus: ["bias", "fairness", "transparency", "explainability"] },
      { id: "ai-security", title: "Security, Compliance, and Governance for AI Solutions", weight: 14, focus: ["data privacy", "access control", "guardrails", "auditability"] },
    ],
    readinessRequirements: [
      ...sharedReadinessRequirements,
      { id: "ai-use-cases", label: "AI and ML use cases mapped to business outcomes", detail: "Explain why classification, regression, clustering, and generative AI fit different requirements and error costs." },
      { id: "ai-safety-review", label: "Responsible AI review completed", detail: "Test representative prompts and data for bias, unsafe outputs, privacy exposure, prompt injection, and escalation behaviour." },
    ],
    capstone: "A grounded AWS learning assistant design using Amazon Bedrock, retrieval, scoped access, guardrails, evaluation evidence, and a responsible-AI review.",
    course: aiPractitionerCourse,
  },
  {
    slug: "associate",
    level: "Associate",
    examCode: "SAA-C03",
    shortTitle: "Solutions Architect Associate",
    description: "Design and deploy API Sandbox across the four SAA-C03 architecture domains.",
    audience: solutionsArchitectAssociateCourse.audience,
    examFormat: "65 questions · 130 minutes",
    experienceGuidance: "AWS recommends about one year of hands-on experience designing cloud solutions, though experienced IT practitioners may use this as an entry path.",
    accent: "orange",
    officialExamGuideUrl: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html",
    officialPrepUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    domains: [
      { id: "secure", title: "Design Secure Architectures", weight: 30, focus: ["identity", "workload security", "data protection"] },
      { id: "resilient", title: "Design Resilient Architectures", weight: 26, focus: ["loose coupling", "high availability", "recovery"] },
      { id: "performance", title: "Design High-Performing Architectures", weight: 24, focus: ["compute", "storage", "database", "networking"] },
      { id: "cost", title: "Design Cost-Optimised Architectures", weight: 20, focus: ["storage", "compute", "database", "network cost"] },
    ],
    readinessRequirements: [
      ...sharedReadinessRequirements,
      { id: "api-sandbox-deploy", label: "API Sandbox AWS capstone deployed and tested", detail: "Provide IaC, deployment, health, observability, cost, failure-injection, and restore evidence." },
      { id: "second-style", label: "A separate serverless workload completed", detail: "Build API Gateway, Lambda, DynamoDB, and an event-driven path so the container capstone does not define every answer." },
      { id: "adrs", label: "Six architecture decisions defended", detail: "Cover compute, database, network, cache, asynchronous work, and recovery with rejected alternatives." },
    ],
    capstone: "A two-AZ ECS/RDS deployment with CloudFront/WAF, SQS/DLQ, Secrets Manager, CloudWatch, IaC, failure injection, and restore evidence.",
    course: solutionsArchitectAssociateCourse,
  },
  {
    slug: "professional",
    level: "Professional",
    examCode: "SAP-C02",
    shortTitle: "Solutions Architect Professional",
    description: "Design API Sandbox as a governed, global enterprise platform and migration programme.",
    audience: solutionsArchitectProfessionalCourse.audience,
    examFormat: "75 questions · 180 minutes",
    experienceGuidance: "AWS targets candidates with two or more years designing and implementing AWS cloud solutions.",
    accent: "violet",
    officialExamGuideUrl: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-professional-02/solutions-architect-professional-02.html",
    officialPrepUrl: "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
    domains: [
      { id: "organization", title: "Design Solutions for Organisational Complexity", weight: 26, focus: ["multi-account", "governance", "identity", "shared services"] },
      { id: "new", title: "Design for New Solutions", weight: 29, focus: ["global architecture", "resilience", "security", "operations"] },
      { id: "improve", title: "Continuous Improvement for Existing Solutions", weight: 25, focus: ["observability", "safe change", "optimisation", "game days"] },
      { id: "migration", title: "Accelerate Migration and Modernisation", weight: 20, focus: ["discovery", "migration waves", "data transfer", "modernisation"] },
    ],
    readinessRequirements: [
      ...sharedReadinessRequirements,
      { id: "experience", label: "Complex AWS experience evidenced", detail: "Record multi-account, migration, incident, governance, or production architecture decisions; mocks do not replace experience." },
      { id: "enterprise-capstone", label: "Enterprise capstone independently reviewed", detail: "An experienced engineer challenges failure domains, consistency, quotas, security, operations, cost, and rollback." },
      { id: "recovery", label: "A timed multi-Region recovery or game day completed", detail: "Validate data, DNS, identity, dependencies, application health, runbooks, RTO, and RPO." },
      { id: "portfolio", label: "Three different workload architectures reviewed", detail: "Demonstrate judgement beyond API Sandbox across different data, traffic, organisational, and migration constraints." },
    ],
    capstone: "A multi-account, multi-Region API Sandbox platform with governance, migration waves, tested recovery, progressive delivery, cost allocation, and an improvement backlog.",
    course: solutionsArchitectProfessionalCourse,
  },
]

export const awsCertificationCourses: Record<string, LearningCourse> = Object.fromEntries(
  awsCertificationTracks.map((track) => [track.course.id, track.course]),
)

export function getAwsCertificationTrack(slug: string): AwsCertificationTrack | null {
  return awsCertificationTracks.find((track) => track.slug === slug) ?? null
}

export function getAwsCertificationTrackForCourse(courseId: string): AwsCertificationTrack | null {
  return awsCertificationTracks.find((track) => track.course.id === courseId) ?? null
}
