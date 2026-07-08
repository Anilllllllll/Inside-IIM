"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LiveWorkflow } from "@/components/LiveWorkflow";
import { 
  Search, History, TrendingUp, Cpu, ShieldAlert, 
  Activity, ArrowRight, BarChart2, Globe, Clock, CheckCircle2 
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

export default function DashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentDate, setCurrentDate] = useState("");

  // Set date client-side only to prevent hydration mismatch
  useEffect(() => {
    const d = new Date();
    setCurrentDate(d.toLocaleDateString(undefined, { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).toUpperCase());
  }, []);

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

  const setQuickSearch = (val: string) => {
    setQuery(val);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 select-none font-mono">
        <LiveWorkflow />
        <p className="text-neutral-600 text-[10px] mt-6 tracking-widest uppercase animate-pulse">
          CONNECTING ALPHA_VANTAGE • TAVILY SCANNERS • GRAPH SERVER
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#b0b0b0] font-mono selection:bg-neutral-800 selection:text-white text-xs">
      
      {/* 1. Market Header Bar */}
      <header className="border-b border-[#1b1b1b] bg-[#090909] px-4 h-12 flex items-center justify-between select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-neutral-100 tracking-wider text-sm">INVESTIQ//TERMINAL</span>
            <span className="text-[10px] text-neutral-600 border border-neutral-800 px-1 rounded">V1.2</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[10px] text-neutral-500 border-l border-neutral-850 pl-6">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>MARKET STATUS: <strong className="text-emerald-500">OPEN</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>AI NODES: <strong className="text-neutral-300">ONLINE (LLAMA 3.1/3.3)</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-neutral-400">
          <span>{currentDate || "LOADING SYSTEM DATE"}</span>
          <span className="bg-[#121212] px-2 py-0.5 border border-[#202020] text-[#00ff66] font-semibold">SECURED</span>
        </div>
      </header>

      {/* Ticker Tape */}
      <div className="border-b border-[#1b1b1b] bg-[#070707] px-4 py-1.5 text-[10px] flex gap-6 overflow-x-auto select-none no-scrollbar">
        <div className="flex gap-1.5"><span className="text-neutral-500">AAPL:</span><span className="text-neutral-200">224.50</span><span className="text-emerald-500">+1.24%</span></div>
        <div className="flex gap-1.5"><span className="text-neutral-500">MSFT:</span><span className="text-neutral-200">415.80</span><span className="text-rose-500">-0.32%</span></div>
        <div className="flex gap-1.5"><span className="text-neutral-500">TSLA:</span><span className="text-neutral-200">248.10</span><span className="text-emerald-500">+4.82%</span></div>
        <div className="flex gap-1.5"><span className="text-neutral-500">NVDA:</span><span className="text-neutral-200">128.40</span><span className="text-emerald-500">+2.15%</span></div>
        <div className="flex gap-1.5"><span className="text-neutral-500">META:</span><span className="text-neutral-200">512.90</span><span className="text-rose-500">-1.42%</span></div>
        <div className="flex gap-1.5"><span className="text-neutral-500">AMZN:</span><span className="text-neutral-200">189.60</span><span className="text-neutral-400">0.00%</span></div>
      </div>

      {/* Main Grid Shell */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Input Control Box */}
        <section className="bg-[#090909] border border-[#1b1b1b] p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-neutral-200 tracking-wider">EQUITY SEARCH TERMINAL</h2>
            <p className="text-neutral-500 text-[10px] mt-1 uppercase">
              Submit listed equity symbol or corporate profile. Multi-agent state graph will invoke parallel research and cro audits.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
              <input
                type="text"
                placeholder="ENTER SEARCH QUERY (e.g. Meta, MSFT, Apple)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-10 bg-[#050505] border border-[#1b1b1b] rounded-none pl-10 pr-4 text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-neutral-500 transition-all font-mono tracking-wide text-xs"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-8 bg-neutral-200 hover:bg-white text-[#050505] font-bold rounded-none uppercase transition-all tracking-wider text-[11px] flex items-center justify-center gap-2"
            >
              RUN ANALYSIS
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* 2. Quick Search tags */}
          <div className="mt-3 flex items-center gap-2 text-[10px] text-neutral-500">
            <span>QUICK LINKS:</span>
            <button onClick={() => setQuickSearch("Microsoft")} className="text-neutral-400 hover:text-white underline">MSFT</button>
            <span>/</span>
            <button onClick={() => setQuickSearch("Tesla")} className="text-neutral-400 hover:text-white underline">Tesla</button>
            <span>/</span>
            <button onClick={() => setQuickSearch("Apple")} className="text-neutral-400 hover:text-white underline">Apple</button>
            <span>/</span>
            <button onClick={() => setQuickSearch("Meta")} className="text-neutral-400 hover:text-white underline">Meta</button>
          </div>

          {error && (
            <div className="mt-4 p-3 border border-rose-900 bg-rose-950/20 text-rose-400 text-[11px]">
              {error}
            </div>
          )}
        </section>

        {/* 3. Market Status / Agents Status Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-[#090909] border border-[#1b1b1b] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-neutral-300">AI RESEARCH ENGINE</span>
              <Cpu className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="text-[10px] text-neutral-500 mt-2">
              LangGraph State Machine orchestrating 7 specialist nodes.
            </div>
            <span className="text-[9px] text-[#00ff66] font-bold mt-4">SYSTEM READY</span>
          </div>

          <div className="p-4 bg-[#090909] border border-[#1b1b1b] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-neutral-300">FINANCIAL METRICS</span>
              <BarChart2 className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="text-[10px] text-neutral-500 mt-2">
              Alpha Vantage interface feeding key valuations and ratios.
            </div>
            <span className="text-[9px] text-[#00ff66] font-bold mt-4">FEED ACTIVE</span>
          </div>

          <div className="p-4 bg-[#090909] border border-[#1b1b1b] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-neutral-300">RISK VALIDATOR</span>
              <ShieldAlert className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="text-[10px] text-neutral-500 mt-2">
              Chief Risk Officer auditing logic and flagging overconfidence loops.
            </div>
            <span className="text-[9px] text-[#00ff66] font-bold mt-4">CRO SECURED</span>
          </div>

          <div className="p-4 bg-[#090909] border border-[#1b1b1b] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-neutral-300">MARKET SENTIMENT</span>
              <Globe className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="text-[10px] text-neutral-500 mt-2">
              Tavily search scanner gathering media feeds and press releases.
            </div>
            <span className="text-[9px] text-[#00ff66] font-bold mt-4">SCANNERS ON</span>
          </div>
        </section>

        {/* History Table */}
        <section className="bg-[#090909] border border-[#1b1b1b]">
          <div className="border-b border-[#1b1b1b] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-neutral-400" />
              <span className="font-bold text-neutral-200 tracking-wider">RESEARCH ARCHIVES & LOGS</span>
            </div>
            <span className="text-[10px] text-neutral-500">{history.length} RECORDS INDEXED</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16 text-neutral-600 uppercase">
              No analysis records logged yet. Enter query above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#1b1b1b] bg-[#070707] text-[10px] uppercase text-neutral-500 font-bold">
                    <th className="px-4 py-3">Ticker / Symbol</th>
                    <th className="px-4 py-3">Decision Verdict</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Executive Rationale</th>
                    <th className="px-4 py-3 text-right">Archived Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b1b1b] text-[11px]">
                  {history.map((item) => {
                    const recColor =
                      item.decision === "INVEST"
                        ? "text-emerald-500"
                        : item.decision === "WATCH"
                        ? "text-amber-500"
                        : "text-rose-500";

                    return (
                      <tr
                        key={item.id}
                        onClick={() => router.push(`/report/${item.id}`)}
                        className="hover:bg-[#121212] cursor-pointer transition-all select-none"
                      >
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-neutral-200 uppercase">{item.companyName}</div>
                          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                            {item.ticker} • {item.exchange}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-bold tracking-wider">
                          <span className={recColor}>[{item.decision}]</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-neutral-300 font-semibold">{item.confidenceScore}%</span>
                            <div className="w-16 bg-neutral-950 rounded-none h-1 border border-neutral-850 overflow-hidden">
                              <div
                                className="bg-neutral-400 h-1"
                                style={{ width: `${item.confidenceScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 max-w-sm truncate text-neutral-400">
                          {item.summary}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-neutral-500 text-[10px]">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).toUpperCase()}
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
