import Link from "next/link";
import {
  TrendingUp, Cpu, ShieldCheck, Award, ArrowRight,
  BarChart3, Sparkles, Target
} from "lucide-react";

const FEATURES = [
  {
    icon: Cpu,
    title: "Parallel Specialists",
    description:
      "Financial, Sentiment, Competitive & Risk agents run concurrently — not sequentially. Faster, deeper research.",
    color: "#00C853",
  },
  {
    icon: TrendingUp,
    title: "Adversarial Debate",
    description:
      "Bull vs Bear AI agents stress-test every investment thesis side-by-side before a verdict is issued.",
    color: "#F5A623",
  },
  {
    icon: ShieldCheck,
    title: "CRO Audit Loop",
    description:
      "Chief Risk Officer node reviews final memo for overconfidence, contradictions, or logical flaws.",
    color: "#FF3B3B",
  },
  {
    icon: Award,
    title: "Committee Verdict",
    description:
      "BUY / HOLD / PASS decision backed by typed structured outputs — zero hallucinations.",
    color: "#00C853",
  },
];

const STATS = [
  { value: "7", label: "Specialist Agents" },
  { value: "3", label: "Debate Rounds" },
  { value: "60s", label: "Avg. Analysis Time" },
  { value: "100%", label: "Grounded Outputs" },
];

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#050505", color: "#F0F2F1", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 h-[60px]"
        style={{
          background: "rgba(5,5,5,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(0,200,83,0.2), rgba(255,59,59,0.2))",
              border: "1px solid rgba(0,200,83,0.3)",
              fontSize: 18,
            }}
          >
            🐂
          </div>
          <div className="flex flex-col leading-none">
            <span style={{ fontSize: 16, fontWeight: 700, color: "#F0F2F1" }}>InvestIQ</span>
            <span style={{ fontSize: 9, color: "#4A5C57", letterSpacing: "0.1em" }}>
              AI POWERED INVESTMENT INTELLIGENCE
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
              color: "#8B9A96",
              padding: "7px 16px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.07)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            GitHub
          </a>
          <Link
            href="/dashboard"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#050505",
              background: "#00C853",
              padding: "8px 20px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Open Terminal
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main className="flex-1 flex flex-col">
        <section className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 relative overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 800px 400px at 50% 0%, rgba(0,200,83,0.06) 0%, transparent 70%)",
            }}
          />

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(0,200,83,0.08)",
              border: "1px solid rgba(0,200,83,0.2)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#00C853" }} />
            <span style={{ fontSize: 11, color: "#00C853", fontWeight: 600, letterSpacing: "0.1em" }}>
              MULTI-AGENT AI · LANGGRAPH
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-bold"
            style={{
              fontSize: "clamp(36px, 6vw, 68px)",
              color: "#F0F2F1",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              maxWidth: 800,
              marginBottom: 20,
            }}
          >
            AI Investment
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00C853 0%, #69F0AE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Research Agent
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(14px, 2vw, 17px)",
              color: "#8B9A96",
              maxWidth: 560,
              lineHeight: 1.65,
              marginBottom: 36,
            }}
          >
            Multi-agent AI system that researches companies, analyzes risk, runs
            adversarial Bull vs Bear debates, and generates professional investment decisions.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold rounded-xl transition-all"
              style={{
                background: "#00C853",
                color: "#050505",
                padding: "13px 28px",
                fontSize: 15,
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              Start Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/Anilllllllll/Inside-IIM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium rounded-xl"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#8B9A96",
                padding: "13px 28px",
                fontSize: 15,
                borderRadius: 12,
                textDecoration: "none",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              View on GitHub
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  style={{
                    fontSize: "clamp(22px, 3vw, 30px)",
                    fontWeight: 800,
                    color: "#00C853",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: "#4A5C57", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="max-w-6xl mx-auto px-4 pb-20 w-full">
          <div className="text-center mb-10">
            <h2
              style={{
                fontSize: "clamp(24px, 3.5vw, 36px)",
                fontWeight: 800,
                color: "#F0F2F1",
                letterSpacing: "-0.02em",
              }}
            >
              Research-grade AI pipeline
            </h2>
            <p style={{ fontSize: 14, color: "#4A5C57", marginTop: 8 }}>
              Not a single-prompt LLM wrapper — a proper multi-agent state machine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6"
                style={{
                  background: "#0B0F0E",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${f.color}30`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `${f.color}15`,
                    border: `1px solid ${f.color}30`,
                  }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F0F2F1", marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "#4A5C57", lineHeight: 1.6 }}>
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
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: 12,
          color: "#4A5C57",
        }}
      >
        <span>© 2025 InvestIQ — AI Investment Intelligence</span>
        <span>Built with LangGraph · Next.js · Supabase</span>
      </footer>
    </div>
  );
}
