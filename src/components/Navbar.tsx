"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, User, Sparkles } from "lucide-react";

const TICKERS = [
  { symbol: "AAPL", price: "224.50", change: "+1.24%", up: true },
  { symbol: "MSFT", price: "415.80", change: "+0.83%", up: true },
  { symbol: "TSLA", price: "248.10", change: "-0.48%", up: false },
  { symbol: "NVDA", price: "128.40", change: "+2.15%", up: true },
  { symbol: "META", price: "512.90", change: "+1.42%", up: true },
  { symbol: "GOOGL", price: "189.60", change: "-0.21%", up: false },
  { symbol: "AMZN", price: "194.30", change: "+0.67%", up: true },
  { symbol: "NFLX", price: "728.50", change: "+1.89%", up: true },
  { symbol: "AMD",  price: "164.20", change: "-0.93%", up: false },
  { symbol: "SPY",  price: "567.40", change: "+0.41%", up: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 flex flex-col"
      style={{
        background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* Main Nav Row */}
      <div className="flex items-center justify-between px-6 h-[60px]">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group" style={{ textDecoration: "none" }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #6366F1)",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
            }}
          >
            <Sparkles className="w-4.5 h-4.5" style={{ color: "white", width: 18, height: 18 }} />
          </div>
          <div className="flex flex-col leading-none">
            <span style={{ fontSize: 16, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
              InvestIQ
            </span>
            <span style={{ fontSize: 9, color: "#9CA3AF", letterSpacing: "0.08em", fontWeight: 500 }}>
              AI INVESTMENT INTELLIGENCE
            </span>
          </div>
        </Link>

        {/* Center: Ticker Tape */}
        <div className="hidden md:flex flex-1 mx-8 overflow-hidden relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, rgba(255,255,255,0.95), transparent)" }}
          />
          <div className="overflow-hidden flex-1">
            <div className="ticker-tape">
              {[...TICKERS, ...TICKERS].map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 mx-4"
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  <span style={{ color: "#111827", fontWeight: 600 }}>{t.symbol}</span>
                  <span style={{ color: "#6B7280" }}>{t.price}</span>
                  <span
                    className="flex items-center gap-0.5"
                    style={{ color: t.up ? "#16A34A" : "#EF4444", fontWeight: 600 }}
                  >
                    {t.up ? <TrendingUp style={{ width: 12, height: 12 }} /> : <TrendingDown style={{ width: 12, height: 12 }} />}
                    {t.change}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div
            className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, rgba(255,255,255,0.95), transparent)" }}
          />
        </div>

        {/* Right: Market Status + Profile */}
        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(22, 163, 74, 0.08)",
              border: "1px solid rgba(22, 163, 74, 0.2)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "#16A34A",
                boxShadow: "0 0 0 3px rgba(22,163,74,0.2)",
                animation: "pulse-ring 2.5s infinite",
              }}
            />
            <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 700, letterSpacing: "0.05em" }}>
              MARKET OPEN
            </span>
          </div>

          <button
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "rgba(124, 58, 237, 0.07)",
              border: "1px solid rgba(124, 58, 237, 0.15)",
            }}
          >
            <User style={{ width: 16, height: 16, color: "#7C3AED" }} />
          </button>
        </div>
      </div>
    </header>
  );
}
