import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "API Integration Training",
  description: "Master API integrations from fundamentals to principal-level architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}

