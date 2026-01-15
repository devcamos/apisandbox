import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "web-app";

  const templates = {
    "web-app": {
      name: "Web Application",
      description: "Standard web application architecture",
      services: [
        { name: "EC2", role: "Application servers", count: 2 },
        { name: "RDS", role: "Database", count: 1 },
        { name: "S3", role: "Static assets", count: 1 },
        { name: "CloudWatch", role: "Monitoring", count: 1 }
      ],
      diagram: "EC2 → RDS, S3 → CloudFront → Users"
    },
    "serverless": {
      name: "Serverless Application",
      description: "Serverless architecture with Lambda",
      services: [
        { name: "Lambda", role: "Compute", count: 5 },
        { name: "API Gateway", role: "API layer", count: 1 },
        { name: "DynamoDB", role: "Database", count: 1 },
        { name: "S3", role: "Storage", count: 1 }
      ],
      diagram: "Users → API Gateway → Lambda → DynamoDB"
    },
    "microservices": {
      name: "Microservices",
      description: "Microservices architecture",
      services: [
        { name: "ECS/EKS", role: "Container orchestration", count: 1 },
        { name: "RDS", role: "Databases", count: 3 },
        { name: "S3", role: "Object storage", count: 1 },
        { name: "CloudWatch", role: "Monitoring", count: 1 }
      ],
      diagram: "Load Balancer → ECS Services → RDS (multiple)"
    }
  };

  const template = templates[type as keyof typeof templates] || templates["web-app"];

  return NextResponse.json(template);
}

