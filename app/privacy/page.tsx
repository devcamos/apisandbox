import { Metadata } from "next"
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout"

export const metadata: Metadata = {
  title: "Privacy Policy — API Sandbox",
  description: "How API Sandbox collects, uses, and protects your data.",
}

export default function PrivacyPage() {
  return (
    <LegalDocumentLayout title="Privacy Policy">
      <section>
        <h2 className="text-xl font-semibold text-white">1. Data We Collect</h2>
        <p className="text-gray-300">When you use API Sandbox, we may collect:</p>
        <ul className="text-gray-300 list-disc pl-5 space-y-1">
          <li><strong>Account data:</strong> email address, name (optional), password hash</li>
          <li><strong>Progress data:</strong> quiz scores, phase completion, XP earned</li>
          <li><strong>Payment data:</strong> processed securely by Stripe — we never store card details</li>
          <li><strong>Usage data:</strong> pages visited, features used (via Vercel Analytics)</li>
          <li><strong>Technical data:</strong> IP address, browser type, device (for security and rate limiting)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">2. How We Use Your Data</h2>
        <ul className="text-gray-300 list-disc pl-5 space-y-1">
          <li>Provide and maintain the learning platform</li>
          <li>Track your progress across phases and exercises</li>
          <li>Process payments and manage subscriptions</li>
          <li>Send transactional emails (verification, subscription updates)</li>
          <li>Protect against abuse (rate limiting, fraud prevention)</li>
          <li>Improve the platform based on aggregate usage patterns</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">3. Data Storage and Security</h2>
        <p className="text-gray-300">
          Your data is stored in a PostgreSQL database hosted on Vercel infrastructure.
          Passwords are hashed with bcrypt and never stored in plain text. All
          connections use TLS encryption. Payment processing is handled entirely by
          Stripe (PCI DSS Level 1 compliant).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">4. Third-Party Services</h2>
        <ul className="text-gray-300 list-disc pl-5 space-y-1">
          <li>
            <strong>Stripe:</strong> payment processing (see{" "}
            <a
              href="https://stripe.com/privacy"
              className="text-violet-400 hover:text-violet-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Privacy Policy
            </a>{" "}
            )
          </li>
          <li>
            <strong>Vercel:</strong> hosting and analytics (see{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              className="text-violet-400 hover:text-violet-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel Privacy Policy
            </a>{" "}
            )
          </li>
          <li><strong>Resend:</strong> transactional email delivery</li>
          <li><strong>Upstash:</strong> rate limiting infrastructure</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">5. Data Retention</h2>
        <p className="text-gray-300">
          We retain your account and progress data for as long as your account is active.
          If you delete your account, we remove your personal data within 30 days.
          Anonymised, aggregate analytics data may be retained indefinitely.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">6. Your Rights (GDPR)</h2>
        <p className="text-gray-300">If you are in the UK or EU, you have the right to:</p>
        <ul className="text-gray-300 list-disc pl-5 space-y-1">
          <li><strong>Access:</strong> request a copy of all data we hold about you</li>
          <li><strong>Rectification:</strong> correct inaccurate personal data</li>
          <li><strong>Erasure:</strong> request deletion of your personal data</li>
          <li><strong>Portability:</strong> receive your data in a structured, machine-readable format</li>
          <li><strong>Objection:</strong> object to processing based on legitimate interests</li>
          <li><strong>Restriction:</strong> request we limit how we use your data</li>
        </ul>
        <p className="text-gray-300 mt-2">
          To exercise any of these rights, email{" "}
          <a href="mailto:privacy@apisandbox.dev" className="text-violet-400 hover:text-violet-300">
            privacy@apisandbox.dev
          </a>
          . We will respond within 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">7. Cookies</h2>
        <p className="text-gray-300">We use:</p>
        <ul className="text-gray-300 list-disc pl-5 space-y-1">
          <li><strong>Essential cookies:</strong> session authentication (required for the app to function)</li>
          <li><strong>Analytics cookies:</strong> Vercel Analytics for page view tracking (only with your consent)</li>
        </ul>
        <p className="text-gray-300 mt-2">
          We do not use advertising or tracking cookies. You can manage cookie
          preferences via the consent banner shown on your first visit.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">8. Children</h2>
        <p className="text-gray-300">
          API Sandbox is not directed at children under 16. We do not knowingly
          collect data from children. If you believe a child has provided us with
          personal data, please contact us to have it removed.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">9. Changes to This Policy</h2>
        <p className="text-gray-300">
          We may update this privacy policy from time to time. Changes will be posted
          on this page with an updated date. Material changes will be communicated
          via email.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Contact</h2>
        <p className="text-gray-300">
          Data protection enquiries:{" "}
          <a href="mailto:privacy@apisandbox.dev" className="text-violet-400 hover:text-violet-300">
            privacy@apisandbox.dev
          </a>
        </p>
      </section>
    </LegalDocumentLayout>
  )
}
