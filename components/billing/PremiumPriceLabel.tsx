"use client"

import { useEffect, useState } from "react"
import {
  PREMIUM_PRICE_FALLBACK_PENCE,
  formatMoneyFromMinorUnits,
  PREMIUM_PRICE_FALLBACK_CURRENCY,
} from "@/lib/premium-pricing"

type PriceState = {
  formatted: string
  amountPence: number
  ready: boolean
}

const fallbackFormatted = formatMoneyFromMinorUnits(
  PREMIUM_PRICE_FALLBACK_PENCE,
  PREMIUM_PRICE_FALLBACK_CURRENCY,
)

/**
 * Renders the Premium plan price from GET /api/billing/price so UI matches
 * the configured Stripe Price (with a local £2 fallback while loading / offline).
 */
export function PremiumPriceLabel({
  className,
  suffix,
}: Readonly<{ className?: string; suffix?: string }>) {
  const [price, setPrice] = useState<PriceState>({
    formatted: fallbackFormatted,
    amountPence: PREMIUM_PRICE_FALLBACK_PENCE,
    ready: false,
  })

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/billing/price", { credentials: "same-origin" })
        if (!res.ok) return
        const body = (await res.json()) as {
          success?: boolean
          data?: { formatted?: string; amountPence?: number }
        }
        if (cancelled || !body.success || !body.data?.formatted) return
        setPrice({
          formatted: body.data.formatted,
          amountPence:
            typeof body.data.amountPence === "number"
              ? body.data.amountPence
              : PREMIUM_PRICE_FALLBACK_PENCE,
          ready: true,
        })
      } catch {
        /* keep fallback */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <span className={className} data-testid="premium-price" data-ready={price.ready ? "1" : "0"}>
      {price.formatted}
      {suffix ?? null}
    </span>
  )
}

export function usePremiumPriceLabel(): PriceState {
  const [price, setPrice] = useState<PriceState>({
    formatted: fallbackFormatted,
    amountPence: PREMIUM_PRICE_FALLBACK_PENCE,
    ready: false,
  })

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/billing/price", { credentials: "same-origin" })
        if (!res.ok) return
        const body = (await res.json()) as {
          success?: boolean
          data?: { formatted?: string; amountPence?: number }
        }
        if (cancelled || !body.success || !body.data?.formatted) return
        setPrice({
          formatted: body.data.formatted,
          amountPence:
            typeof body.data.amountPence === "number"
              ? body.data.amountPence
              : PREMIUM_PRICE_FALLBACK_PENCE,
          ready: true,
        })
      } catch {
        /* keep fallback */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return price
}
