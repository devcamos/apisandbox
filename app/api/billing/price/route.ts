import { NextResponse } from "next/server"
import { resolvePremiumPricing } from "@/lib/premium-pricing"

/** Public Premium price for marketing / upgrade UI (matches Stripe when configured). */
export async function GET() {
  const pricing = await resolvePremiumPricing()
  return NextResponse.json(
    {
      success: true,
      data: {
        amountPence: pricing.amountPence,
        currency: pricing.currency,
        interval: pricing.interval,
        formatted: pricing.formatted,
        source: pricing.source,
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  )
}
