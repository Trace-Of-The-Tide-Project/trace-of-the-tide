"use client";

import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";
import { HeartIcon, MessageSquareIcon, TrendingUpIcon, GiftIcon } from "@/components/ui/icons";

export function EngagementsPageHeader() {
  return (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      <DashboardHeader
        title="Engagement"
        subtitle="Manage community interactions, comments, and recognition"
        compactPadding
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <MessageSquareIcon />
          </div>
          <p className="text-xs text-gray-500">Total comments</p>
          <p className="mt-1 text-xl font-semibold text-white">12,546</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <HeartIcon />
          </div>
          <p className="text-xs text-gray-500">Total Likes...</p>
          <p className="mt-1 text-xl font-semibold text-white">89.2k</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <TrendingUpIcon />
          </div>
          <p className="text-xs text-gray-500">Active Discussions</p>
          <p className="mt-1 text-xl font-semibold text-white">456</p>
        </div>

        <div className="rounded-2xl border border-[#2f2f2f] bg-[#121212] px-6 py-5">
          <div
            className="mb-3 inline-flex items-center justify-center rounded-xl border border-[#2f2f2f] bg-[#1a1a1a] p-2"
            style={{ color: "#E8DDC0" }}
          >
            <GiftIcon />
          </div>
          <p className="text-xs text-gray-500">Badges Awarded...</p>
          <p className="mt-1 text-xl font-semibold text-white">492</p>
        </div>
      </div>
    </div>
  );
}
