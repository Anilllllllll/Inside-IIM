"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  highlight?: "green" | "red" | "gold" | "none";
}

export function MetricCard({
  label,
  value,
  subtext,
  trend,
  icon,
  highlight = "none",
}: MetricCardProps) {
  const trendColor =
    trend === "up" ? "#00C853" : trend === "down" ? "#FF3B3B" : "#8B9A96";

  const highlightStyle =
    highlight === "green"
      ? { borderColor: "rgba(0,200,83,0.25)", background: "rgba(0,200,83,0.05)" }
      : highlight === "red"
      ? { borderColor: "rgba(255,59,59,0.25)", background: "rgba(255,59,59,0.05)" }
      : highlight === "gold"
      ? { borderColor: "rgba(245,166,35,0.25)", background: "rgba(245,166,35,0.05)" }
      : { borderColor: "rgba(255,255,255,0.06)", background: "#0B0F0E" };

  return (
    <div
      className="metric-card glass-card-hover"
      style={{ ...highlightStyle, borderRadius: 12, padding: "18px 20px", border: "1px solid" }}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "#4A5C57",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        {icon && (
          <span style={{ color: "#4A5C57" }}>{icon}</span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#F0F2F1",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </div>
          {subtext && (
            <div
              style={{ fontSize: 12, color: "#8B9A96", marginTop: 4 }}
            >
              {subtext}
            </div>
          )}
        </div>

        {trend && (
          <div
            className="flex items-center gap-1"
            style={{ fontSize: 12, fontWeight: 600, color: trendColor }}
          >
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : trend === "down" ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
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
  const isPass = decision === "PASS";

  const label = isInvest ? "BUY" : isWatch ? "HOLD" : "PASS";

  const styles = isInvest
    ? {
        background: "rgba(0, 200, 83, 0.12)",
        border: "1px solid rgba(0, 200, 83, 0.35)",
        color: "#00C853",
        boxShadow: "0 0 16px rgba(0, 200, 83, 0.15)",
      }
    : isWatch
    ? {
        background: "rgba(245, 166, 35, 0.12)",
        border: "1px solid rgba(245, 166, 35, 0.35)",
        color: "#F5A623",
        boxShadow: "0 0 16px rgba(245, 166, 35, 0.15)",
      }
    : {
        background: "rgba(255, 59, 59, 0.12)",
        border: "1px solid rgba(255, 59, 59, 0.35)",
        color: "#FF3B3B",
        boxShadow: "0 0 16px rgba(255, 59, 59, 0.15)",
      };

  const sizeStyle =
    size === "lg"
      ? { fontSize: 18, fontWeight: 800, padding: "10px 24px", borderRadius: 10, letterSpacing: "0.12em" }
      : size === "sm"
      ? { fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, letterSpacing: "0.1em" }
      : { fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 8, letterSpacing: "0.1em" };

  return (
    <span style={{ ...styles, ...sizeStyle, display: "inline-block" }}>
      {label}
    </span>
  );
}
