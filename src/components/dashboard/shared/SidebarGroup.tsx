"use client";

import type { SidebarGroupConfig } from "@/lib/dashboard/types";
import { SidebarItem } from "./SidebarItem";

type SidebarGroupProps = SidebarGroupConfig & {
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
};

export function SidebarGroup({
  label,
  icon: Icon,
  items,
  isOpen,
  onToggle,
  onItemClick,
}: SidebarGroupProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 rounded-lg border border-[#333] bg-[#333333] px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-[#222] hover:text-white"
      >
        <span className="shrink-0">
          <Icon />
        </span>
        <span className="flex-1 truncate text-left">{label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-1 flex flex-col gap-0.5">
          {items.map((item) => (
            <SidebarItem key={item.href} {...item} onClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  );
}
