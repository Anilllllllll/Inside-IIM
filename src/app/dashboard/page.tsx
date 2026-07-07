"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LiveWorkflow } from "@/components/LiveWorkflow";
import { Search, History, TrendingUp, Cpu, ShieldAlert, Award, FileText } from "lucide-react";

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

export default function DashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Fetch report history upon mounting
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to load reports history:", err);
      }
    }
    fetchHistory();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: query }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Graph execution failed.");
      }

      const report = await res.json();
      router.push(`/report/${report.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        <LiveWorkflow />
        <p className="text-neutral-500 text-xs mt-6 font-mono tracking-widest uppercase animate-pulse">
          Compiling data from Alpha Vantage & Tavily
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header Navigation */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 flex items-center justify-center font-bold text-white tracking-widest text-md shadow-[0_0_12px_rgba(99,102,241,0.4)]">
              IQ
            </div>
            <span className="font-semibold tracking-wider text-lg bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
              InvestIQ
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 font-mono">
            V1.0.0
          </div>
        </div>
      </header>

      {/* Main Grid Shell */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Welcome Callout Banner */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-100">
            AI Investment Research Terminal
          </h1>
          <p className="text-neutral-400 mt-2 text-md">
            Enter any public listed corporation. Our multi-agent state graph compiles ratios, news sentiments, competitor benchmarks, and risk profiles before issuing a decision.
          </p>
        </div>

        {/* Input Control Box */}
        <section className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-xl backdrop-blur mb-16">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Enter stock name or ticker (e.g. Tesla, AAPL, Nvidia)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-12 bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500/80 transition-all font-sans tracking-wide text-md"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold rounded-xl text-neutral-100 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.2)] flex items-center justify-center gap-2"
            >
              Analyze Equity
            </button>
          </form>
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-400 text-sm font-sans">
              {error}
            </div>
          )}
        </section>

        {/* Audit / Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="p-5 rounded-xl bg-neutral-900/20 border border-neutral-900">
            <Cpu className="w-8 h-8 text-indigo-400 mb-3" />
            <h3 className="font-semibold text-neutral-200">Parallel Research</h3>
            <p className="text-xs text-neutral-500 mt-1">Concurrently fetching financials & Google news feeds to speed up compilation.</p>
          </div>
          <div className="p-5 rounded-xl bg-neutral-900/20 border border-neutral-900">
            <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-semibold text-neutral-200">Adversarial Debates</h3>
            <p className="text-xs text-neutral-500 mt-1">Bull & Bear agents run opposing theses to reconcile risk vectors.</p>
          </div>
          <div className="p-5 rounded-xl bg-neutral-900/20 border border-neutral-900">
            <ShieldAlert className="w-8 h-8 text-rose-400 mb-3" />
            <h3 className="font-semibold text-neutral-200">Self-Critique Audits</h3>
            <p className="text-xs text-neutral-500 mt-1">Chief Risk Officer node rejects logical flaws or overconfident ratings.</p>
          </div>
          <div className="p-5 rounded-xl bg-neutral-900/20 border border-neutral-900">
            <Award className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-neutral-200">Grounded Logic</h3>
            <p className="text-xs text-neutral-500 mt-1">Strict type structures to avoid hallucinations and maintain math accuracy.</p>
          </div>
        </section>

        {/* History Table */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-neutral-400" />
            <h2 className="text-2xl font-bold tracking-tight text-neutral-200">Research Archives</h2>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-neutral-900 rounded-2xl bg-neutral-950">
              <FileText className="w-12 h-12 text-neutral-800 mx-auto mb-3" />
              <p className="text-neutral-500 text-sm">No analysis reports logged yet. Enter a query above to start.</p>
            </div>
          ) : (
            <div className="border border-neutral-900 rounded-xl overflow-hidden bg-neutral-900/20 shadow-lg">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-900 bg-neutral-950/60 text-xs font-mono uppercase text-neutral-500 tracking-wider">
                    <th className="px-6 py-4">Company / Symbol</th>
                    <th className="px-6 py-4">Decision Recommendation</th>
                    <th className="px-6 py-4">Confidence Score</th>
                    <th className="px-6 py-4">Executive Summary</th>
                    <th className="px-6 py-4 text-right">Archived Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-sm">
                  {history.map((item) => {
                    const recColor =
                      item.decision === "INVEST"
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                        : item.decision === "WATCH"
                        ? "bg-amber-950/40 text-amber-400 border-amber-900/50"
                        : "bg-rose-950/40 text-rose-400 border-rose-900/50";

                    return (
                      <tr
                        key={item.id}
                        onClick={() => router.push(`/report/${item.id}`)}
                        className="hover:bg-neutral-900/40 cursor-pointer transition-all"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-neutral-200">{item.companyName}</div>
                          <div className="text-xs text-neutral-500 font-mono mt-0.5">
                            {item.ticker} • {item.exchange}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold tracking-wide ${recColor}`}>
                            {item.decision}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-neutral-900 rounded-full h-1 border border-neutral-850 overflow-hidden">
                              <div
                                className="bg-indigo-500 h-1 rounded-full"
                                style={{ width: `${item.confidenceScore}%` }}
                              ></div>
                            </div>
                            <span className="font-mono text-neutral-300 font-semibold">{item.confidenceScore}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-neutral-400">
                          {item.summary}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-neutral-500 text-xs">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
