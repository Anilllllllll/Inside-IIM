"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, ShieldAlert, Award, AlertCircle, FileText, ChevronRight, TrendingUp, Info } from "lucide-react";

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

// Simple client-side helper to render markdown lines into HTML paragraphs, headings, and lists
function parseMarkdownToHtml(markdown: string) {
  if (!markdown) return "";
  
  return markdown
    .split("\n")
    .map((line) => {
      let trimmed = line.trim();
      
      // Headings
      if (trimmed.startsWith("# ")) {
        return `<h1 class="text-3xl font-extrabold text-neutral-100 mt-6 mb-4 font-sans tracking-tight border-b border-neutral-900 pb-2">${trimmed.slice(2)}</h1>`;
      }
      if (trimmed.startsWith("## ")) {
        return `<h2 class="text-2xl font-bold text-neutral-200 mt-6 mb-3 font-sans tracking-wide">${trimmed.slice(3)}</h2>`;
      }
      if (trimmed.startsWith("### ")) {
        return `<h3 class="text-xl font-bold text-neutral-350 mt-4 mb-2 font-sans">${trimmed.slice(4)}</h3>`;
      }
      
      // Horizontal dividers
      if (trimmed === "---") {
        return `<hr class="border-neutral-900 my-6" />`;
      }

      // Blockquotes
      if (trimmed.startsWith("> ")) {
        return `<blockquote class="border-l-4 border-indigo-500 bg-neutral-900/40 p-4 rounded-r-xl my-4 text-neutral-300 font-sans italic">${trimmed.slice(2)}</blockquote>`;
      }

      // Bullet Lists
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return `<li class="ml-6 list-disc text-neutral-300 my-1.5 font-sans leading-relaxed">${trimmed.slice(2)}</li>`;
      }

      // Empty Lines
      if (!trimmed) {
        return `<div class="h-2"></div>`;
      }

      // Bold formatting helper inside paragraphs
      let formattedLine = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-indigo-300">$1</strong>');

      return `<p class="text-neutral-300 font-sans leading-relaxed my-2 text-md">${formattedLine}</p>`;
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
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
        <p className="text-neutral-500 text-xs font-mono tracking-widest uppercase">
          Loading report dossiers
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-semibold text-neutral-200">Archive Error</h2>
        <p className="text-neutral-500 text-sm mt-1">{error || "Could not retrieve report data."}</p>
        <Link
          href="/dashboard"
          className="mt-6 px-5 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-350 hover:bg-neutral-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Terminal
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

  // Decision coloring parameters
  const recColors =
    report.decision === "INVEST"
      ? { bg: "bg-emerald-950/40 border-emerald-900/50 text-emerald-400", fill: "bg-emerald-400" }
      : report.decision === "WATCH"
      ? { bg: "bg-amber-950/40 border-amber-900/50 text-amber-400", fill: "bg-amber-400" }
      : { bg: "bg-rose-950/40 border-rose-900/50 text-rose-400", fill: "bg-rose-400" };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
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
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-sm text-neutral-300 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Export Report (PDF)
            </button>
          </div>
        </div>
      </header>

      {/* Main Report Container */}
      <div ref={reportRef} className="max-w-7xl mx-auto px-6 py-12 print-container">
        
        {/* Core Header Card */}
        <section className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-900 backdrop-blur mb-8 card-bg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest bg-neutral-950 px-2 py-0.5 rounded border border-neutral-850">
                {report.exchange} Listed Equity
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight mt-2 text-neutral-100">
                {report.companyName} ({report.ticker})
              </h1>
              <p className="text-neutral-400 mt-2 max-w-2xl text-sm leading-relaxed">
                {report.summary}
              </p>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-xl bg-neutral-950/50 border border-neutral-900">
              <div>
                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest block mb-1.5">
                  Recommendation
                </span>
                <span className={`px-4 py-1.5 rounded-full border text-sm font-extrabold tracking-widest ${recColors.bg}`}>
                  {report.decision}
                </span>
              </div>
              <div className="w-px h-10 bg-neutral-900"></div>
              <div>
                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest block mb-1">
                  Confidence Score
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-neutral-100 font-sans tracking-wide">
                    {report.confidenceScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Detail Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* LEFT PANELS: Specialist Data feeds */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Fundamentals Analyst Ratios */}
            {financial && (
              <div className="p-6 rounded-xl bg-neutral-900/10 border border-neutral-900 card-bg">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold tracking-wide text-neutral-200">Financial Profile & Ratios</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-900">
                    <span className="text-xs text-neutral-500 font-mono block">P/E Ratio</span>
                    <span className="text-lg font-bold text-neutral-200 font-sans tracking-wide">{financial.metrics.peRatio}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-900">
                    <span className="text-xs text-neutral-500 font-mono block">PEG Ratio</span>
                    <span className="text-lg font-bold text-neutral-200 font-sans tracking-wide">{financial.metrics.pegRatio}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-900">
                    <span className="text-xs text-neutral-500 font-mono block">Debt-to-Equity</span>
                    <span className="text-lg font-bold text-neutral-200 font-sans tracking-wide">{financial.metrics.debtToEquity.toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-900">
                    <span className="text-xs text-neutral-500 font-mono block">Current Ratio</span>
                    <span className="text-lg font-bold text-neutral-200 font-sans tracking-wide">{financial.metrics.currentRatio.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-sm text-neutral-400 leading-relaxed italic mb-6">
                  "{financial.summary}"
                </p>

                {/* Annual reports list */}
                {financial.annualReports && financial.annualReports.length > 0 && (
                  <div className="border border-neutral-900 rounded-lg overflow-hidden bg-neutral-950/30">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-900 bg-neutral-950/60 font-mono text-neutral-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Fiscal Date</th>
                          <th className="px-4 py-3">Total Revenue</th>
                          <th className="px-4 py-3">Net Income</th>
                          <th className="px-4 py-3">Operating Margin</th>
                          <th className="px-4 py-3">Net Margin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900">
                        {financial.annualReports.map((r: any) => (
                          <tr key={r.fiscalDateEnding} className="text-neutral-300 font-sans">
                            <td className="px-4 py-2.5 font-mono">{r.fiscalDateEnding}</td>
                            <td className="px-4 py-2.5">$${(r.totalRevenue / 1e9).toFixed(2)}B</td>
                            <td className="px-4 py-2.5">$${(r.netIncome / 1e9).toFixed(2)}B</td>
                            <td className="px-4 py-2.5 font-mono text-emerald-400">{(r.operatingMargin * 100).toFixed(1)}%</td>
                            <td className="px-4 py-2.5 font-mono text-indigo-400">{(r.netMargin * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Competitors and Moat Analysis */}
            {competition && (
              <div className="p-6 rounded-xl bg-neutral-900/10 border border-neutral-900 card-bg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold tracking-wide text-neutral-200">Competitive Moat Analysis</h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">
                    Moat: {competition.moatRating}
                  </span>
                </div>
                
                <div className="flex gap-2 flex-wrap mb-4">
                  {competition.competitors.map((c: string) => (
                    <span key={c} className="text-xs px-2.5 py-1 rounded bg-neutral-950 text-neutral-400 border border-neutral-850">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 mt-4">
                  <div>
                    <h5 className="text-xs text-neutral-500 font-mono uppercase tracking-wide">Moat Evaluation</h5>
                    <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{competition.moatAnalysis}</p>
                  </div>
                  <div>
                    <h5 className="text-xs text-neutral-500 font-mono uppercase tracking-wide">Market Share Context</h5>
                    <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{competition.marketShareInfo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* News Sentiment Feed */}
            {news && (
              <div className="p-6 rounded-xl bg-neutral-900/10 border border-neutral-900 card-bg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold tracking-wide text-neutral-200">News Sentiment</h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-900">
                    Sentiment: {news.sentiment}
                  </span>
                </div>

                <p className="text-sm text-neutral-300 mt-1 leading-relaxed mb-4">{news.summary}</p>

                <h5 className="text-xs text-neutral-500 font-mono uppercase tracking-wide mb-2">Key News Highlights</h5>
                <ul className="space-y-1.5 list-disc pl-5">
                  {news.highlights.map((h: string, index: number) => (
                    <li key={index} className="text-sm text-neutral-300 font-sans leading-relaxed">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Material Risks factors */}
            {risk && (
              <div className="p-6 rounded-xl bg-neutral-900/10 border border-neutral-900 card-bg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <h3 className="text-lg font-bold tracking-wide text-neutral-200">Material Risk Factors</h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-900">
                    Overall: {risk.overallRiskLevel} Risk
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs text-rose-450 font-mono uppercase tracking-wide">Regulatory & Legal Risks</h5>
                    <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{risk.regulatoryRisk}</p>
                  </div>
                  <div>
                    <h5 className="text-xs text-rose-455 font-mono uppercase tracking-wide">Market & Demand Headwinds</h5>
                    <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{risk.marketRisk}</p>
                  </div>
                  <div>
                    <h5 className="text-xs text-rose-460 font-mono uppercase tracking-wide">Business & Operational Complexity</h5>
                    <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{risk.businessRisk}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT PANELS: Adversarial Debates and Thesis */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Bull vs Bear columns */}
            {bullCase && bearCase && (
              <div className="p-6 rounded-xl bg-neutral-900/10 border border-neutral-900 card-bg">
                <h3 className="text-lg font-bold tracking-wide text-neutral-200 mb-6 font-sans">Adversarial Long vs Short</h3>
                
                <div className="space-y-6">
                  {/* Bull Case */}
                  <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                    <h4 className="text-sm font-bold text-emerald-400 font-sans tracking-wide uppercase">BULL CASE THESIS</h4>
                    <p className="text-xs text-neutral-300 mt-2 leading-relaxed">{bullCase.thesis}</p>
                    <ul className="mt-3 space-y-1 list-disc pl-4">
                      {bullCase.supportingFacts.map((f: string, i: number) => (
                        <li key={i} className="text-[11px] text-neutral-400 font-sans leading-relaxed">{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Bear Case */}
                  <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/30">
                    <h4 className="text-sm font-bold text-rose-400 font-sans tracking-wide uppercase">BEAR CASE THESIS</h4>
                    <p className="text-xs text-neutral-300 mt-2 leading-relaxed">{bearCase.thesis}</p>
                    <ul className="mt-3 space-y-1 list-disc pl-4">
                      {bearCase.supportingFacts.map((f: string, i: number) => (
                        <li key={i} className="text-[11px] text-neutral-400 font-sans leading-relaxed">{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Reconciled Debate Arb summary */}
            {report.fullReasoning?.debateSummary && (
              <div className="p-6 rounded-xl bg-neutral-900/10 border border-neutral-900 card-bg">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold tracking-wide text-neutral-200 font-sans">Debate Reconciliation</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans italic">
                  {report.fullReasoning.debateSummary}
                </p>
              </div>
            )}

            {/* Citations List */}
            {report.sources && report.sources.length > 0 && (
              <div className="p-6 rounded-xl bg-neutral-900/10 border border-neutral-900 card-bg print:break-inside-avoid">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-4 h-4 text-neutral-500" />
                  <h3 className="text-sm font-bold tracking-wide text-neutral-400 uppercase font-sans">Research Citations</h3>
                </div>
                <ul className="space-y-1.5">
                  {report.sources.map((src, i) => (
                    <li key={i} className="text-xs truncate text-indigo-400 font-mono hover:underline">
                      <a href={src} target="_blank" rel="noopener noreferrer">
                        {src}
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
          <section className="p-8 rounded-2xl bg-neutral-900/20 border border-neutral-900 card-bg print:break-before-page">
            <div className="flex items-center gap-2 mb-6 border-b border-neutral-900 pb-4">
              <FileText className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-bold tracking-tight text-neutral-200 font-sans">Investment Committee Memo</h2>
            </div>
            
            <div
              className="prose prose-invert max-w-none text-neutral-300"
              dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(memoMarkdown) }}
            />
          </section>
        )}

      </div>
    </div>
  );
}
