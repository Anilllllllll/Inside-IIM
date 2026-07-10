"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  highlight?: "green" | "red" | "purple" | "none";
}

export function MetricCard({
  label,
  value,
  subtext,
  trend,
  icon,
  highlight = "none",
}: MetricCardProps) {
  const highlightStyle =
    highlight === "green"
      ? { borderColor: "rgba(22,163,74,0.2)", background: "rgba(22,163,74,0.04)" }
      : highlight === "red"
      ? { borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }
      : highlight === "purple"
      ? { borderColor: "rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.04)" }
      : { borderColor: "rgba(0,0,0,0.07)", background: "#FFFFFF" };

  const trendColor =
    trend === "up" ? "#16A34A" : trend === "down" ? "#EF4444" : "#9CA3AF";

  return (
    <div
      className="glass-card-hover"
      style={{
        ...highlightStyle,
        border: "1px solid",
        borderRadius: 20,
        padding: "20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        transition: "all 0.22s ease",
        cursor: "default",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.07em",
            color: "#9CA3AF",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        {icon && <span style={{ color: "#C4B5FD" }}>{icon}</span>}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {value}
          </div>
          {subtext && (
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 5, fontWeight: 400 }}>
              {subtext}
            </div>
          )}
        </div>

        {trend && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: trendColor,
              background:
                trend === "up"
                  ? "rgba(22,163,74,0.08)"
                  : trend === "down"
                  ? "rgba(239,68,68,0.08)"
                  : "rgba(0,0,0,0.04)",
            }}
          >
            {trend === "up" ? (
              <TrendingUp style={{ width: 14, height: 14 }} />
            ) : trend === "down" ? (
              <TrendingDown style={{ width: 14, height: 14 }} />
            ) : (
              <Minus style={{ width: 14, height: 14 }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Decision Badge ===== */
interface DecisionBadgeProps {
  decision: string;
  size?: "sm" | "md" | "lg";
}

export function DecisionBadge({ decision, size = "md" }: DecisionBadgeProps) {
  const isInvest = decision === "INVEST";
  const isWatch = decision === "WATCH";

  const label = isInvest ? "BUY" : isWatch ? "HOLD" : "PASS";

  const styles = isInvest
    ? {
        background: "linear-gradient(135deg, #16A34A, #059669)",
        color: "white",
        boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
      }
    : isWatch
    ? {
        background: "linear-gradient(135deg, #D97706, #B45309)",
        color: "white",
        boxShadow: "0 4px 14px rgba(217, 119, 6, 0.3)",
      }
    : {
        background: "linear-gradient(135deg, #EF4444, #DC2626)",
        color: "white",
        boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)",
      };

  const sizeStyle =
    size === "lg"
      ? { fontSize: 20, fontWeight: 900, padding: "10px 28px", borderRadius: 14, letterSpacing: "0.1em" }
      : size === "sm"
      ? { fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8, letterSpacing: "0.08em" }
      : { fontSize: 14, fontWeight: 700, padding: "7px 18px", borderRadius: 10, letterSpacing: "0.08em" };

  return (
    <span style={{ ...styles, ...sizeStyle, display: "inline-block" }}>
      {label}
    </span>
  );
}
