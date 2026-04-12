"use client";

import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";
import { DownloadIcon } from "@/components/ui/icons";
import { securityStats } from "@/lib/dashboard/security-constants";

const ACCENT = "#E8DDC0";

export function SecurityPageHeader() {
  return (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      <DashboardHeader
        title="Security"
        subtitle="Manage admin access, security settings, and system monitoring."
        compactPadding
        actions={
          <button
            type="button"
            className="inline-flex h-[40px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-[#111] whitespace-nowrap transition-opacity hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <span className="[&_svg]:h-4 [&_svg]:w-4">
              <DownloadIcon />
            </span>
            Export Logs
          </button>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {securityStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-xl border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface)] px-4 py-5"
            >
              <span className="text-[#E8DDC0]">
                <Icon />
              </span>
              <span className="text-center text-xs text-gray-500">{stat.label}</span>
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
