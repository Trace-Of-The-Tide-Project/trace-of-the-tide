"use client";

import type { ComponentType } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

type StatCardProps = {
  icon: ComponentType;
  value: string | number;
  label: string;
  trend?: {
    value: string;
    direction: "up" | "down";
    comparison: string;
  };
};

export function StatCard({ icon: Icon, value, label, trend }: StatCardProps) {
  const { isDark } = useTheme();
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--tott-card-border)] bg-[var(--tott-panel-bg)] px-4 py-5">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--tott-card-border)] bg-[var(--tott-dash-icon-bg)]"
        style={{ color: isDark ? "#E8DDC0" : "#a89060" }}
      >
        <Icon />
      </span>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      {trend && (
        <div className="flex items-center gap-1 text-xs">
          <span className={trend.direction === "up" ? "text-emerald-400" : "text-red-400"}>
            {trend.direction === "up" ? "↗" : "↘"} {trend.value}
          </span>
          <span className="text-gray-600">{trend.comparison}</span>
        </div>
      )}
    </div>
  );
}
