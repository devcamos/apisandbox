import { NextResponse } from "next/server";

export async function GET() {
  const services = [
    {
      id: "ec2",
      name: "EC2",
      category: "Compute",
      description: "Virtual servers in the cloud",
      useCases: ["Web applications", "Application servers", "Development environments"],
      pricing: "Pay per hour/second"
    },
    {
      id: "s3",
      name: "S3",
      category: "Storage",
      description: "Object storage for any amount of data",
      useCases: ["File storage", "Backups", "Static website hosting"],
      pricing: "Pay per GB stored and transferred"
    },
    {
      id: "rds",
      name: "RDS",
      category: "Database",
      description: "Managed relational database service",
      useCases: ["Web applications", "E-commerce", "Enterprise applications"],
      pricing: "Pay per instance hour"
    },
    {
      id: "lambda",
      name: "Lambda",
      category: "Compute",
      description: "Serverless compute service",
      useCases: ["API backends", "Data processing", "Scheduled tasks"],
      pricing: "Pay per request and compute time"
    },
    {
      id: "api-gateway",
      name: "API Gateway",
      category: "Integration",
      description: "Fully managed API service",
      useCases: ["REST APIs", "Microservices", "Mobile backends"],
      pricing: "Pay per API call"
    },
    {
      id: "cloudwatch",
      name: "CloudWatch",
      category: "Monitoring",
      description: "Monitoring and observability service",
      useCases: ["Application monitoring", "Log management", "Alerting"],
      pricing: "Pay per metric and log data"
    }
  ];

  return NextResponse.json(services);
}

