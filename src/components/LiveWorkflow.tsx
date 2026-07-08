"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Cpu, ShieldAlert, Check, Play, AlertCircle } from "lucide-react";

interface Step {
  id: string;
  name: string;
  description: string;
  agent: string;
  code: string;
}

const STEPS: Step[] = [
  {
    id: "resolver",
    name: "Entity Resolver",
    description: "Resolving query to primary listed stock symbol...",
    agent: "RESOLVER_NODE",
    code: "SEC_RESOLVE_TICKER",
  },
  {
    id: "financial",
    name: "Financial Data Collection",
    description: "Scraping key balance sheets, metrics, and ratios...",
    agent: "FUNDAMENTAL_NODE",
    code: "DATA_PULL_RATIOS",
  },
  {
    id: "news",
    name: "News Intelligence",
    description: "Scanning live media headlines and scraping Tavily feeds...",
    agent: "SENTIMENT_NODE",
    code: "SENTIMENT_SCAN_MEDIA",
  },
  {
    id: "debate",
    name: "Bull vs Bear Debate",
    description: "Pitting Growth (Bull) vs Short-Seller (Bear) cases...",
    agent: "DEBATE_ARBITRATOR",
    code: "ADVERSARIAL_THESIS_RUN",
  },
  {
    id: "risk",
    name: "Risk Committee",
    description: "CRO node auditing logical consistency and credit limits...",
    agent: "CRO_QUALITY_CONTROL",
    code: "CRO_COMPLIANCE_AUDIT",
  },
  {
    id: "decision",
    name: "Final Investment Decision",
    description: "Compiling committee memo and formatting research dossier...",
    agent: "DECISION_NODE",
    code: "MEMO_COMPILATION_DONE",
  },
];

export function LiveWorkflow() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Set initial log
    setLogs([
      `[${new Date().toLocaleTimeString()}] INIT: Launching InvestIQ Multi-Agent Workflow...`,
      `[${new Date().toLocaleTimeString()}] RESOLVER_NODE: Listening for request payload...`,
    ]);

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          const nextIndex = prev + 1;
          const nextStep = STEPS[nextIndex];
          
          setLogs((prevLogs) => [
            ...prevLogs,
            `[${new Date().toLocaleTimeString()}] ${STEPS[prev].agent}: Completed ${STEPS[prev].code} successfully.`,
            `[${new Date().toLocaleTimeString()}] ${nextStep.agent}: Launching ${nextStep.code}...`,
          ]);
          
          return nextIndex;
        }
        return prev;
      });
    }, 4000); // 4 seconds per node

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#0a0a0a] border border-[#1f1f1f] shadow-2xl p-6 font-mono text-xs text-neutral-300">
      
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="font-bold tracking-wider text-neutral-200">AI ANALYST DESK v1.2</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block"></span>
          <span>PIPELINE RUNNING</span>
        </div>
      </div>

      {/* Header Info */}
      <div className="mb-6 bg-[#070707] border border-[#151515] p-3 text-[11px] text-neutral-400 space-y-1">
        <div>SYSTEM: Stateful Multi-Agent LangGraph Machine</div>
        <div>THREAD: RESEARCH_PROCESSOR_ID_{Math.random().toString(36).slice(2, 8).toUpperCase()}</div>
        <div>METRICS: 7 Specialists • Dynamic Fallbacks Enabled</div>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="space-y-3 mb-6">
        {STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isPending = index > currentStepIndex;

          let statusText = "PENDING";
          let statusColor = "text-neutral-600 border-neutral-800";
          if (isActive) {
            statusText = "RUNNING";
            statusColor = "text-amber-500 border-amber-900/50 bg-amber-950/20";
          } else if (isCompleted) {
            statusText = "OK";
            statusColor = "text-emerald-500 border-emerald-900/50 bg-emerald-950/20";
          }

          return (
            <div
              key={step.id}
              className={`border p-3 flex flex-col md:flex-row md:items-center justify-between gap-2 transition-all ${
                isActive
                  ? "border-neutral-700 bg-neutral-900/30"
                  : "border-[#151515] bg-[#070707]/30 opacity-70"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded border border-[#1f1f1f] flex items-center justify-center bg-[#070707]">
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  ) : (
                    <span className="text-[9px] text-neutral-600">{index + 1}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-neutral-200">{step.name}</div>
                  {isActive && <div className="text-[10px] text-neutral-400 mt-0.5">{step.description}</div>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] text-neutral-500 uppercase px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                  {step.agent}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusColor}`}>
                  {statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Progress Bar */}
      <div className="w-full bg-[#070707] rounded-none h-1.5 border border-[#1f1f1f] mb-6 overflow-hidden">
        <div
          className="bg-emerald-500 h-1 rounded-none transition-all duration-700"
          style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
        ></div>
      </div>

      {/* Terminal Live logs */}
      <div className="border border-[#1f1f1f] bg-[#050505] p-3 rounded-none h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 font-mono text-[10px] text-neutral-500 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className={i === logs.length - 1 ? "text-neutral-400" : ""}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
