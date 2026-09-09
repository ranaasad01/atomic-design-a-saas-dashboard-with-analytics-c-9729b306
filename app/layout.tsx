import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: {
    default: "Nexus Analytics — SaaS Intelligence Platform",
    template: "%s | Nexus Analytics",
  },
  description:
    "Monitor revenue, user growth, and engagement in real time. Nexus Analytics gives your team a single source of truth for every business metric that matters.",
  keywords: ["analytics", "SaaS", "dashboard", "MRR", "user growth", "business intelligence"],
  authors: [{ name: "Nexus Analytics" }],
  openGraph: {
    title: "Nexus Analytics — SaaS Intelligence Platform",
    description: "Real-time analytics for modern SaaS teams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased min-h-screen flex flex-col">
        <LocaleProvider>
          <LanguageToggle />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}