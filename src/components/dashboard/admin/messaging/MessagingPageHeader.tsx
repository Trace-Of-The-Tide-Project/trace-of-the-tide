"use client";

import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";
import { theme } from "@/lib/theme";
import {
  ContributeIcon,
  ClockIcon,
  MessageSquareIcon,
  SquareCheckIcon,
  TrendingUpIcon,
} from "@/components/ui/icons";

export function MessagingPageHeader() {
  return (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      <DashboardHeader
        title="Messaging Center"
        subtitle="Manage communications with users and send broadcasts"
        compactPadding
        actions={
          <button
            type="button"
            className="inline-flex h-[40px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-[#111] whitespace-nowrap"
            style={{ backgroundColor: theme.accentGoldFocus }}
          >
            <span className="[&_svg]:h-4 [&_svg]:w-4">
              <ContributeIcon />
            </span>
            New Broadcast
          </button>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <MessageSquareIcon />
          </div>
          <p className="text-xs text-gray-500">Unread Messages</p>
          <p className="mt-1 text-xl font-semibold text-white">23</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <TrendingUpIcon />
          </div>
          <p className="text-xs text-gray-500">High Priority...</p>
          <p className="mt-1 text-xl font-semibold text-white">5</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <ClockIcon />
          </div>
          <p className="text-xs text-gray-500">Pending Response</p>
          <p className="mt-1 text-xl font-semibold text-white">12</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <SquareCheckIcon />
          </div>
          <p className="text-xs text-gray-500">Resolved This Week...</p>
          <p className="mt-1 text-xl font-semibold text-white">156</p>
        </div>
      </div>
    </div>
  );
}

