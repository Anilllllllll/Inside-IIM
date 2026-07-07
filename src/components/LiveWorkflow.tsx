"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2, ArrowRight } from "lucide-react";

interface Step {
  id: string;
  name: string;
  description: string;
  agent: string;
}

const STEPS: Step[] = [
  {
    id: "resolver",
    name: "Entity Resolution",
    description: "Resolving company name to listing stock ticker...",
    agent: "Entity Resolver Agent",
  },
  {
    id: "specialists",
    name: "Parallel Specialist Research",
    description: "Gathering metrics, news sentiment, moat, and risk factors in parallel...",
    agent: "Financial, News, Competitive & Risk Agents",
  },
  {
    id: "adversaries",
    name: "Adversarial Syntheses",
    description: "Compiling extreme long (Bull) and short (Bear) arguments...",
    agent: "Bull Case & Bear Case Agents",
  },
  {
    id: "debate",
    name: "Debate & Reconciliation",
    description: "Stress-testing cases side-by-side against financial columns...",
    agent: "Adversarial Debate Arbitrator",
  },
  {
    id: "committee",
    name: "Investment Committee Verdict",
    description: "Formulating final BUY/WATCH/PASS decision and memo...",
    agent: "Investment Committee Agent",
  },
  {
    id: "critique",
    name: "Self-Correction & CRO Audit",
    description: "Checking logical consistency and correcting overconfidence bias...",
    agent: "Self-Critique Quality Control Agent",
  },
  {
    id: "saving",
    name: "Archiving Results",
    description: "Saving structural analysis, citation links, and trace logs to PostgreSQL...",
    agent: "Database Saving Agent",
  },
];

export function LiveWorkflow({ active: _active }: { active?: boolean }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Cycle through steps to simulate the active backend LangGraph flow
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4500); // 4.5 seconds per node step average (takes ~30s total)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-neutral-100 font-sans tracking-wide">
            InvestIQ AI Agent Engine
          </h3>
          <p className="text-sm text-neutral-400 mt-1 font-sans">
            Executing Multi-Agent state machine workflow
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-xs font-semibold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Running Live Graph
        </div>
      </div>

      <div className="space-y-6">
        {STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-neutral-800/50 border border-neutral-700/60 shadow-lg translate-x-2"
                  : "bg-transparent border border-transparent opacity-60"
              }`}
            >
              <div className="mt-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950/20" />
                ) : isActive ? (
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                ) : (
                  <Circle className="w-6 h-6 text-neutral-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-md font-semibold tracking-wide font-sans ${
                      isActive ? "text-indigo-300" : isCompleted ? "text-neutral-300" : "text-neutral-500"
                    }`}
                  >
                    {step.name}
                  </h4>
                  <span className="text-xs text-neutral-500 font-sans px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800/80">
                    {step.agent}
                  </span>
                </div>
                
                {isActive && (
                  <p className="text-sm text-neutral-300 mt-1 font-sans animate-fade-in">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-950 rounded-full h-1.5 mt-8 overflow-hidden border border-neutral-900">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
          style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
