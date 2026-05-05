import { Resend } from "resend"

if (!process.env.RESEND_API_KEY && process.env.NODE_ENV === "production") {
  throw new Error("RESEND_API_KEY is required in production")
}

const resend = new Resend(process.env.RESEND_API_KEY ?? "")

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "API Sandbox <noreply@apisandbox.dev>"

export async function sendWelcomeEmail(to: string, name?: string) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Welcome to API Sandbox",
    html: `
      <h1>Welcome${name ? `, ${name}` : ""}!</h1>
      <p>Thanks for signing up to API Sandbox. You now have access to our free learning phases.</p>
      <p>Ready to unlock all interactive visualizers, exercises, and guided practice?</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/upgrade">Upgrade to Premium — £5/month</a></p>
    `,
  })
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Verify your email — API Sandbox",
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email address:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  })
}

export async function sendSubscriptionConfirmation(to: string) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "You're now Premium — API Sandbox",
    html: `
      <h1>Welcome to Premium!</h1>
      <p>Your subscription is active. You now have full access to all phases, interactive visualizers, and guided exercises.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/phase-2">Start with Phase 2 →</a></p>
      <p>Manage your billing anytime from your <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings">settings page</a>.</p>
    `,
  })
}

export async function sendSubscriptionCancelled(to: string, endsAt: Date) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Your subscription has been cancelled — API Sandbox",
    html: `
      <h1>Subscription cancelled</h1>
      <p>Your Premium access will remain active until ${endsAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</p>
      <p>You can resubscribe anytime from the <a href="${process.env.NEXT_PUBLIC_APP_URL}/upgrade">upgrade page</a>.</p>
    `,
  })
}
