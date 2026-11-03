import { NextResponse, type NextRequest } from "next/server";
import { withPremiumApiAccess } from "@/lib/http/premium-api-guard";
import { awsToolsLimiter } from "@/lib/rate-limit";

function invalidBodyResponse(error: unknown) {
  const detail = error instanceof Error ? error.message : "Invalid request body";
  return NextResponse.json({ error: detail }, { status: 400 });
}

async function handlePOST(request: Request) {
  try {
    const body = await request.json();
    const { appType, complexity } = body;

    // Mock analysis logic
    let recommendedStrategy = "lift-shift";
    let confidence = 0.7;
    let estimatedCost = 100;
    let estimatedTime = "1-3 months";

    if (complexity === "high" && appType === "modern") {
      recommendedStrategy = "refactor";
      confidence = 0.8;
      estimatedCost = 500;
      estimatedTime = "6-12 months";
    } else if (complexity === "medium") {
      recommendedStrategy = "replatform";
      confidence = 0.75;
      estimatedCost = 250;
      estimatedTime = "3-6 months";
    }

    const analysis = {
      recommendedStrategy,
      confidence,
      estimatedCost,
      estimatedTime,
      recommendations: [
        "Start with a proof of concept",
        "Set up proper monitoring from day one",
        "Implement cost optimization strategies",
        "Plan for security and compliance"
      ],
      risks: [
        "Data migration complexity",
        "Downtime during migration",
        "Team learning curve"
      ]
    };

    return NextResponse.json(analysis);
  } catch (error) {
    return invalidBodyResponse(error);
  }
}

const guard = { phase: "cloud" as const, limiter: awsToolsLimiter, bucket: "aws-tools" }

export async function POST(request: NextRequest) {
  return withPremiumApiAccess(request, guard, () => handlePOST(request))
}
