import Link from "next/link"
import AuthPageShell from "@/components/auth/AuthPageShell"

export const dynamic = "force-dynamic"

/**
 * Minimal recovery page for the login "Forgot password?" link.
 * Full email-based reset is out of scope for this PR; this page explains
 * options and stops the previous 404.
 */
export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="Reset password"
      subtitle="Email reset is not available yet — here is how to get back in"
    >
      <div className="space-y-5 text-sm text-gray-300" data-testid="forgot-password-page">
        <p>
          Automated password-reset email is not wired up on this deployment. Until
          it is, use one of these paths:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-gray-300">
          <li>
            If you signed up with <strong className="text-white">Google</strong>,
            return to sign-in and use Continue with Google — no password is required.
          </li>
          <li>
            If you only used the <strong className="text-white">demo</strong>, create a
            free account from inside the demo (or sign up fresh) to keep Phase 1
            progress when you claim the session.
          </li>
          <li>
            For an existing email/password account you cannot access, email{" "}
            <a
              href="mailto:support@apisandbox.dev"
              className="text-blue-400 hover:text-blue-300"
            >
              support@apisandbox.dev
            </a>{" "}
            from the address on the account and ask for a reset.
          </li>
        </ul>
        <p className="text-xs text-gray-400">
          Tip: after 5 failed sign-in attempts an account locks for 30 minutes.
          Waiting out the lock is often enough if you then enter the correct password.
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white hover:shadow-lg"
          >
            Back to sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-600 bg-slate-900/40 px-4 py-3 text-center text-sm font-semibold text-slate-100 hover:bg-slate-800/60"
          >
            Create an account
          </Link>
        </div>
      </div>
    </AuthPageShell>
  )
}
