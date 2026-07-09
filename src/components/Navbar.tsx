"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, TrendingDown, User } from "lucide-react";

const TICKERS = [
  { symbol: "AAPL", change: "+1.24%", up: true },
  { symbol: "MSFT", change: "+0.83%", up: true },
  { symbol: "TSLA", change: "-0.48%", up: false },
  { symbol: "NVDA", change: "+2.15%", up: true },
  { symbol: "META", change: "+1.42%", up: true },
  { symbol: "GOOGL", change: "-0.21%", up: false },
  { symbol: "AMZN", change: "+0.67%", up: true },
  { symbol: "NFLX", change: "+1.89%", up: true },
  { symbol: "AMD", change: "-0.93%", up: false },
  { symbol: "SPY", change: "+0.41%", up: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 flex flex-col"
      style={{
        background: scrolled
          ? "rgba(5, 5, 5, 0.95)"
          : "rgba(5, 5, 5, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Main Nav Row */}
      <div className="flex items-center justify-between px-6 h-[60px]">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Image
              src="/bull-bear-logo.png"
              alt="InvestIQ Logo"
              width={40}
              height={40}
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="font-bold tracking-tight"
              style={{ fontSize: 16, color: "#F0F2F1" }}
            >
              InvestIQ
            </span>
            <span style={{ fontSize: 9, color: "#4A5C57", letterSpacing: "0.08em" }}>
              AI POWERED
            </span>
          </div>
        </Link>

        {/* Center: Ticker Tape (hidden on mobile) */}
        <div className="hidden md:flex flex-1 mx-8 overflow-hidden relative">
          {/* Left fade */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to right, #050505, transparent)",
            }}
          />
          <div className="overflow-hidden flex-1">
            <div className="ticker-tape">
              {[...TICKERS, ...TICKERS].map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 mx-4 text-xs font-medium"
                  style={{ color: t.up ? "#00C853" : "#FF3B3B" }}
                >
                  {t.up ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span style={{ color: "#8B9A96", fontWeight: 500 }}>{t.symbol}</span>
                  <span>{t.change}</span>
                </span>
              ))}
            </div>
          </div>
          {/* Right fade */}
          <div
            className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to left, #050505, transparent)",
            }}
          />
        </div>

        {/* Right: Status + Profile */}
        <div className="flex items-center gap-3">
          {/* Market Status */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(0, 200, 83, 0.08)",
              border: "1px solid rgba(0, 200, 83, 0.2)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full pulse-dot"
              style={{ background: "#00C853" }}
            />
            <span style={{ fontSize: 11, color: "#00C853", fontWeight: 600 }}>
              MARKET OPEN
            </span>
          </div>

          {/* Profile button */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <User className="w-4 h-4" style={{ color: "#8B9A96" }} />
          </button>
        </div>
      </div>
    </header>
  );
}
