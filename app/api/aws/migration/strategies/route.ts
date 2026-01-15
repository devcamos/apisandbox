import { NextResponse } from "next/server";

export async function GET() {
  const strategies = [
    {
      id: "lift-shift",
      name: "Lift & Shift (Rehost)",
      description: "Move applications to cloud with minimal changes",
      timeline: "1-3 months",
      cost: "Low",
      risk: "Low",
      bestFor: ["Legacy applications", "Quick migration needs", "When minimal changes are required"],
      pros: ["Fastest migration", "Low risk", "Minimal code changes"],
      cons: ["May not optimize costs", "Limited cloud benefits"]
    },
    {
      id: "replatform",
      name: "Re-platform (Replatform)",
      description: "Move to cloud with some optimizations",
      timeline: "3-6 months",
      cost: "Medium",
      risk: "Medium",
      bestFor: ["Applications needing optimization", "When cost savings are important"],
      pros: ["Better cost optimization", "Improved performance", "Some cloud-native benefits"],
      cons: ["More time required", "Some code changes needed"]
    },
    {
      id: "refactor",
      name: "Refactor (Re-architect)",
      description: "Redesign for cloud-native architecture",
      timeline: "6-12 months",
      cost: "High",
      risk: "High",
      bestFor: ["Long-term cloud strategy", "When maximum benefits needed"],
      pros: ["Maximum cloud benefits", "Best performance", "Optimal cost structure"],
      cons: ["Most time-consuming", "Requires significant changes"]
    }
  ];

  return NextResponse.json(strategies);
}

