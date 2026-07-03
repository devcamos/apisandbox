import { NextResponse } from "next/server";

function invalidBodyResponse(error: unknown) {
  const detail = error instanceof Error ? error.message : "Invalid request body";
  return NextResponse.json({ error: detail }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trafficGB, computeHours, strategy, region = "us-east-1" } = body;

    // Mock cost calculation
    const baseComputeCost = computeHours * 0.1; // $0.10 per hour
    const baseStorageCost = trafficGB * 0.023; // $0.023 per GB
    const baseDataTransferCost = trafficGB * 0.09; // $0.09 per GB

    let strategyMultiplier = 1;
    if (strategy === "refactor") {
      strategyMultiplier = 0.7; // 30% cost reduction
    } else if (strategy === "replatform") {
      strategyMultiplier = 0.85; // 15% cost reduction
    }

    const totalCost = Math.round(
      (baseComputeCost + baseStorageCost + baseDataTransferCost) * strategyMultiplier
    );

    const breakdown = {
      compute: Math.round(baseComputeCost * strategyMultiplier),
      storage: Math.round(baseStorageCost * strategyMultiplier),
      dataTransfer: Math.round(baseDataTransferCost * strategyMultiplier),
      total: totalCost
    };

    return NextResponse.json({
      estimatedMonthlyCost: totalCost,
      breakdown,
      currency: "USD",
      region,
      note: "This is an estimate. Actual costs may vary based on usage patterns and AWS pricing."
    });
  } catch (error) {
    return invalidBodyResponse(error);
  }
}
