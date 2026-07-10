"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LiveWorkflow } from "@/components/LiveWorkflow";
import { Navbar } from "@/components/Navbar";
import { DecisionBadge } from "@/components/ui/MetricCard";
import {
  Search, History, TrendingUp, Cpu, ShieldAlert, Award,
  FileText, ArrowRight, Clock, Sparkles, BarChart3
} from "lucide-react";

interface HistoryItem {
  id: string;
  companyName: string;
  ticker: string;
  exchange: string;
  decision: string;
  confidenceScore: number;
  summary: string;
  createdAt: string;
}

const QUICK_CHIPS = ["Apple", "Tesla", "Microsoft", "Nvidia", "Google", "Amazon"];

const FEATURES = [
  {
    icon: <Cpu style={{ width: 20, height: 20 }} />,
    title: "AI Research Engine",
    desc: "7 specialist agents run in parallel — financial, sentiment, risk & more.",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
  },
  {
    icon: <TrendingUp style={{ width: 20, height: 20 }} />,
    title: "Bull vs Bear Debate",
    desc: "Adversarial AI agents stress-test every thesis before a decision is made.",
    color: "#16A34A",
    bg: "rgba(22,163,74,0.08)",
  },
  {
    icon: <ShieldAlert style={{ width: 20, height: 20 }} />,
    title: "CRO Risk Audit",
    desc: "Chief Risk Officer node reviews for overconfidence and logical flaws.",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
  },
  {
    icon: <Award style={{ width: 20, height: 20 }} />,
    title: "Committee Verdict",
    desc: "Final BUY / HOLD / PASS backed by structured AI consensus outputs.",
    color: "#6366F1",
    bg: "rgba(99,102,241,0.08)",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.ok ? r.json() : [])
      .then(setHistory)
      .catch(console.error);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: query }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Analysis failed.");
      }
      const report = await res.json();
      router.push(`/report/${report.id}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#FAFAFF" }}>
        <Navbar />
        <div
          className="flex-1 flex flex-col items-center justify-center p-6"
          style={{
            background: "linear-gradient(160deg, #FAFAFF 0%, #F0EEFF 60%, #EBF3FF 100%)",
          }}
        >
          <LiveWorkflow />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFF" }}>
      <Navbar />

      {/* Subtle top gradient */}
      <div
        style={{
          background: "linear-gradient(180deg, #F3F2FF 0%, #FAFAFF 100%)",
          paddingTop: 60,
          paddingBottom: 48,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.18)",
            }}
          >
            <Sparkles style={{ width: 13, height: 13, color: "#7C3AED" }} />
            <span style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700, letterSpacing: "0.1em" }}>
              MULTI-AGENT AI RESEARCH
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 900,
              color: "#111827",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 14,
            }}
          >
            AI Investment{" "}
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
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 36px" }}>
            Multi-agent AI system that researches companies, analyzes risk, runs
            adversarial Bull vs Bear debates, and generates investment decisions.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-4">
            <div
              className="flex gap-2 p-2 rounded-2xl"
              style={{
                background: "white",
                border: "1.5px solid rgba(124,58,237,0.2)",
                boxShadow: "0 4px 24px rgba(124,58,237,0.1), 0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex-1 relative flex items-center">
                <Search
                  style={{
                    position: "absolute",
                    left: 14,
                    width: 18,
                    height: 18,
                    color: "#9CA3AF",
                  }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search company or ticker — Apple, TSLA, Nvidia..."
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    paddingLeft: 44,
                    paddingRight: 16,
                    paddingTop: 12,
                    paddingBottom: 12,
                    fontSize: 15,
                    color: "#111827",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 font-semibold rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #6366F1)",
                  color: "white",
                  padding: "11px 22px",
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.4)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(124,58,237,0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Analyze
                <ArrowRight style={{ width: 15, height: 15 }} />
              </button>
            </div>
          </form>

          {/* Quick Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>Try:</span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setQuery(chip)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "5px 14px",
                  borderRadius: 20,
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.09)",
                  color: "#4B5563",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                  e.currentTarget.style.color = "#7C3AED";
                  e.currentTarget.style.background = "rgba(124,58,237,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.09)";
                  e.currentTarget.style.color = "#4B5563";
                  e.currentTarget.style.background = "white";
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {error && (
            <div
              className="max-w-2xl mx-auto rounded-xl p-4 mt-4"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#DC2626",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* ── HOW IT WORKS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass-card-hover"
              style={{
                background: "white",
                borderRadius: 20,
                padding: "20px",
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: f.bg, color: f.color }}
              >
                {f.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                {f.title}
              </div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        {/* ── HISTORY ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <History style={{ width: 18, height: 18, color: "#9CA3AF" }} />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                Research Archives
              </h2>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: "rgba(124,58,237,0.08)",
                  color: "#7C3AED",
                  border: "1px solid rgba(124,58,237,0.15)",
                }}
              >
                {history.length}
              </span>
            </div>
          </div>

          {history.length === 0 ? (
            <div
              className="text-center py-20 rounded-3xl"
              style={{
                background: "white",
                border: "2px dashed rgba(124,58,237,0.15)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(124,58,237,0.06)" }}
              >
                <FileText style={{ width: 28, height: 28, color: "#C4B5FD" }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#4B5563" }}>
                No reports yet
              </p>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
                Run your first analysis above to get started.
              </p>
            </div>
          ) : (
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              }}
            >
              {/* Table header */}
              <div
                className="grid items-center px-6 py-3"
                style={{
                  gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  background: "rgba(124,58,237,0.03)",
                }}
              >
                <span>Company</span>
                <span>Signal</span>
                <span>Confidence</span>
                <span className="hidden md:block">Rationale</span>
                <span className="text-right">Date</span>
              </div>

              {history.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/report/${item.id}`)}
                  className="grid items-center px-6 py-4 cursor-pointer transition-all"
                  style={{
                    gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr",
                    borderBottom: i < history.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(124,58,237,0.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                      {item.companyName}
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2, fontWeight: 500 }}>
                      {item.ticker} · {item.exchange}
                    </div>
                  </div>

                  <div>
                    <DecisionBadge decision={item.decision} size="sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-full overflow-hidden"
                      style={{ width: 48, height: 5, background: "rgba(0,0,0,0.06)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.confidenceScore}%`,
                          background:
                            item.confidenceScore >= 70
                              ? "linear-gradient(90deg,#16A34A,#059669)"
                              : item.confidenceScore >= 50
                              ? "linear-gradient(90deg,#D97706,#B45309)"
                              : "linear-gradient(90deg,#EF4444,#DC2626)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#4B5563" }}>
                      {item.confidenceScore}%
                    </span>
                  </div>

                  <div
                    className="hidden md:block truncate"
                    style={{ fontSize: 12, color: "#9CA3AF", paddingRight: 12 }}
                  >
                    {item.summary}
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <Clock style={{ width: 11, height: 11, color: "#9CA3AF" }} />
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
