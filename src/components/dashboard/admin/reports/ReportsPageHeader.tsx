"use client";

import {
  AlertTriangleIcon,
  FlagIcon,
  SquareCheckIcon,
  UsersIcon,
} from "@/components/ui/icons";

export function ReportsPageHeader() {
  return (
    <div className="px-6 py-6 sm:px-8 sm:py-8">
      <div className="pb-6">
        <h1 className="text-xl font-bold text-white sm:text-2xl">Reports & Moderation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review reported content, manage user violations, and audit logs
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span className="text-[#E8DDC0]">
            <FlagIcon />
          </span>
          <span className="text-2xl font-bold text-white">8</span>
          <span className="text-xs text-gray-500">Pending Reports</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span className="text-[#E8DDC0]">
            <AlertTriangleIcon />
          </span>
          <span className="text-2xl font-bold text-white">3</span>
          <span className="text-xs text-gray-500">Content Flagged</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span className="text-[#E8DDC0]">
            <UsersIcon />
          </span>
          <span className="text-2xl font-bold text-white">2</span>
          <span className="text-xs text-gray-500">Users Reported</span>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5">
          <span className="text-[#E8DDC0]">
            <SquareCheckIcon />
          </span>
          <span className="text-2xl font-bold text-white">24</span>
          <span className="text-xs text-gray-500">Resolved Today</span>
        </div>
      </div>
    </div>
  );
}
