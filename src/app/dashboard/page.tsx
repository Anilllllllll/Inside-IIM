"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LiveWorkflow } from "@/components/LiveWorkflow";
import { Navbar } from "@/components/Navbar";
import { DecisionBadge } from "@/components/ui/MetricCard";
import {
  Search, History, TrendingUp, Cpu, ShieldAlert, Award,
  FileText, ArrowRight, Sparkles, BarChart3, ChevronRight,
  Clock
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

const QUICK_CHIPS = ["Apple", "Tesla", "Microsoft", "Nvidia", "Google"];

const FEATURES = [
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "Parallel Research",
    desc: "Concurrent specialist agents gather financials, sentiment & risk simultaneously.",
    color: "#00C853",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Adversarial Debate",
    desc: "Bull vs Bear AI agents stress-test every thesis before a decision is made.",
    color: "#F5A623",
  },
  {
    icon: <ShieldAlert className="w-5 h-5" />,
    title: "CRO Risk Audit",
    desc: "Chief Risk Officer node audits for overconfidence and logical contradictions.",
    color: "#FF3B3B",
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: "Committee Verdict",
    desc: "Final BUY/HOLD/PASS decision backed by multi-agent consensus and memo.",
    color: "#F5A623",
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
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#050505" }}
      >
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <LiveWorkflow />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#050505" }}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12">

        {/* ── HERO ── */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(0,200,83,0.08)",
              border: "1px solid rgba(0,200,83,0.2)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#00C853" }} />
            <span style={{ fontSize: 11, color: "#00C853", fontWeight: 600, letterSpacing: "0.1em" }}>
              MULTI-AGENT AI RESEARCH
            </span>
          </div>

          <h1
            className="font-bold mb-4"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "#F0F2F1",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            AI Investment<br />
            <span
              style={{
                background: "linear-gradient(135deg, #00C853, #69F0AE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Research Agent
            </span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#8B9A96",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Multi-agent AI system that researches companies, analyzes risk,
            runs adversarial Bull vs Bear debates, and generates investment decisions.
          </p>
        </div>

        {/* ── SEARCH ── */}
        <div className="max-w-2xl mx-auto mb-5">
          <form onSubmit={handleSearch}>
            <div
              className="flex gap-2 p-2 rounded-2xl"
              style={{
                background: "#0B0F0E",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 0 40px rgba(0,200,83,0.05)",
              }}
            >
              <div className="flex-1 relative flex items-center">
                <Search className="w-5 h-5 absolute left-4" style={{ color: "#4A5C57" }} />
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
                    color: "#F0F2F1",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 font-semibold rounded-xl transition-all"
                style={{
                  background: "#00C853",
                  color: "#050505",
                  padding: "12px 24px",
                  fontSize: 14,
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#00E676")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#00C853")
                }
              >
                Analyze
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
          <span style={{ fontSize: 12, color: "#4A5C57", marginRight: 4 }}>Try:</span>
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setQuery(chip)}
              className="rounded-full transition-all"
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: "5px 14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#8B9A96",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,200,83,0.3)";
                e.currentTarget.style.color = "#00C853";
                e.currentTarget.style.background = "rgba(0,200,83,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "#8B9A96";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {error && (
          <div
            className="max-w-2xl mx-auto rounded-xl p-4 mb-8"
            style={{
              background: "rgba(255,59,59,0.08)",
              border: "1px solid rgba(255,59,59,0.25)",
              color: "#FF3B3B",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* ── HOW IT WORKS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16 mt-14">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl p-4 glass-card-hover"
              style={{
                background: "#0B0F0E",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{
                  background: `${f.color}15`,
                  border: `1px solid ${f.color}30`,
                  color: f.color,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{ fontSize: 13, fontWeight: 600, color: "#F0F2F1", marginBottom: 4 }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: 11, color: "#4A5C57", lineHeight: 1.5 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        {/* ── HISTORY ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" style={{ color: "#4A5C57" }} />
              <h2
                style={{ fontSize: 18, fontWeight: 700, color: "#F0F2F1", letterSpacing: "-0.02em" }}
              >
                Research Archives
              </h2>
              <span
                className="rounded-full px-2 py-0.5"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.05)",
                  color: "#4A5C57",
                }}
              >
                {history.length}
              </span>
            </div>
          </div>

          {history.length === 0 ? (
            <div
              className="text-center py-20 rounded-2xl"
              style={{
                background: "#0B0F0E",
                border: "1px dashed rgba(255,255,255,0.07)",
              }}
            >
              <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "#1f2e2a" }} />
              <p style={{ fontSize: 14, color: "#4A5C57" }}>
                No reports yet. Run your first analysis above.
              </p>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#0B0F0E",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Table header */}
              <div
                className="grid items-center px-5 py-3"
                style={{
                  gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#4A5C57",
                  textTransform: "uppercase",
                }}
              >
                <span>Company</span>
                <span>Decision</span>
                <span>Confidence</span>
                <span className="hidden md:block">Rationale</span>
                <span className="text-right">Date</span>
              </div>

              {history.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/report/${item.id}`)}
                  className="grid items-center px-5 py-4 cursor-pointer transition-all"
                  style={{
                    gridTemplateColumns: "2fr 1fr 1fr 2fr 1fr",
                    borderBottom:
                      i < history.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#F0F2F1" }}>
                      {item.companyName}
                    </div>
                    <div style={{ fontSize: 11, color: "#4A5C57", marginTop: 1 }}>
                      {item.ticker} · {item.exchange}
                    </div>
                  </div>

                  <div>
                    <DecisionBadge decision={item.decision} size="sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-full overflow-hidden"
                      style={{
                        width: 40,
                        height: 4,
                        background: "rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.confidenceScore}%`,
                          background:
                            item.confidenceScore >= 70
                              ? "#00C853"
                              : item.confidenceScore >= 50
                              ? "#F5A623"
                              : "#FF3B3B",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#8B9A96" }}>
                      {item.confidenceScore}%
                    </span>
                  </div>

                  <div
                    className="hidden md:block truncate"
                    style={{ fontSize: 12, color: "#4A5C57", paddingRight: 16 }}
                  >
                    {item.summary}
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" style={{ color: "#4A5C57" }} />
                    <span style={{ fontSize: 11, color: "#4A5C57" }}>
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
      </main>
    </div>
  );
}
