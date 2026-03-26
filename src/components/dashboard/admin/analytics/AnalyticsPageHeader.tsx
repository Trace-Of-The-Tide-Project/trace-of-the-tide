"use client";

import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";
import { theme } from "@/lib/theme";
import {
  CalendarIcon,
  DownloadIcon,
  EyeIcon,
  TrendingUpIcon,
  ClockIcon,
  UserCheckIcon,
} from "@/components/ui/icons";

export function AnalyticsPageHeader() {
  return (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      <DashboardHeader
        title="Analytics"
        subtitle="Platform performance and growth metrics"
        compactPadding
        actions={
          <>
            <button
              type="button"
              className="inline-flex h-[40px] items-center justify-center gap-2 rounded-lg border border-[#2f2f2f] bg-[#121212] px-4 text-sm font-medium text-gray-200 transition-colors hover:bg-[#151515]"
            >
              <span className="[&_svg]:h-4 [&_svg]:w-4 text-gray-400">
                <CalendarIcon />
              </span>
              Last 30 days
              <span className="ml-1 text-gray-500">▾</span>
            </button>

            <button
              type="button"
              className="inline-flex h-[40px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-[#111] whitespace-nowrap"
              style={{ backgroundColor: theme.accentGoldFocus }}
            >
              <span className="[&_svg]:h-4 [&_svg]:w-4">
                <DownloadIcon />
              </span>
              Export Reports
            </button>
          </>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span style={{ color: "#E8DDC0" }}>
            <EyeIcon />
          </span>
          <span className="text-2xl font-bold text-white">2.4M</span>
          <span className="text-xs text-gray-500">Total Page views...</span>
          <span className="text-xs text-emerald-400">↗ 18%</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span style={{ color: "#E8DDC0" }}>
            <UserCheckIcon />
          </span>
          <span className="text-2xl font-bold text-white">68%</span>
          <span className="text-xs text-gray-500">User Retention</span>
          <span className="text-xs text-emerald-400">↗ 5%</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span style={{ color: "#E8DDC0" }}>
            <ClockIcon />
          </span>
          <span className="text-2xl font-bold text-white">8m 42s</span>
          <span className="text-xs text-gray-500">Avg. Session</span>
          <span className="text-xs text-emerald-400">↗ 12%</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span style={{ color: "#E8DDC0" }}>
            <TrendingUpIcon />
          </span>
          <span className="text-2xl font-bold text-white">32%</span>
          <span className="text-xs text-gray-500">Bounce Rate</span>
          <span className="text-xs text-red-400">↘ 3%</span>
        </div>
      </div>
    </div>
  );
}

