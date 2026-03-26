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
        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <EyeIcon />
          </div>
          <p className="text-xs text-gray-500">Total Page views...</p>
          <p className="mt-1 text-xl font-semibold text-white">2.4M</p>
          <p className="mt-1 text-xs text-emerald-400">↗ 18%</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <UserCheckIcon />
          </div>
          <p className="text-xs text-gray-500">User Retention</p>
          <p className="mt-1 text-xl font-semibold text-white">68%</p>
          <p className="mt-1 text-xs text-emerald-400">↗ 5%</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <ClockIcon />
          </div>
          <p className="text-xs text-gray-500">Avg. Session</p>
          <p className="mt-1 text-xl font-semibold text-white">8m 42s</p>
          <p className="mt-1 text-xs text-emerald-400">↗ 12%</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <TrendingUpIcon />
          </div>
          <p className="text-xs text-gray-500">Bounce Rate</p>
          <p className="mt-1 text-xl font-semibold text-white">32%</p>
          <p className="mt-1 text-xs text-red-400">↘ 3%</p>
        </div>
      </div>
    </div>
  );
}

