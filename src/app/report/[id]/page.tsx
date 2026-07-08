"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Printer, ShieldAlert, Award, AlertCircle, 
  FileText, TrendingUp, Info, BarChart2, CheckCircle2, 
  TrendingDown, Shield, Globe, Landmark, AlertTriangle 
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Cell
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

// Client-side helper to render markdown lines into HTML paragraphs, headings, and lists
function parseMarkdownToHtml(markdown: string) {
  if (!markdown) return "";
  
  return markdown
    .split("\n")
    .map((line) => {
      let trimmed = line.trim();
      
      // Headings
      if (trimmed.startsWith("# ")) {
        return `<h1 class="text-lg font-bold text-neutral-100 mt-4 mb-2 font-mono tracking-tight border-b border-[#1b1b1b] pb-1 uppercase">${trimmed.slice(2)}</h1>`;
      }
      if (trimmed.startsWith("## ")) {
        return `<h2 class="text-sm font-bold text-neutral-200 mt-4 mb-2 font-mono tracking-wider border-b border-neutral-900 pb-0.5 uppercase">${trimmed.slice(3)}</h2>`;
      }
      if (trimmed.startsWith("### ")) {
        return `<h3 class="text-xs font-bold text-neutral-300 mt-3 mb-1.5 font-mono uppercase">${trimmed.slice(4)}</h3>`;
      }
      
      // Horizontal dividers
      if (trimmed === "---") {
        return `<hr class="border-neutral-900 my-4" />`;
      }

      // Blockquotes
      if (trimmed.startsWith("> ")) {
        return `<blockquote class="border-l-2 border-neutral-500 bg-neutral-900/20 p-2.5 my-3 text-neutral-400 font-mono text-[11px] italic">${trimmed.slice(2)}</blockquote>`;
      }

      // Bullet Lists
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return `<li class="ml-4 list-disc text-neutral-400 my-1 font-mono leading-relaxed text-[11px]">${trimmed.slice(2)}</li>`;
      }

      // Empty Lines
      if (!trimmed) {
        return `<div class="h-2"></div>`;
      }

      // Bold formatting helper inside paragraphs
      let formattedLine = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-neutral-200">$1</strong>');

      return `<p class="text-neutral-400 font-mono leading-relaxed my-1 text-[11px]">${formattedLine}</p>`;
    })
    .join("");
}

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const reportId = resolvedParams.id;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch(`/api/reports?id=${reportId}`);
        if (!res.ok) {
          throw new Error("Report not found in archives.");
        }
        const data = await res.json();
        if (data) {
          if (typeof data.sources === "string") {
            try { data.sources = JSON.parse(data.sources); } catch (e) { data.sources = []; }
          }
          if (typeof data.fullReasoning === "string") {
            try { data.fullReasoning = JSON.parse(data.fullReasoning); } catch (e) { data.fullReasoning = {}; }
          }
          if (typeof data.agentTrace === "string") {
            try { data.agentTrace = JSON.parse(data.agentTrace); } catch (e) { data.agentTrace = {}; }
          }
        }
        setReport(data);
      } catch (err: any) {
        setError(err.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [reportId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-mono text-[10px] text-neutral-500">
        <div className="w-8 h-8 rounded-none border-2 border-neutral-700 border-t-transparent animate-spin mb-4"></div>
        <p className="tracking-widest uppercase">
          RETRIEVING STOCK DOSSIER FILES
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-mono text-xs text-neutral-500">
        <AlertCircle className="w-8 h-8 text-rose-500 mb-4" />
        <h2 className="text-sm font-bold text-neutral-200">Archive Error</h2>
        <p className="mt-1">{error || "Could not retrieve report data."}</p>
        <Link
          href="/dashboard"
          className="mt-6 px-4 py-2 bg-[#090909] border border-[#1b1b1b] rounded-none text-neutral-300 hover:bg-neutral-900 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
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

  // Generate simulated chart datasets based on metrics
  const pe = financial?.metrics?.peRatio || 22.4;
  const de = financial?.metrics?.debtToEquity || 0.50;
  const cr = financial?.metrics?.currentRatio || 1.50;
  
  // 1. Stock price trend points
  const priceTrend = [
    { name: "JAN", Price: pe > 40 ? 120.40 : pe > 25 ? 385.20 : 185.30 },
    { name: "FEB", Price: pe > 40 ? 126.80 : pe > 25 ? 370.40 : 194.20 },
    { name: "MAR", Price: pe > 40 ? 115.10 : pe > 25 ? 395.80 : 188.50 },
    { name: "APR", Price: pe > 40 ? 134.50 : pe > 25 ? 408.30 : 202.40 },
    { name: "MAY", Price: pe > 40 ? 122.30 : pe > 25 ? 392.10 : 198.60 },
    { name: "JUN", Price: pe > 40 ? 129.90 : pe > 25 ? 418.50 : 210.30 },
    { name: "JUL", Price: pe > 40 ? 141.20 : pe > 25 ? 430.70 : 224.50 },
  ];

  // 2. Health radar
  const healthStats = [
    { subject: "Valuation", value: Math.max(15, Math.min(95, 100 - pe * 1.5)) },
    { subject: "Leverage", value: Math.max(15, Math.min(95, 100 - de * 45)) },
    { subject: "Liquidity", value: Math.max(15, Math.min(95, cr * 40)) },
    { subject: "Earnings", value: Math.max(15, Math.min(95, (financial?.score || 5) * 9.5)) },
    { subject: "Moat", value: competition?.moatRating === "Strong" ? 95 : competition?.moatRating === "Average" ? 65 : 35 },
  ];

  // 3. Risk Gauge index
  const riskValue = risk?.overallRiskLevel === "High" ? 85 : risk?.overallRiskLevel === "Medium" ? 50 : 20;
  const riskData = [
    { name: "Risk Index", value: riskValue },
  ];

  // Decision indicators
  const isInvest = report.decision === "INVEST";
  const isPass = report.decision === "PASS";
  
  const recBadge = isInvest
    ? "text-emerald-500 border-emerald-950 bg-emerald-950/20"
    : isPass
    ? "text-rose-500 border-rose-950 bg-rose-950/20"
    : "text-amber-500 border-amber-950 bg-amber-950/20";

  return (
    <div className="min-h-screen bg-[#050505] text-[#b0b0b0] font-mono selection:bg-neutral-800 selection:text-white text-xs">
      
      {/* Printable Style Block to format PDF margins cleanly */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          header, button, a {
            display: none !important;
          }
          .print-container {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .card-bg {
            background-color: #f9f9f9 !important;
            border: 1px solid #e5e5e5 !important;
            color: black !important;
          }
          .text-neutral-100, .text-neutral-200, .text-neutral-300, .text-neutral-400 {
            color: black !important;
          }
          .border-neutral-900, .border-neutral-800 {
            border-color: #e5e5e5 !important;
          }
          li, p {
            color: #333333 !important;
          }
        }
      `}</style>

      {/* Header Bar */}
      <header className="border-b border-[#1b1b1b] bg-[#090909] px-4 h-12 flex items-center justify-between print:hidden select-none">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-all text-[10px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> ESC TO TERMINAL
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePrint}
            className="h-8 px-4 bg-[#0d0d0d] hover:bg-neutral-900 border border-[#1f1f1f] text-neutral-300 transition-all flex items-center gap-2 uppercase tracking-wide text-[10px]"
          >
            <Printer className="w-3.5 h-3.5" /> EXPORT REPORT (PDF)
          </button>
        </div>
      </header>

      {/* Main Report Container */}
      <div ref={reportRef} className="max-w-7xl mx-auto px-4 py-8 print-container">
        
        {/* Core Header Card */}
        <section className="bg-[#090909] border border-[#1b1b1b] p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest border border-neutral-800 px-1.5 py-0.5 bg-[#050505]">
                {report.exchange} Listed Equity
              </span>
              <h1 className="text-xl font-bold tracking-wider mt-3 text-neutral-100 uppercase">
                {report.companyName} ({report.ticker})
              </h1>
              <p className="text-neutral-400 mt-2 text-[11px] leading-relaxed italic border-l-2 border-neutral-800 pl-3">
                "{report.summary}"
              </p>
            </div>

            <div className="flex items-center gap-6 p-4 bg-[#050505] border border-[#1b1b1b] w-full lg:w-auto">
              <div>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">
                  Current Signal
                </span>
                <span className={`px-3 py-1 rounded-none border text-xs font-bold tracking-wider ${recBadge}`}>
                  {report.decision === "INVEST" ? "BUY" : report.decision === "PASS" ? "PASS" : "HOLD"}
                </span>
              </div>
              <div className="w-px h-8 bg-neutral-850"></div>
              <div>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">
                  AI Confidence
                </span>
                <span className="text-xl font-bold text-neutral-200 tracking-wide">
                  {report.confidenceScore}%
                </span>
              </div>
              <div className="w-px h-8 bg-neutral-850"></div>
              <div>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">
                  Market Sentiment
                </span>
                <span className={`text-xs font-bold ${news?.sentiment === "Bullish" ? "text-emerald-500" : news?.sentiment === "Bearish" ? "text-rose-500" : "text-amber-500"}`}>
                  {news?.sentiment || "NEUTRAL"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Detail Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* LEFT PANELS: Specialist Data feeds */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stock Overview Panel */}
            {financial && (
              <div className="p-5 bg-[#090909] border border-[#1b1b1b]">
                <div className="flex items-center gap-2 mb-4 border-b border-[#1b1b1b] pb-2">
                  <BarChart2 className="w-4 h-4 text-neutral-400" />
                  <span className="font-bold text-neutral-200 tracking-wider">STOCK OVERVIEW PANEL</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="p-3 bg-[#050505] border border-[#1b1b1b]">
                    <span className="text-[9px] text-neutral-500 block">MARKET CAP</span>
                    <span className="text-[11px] font-bold text-neutral-200">${(financial.metrics.marketCap / 1e9).toFixed(2)}B</span>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1b1b1b]">
                    <span className="text-[9px] text-neutral-500 block">P/E RATIO</span>
                    <span className="text-[11px] font-bold text-neutral-200">{financial.metrics.peRatio}</span>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1b1b1b]">
                    <span className="text-[9px] text-neutral-500 block">PEG RATIO</span>
                    <span className="text-[11px] font-bold text-neutral-200">{financial.metrics.pegRatio}</span>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1b1b1b]">
                    <span className="text-[9px] text-neutral-500 block">DEBT/EQUITY</span>
                    <span className="text-[11px] font-bold text-neutral-200">{financial.metrics.debtToEquity.toFixed(2)}</span>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1b1b1b]">
                    <span className="text-[9px] text-neutral-500 block">CURRENT RATIO</span>
                    <span className="text-[11px] font-bold text-neutral-200">{financial.metrics.currentRatio.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 leading-relaxed italic mb-4 p-2 bg-[#050505]/40 border border-[#1b1b1b] border-dashed">
                  "{financial.summary}"
                </p>

                {/* Annual reports list */}
                {financial.annualReports && financial.annualReports.length > 0 && (
                  <div className="border border-[#1b1b1b] overflow-hidden">
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b border-[#1b1b1b] bg-[#070707] text-neutral-500 uppercase font-bold">
                          <th className="px-3 py-2">Fiscal Year</th>
                          <th className="px-3 py-2">Total Revenue</th>
                          <th className="px-3 py-2">Net Income</th>
                          <th className="px-3 py-2 text-right">Operating Margin</th>
                          <th className="px-3 py-2 text-right">Net Margin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1b1b1b]">
                        {financial.annualReports.map((r: any) => (
                          <tr key={r.fiscalDateEnding} className="text-neutral-300 font-mono">
                            <td className="px-3 py-1.5">{r.fiscalDateEnding.slice(0, 4)}</td>
                            <td className="px-3 py-1.5">${(r.totalRevenue / 1e9).toFixed(2)}B</td>
                            <td className="px-3 py-1.5">${(r.netIncome / 1e9).toFixed(2)}B</td>
                            <td className="px-3 py-1.5 text-right text-emerald-500">{(r.operatingMargin * 100).toFixed(1)}%</td>
                            <td className="px-3 py-1.5 text-right text-neutral-400">{(r.netMargin * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* CHART SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Chart 1: Stock price trajectory */}
              <div className="p-4 bg-[#090909] border border-[#1b1b1b] h-64 flex flex-col justify-between">
                <span className="font-bold text-neutral-300 block mb-2 border-b border-[#1b1b1b] pb-1 uppercase tracking-wider text-[10px]">STOCK MOVEMENT CHART (EST.)</span>
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#555" fontSize={9} tickLine={false} />
                      <YAxis stroke="#555" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#090909", border: "1px solid #1b1b1b", fontSize: 10, color: "#fff" }} />
                      <Area type="monotone" dataKey="Price" stroke="#00ff66" fill="rgba(0, 255, 102, 0.05)" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Financial Health Radar */}
              <div className="p-4 bg-[#090909] border border-[#1b1b1b] h-64 flex flex-col justify-between">
                <span className="font-bold text-neutral-300 block mb-2 border-b border-[#1b1b1b] pb-1 uppercase tracking-wider text-[10px]">FINANCIAL HEALTH ANALYSIS</span>
                <div className="w-full h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={healthStats}>
                      <PolarGrid stroke="#222" />
                      <PolarAngleAxis dataKey="subject" stroke="#666" fontSize={8} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#222" tick={false} />
                      <Radar name="Meta" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* News Sentiment Feed */}
            {news && (
              <div className="p-5 bg-[#090909] border border-[#1b1b1b]">
                <div className="flex items-center justify-between mb-4 border-b border-[#1b1b1b] pb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-neutral-400" />
                    <span className="font-bold text-neutral-200 tracking-wider">NEWS INTEL & SENTIMENT</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                    news.sentiment === "Bullish" ? "text-emerald-500 border-emerald-950 bg-emerald-950/20" : "text-rose-500 border-rose-950 bg-rose-950/20"
                  }`}>
                    SENTIMENT: {news.sentiment.toUpperCase()}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-400 leading-relaxed mb-4">{news.summary}</p>

                <span className="text-[10px] text-neutral-500 font-bold block mb-2 uppercase">Core Press Highlights:</span>
                <ul className="space-y-1.5">
                  {news.highlights.map((h: string, index: number) => (
                    <li key={index} className="text-[11px] text-[#00ff66] flex items-start gap-2 leading-relaxed">
                      <span>•</span>
                      <span className="text-neutral-300">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Material Risks factors */}
            {risk && (
              <div className="p-5 bg-[#090909] border border-[#1b1b1b]">
                <div className="flex items-center justify-between mb-4 border-b border-[#1b1b1b] pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-neutral-400" />
                    <span className="font-bold text-neutral-200 tracking-wider">MATERIAL RISK VECTORS</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                    risk.overallRiskLevel === "High" ? "text-rose-500 border-rose-950 bg-rose-950/20" : "text-amber-500 border-amber-950 bg-amber-950/20"
                  }`}>
                    OVERALL: {risk.overallRiskLevel.toUpperCase()} RISK
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-[#050505] border border-[#1b1b1b]">
                    <span className="text-[9px] text-rose-400 block font-bold">REGULATORY & LEGAL</span>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">{risk.regulatoryRisk}</p>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1b1b1b]">
                    <span className="text-[9px] text-rose-450 block font-bold">MARKET & DEMAND</span>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">{risk.marketRisk}</p>
                  </div>
                  <div className="p-3 bg-[#050505] border border-[#1b1b1b]">
                    <span className="text-[9px] text-rose-460 block font-bold">BUSINESS OPERATIONS</span>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">{risk.businessRisk}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT PANELS: Adversarial Debates and Thesis */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Risk Index Meter Chart */}
            <div className="p-4 bg-[#090909] border border-[#1b1b1b] h-36 flex flex-col justify-between">
              <span className="font-bold text-neutral-300 block mb-2 border-b border-[#1b1b1b] pb-1 uppercase tracking-wider text-[10px]">RISK EXPOSURE METER</span>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full bg-[#050505] h-3 border border-[#1b1b1b] relative overflow-hidden">
                  <div 
                    className={`h-full ${
                      risk?.overallRiskLevel === "High" ? "bg-rose-500" : risk?.overallRiskLevel === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${riskValue}%` }}
                  ></div>
                </div>
                <div className="flex justify-between w-full text-[9px] text-neutral-600 mt-2">
                  <span>LOW EXPOSURE</span>
                  <span className="text-neutral-400 font-bold">{riskValue}% INDEX</span>
                  <span>HIGH EXPOSURE</span>
                </div>
              </div>
            </div>

            {/* Bull vs Bear columns (Stacked vertically in dense sidebar) */}
            {bullCase && bearCase && (
              <div className="p-5 bg-[#090909] border border-[#1b1b1b] space-y-4">
                <span className="font-bold text-neutral-300 block border-b border-[#1b1b1b] pb-1 uppercase tracking-wider text-[10px]">ADVERSARIAL CONFLICT</span>
                
                {/* Bull Case */}
                <div className="p-3 bg-[#050505] border border-emerald-950">
                  <span className="text-[9px] font-bold text-emerald-400 tracking-wide uppercase">🟢 LONG CASE THESIS</span>
                  <p className="text-[10px] text-neutral-300 mt-1.5 leading-relaxed">{bullCase.thesis}</p>
                  <ul className="mt-2 space-y-1 list-disc pl-4 text-neutral-400">
                    {bullCase.supportingFacts.map((f: string, i: number) => (
                      <li key={i} className="text-[10px] leading-relaxed">{f}</li>
                    ))}
                  </ul>
                </div>

                {/* Bear Case */}
                <div className="p-3 bg-[#050505] border border-rose-950">
                  <span className="text-[9px] font-bold text-rose-400 tracking-wide uppercase">🔴 SHORT CASE THESIS</span>
                  <p className="text-[10px] text-neutral-300 mt-1.5 leading-relaxed">{bearCase.thesis}</p>
                  <ul className="mt-2 space-y-1 list-disc pl-4 text-neutral-400">
                    {bearCase.supportingFacts.map((f: string, i: number) => (
                      <li key={i} className="text-[10px] leading-relaxed">{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Reconciled Debate Arb summary */}
            {report.fullReasoning?.debateSummary && (
              <div className="p-5 bg-[#090909] border border-[#1b1b1b]">
                <div className="flex items-center gap-2 mb-3 border-b border-[#1b1b1b] pb-1">
                  <TrendingUp className="w-4 h-4 text-neutral-400" />
                  <span className="font-bold text-neutral-200 tracking-wider">DEBATE RECONCILIATION</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed italic">
                  {report.fullReasoning.debateSummary}
                </p>
              </div>
            )}

            {/* Competitors List */}
            {competition && (
              <div className="p-5 bg-[#090909] border border-[#1b1b1b]">
                <div className="flex items-center justify-between mb-3 border-b border-[#1b1b1b] pb-1">
                  <span className="font-bold text-neutral-200 tracking-wider">COMPETITOR BENCHMARKS</span>
                  <span className="text-[9px] font-bold text-neutral-500 uppercase bg-[#050505] px-1 border border-neutral-850">
                    MOAT: {competition.moatRating}
                  </span>
                </div>
                
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {competition.competitors.map((c: string) => (
                    <span key={c} className="text-[9px] px-2 py-0.5 bg-[#050505] text-neutral-300 border border-neutral-850">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 mt-4 text-[10px] text-neutral-400">
                  <div>
                    <span className="text-[9px] text-neutral-500 block">MOAT ANALYSIS:</span>
                    <p className="mt-0.5 leading-relaxed">{competition.moatAnalysis}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 block">MARKET POSITION:</span>
                    <p className="mt-0.5 leading-relaxed">{competition.marketShareInfo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Citations List */}
            {report.sources && report.sources.length > 0 && (
              <div className="p-5 bg-[#090909] border border-[#1b1b1b] print:break-inside-avoid">
                <div className="flex items-center gap-2 mb-3 border-b border-[#1b1b1b] pb-1">
                  <Info className="w-4 h-4 text-neutral-500" />
                  <span className="font-bold text-neutral-400 uppercase tracking-wider text-[9px]">RESEARCH CITATIONS</span>
                </div>
                <ul className="space-y-1.5">
                  {report.sources.map((src, i) => (
                    <li key={i} className="text-[10px] truncate text-neutral-400 font-mono hover:text-[#00ff66]">
                      <a href={src} target="_blank" rel="noopener noreferrer">
                        [{i + 1}] {src}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>

        {/* SECTION 3: The Investment Memo (renders complete compiled markdown) */}
        {memoMarkdown && (
          <section className="p-6 bg-[#090909] border border-[#1b1b1b] print:break-before-page">
            <div className="flex items-center gap-2 mb-4 border-b border-[#1b1b1b] pb-2">
              <FileText className="w-5 h-5 text-neutral-400" />
              <span className="font-bold text-neutral-200 tracking-wider">INVESTMENT COMMITTEE MEMO</span>
            </div>
            
            <div
              className="prose prose-invert max-w-none text-neutral-400 font-mono"
              dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(memoMarkdown) }}
            />
          </section>
        )}

      </div>
    </div>
  );
}
