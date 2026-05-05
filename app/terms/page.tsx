import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service — API Sandbox",
  description: "Terms and conditions for using API Sandbox.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <Link
          href="/"
          className="text-sm text-violet-400 hover:text-violet-300 mb-8 inline-block"
        >
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: May 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Service Description</h2>
            <p className="text-gray-300">
              API Sandbox is an interactive learning platform that teaches API development,
              integration patterns, and software engineering fundamentals through guided
              phases, exercises, and visualisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. Accounts</h2>
            <p className="text-gray-300">
              You may browse free content without an account. To access Premium content,
              you must create an account with a valid email address. You are responsible
              for maintaining the security of your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. Subscriptions and Payment</h2>
            <p className="text-gray-300">
              Premium access is available for £5 per month, billed monthly via Stripe.
              Your subscription renews automatically each month until cancelled.
              You may cancel at any time through the billing portal — access continues
              until the end of your current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. Refunds</h2>
            <p className="text-gray-300">
              We offer a full refund within 7 days of your first subscription payment if
              you are not satisfied. After this period, no refunds are provided for partial
              months. Contact us at support@apisandbox.dev for refund requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. Acceptable Use</h2>
            <p className="text-gray-300">You agree not to:</p>
            <ul className="text-gray-300 list-disc pl-5 space-y-1">
              <li>Share your account credentials with others</li>
              <li>Scrape, copy, or redistribute platform content</li>
              <li>Attempt to circumvent subscription restrictions</li>
              <li>Use automated tools to access the service in violation of rate limits</li>
              <li>Interfere with the operation of the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. Intellectual Property</h2>
            <p className="text-gray-300">
              All content, code examples, visualisers, and educational materials are
              owned by API Sandbox. You may use code examples in your own projects but
              may not redistribute the educational content itself.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Limitation of Liability</h2>
            <p className="text-gray-300">
              API Sandbox is provided &ldquo;as is&rdquo; without warranty. We are not liable for
              any indirect, incidental, or consequential damages arising from your use
              of the service. Our total liability is limited to the amount you have paid
              us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Termination</h2>
            <p className="text-gray-300">
              We may suspend or terminate your account if you violate these terms. You
              may delete your account at any time by contacting support. Upon termination,
              your access to Premium content ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">9. Changes to Terms</h2>
            <p className="text-gray-300">
              We may update these terms from time to time. Material changes will be
              communicated via email to registered users. Continued use of the service
              after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">10. Governing Law</h2>
            <p className="text-gray-300">
              These terms are governed by the laws of England and Wales. Disputes shall
              be resolved in the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p className="text-gray-300">
              Questions about these terms? Email us at{" "}
              <a href="mailto:support@apisandbox.dev" className="text-violet-400 hover:text-violet-300">
                support@apisandbox.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
