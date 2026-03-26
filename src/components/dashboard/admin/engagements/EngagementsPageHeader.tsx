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
        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span style={{ color: "#E8DDC0" }}>
            <MessageSquareIcon />
          </span>
          <span className="text-2xl font-bold text-white">12,546</span>
          <span className="text-xs text-gray-500">Total comments</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span style={{ color: "#E8DDC0" }}>
            <HeartIcon />
          </span>
          <span className="text-2xl font-bold text-white">89.2k</span>
          <span className="text-xs text-gray-500">Total Likes...</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span style={{ color: "#E8DDC0" }}>
            <TrendingUpIcon />
          </span>
          <span className="text-2xl font-bold text-white">456</span>
          <span className="text-xs text-gray-500">Active Discussions</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span style={{ color: "#E8DDC0" }}>
            <GiftIcon />
          </span>
          <span className="text-2xl font-bold text-white">492</span>
          <span className="text-xs text-gray-500">Badges Awarded...</span>
        </div>
      </div>
    </div>
  );
}
