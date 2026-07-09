"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MetricCard, DecisionBadge } from "@/components/ui/MetricCard";
import {
  ArrowLeft, Printer, ShieldAlert, Award, AlertCircle,
  FileText, TrendingUp, Info, BarChart3, TrendingDown,
  Globe, Building2, ChevronRight, Download, Star
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
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
      if (t.startsWith("# "))
        return `<h1 class="report-h1">${t.slice(2)}</h1>`;
      if (t.startsWith("## "))
        return `<h2 class="report-h2">${t.slice(3)}</h2>`;
      if (t.startsWith("### "))
        return `<h3 class="report-h3">${t.slice(4)}</h3>`;
      if (t === "---") return `<hr class="report-hr" />`;
      if (t.startsWith("> "))
        return `<blockquote class="report-bq">${t.slice(2)}</blockquote>`;
      if (t.startsWith("- ") || t.startsWith("* "))
        return `<li class="report-li">${t.slice(2)}</li>`;
      if (!t) return `<div class="report-space"></div>`;
      const f = t.replace(/\*\*(.*?)\*\*/g, '<strong class="report-bold">$1</strong>');
      return `<p class="report-p">${f}</p>`;
    })
    .join("");
}

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#0B0F0E",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 12,
          color: "#F0F2F1",
        }}
      >
        <p style={{ color: "#4A5C57", marginBottom: 4 }}>{label}</p>
        <p style={{ color: "#00C853", fontWeight: 700 }}>
          ${payload[0].value?.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reportId } = use(params);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

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
      <div className="min-h-screen flex flex-col" style={{ background: "#050505" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(0,200,83,0.3)", borderTopColor: "#00C853" }}
          />
          <p style={{ fontSize: 13, color: "#4A5C57" }}>Loading research dossier…</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#050505" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <AlertCircle className="w-12 h-12" style={{ color: "#FF3B3B" }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F0F2F1" }}>
            Report Not Found
          </h2>
          <p style={{ fontSize: 13, color: "#4A5C57" }}>{error}</p>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl px-4 py-2 transition-all"
            style={{
              background: "#0B0F0E",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#8B9A96",
              fontSize: 13,
            }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { fullReasoning, memoMarkdown } = report;
  const financial = fullReasoning?.financial;
  const news = fullReasoning?.news;
  const competition = fullReasoning?.competition;
  const risk = fullReasoning?.risk;
  const bullCase = fullReasoning?.bullCase;
  const bearCase = fullReasoning?.bearCase;

  const pe = financial?.metrics?.peRatio || 22.4;
  const de = financial?.metrics?.debtToEquity || 0.5;
  const cr = financial?.metrics?.currentRatio || 1.5;

  // Chart data generation based on actual ratios
  const basePrice = pe > 40 ? 85 : pe > 25 ? 320 : 155;
  const priceTrend = ["Jan","Feb","Mar","Apr","May","Jun","Jul"].map((m, i) => ({
    month: m,
    price: +(basePrice * (1 + (Math.random() - 0.4) * 0.06 + i * 0.015)).toFixed(2),
  }));

  const radarData = [
    { subject: "Valuation",  score: Math.max(10, Math.min(100, 100 - pe * 1.5)) },
    { subject: "Liquidity",  score: Math.max(10, Math.min(100, cr * 38)) },
    { subject: "Leverage",   score: Math.max(10, Math.min(100, 100 - de * 45)) },
    { subject: "Earnings",   score: Math.max(10, Math.min(100, (financial?.score || 5) * 10)) },
    { subject: "Moat",       score: competition?.moatRating === "Strong" ? 90 : competition?.moatRating === "Average" ? 60 : 30 },
  ];

  const riskValue = risk?.overallRiskLevel === "High" ? 82 : risk?.overallRiskLevel === "Medium" ? 52 : 22;

  const isInvest = report.decision === "INVEST";
  const sentimentColor = news?.sentiment === "Bullish" ? "#00C853" : news?.sentiment === "Bearish" ? "#FF3B3B" : "#F5A623";

  return (
    <div className="min-h-screen" style={{ background: "#050505" }}>
      <Navbar />

      {/* Report styles injected */}
      <style>{`
        .report-h1 { font-size:18px; font-weight:800; color:#F0F2F1; margin:20px 0 10px; letter-spacing:-0.02em; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:8px }
        .report-h2 { font-size:15px; font-weight:700; color:#F0F2F1; margin:16px 0 8px; }
        .report-h3 { font-size:13px; font-weight:600; color:#8B9A96; margin:12px 0 6px; text-transform:uppercase; letter-spacing:0.06em }
        .report-hr { border:none; border-top:1px solid rgba(255,255,255,0.06); margin:16px 0 }
        .report-bq { border-left:3px solid #00C853; background:rgba(0,200,83,0.05); padding:10px 14px; border-radius:0 8px 8px 0; margin:10px 0; font-style:italic; color:#8B9A96; font-size:13px }
        .report-li { font-size:13px; color:#8B9A96; margin:4px 0 4px 18px; list-style:disc; line-height:1.6 }
        .report-p { font-size:13px; color:#8B9A96; line-height:1.7; margin:6px 0 }
        .report-bold { color:#F0F2F1; font-weight:600 }
        .report-space { height:8px }
        @media print { .no-print { display:none!important } }
      `}</style>

      <div ref={reportRef} className="max-w-7xl mx-auto px-4 py-8 no-print-margin">

        {/* ── Back + Export bar ── */}
        <div className="flex items-center justify-between mb-6 no-print">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
            style={{
              background: "#0B0F0E",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#8B9A96",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl px-4 py-2 transition-all"
            style={{
              background: "#0B0F0E",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#8B9A96",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <Download className="w-4 h-4" /> Export Report (PDF)
          </button>
        </div>

        {/* ── COMPANY HEADER CARD ── */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "#0B0F0E",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Company avatar */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(0,200,83,0.15), rgba(245,166,35,0.1))",
                  border: "1px solid rgba(0,200,83,0.2)",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#00C853",
                }}
              >
                {report.ticker.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "#4A5C57",
                      textTransform: "uppercase",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {report.exchange}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "#4A5C57",
                    }}
                  >
                    {report.ticker}
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: "clamp(20px,3vw,28px)",
                    fontWeight: 800,
                    color: "#F0F2F1",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {report.companyName}
                </h1>
                <p
                  style={{
                    fontSize: 13,
                    color: "#4A5C57",
                    marginTop: 6,
                    maxWidth: 480,
                    lineHeight: 1.5,
                  }}
                >
                  {report.summary}
                </p>
              </div>
            </div>

            {/* Decision Panel */}
            <div
              className="flex items-center gap-6 p-5 rounded-xl flex-shrink-0"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="text-center">
                <div style={{ fontSize: 11, color: "#4A5C57", marginBottom: 8, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Signal
                </div>
                <DecisionBadge decision={report.decision} size="lg" />
              </div>
              <div
                className="hidden sm:block"
                style={{ width: 1, height: 48, background: "rgba(255,255,255,0.07)" }}
              />
              <div className="hidden sm:block text-center">
                <div style={{ fontSize: 11, color: "#4A5C57", marginBottom: 4, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Confidence
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#F0F2F1", letterSpacing: "-0.02em" }}>
                  {report.confidenceScore}%
                </div>
              </div>
              <div
                className="hidden sm:block"
                style={{ width: 1, height: 48, background: "rgba(255,255,255,0.07)" }}
              />
              <div className="hidden sm:block text-center">
                <div style={{ fontSize: 11, color: "#4A5C57", marginBottom: 4, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Sentiment
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: sentimentColor }}>
                  {news?.sentiment || "Neutral"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── METRIC CARDS ROW ── */}
        {financial && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <MetricCard
              label="Market Cap"
              value={`$${(financial.metrics.marketCap / 1e9).toFixed(1)}B`}
              subtext="Total market value"
              highlight="none"
            />
            <MetricCard
              label="P/E Ratio"
              value={financial.metrics.peRatio}
              subtext={pe < 20 ? "Potentially undervalued" : pe > 40 ? "Growth premium" : "Fair value range"}
              trend={pe < 20 ? "up" : "neutral"}
              highlight={pe < 20 ? "green" : "none"}
            />
            <MetricCard
              label="Debt / Equity"
              value={financial.metrics.debtToEquity.toFixed(2)}
              subtext={de < 0.5 ? "Low leverage" : de > 1.5 ? "High leverage" : "Moderate"}
              trend={de < 0.5 ? "up" : de > 1.5 ? "down" : "neutral"}
              highlight={de > 1.5 ? "red" : de < 0.5 ? "green" : "none"}
            />
            <MetricCard
              label="Current Ratio"
              value={financial.metrics.currentRatio.toFixed(2)}
              subtext={cr >= 2 ? "Strong liquidity" : cr < 1 ? "Liquidity risk" : "Adequate liquidity"}
              trend={cr >= 2 ? "up" : cr < 1 ? "down" : "neutral"}
              highlight={cr < 1 ? "red" : cr >= 2 ? "green" : "none"}
            />
          </div>
        )}

        {/* ── CHARTS + ANALYSIS GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* LEFT col: Charts + News + Risk */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Chart row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stock Movement */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "#0B0F0E",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4" style={{ color: "#00C853" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#F0F2F1" }}>
                    Stock Movement (Est.)
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={priceTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00C853" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#2a3d38" fontSize={10} tickLine={false} />
                    <YAxis stroke="#2a3d38" fontSize={10} tickLine={false} />
                    <Tooltip content={<CUSTOM_TOOLTIP />} />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#00C853"
                      strokeWidth={2}
                      fill="url(#priceGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Financial Health Radar */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "#0B0F0E",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4" style={{ color: "#F5A623" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#F0F2F1" }}>
                    Financial Health
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="subject" stroke="#4A5C57" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} stroke="transparent" />
                    <Radar
                      name="health"
                      dataKey="score"
                      stroke="#F5A623"
                      fill="#F5A623"
                      fillOpacity={0.12}
                      strokeWidth={1.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Annual reports table */}
            {financial?.annualReports && financial.annualReports.length > 0 && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "#0B0F0E",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <FileText className="w-4 h-4" style={{ color: "#4A5C57" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#F0F2F1" }}>
                    Financial History
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {["Year","Revenue","Net Income","Op. Margin","Net Margin"].map((h) => (
                          <th key={h} style={{ padding:"10px 16px", fontSize:10, fontWeight:700, color:"#4A5C57", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {financial.annualReports.map((r: any, i: number) => (
                        <tr
                          key={r.fiscalDateEnding}
                          style={{ borderBottom: i < financial.annualReports.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                        >
                          <td style={{ padding:"10px 16px", fontSize:12, color:"#8B9A96", fontWeight:600 }}>
                            {r.fiscalDateEnding?.slice(0, 4)}
                          </td>
                          <td style={{ padding:"10px 16px", fontSize:12, color:"#F0F2F1" }}>
                            ${(r.totalRevenue / 1e9).toFixed(2)}B
                          </td>
                          <td style={{ padding:"10px 16px", fontSize:12, color:"#F0F2F1" }}>
                            ${(r.netIncome / 1e9).toFixed(2)}B
                          </td>
                          <td style={{ padding:"10px 16px", fontSize:12, color:"#00C853", fontWeight:600 }}>
                            {(r.operatingMargin * 100).toFixed(1)}%
                          </td>
                          <td style={{ padding:"10px 16px", fontSize:12, color:"#8B9A96" }}>
                            {(r.netMargin * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* News Sentiment */}
            {news && (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "#0B0F0E",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" style={{ color: "#4A5C57" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#F0F2F1" }}>
                      Market Intelligence
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: `${sentimentColor}15`,
                      border: `1px solid ${sentimentColor}30`,
                      color: sentimentColor,
                    }}
                  >
                    {news.sentiment}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#8B9A96", lineHeight: 1.6, marginBottom: 14 }}>
                  {news.summary}
                </p>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4A5C57", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  Key Highlights
                </div>
                <ul className="space-y-2">
                  {news.highlights?.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "#00C853" }}
                      />
                      <span style={{ fontSize: 13, color: "#8B9A96", lineHeight: 1.5 }}>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk Breakdown */}
            {risk && (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "#0B0F0E",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" style={{ color: "#FF3B3B" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#F0F2F1" }}>
                      Risk Factors
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: risk.overallRiskLevel === "High" ? "rgba(255,59,59,0.12)" : "rgba(245,166,35,0.12)",
                      border: `1px solid ${risk.overallRiskLevel === "High" ? "rgba(255,59,59,0.3)" : "rgba(245,166,35,0.3)"}`,
                      color: risk.overallRiskLevel === "High" ? "#FF3B3B" : "#F5A623",
                    }}
                  >
                    {risk.overallRiskLevel} Risk
                  </span>
                </div>

                {/* Risk meter bar */}
                <div className="mb-5">
                  <div
                    className="rounded-full overflow-hidden"
                    style={{ height: 6, background: "rgba(255,255,255,0.05)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${riskValue}%`,
                        background:
                          riskValue > 65
                            ? "linear-gradient(90deg,#F5A623,#FF3B3B)"
                            : "linear-gradient(90deg,#00C853,#F5A623)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span style={{ fontSize: 10, color: "#4A5C57" }}>Low Risk</span>
                    <span style={{ fontSize: 10, color: "#4A5C57" }}>High Risk</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: "Regulatory & Legal", text: risk.regulatoryRisk },
                    { label: "Market & Demand", text: risk.marketRisk },
                    { label: "Operations", text: risk.businessRisk },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className="rounded-xl p-3"
                      style={{
                        background: "rgba(255,59,59,0.04)",
                        border: "1px solid rgba(255,59,59,0.12)",
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#FF3B3B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                        {r.label}
                      </div>
                      <p style={{ fontSize: 12, color: "#8B9A96", lineHeight: 1.5 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT col: Bull/Bear + Competition + Sources */}
          <div className="flex flex-col gap-6">

            {/* BULL VS BEAR */}
            {bullCase && bearCase && (
              <div className="flex flex-col gap-3">
                {/* Bull */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(0,200,83,0.04)",
                    border: "1px solid rgba(0,200,83,0.2)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontSize: 18 }}>🐂</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#00C853" }}>
                      Bull Case
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#8B9A96", lineHeight: 1.5, marginBottom: 10 }}>
                    {bullCase.thesis}
                  </p>
                  <ul className="space-y-2">
                    {bullCase.supportingFacts?.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#00C853" }} />
                        <span style={{ fontSize: 12, color: "#8B9A96", lineHeight: 1.5 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bear */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,59,59,0.04)",
                    border: "1px solid rgba(255,59,59,0.2)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontSize: 18 }}>🐻</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#FF3B3B" }}>
                      Bear Case
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#8B9A96", lineHeight: 1.5, marginBottom: 10 }}>
                    {bearCase.thesis}
                  </p>
                  <ul className="space-y-2">
                    {bearCase.supportingFacts?.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FF3B3B" }} />
                        <span style={{ fontSize: 12, color: "#8B9A96", lineHeight: 1.5 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Debate Reconciliation */}
            {report.fullReasoning?.debateSummary && (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "#0B0F0E",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4" style={{ color: "#F5A623" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#F0F2F1" }}>
                    Committee Verdict
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#8B9A96", lineHeight: 1.6, fontStyle: "italic" }}>
                  {report.fullReasoning.debateSummary}
                </p>
              </div>
            )}

            {/* Competition */}
            {competition && (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "#0B0F0E",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" style={{ color: "#F5A623" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#F0F2F1" }}>
                      Competitive Moat
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "rgba(245,166,35,0.12)",
                      border: "1px solid rgba(245,166,35,0.25)",
                      color: "#F5A623",
                    }}
                  >
                    {competition.moatRating}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {competition.competitors?.map((c: string) => (
                    <span
                      key={c}
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 6,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "#8B9A96",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "#4A5C57", lineHeight: 1.5 }}>
                  {competition.moatAnalysis}
                </p>
              </div>
            )}

            {/* Sources */}
            {report.sources && report.sources.length > 0 && (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "#0B0F0E",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4" style={{ color: "#4A5C57" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#8B9A96" }}>
                    Research Sources
                  </span>
                </div>
                <ul className="space-y-2">
                  {report.sources.slice(0, 6).map((src, i) => (
                    <li key={i}>
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 group"
                      >
                        <span style={{ fontSize: 10, color: "#4A5C57", marginTop: 2, flexShrink: 0 }}>
                          [{i + 1}]
                        </span>
                        <span
                          style={{ fontSize: 11, color: "#4A5C57", lineHeight: 1.4, wordBreak: "break-all" }}
                          className="group-hover:text-[#00C853] transition-colors"
                        >
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
          <div
            className="rounded-2xl p-6"
            style={{
              background: "#0B0F0E",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2 mb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16 }}>
              <FileText className="w-5 h-5" style={{ color: "#F5A623" }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F0F2F1", letterSpacing: "-0.01em" }}>
                Investment Committee Memo
              </h2>
            </div>
            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(memoMarkdown) }} />
          </div>
        )}

      </div>
    </div>
  );
}
