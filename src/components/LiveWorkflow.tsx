"use client";

import React, { useEffect, useState } from "react";
import {
  Building2, BarChart3, Newspaper, Swords, ShieldAlert, Gavel, Database, Check
} from "lucide-react";

interface AgentStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: AgentStep[] = [
  {
    id: "resolver",
    name: "Company Research Agent",
    description: "Resolving ticker & understanding the business model",
    icon: <Building2 style={{ width: 18, height: 18 }} />,
  },
  {
    id: "financial",
    name: "Financial Analysis Agent",
    description: "Pulling key ratios: P/E, Debt/Equity, growth metrics",
    icon: <BarChart3 style={{ width: 18, height: 18 }} />,
  },
  {
    id: "news",
    name: "Market Sentiment Agent",
    description: "Scanning latest news and media sentiment signals",
    icon: <Newspaper style={{ width: 18, height: 18 }} />,
  },
  {
    id: "debate",
    name: "Bull vs Bear Debate",
    description: "Adversarial agents stress-testing the investment thesis",
    icon: <Swords style={{ width: 18, height: 18 }} />,
  },
  {
    id: "risk",
    name: "Risk Committee Agent",
    description: "Evaluating downside vectors & running CRO audit",
    icon: <ShieldAlert style={{ width: 18, height: 18 }} />,
  },
  {
    id: "decision",
    name: "Investment Committee",
    description: "Generating final investment verdict and research memo",
    icon: <Gavel style={{ width: 18, height: 18 }} />,
  },
  {
    id: "saving",
    name: "Archiving Results",
    description: "Saving dossier to secure database",
    icon: <Database style={{ width: 18, height: 18 }} />,
  },
];

export function LiveWorkflow() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="w-full max-w-lg mx-auto px-4">

      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
          style={{
            background: "rgba(124, 58, 237, 0.08)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "#7C3AED",
              animation: "pulse-ring 2.5s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700, letterSpacing: "0.1em" }}>
            AI RESEARCH IN PROGRESS
          </span>
        </div>

        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.02em",
          }}
        >
          Analyst Desk Running
        </h2>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6 }}>
          Multi-agent pipeline active — takes ~60–90 seconds
        </p>
      </div>

      {/* Agent Cards */}
      <div className="space-y-2.5 mb-8">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step.id}
              className="flex items-center gap-4 rounded-2xl transition-all duration-500"
              style={{
                padding: "14px 18px",
                background: isActive
                  ? "rgba(255,255,255,0.95)"
                  : isCompleted
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(255,255,255,0.4)",
                border: isActive
                  ? "1.5px solid rgba(124, 58, 237, 0.35)"
                  : isCompleted
                  ? "1px solid rgba(22, 163, 74, 0.2)"
                  : "1px solid rgba(0,0,0,0.06)",
                boxShadow: isActive
                  ? "0 4px 20px rgba(124, 58, 237, 0.12), 0 0 0 3px rgba(124,58,237,0.06)"
                  : isCompleted
                  ? "0 1px 6px rgba(0,0,0,0.05)"
                  : "none",
                opacity: isPending ? 0.45 : 1,
                transform: isActive ? "scale(1.01)" : "scale(1)",
              }}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: isCompleted
                    ? "linear-gradient(135deg, #16A34A, #059669)"
                    : isActive
                    ? "linear-gradient(135deg, #7C3AED, #6366F1)"
                    : "rgba(0,0,0,0.04)",
                  color: isCompleted || isActive ? "white" : "#9CA3AF",
                  boxShadow: isActive
                    ? "0 4px 12px rgba(124,58,237,0.3)"
                    : isCompleted
                    ? "0 4px 12px rgba(22,163,74,0.25)"
                    : "none",
                }}
              >
                {isCompleted ? (
                  <Check style={{ width: 18, height: 18 }} />
                ) : (
                  step.icon
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isCompleted ? "#6B7280" : isActive ? "#111827" : "#9CA3AF",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.name}
                </div>
                {isActive && (
                  <div
                    className="fade-up"
                    style={{ fontSize: 12, color: "#7C3AED", marginTop: 2, fontWeight: 500 }}
                  >
                    {step.description}
                  </div>
                )}
                {isCompleted && (
                  <div style={{ fontSize: 11, color: "#16A34A", marginTop: 1, fontWeight: 500 }}>
                    Completed
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: isCompleted
                    ? "rgba(22, 163, 74, 0.1)"
                    : isActive
                    ? "rgba(124, 58, 237, 0.1)"
                    : "rgba(0,0,0,0.04)",
                  color: isCompleted ? "#16A34A" : isActive ? "#7C3AED" : "#9CA3AF",
                  border: isCompleted
                    ? "1px solid rgba(22,163,74,0.2)"
                    : isActive
                    ? "1px solid rgba(124,58,237,0.2)"
                    : "1px solid transparent",
                }}
              >
                {isCompleted ? "DONE" : isActive ? "RUNNING" : "QUEUED"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <span style={{ fontSize: 13, color: "#4B5563", fontWeight: 600 }}>
            Research Progress
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#7C3AED",
            }}
          >
            {progress}%
          </span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 8, background: "rgba(124,58,237,0.08)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7C3AED, #6366F1)",
              boxShadow: "0 0 10px rgba(124,58,237,0.3)",
            }}
          />
        </div>
        <p className="text-center mt-3" style={{ fontSize: 12, color: "#9CA3AF" }}>
          Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep]?.name}
        </p>
      </div>
    </div>
  );
}
