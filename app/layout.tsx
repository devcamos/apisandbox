import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { DemoSessionBanner } from "@/components/DemoSessionBanner";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "API Sandbox — Learn API Development Interactively",
  description:
    "Master API integrations, algorithms, and architecture patterns through interactive visualisers and guided practice. Free to start, £5/month for full access.",
  openGraph: {
    title: "API Sandbox — Learn API Development Interactively",
    description:
      "Master API integrations, algorithms, and architecture patterns through interactive visualisers and guided practice.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <SessionProvider>
          <Navigation />
          <DemoSessionBanner />
          <main className="min-h-screen">
            {children}
          </main>
          <CookieConsent />
          <AnalyticsProvider />
          <footer className="border-t border-slate-800 py-8 px-6">
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
              <span>© {new Date().getFullYear()} API Sandbox</span>
              <div className="flex items-center gap-6">
                <a href="/terms" className="hover:text-gray-300 transition-colors">Terms</a>
                <a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</a>
                <a href="/upgrade" className="hover:text-gray-300 transition-colors">Pricing</a>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}

