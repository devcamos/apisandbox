import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { getStripeClient } from "@/lib/stripe"
import { logger } from "@/lib/logger"
import { dispatchStripeWebhookEvent } from "@/lib/stripe-webhook-handlers"
import {
  claimStripeWebhookEvent,
  completeStripeWebhookEvent,
  failStripeWebhookEvent,
} from "@/lib/stripe-webhook-idempotency"

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!webhookSecret) {
    logger.error("STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 })
  }

  const stripe = getStripeClient()
  if (!stripe) {
    logger.error("Stripe webhook: STRIPE_SECRET_KEY not set")
    return NextResponse.json({ error: "Billing not configured" }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    logger.error({ err }, "Stripe webhook signature verification failed")
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  logger.info({ type: event.type, id: event.id }, "Stripe webhook received")

  let claimed: boolean
  try {
    claimed = await claimStripeWebhookEvent(event.id, event.type)
  } catch (err) {
    logger.error({ err, eventId: event.id }, "Could not claim Stripe webhook event")
    return NextResponse.json({ error: "Webhook handler unavailable" }, { status: 500 })
  }
  if (!claimed) {
    logger.info({ type: event.type, id: event.id }, "Stripe webhook already processed")
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    await dispatchStripeWebhookEvent(event)
    await completeStripeWebhookEvent(event.id)
  } catch (err) {
    await failStripeWebhookEvent(event.id, err).catch((recordError) => {
      logger.error({ err: recordError, eventId: event.id }, "Could not record Stripe webhook failure")
    })
    logger.error({ err, eventType: event.type }, "Error processing webhook")
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
