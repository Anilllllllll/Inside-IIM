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
  durationMs: number;
}

const STEPS: AgentStep[] = [
  {
    id: "resolver",
    name: "Company Research Agent",
    description: "Resolving ticker & understanding business model",
    icon: <Building2 className="w-5 h-5" />,
    durationMs: 4000,
  },
  {
    id: "financial",
    name: "Financial Analysis Agent",
    description: "Pulling key ratios: P/E, Debt/Equity, Growth metrics",
    icon: <BarChart3 className="w-5 h-5" />,
    durationMs: 5000,
  },
  {
    id: "news",
    name: "Market Sentiment Agent",
    description: "Scanning latest news signals & media sentiment",
    icon: <Newspaper className="w-5 h-5" />,
    durationMs: 4500,
  },
  {
    id: "debate",
    name: "Bull vs Bear Debate",
    description: "Adversarial agents stress-testing the investment thesis",
    icon: <Swords className="w-5 h-5" />,
    durationMs: 5000,
  },
  {
    id: "risk",
    name: "Risk Committee Agent",
    description: "Evaluating downside risk vectors & CRO audit",
    icon: <ShieldAlert className="w-5 h-5" />,
    durationMs: 4000,
  },
  {
    id: "decision",
    name: "Investment Committee",
    description: "Generating final investment verdict & research memo",
    icon: <Gavel className="w-5 h-5" />,
    durationMs: 4500,
  },
  {
    id: "saving",
    name: "Archiving Results",
    description: "Saving dossier to secure database",
    icon: <Database className="w-5 h-5" />,
    durationMs: 3000,
  },
];

export function LiveWorkflow() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
          style={{
            background: "rgba(0,200,83,0.08)",
            border: "1px solid rgba(0,200,83,0.2)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full pulse-dot"
            style={{ background: "#00C853" }}
          />
          <span style={{ fontSize: 11, color: "#00C853", fontWeight: 600, letterSpacing: "0.1em" }}>
            RESEARCH IN PROGRESS
          </span>
        </div>

        <h2
          className="font-bold"
          style={{ fontSize: 22, color: "#F0F2F1", letterSpacing: "-0.02em" }}
        >
          AI Analyst Desk
        </h2>
        <p style={{ fontSize: 13, color: "#4A5C57", marginTop: 6 }}>
          Multi-agent pipeline running — takes ~60–90 seconds
        </p>
      </div>

      {/* Agent Cards */}
      <div className="space-y-2 mb-8">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step.id}
              className="flex items-center gap-4 rounded-xl transition-all duration-500"
              style={{
                padding: "14px 16px",
                background: isActive
                  ? "rgba(0,200,83,0.06)"
                  : isCompleted
                  ? "rgba(255,255,255,0.02)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(0,200,83,0.2)"
                  : "1px solid rgba(255,255,255,0.04)",
                opacity: isPending ? 0.35 : 1,
                transform: isActive ? "scale(1.01)" : "scale(1)",
              }}
            >
              {/* Icon / Status circle */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: isCompleted
                    ? "rgba(0,200,83,0.15)"
                    : isActive
                    ? "rgba(0,200,83,0.08)"
                    : "rgba(255,255,255,0.03)",
                  border: isCompleted
                    ? "1px solid rgba(0,200,83,0.35)"
                    : isActive
                    ? "1px solid rgba(0,200,83,0.2)"
                    : "1px solid rgba(255,255,255,0.06)",
                  color: isCompleted ? "#00C853" : isActive ? "#00C853" : "#4A5C57",
                }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span
                    style={{
                      opacity: isActive ? 1 : 0.5,
                      animation: isActive ? "pulse-dot 2s infinite" : "none",
                    }}
                  >
                    {step.icon}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isCompleted ? "#8B9A96" : isActive ? "#F0F2F1" : "#4A5C57",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.name}
                </div>
                {isActive && (
                  <div
                    className="fade-slide-in"
                    style={{ fontSize: 12, color: "#4A5C57", marginTop: 2 }}
                  >
                    {step.description}
                  </div>
                )}
              </div>

              {/* Status tag */}
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  padding: "3px 8px",
                  borderRadius: 4,
                  background: isCompleted
                    ? "rgba(0,200,83,0.1)"
                    : isActive
                    ? "rgba(245,166,35,0.1)"
                    : "transparent",
                  color: isCompleted ? "#00C853" : isActive ? "#F5A623" : "#4A5C57",
                  border: isCompleted
                    ? "1px solid rgba(0,200,83,0.2)"
                    : isActive
                    ? "1px solid rgba(245,166,35,0.2)"
                    : "none",
                }}
              >
                {isCompleted ? "DONE" : isActive ? "RUNNING" : "QUEUED"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span style={{ fontSize: 11, color: "#4A5C57", fontWeight: 500 }}>
            Research Progress
          </span>
          <span style={{ fontSize: 11, color: "#00C853", fontWeight: 700 }}>
            {progress}%
          </span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{
            height: 4,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #00C853, #00E676)",
              boxShadow: "0 0 8px rgba(0,200,83,0.4)",
            }}
          />
        </div>
        <p
          className="text-center mt-4"
          style={{ fontSize: 11, color: "#4A5C57" }}
        >
          Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].name}
        </p>
      </div>
    </div>
  );
}
