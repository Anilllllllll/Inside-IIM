import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InvestIQ — AI Investment Research Agent",
  description:
    "Multi-agent AI system that researches companies, analyzes risk, runs adversarial bull vs bear debates, and generates professional investment decisions.",
  keywords: ["AI investment research", "stock analysis", "LangGraph", "financial AI"],
  openGraph: {
    title: "InvestIQ — AI Investment Research Agent",
    description: "Institutional-grade AI stock research powered by multi-agent LangGraph.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
