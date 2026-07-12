"use client";

import Link from "next/link";
import {
  TrendingUp, Cpu, ShieldCheck, Award, ArrowRight,
  Sparkles, BarChart3, TrendingDown, Check
} from "lucide-react";

const FEATURES = [
  {
    icon: Cpu,
    title: "Parallel Specialists",
    description: "Financial, Sentiment, Competitive & Risk agents run concurrently — not sequentially.",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
  },
  {
    icon: TrendingUp,
    title: "Adversarial Debate",
    description: "Bull vs Bear AI agents stress-test every investment thesis before a verdict.",
    color: "#16A34A",
    bg: "rgba(22,163,74,0.08)",
  },
  {
    icon: ShieldCheck,
    title: "CRO Risk Audit",
    description: "Chief Risk Officer node reviews for overconfidence and logical contradictions.",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
  },
  {
    icon: Award,
    title: "Committee Verdict",
    description: "BUY / HOLD / PASS decision backed by typed structured outputs — zero hallucinations.",
    color: "#6366F1",
    bg: "rgba(99,102,241,0.08)",
  },
];

const STATS = [
  { value: "7", label: "Specialist Agents" },
  { value: "3", label: "Debate Rounds" },
  { value: "60s", label: "Avg. Analysis" },
  { value: "100%", label: "Grounded Data" },
];

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FAFAFF", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 h-[62px]"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-9 flex items-center justify-center overflow-hidden rounded-lg bg-white"
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.08)",
              padding: "2px 4px",
            }}
          >
            <img
              src="/logo.png"
              alt="InvestIQ Logo"
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span style={{ fontSize: 16, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
              InvestIQ
            </span>
            <span style={{ fontSize: 9, color: "#9CA3AF", letterSpacing: "0.08em" }}>
              AI INVESTMENT INTELLIGENCE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Anilllllllll/Inside-IIM"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#4B5563",
              padding: "7px 16px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.1)",
              background: "white",
              textDecoration: "none",
            }}
          >
            GitHub
          </a>
          <Link
            href="/dashboard"
            className="btn-primary flex items-center gap-2"
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: 10,
              textDecoration: "none",
              background: "linear-gradient(135deg, #7C3AED, #6366F1)",
              color: "white",
              boxShadow: "0 4px 14px rgba(124,58,237,0.28)",
            }}
          >
            Open App
            <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main className="flex-1 flex flex-col">
        <section
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #FAFAFF 0%, #F0EEFF 45%, #EBF3FF 100%)",
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          {/* Background orbs */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
              top: -200,
              right: -100,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
              bottom: -100,
              left: -100,
            }}
          />

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* LEFT: Text */}
              <div>
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                  style={{
                    background: "rgba(124,58,237,0.08)",
                    border: "1px solid rgba(124,58,237,0.2)",
                  }}
                >
                  <Sparkles style={{ width: 14, height: 14, color: "#7C3AED" }} />
                  <span style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700, letterSpacing: "0.1em" }}>
                    MULTI-AGENT AI · LANGGRAPH
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: "clamp(36px, 5vw, 60px)",
                    fontWeight: 900,
                    color: "#111827",
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                    marginBottom: 20,
                  }}
                >
                  AI Investment
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #6366F1)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Research Agent
                  </span>
                </h1>

                <p
                  style={{
                    fontSize: 17,
                    color: "#4B5563",
                    lineHeight: 1.65,
                    maxWidth: 480,
                    marginBottom: 36,
                  }}
                >
                  Multi-agent AI analysts that research companies, analyze risks,
                  debate opportunities, and generate institutional-grade investment decisions.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 mb-12">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #6366F1)",
                      color: "white",
                      padding: "13px 28px",
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 6px 20px rgba(124,58,237,0.3)",
                    }}
                  >
                    Start Analysis
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </Link>
                  <a
                    href="https://github.com/Anilllllllll/Inside-IIM"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "white",
                      color: "#4B5563",
                      padding: "13px 28px",
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 600,
                      textDecoration: "none",
                      border: "1px solid rgba(0,0,0,0.1)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    View on GitHub
                  </a>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8">
                  {STATS.map((s) => (
                    <div key={s.label}>
                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: 900,
                          letterSpacing: "-0.02em",
                          background: "linear-gradient(135deg, #7C3AED, #6366F1)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          lineHeight: 1,
                        }}
                      >
                        {s.value}
                      </div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4, fontWeight: 500 }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: Floating preview card */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Main card */}
                  <div
                    className="float-card"
                    style={{
                      width: 320,
                      borderRadius: 24,
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.9)",
                      boxShadow: "0 24px 60px rgba(124,58,237,0.15), 0 4px 16px rgba(0,0,0,0.06)",
                      padding: 24,
                      overflow: "hidden",
                    }}
                  >
                    {/* Card header gradient */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: "linear-gradient(90deg, #7C3AED, #6366F1, #16A34A)",
                      }}
                    />

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 2 }}>
                          ANALYSIS COMPLETE
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                          Alphabet Inc.
                        </div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>GOOGL · NASDAQ</div>
                      </div>
                      <span
                        style={{
                          background: "linear-gradient(135deg, #16A34A, #059669)",
                          color: "white",
                          fontSize: 13,
                          fontWeight: 800,
                          padding: "6px 16px",
                          borderRadius: 10,
                          boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        BUY
                      </span>
                    </div>

                    {/* Confidence bar */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-1.5">
                        <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>AI Confidence</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#7C3AED" }}>87%</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(124,58,237,0.1)", borderRadius: 4 }}>
                        <div
                          style={{
                            width: "87%",
                            height: "100%",
                            background: "linear-gradient(90deg, #7C3AED, #6366F1)",
                            borderRadius: 4,
                            boxShadow: "0 0 8px rgba(124,58,237,0.35)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Mini chart bars */}
                    <div
                      className="flex items-end gap-1 mb-4 rounded-xl p-3"
                      style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.08)" }}
                    >
                      {[45, 60, 55, 70, 65, 80, 75, 87].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height: h * 0.6,
                            background: `linear-gradient(to top, #7C3AED, #6366F1)`,
                            opacity: 0.6 + i * 0.05,
                          }}
                        />
                      ))}
                    </div>

                    {/* Agent pills */}
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8, fontWeight: 600 }}>
                      7 AI AGENTS DEPLOYED
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Financial", "Sentiment", "Risk", "Bull Case", "Bear Case"].map((a) => (
                        <span
                          key={a}
                          className="flex items-center gap-1"
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "rgba(22,163,74,0.08)",
                            color: "#16A34A",
                            border: "1px solid rgba(22,163,74,0.15)",
                          }}
                        >
                          <Check style={{ width: 9, height: 9 }} />
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Floating mini card */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -20,
                      right: -30,
                      background: "white",
                      borderRadius: 16,
                      padding: "12px 16px",
                      boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
                      border: "1px solid rgba(0,0,0,0.07)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "rgba(22,163,74,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TrendingUp style={{ width: 18, height: 18, color: "#16A34A" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>+24.8%</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF" }}>Upside potential</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="text-center mb-12">
            <h2
              style={{
                fontSize: "clamp(26px, 3.5vw, 40px)",
                fontWeight: 900,
                color: "#111827",
                letterSpacing: "-0.025em",
              }}
            >
              Research-grade AI pipeline
            </h2>
            <p style={{ fontSize: 15, color: "#6B7280", marginTop: 10, maxWidth: 500, margin: "10px auto 0" }}>
              Not a single-prompt wrapper — a proper multi-agent state machine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-card-hover"
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: "24px",
                  border: "1px solid rgba(0,0,0,0.07)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  cursor: "default",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.bg, border: `1px solid ${f.color}25` }}
                >
                  <f.icon style={{ width: 20, height: 20, color: f.color }} />
                </div>
                <h3
                  style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8, letterSpacing: "-0.01em" }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="flex items-center justify-between px-6 py-4"
        style={{
          borderTop: "1px solid rgba(0,0,0,0.07)",
          fontSize: 12,
          color: "#9CA3AF",
          background: "white",
        }}
      >
        <span>© 2025 InvestIQ — AI Investment Intelligence</span>
        <span>Built with LangGraph · Next.js · Supabase</span>
      </footer>
    </div>
  );
}
