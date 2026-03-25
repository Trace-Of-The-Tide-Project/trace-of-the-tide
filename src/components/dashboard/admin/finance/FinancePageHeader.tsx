"use client";

import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";
import { theme } from "@/lib/theme";
import { DollarSignIcon, DownloadIcon, TrendingUpIcon, CreditCardIcon } from "@/components/ui/icons";

export function FinancePageHeader() {
  return (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      <DashboardHeader
        title="Finance Management"
        subtitle="Monitor donations, payouts, and financial activity"
        compactPadding
        actions={
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
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <DollarSignIcon />
          </div>
          <p className="text-xs text-gray-500">Today’s Donations</p>
          <p className="mt-1 text-xl font-semibold text-white">$2,847</p>
          <p className="mt-1 text-xs text-emerald-400">↗ 12%</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <TrendingUpIcon />
          </div>
          <p className="text-xs text-gray-500">Monthly Revenue</p>
          <p className="mt-1 text-xl font-semibold text-white">$34,892</p>
          <p className="mt-1 text-xs text-emerald-400">↗ 22%</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <CreditCardIcon />
          </div>
          <p className="text-xs text-gray-500">Pending Payouts</p>
          <p className="mt-1 text-xl font-semibold text-white">$2,596</p>
          <p className="mt-1 text-xs text-[#CBA158]">3 pending</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <DollarSignIcon />
          </div>
          <p className="text-xs text-gray-500">Platforms Fees</p>
          <p className="mt-1 text-xl font-semibold text-white">$3,489</p>
          <p className="mt-1 text-xs text-gray-500">10% rate</p>
        </div>
      </div>
    </div>
  );
}

