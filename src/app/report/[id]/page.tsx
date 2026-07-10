"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MetricCard, DecisionBadge } from "@/components/ui/MetricCard";
import {
  ArrowLeft, ShieldAlert, Award, AlertCircle,
  FileText, TrendingUp, Info, BarChart3, Download, Star, Globe, Check
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

interface Report {
  id: string;
  companyName: string;
  ticker: string;
  exchange: string;
  decision: string;
  confidenceScore: number;
  summary: string;
  fullReasoning: any;
  memoMarkdown: string;
  agentTrace: any;
  sources: string[];
  createdAt: string;
}

function parseMarkdown(md: string) {
  if (!md) return "";
  return md
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (t.startsWith("# "))  return `<h1 class="rh1">${t.slice(2)}</h1>`;
      if (t.startsWith("## ")) return `<h2 class="rh2">${t.slice(3)}</h2>`;
      if (t.startsWith("### "))return `<h3 class="rh3">${t.slice(4)}</h3>`;
      if (t === "---")          return `<hr class="rhr" />`;
      if (t.startsWith("> "))  return `<blockquote class="rbq">${t.slice(2)}</blockquote>`;
      if (t.startsWith("- ") || t.startsWith("* ")) return `<li class="rli">${t.slice(2)}</li>`;
      if (!t) return `<div style="height:10px"></div>`;
      const f = t.replace(/\*\*(.*?)\*\*/g, '<strong class="rbold">$1</strong>');
      return `<p class="rp">${f}</p>`;
    })
    .join("");
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "white",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        fontSize: 12,
      }}>
        <p style={{ color: "#9CA3AF", marginBottom: 4 }}>{label}</p>
        <p style={{ color: "#7C3AED", fontWeight: 800 }}>${payload[0].value?.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: reportId } = use(params);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/reports?id=${reportId}`);
        if (!res.ok) throw new Error("Report not found.");
        const data = await res.json();
        if (typeof data.sources === "string") {
          try { data.sources = JSON.parse(data.sources); } catch { data.sources = []; }
        }
        if (typeof data.fullReasoning === "string") {
          try { data.fullReasoning = JSON.parse(data.fullReasoning); } catch { data.fullReasoning = {}; }
        }
        if (typeof data.agentTrace === "string") {
          try { data.agentTrace = JSON.parse(data.agentTrace); } catch { data.agentTrace = {}; }
        }
        setReport(data);
      } catch (e: any) {
        setError(e.message || "Failed to load.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#FAFAFF" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(124,58,237,0.2)", borderTopColor: "#7C3AED" }}
          />
          <p style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>Loading research dossier…</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#FAFAFF" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.08)" }}
          >
            <AlertCircle style={{ width: 28, height: 28, color: "#EF4444" }} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Report Not Found</h2>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>{error}</p>
          <Link href="/dashboard" style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "white", border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 12, padding: "10px 20px",
            fontSize: 14, fontWeight: 600, color: "#4B5563",
            textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { fullReasoning, memoMarkdown } = report;
  const financial  = fullReasoning?.financial;
  const news       = fullReasoning?.news;
  const competition= fullReasoning?.competition;
  const risk       = fullReasoning?.risk;
  const bullCase   = fullReasoning?.bullCase;
  const bearCase   = fullReasoning?.bearCase;

  const pe = financial?.metrics?.peRatio ?? 22.4;
  const de = financial?.metrics?.debtToEquity ?? 0.5;
  const cr = financial?.metrics?.currentRatio ?? 1.5;

  const basePrice = pe > 40 ? 85 : pe > 25 ? 320 : 155;
  const priceTrend = ["Jan","Feb","Mar","Apr","May","Jun","Jul"].map((m, i) => ({
    month: m,
    price: +(basePrice * (1 + (Math.random() - 0.4) * 0.06 + i * 0.015)).toFixed(2),
  }));

  const radarData = [
    { subject: "Valuation", score: Math.max(10, Math.min(100, 100 - pe * 1.5)) },
    { subject: "Liquidity", score: Math.max(10, Math.min(100, cr * 38)) },
    { subject: "Leverage",  score: Math.max(10, Math.min(100, 100 - de * 45)) },
    { subject: "Earnings",  score: Math.max(10, Math.min(100, (financial?.score || 5) * 10)) },
    { subject: "Moat",      score: competition?.moatRating === "Strong" ? 90 : competition?.moatRating === "Average" ? 60 : 30 },
  ];

  const riskPct = risk?.overallRiskLevel === "High" ? 82 : risk?.overallRiskLevel === "Medium" ? 52 : 22;
  const sentimentColor = news?.sentiment === "Bullish" ? "#16A34A" : news?.sentiment === "Bearish" ? "#EF4444" : "#D97706";

  const cardStyle = {
    background: "white",
    border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 24,
    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
    padding: 24,
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFF" }}>
      <Navbar />

      {/* Inline memo styles */}
      <style>{`
        .rh1 { font-size:18px; font-weight:800; color:#111827; margin:24px 0 10px; letter-spacing:-0.02em; border-bottom:2px solid rgba(124,58,237,0.1); padding-bottom:10px }
        .rh2 { font-size:15px; font-weight:700; color:#111827; margin:20px 0 8px; }
        .rh3 { font-size:12px; font-weight:700; color:#7C3AED; margin:14px 0 6px; text-transform:uppercase; letter-spacing:0.07em }
        .rhr { border:none; border-top:1px solid rgba(0,0,0,0.08); margin:16px 0 }
        .rbq { border-left:3px solid #7C3AED; background:rgba(124,58,237,0.04); padding:12px 16px; border-radius:0 12px 12px 0; margin:12px 0; font-style:italic; color:#4B5563; font-size:13px }
        .rli  { font-size:13px; color:#4B5563; margin:5px 0 5px 18px; list-style:disc; line-height:1.65 }
        .rp   { font-size:13px; color:#4B5563; line-height:1.75; margin:6px 0 }
        .rbold { color:#111827; font-weight:700 }
        @media print { .no-print { display:none!important } }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back + Export */}
        <div className="flex items-center justify-between mb-6 no-print">
          <Link href="/dashboard" style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "white", border: "1px solid rgba(0,0,0,0.09)",
            borderRadius: 12, padding: "8px 16px",
            fontSize: 13, fontWeight: 600, color: "#4B5563",
            textDecoration: "none", boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}>
            <ArrowLeft style={{ width: 15, height: 15 }} /> Back
          </Link>
          <button
            onClick={() => window.print()}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "white", border: "1px solid rgba(0,0,0,0.09)",
              borderRadius: 12, padding: "8px 16px",
              fontSize: 13, fontWeight: 600, color: "#4B5563",
              cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            }}
          >
            <Download style={{ width: 15, height: 15 }} /> Export PDF
          </button>
        </div>

        {/* ── COMPANY HEADER ── */}
        <div style={{ ...cardStyle, marginBottom: 20 }}>
          <div
            style={{
              height: 4, borderRadius: "20px 20px 0 0", marginBottom: 24,
              background: "linear-gradient(90deg, #7C3AED, #6366F1, #16A34A)",
              margin: "-24px -24px 24px -24px",
              borderRadius: "24px 24px 0 0",
            }}
          />
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Company avatar */}
              <div
                style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(99,102,241,0.08))",
                  border: "1.5px solid rgba(124,58,237,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 900, color: "#7C3AED",
                  flexShrink: 0,
                }}
              >
                {report.ticker.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {[report.exchange, report.ticker].map((t) => (
                    <span key={t} style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                      padding: "2px 8px", borderRadius: 6,
                      background: "rgba(124,58,237,0.07)", color: "#7C3AED",
                      border: "1px solid rgba(124,58,237,0.15)",
                    }}>{t}</span>
                  ))}
                </div>
                <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 900, color: "#111827", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
                  {report.companyName}
                </h1>
                <p style={{ fontSize: 13, color: "#6B7280", marginTop: 6, maxWidth: 500, lineHeight: 1.55 }}>
                  {report.summary}
                </p>
              </div>
            </div>

            {/* Decision panel */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: 20,
                padding: "20px 24px", borderRadius: 20,
                background: "rgba(124,58,237,0.03)",
                border: "1px solid rgba(124,58,237,0.12)",
                flexShrink: 0,
              }}
            >
              <div className="text-center">
                <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 8, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>Signal</div>
                <DecisionBadge decision={report.decision} size="lg" />
              </div>
              <div style={{ width: 1, height: 48, background: "rgba(0,0,0,0.08)" }} className="hidden sm:block" />
              <div className="hidden sm:block text-center">
                <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 4, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>Confidence</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#111827", letterSpacing: "-0.03em" }}>
                  {report.confidenceScore}%
                </div>
                <div style={{ width: 80, height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                  <div style={{
                    width: `${report.confidenceScore}%`, height: "100%",
                    background: "linear-gradient(90deg,#7C3AED,#6366F1)", borderRadius: 2,
                  }} />
                </div>
              </div>
              <div style={{ width: 1, height: 48, background: "rgba(0,0,0,0.08)" }} className="hidden sm:block" />
              <div className="hidden sm:block text-center">
                <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 4, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>Sentiment</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: sentimentColor }}>{news?.sentiment || "Neutral"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        {financial && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Market Cap"
              value={`$${(financial.metrics.marketCap / 1e9).toFixed(1)}B`}
              subtext="Total market value"
            />
            <MetricCard
              label="P/E Ratio"
              value={pe}
              subtext={pe < 20 ? "Undervalued" : pe > 40 ? "Growth premium" : "Fair range"}
              trend={pe < 20 ? "up" : "neutral"}
              highlight={pe < 20 ? "green" : "none"}
            />
            <MetricCard
              label="Debt / Equity"
              value={de.toFixed(2)}
              subtext={de < 0.5 ? "Low leverage" : de > 1.5 ? "High leverage" : "Moderate"}
              trend={de < 0.5 ? "up" : de > 1.5 ? "down" : "neutral"}
              highlight={de > 1.5 ? "red" : de < 0.5 ? "green" : "none"}
            />
            <MetricCard
              label="Current Ratio"
              value={cr.toFixed(2)}
              subtext={cr >= 2 ? "Strong liquidity" : cr < 1 ? "Liquidity risk" : "Adequate"}
              trend={cr >= 2 ? "up" : cr < 1 ? "down" : "neutral"}
              highlight={cr < 1 ? "red" : cr >= 2 ? "green" : "none"}
            />
          </div>
        )}

        {/* ── CHARTS + ANALYSIS GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* LEFT: Charts + News + Risk */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Stock Chart */}
              <div style={cardStyle}>
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp style={{ width: 14, height: 14, color: "#7C3AED" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Stock Movement (Est.)</span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={priceTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#E5E7EB" fontSize={10} tickLine={false} />
                    <YAxis stroke="#E5E7EB" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="price" stroke="#7C3AED" strokeWidth={2} fill="url(#priceGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart */}
              <div style={cardStyle}>
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(22,163,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BarChart3 style={{ width: 14, height: 14, color: "#16A34A" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Financial Health</span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="rgba(0,0,0,0.06)" />
                    <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} stroke="transparent" />
                    <Radar name="health" dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.1} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Financial History Table */}
            {financial?.annualReports && financial.annualReports.length > 0 && (
              <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 8 }}>
                  <FileText style={{ width: 15, height: 15, color: "#9CA3AF" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Financial History</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "rgba(124,58,237,0.03)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        {["Year","Revenue","Net Income","Op. Margin","Net Margin"].map((h) => (
                          <th key={h} style={{ padding: "10px 16px", fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "left" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {financial.annualReports.map((r: any, i: number) => (
                        <tr key={r.fiscalDateEnding} style={{ borderBottom: i < financial.annualReports.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                          <td style={{ padding: "10px 16px", fontSize: 12, color: "#4B5563", fontWeight: 700 }}>{r.fiscalDateEnding?.slice(0, 4)}</td>
                          <td style={{ padding: "10px 16px", fontSize: 12, color: "#111827", fontWeight: 600 }}>${(r.totalRevenue / 1e9).toFixed(2)}B</td>
                          <td style={{ padding: "10px 16px", fontSize: 12, color: "#111827" }}>${(r.netIncome / 1e9).toFixed(2)}B</td>
                          <td style={{ padding: "10px 16px", fontSize: 12, color: "#16A34A", fontWeight: 700 }}>{(r.operatingMargin * 100).toFixed(1)}%</td>
                          <td style={{ padding: "10px 16px", fontSize: 12, color: "#6B7280" }}>{(r.netMargin * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* News */}
            {news && (
              <div style={cardStyle}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Globe style={{ width: 14, height: 14, color: "#6366F1" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Market Intelligence</span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                    background: `${sentimentColor}12`, border: `1px solid ${sentimentColor}30`,
                    color: sentimentColor,
                  }}>{news.sentiment}</span>
                </div>
                <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.65, marginBottom: 14 }}>{news.summary}</p>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Key Highlights</div>
                <ul className="space-y-2">
                  {news.highlights?.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(22,163,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Check style={{ width: 10, height: 10, color: "#16A34A" }} />
                      </span>
                      <span style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.55 }}>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk */}
            {risk && (
              <div style={cardStyle}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ShieldAlert style={{ width: 14, height: 14, color: "#EF4444" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Risk Factors</span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                    background: risk.overallRiskLevel === "High" ? "rgba(239,68,68,0.08)" : "rgba(217,119,6,0.08)",
                    border: `1px solid ${risk.overallRiskLevel === "High" ? "rgba(239,68,68,0.25)" : "rgba(217,119,6,0.25)"}`,
                    color: risk.overallRiskLevel === "High" ? "#EF4444" : "#D97706",
                  }}>{risk.overallRiskLevel} Risk</span>
                </div>
                <div className="mb-5">
                  <div style={{ height: 8, background: "rgba(0,0,0,0.06)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${riskPct}%`, height: "100%", borderRadius: 4,
                      background: riskPct > 65 ? "linear-gradient(90deg,#D97706,#EF4444)" : "linear-gradient(90deg,#16A34A,#D97706)",
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span style={{ fontSize: 10, color: "#9CA3AF" }}>Low Risk</span>
                    <span style={{ fontSize: 10, color: "#9CA3AF" }}>High Risk</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: "Regulatory", text: risk.regulatoryRisk },
                    { label: "Market", text: risk.marketRisk },
                    { label: "Operations", text: risk.businessRisk },
                  ].map((r) => (
                    <div key={r.label} style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 14, padding: "12px 14px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{r.label}</div>
                      <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Bull/Bear + Competition + Sources */}
          <div className="flex flex-col gap-5">

            {/* Bull Case */}
            {bullCase && (
              <div style={{ ...cardStyle, borderColor: "rgba(22,163,74,0.2)", background: "rgba(22,163,74,0.02)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 20 }}>🐂</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#16A34A" }}>Bull Case</span>
                </div>
                <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6, marginBottom: 12 }}>{bullCase.thesis}</p>
                <ul className="space-y-2">
                  {bullCase.supportingFacts?.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(22,163,74,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink: 0, marginTop: 1 }}>
                        <Check style={{ width: 10, height: 10, color: "#16A34A" }} />
                      </span>
                      <span style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.55 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bear Case */}
            {bearCase && (
              <div style={{ ...cardStyle, borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.02)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 20 }}>🐻</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#EF4444" }}>Bear Case</span>
                </div>
                <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6, marginBottom: 12 }}>{bearCase.thesis}</p>
                <ul className="space-y-2">
                  {bearCase.supportingFacts?.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", flexShrink: 0, marginTop: 6 }} />
                      <span style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.55 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Committee verdict */}
            {report.fullReasoning?.debateSummary && (
              <div style={{ ...cardStyle, borderColor: "rgba(124,58,237,0.18)", background: "rgba(124,58,237,0.03)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(124,58,237,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Star style={{ width: 14, height: 14, color: "#7C3AED" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>AI Committee Verdict</span>
                </div>
                <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.65, fontStyle: "italic" }}>
                  {report.fullReasoning.debateSummary}
                </p>
              </div>
            )}

            {/* Competitive Moat */}
            {competition && (
              <div style={cardStyle}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(217,119,6,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Award style={{ width: 14, height: 14, color: "#D97706" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Competitive Moat</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", color: "#D97706" }}>
                    {competition.moatRating}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {competition.competitors?.map((c: string) => (
                    <span key={c} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 8, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", color: "#4B5563", fontWeight: 500 }}>
                      {c}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.55 }}>{competition.moatAnalysis}</p>
              </div>
            )}

            {/* Sources */}
            {report.sources && report.sources.length > 0 && (
              <div style={cardStyle}>
                <div className="flex items-center gap-2 mb-3">
                  <Info style={{ width: 14, height: 14, color: "#9CA3AF" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Research Sources</span>
                </div>
                <ul className="space-y-2">
                  {report.sources.slice(0, 6).map((src, i) => (
                    <li key={i}>
                      <a href={src} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 group">
                        <span style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2, flexShrink: 0 }}>[{i+1}]</span>
                        <span style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.4, wordBreak: "break-all", transition: "color 0.15s" }}>
                          {src.replace(/^https?:\/\//, "").slice(0, 60)}…
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── INVESTMENT MEMO ── */}
        {memoMarkdown && (
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(124,58,237,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FileText style={{ width: 16, height: 16, color: "#7C3AED" }} />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", letterSpacing: "-0.01em" }}>
                  Investment Committee Memo
                </h2>
                <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>
                  AI-generated research report · {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(memoMarkdown) }} />
          </div>
        )}
      </div>
    </div>
  );
}
