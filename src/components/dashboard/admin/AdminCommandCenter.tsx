"use client";

import { StatCard } from "../shared/StatCard";
import { commandCenterStats } from "@/lib/dashboard/admin-dashboard-constants";

export function AdminCommandCenter() {
  return (
    <div>
      <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">Command Center</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, Super Admin. Here&apos;s what&apos;s happening on your platform.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#E8DDC0" }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>Last updated: Just now</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-6 lg:grid-cols-4">
        {commandCenterStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
