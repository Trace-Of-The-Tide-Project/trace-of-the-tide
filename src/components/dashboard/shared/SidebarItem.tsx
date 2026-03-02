"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from "@/lib/theme";
import type { SidebarItemConfig } from "@/lib/dashboard/types";

const GOLD = theme.accentGold;

type SidebarItemProps = SidebarItemConfig & {
  onClick?: () => void;
};

export function SidebarItem({ label, href, icon: Icon, badge, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        isActive
          ? "border font-medium"
          : "border border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
      style={
        isActive
          ? { borderColor: GOLD, color: GOLD }
          : undefined
      }
    >
      <span className="shrink-0">
        <Icon />
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && (
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
          style={
            isActive
              ? { color: GOLD, backgroundColor: "rgba(232, 221, 192, 0.1)" }
              : { color: "#9ca3af", backgroundColor: "rgba(255,255,255,0.1)" }
          }
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
