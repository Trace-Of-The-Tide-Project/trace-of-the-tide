import type { ComponentType } from "react";

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
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
      <span style={{ color: "#E8DDC0" }}>
        <Icon />
      </span>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
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
