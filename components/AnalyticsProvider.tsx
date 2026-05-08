"use client"

import { Analytics } from "@vercel/analytics/react"
import { useEffect, useState } from "react"
import { hasAnalyticsConsent } from "./CookieConsent"

export function AnalyticsProvider() {
  const [consented, setConsented] = useState(false)
  const analyticsEnabled =
    process.env.NEXT_PUBLIC_FF_ANALYTICS === "true"

  useEffect(() => {
    setConsented(hasAnalyticsConsent())
  }, [])

  if (!analyticsEnabled || !consented) return null

  return <Analytics />
}
