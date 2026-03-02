"use client";

import { SettingsIcon, BellIcon, ClockIcon, SearchIcon } from "@/components/ui/icons";

export function AdminTopbar() {
  return (
    <div className="hidden items-center gap-4 border-b border-[#333] py-3 pb-4 lg:flex">
      {/* Search */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#E8DDC0" }}>
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Search users, content, settings..."
          className="w-full max-w-md rounded-lg border border-[#333] bg-[#1a1a1a] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-gray-600"
        />
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 transition-colors hover:bg-white/5"
          style={{ color: "#E8DDC0" }}
          aria-label="Activity"
        >
          <ClockIcon />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 transition-colors hover:bg-white/5"
          style={{ color: "#E8DDC0" }}
          aria-label="Settings"
        >
          <SettingsIcon />
        </button>
        <button
          type="button"
          className="relative rounded-lg p-2 transition-colors hover:bg-white/5"
          style={{ color: "#E8DDC0" }}
          aria-label="Notifications"
        >
          <BellIcon />
          <span
            className="absolute right-1 top-1 h-2 w-2 rounded-full"
            style={{ backgroundColor: "#E8DDC0" }}
          />
        </button>

        <span
          className="ml-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          style={{ backgroundColor: "rgba(52, 211, 153, 0.15)", color: "#34d399" }}
        >
          System Healthy
        </span>
      </div>
    </div>
  );
}
