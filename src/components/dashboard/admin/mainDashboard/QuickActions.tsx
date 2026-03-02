import Link from "next/link";
import type { ComponentType } from "react";

export type QuickActionItem = {
  id: string;
  icon: ComponentType;
  label: string;
  description: string;
  href: string;
};

type QuickActionsProps = {
  items: QuickActionItem[];
};

function HexIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path
          d="M24 2L44 14V34L24 46L4 34V14Z"
          fill="#1a1a1a"
          stroke="#333"
          strokeWidth="1"
        />
      </svg>
      <span className="relative text-gray-400">{children}</span>
    </div>
  );
}

export function QuickActions({ items }: QuickActionsProps) {
  return (
    <div className="rounded-xl border border-[#333] bg-[#0a0a0a] p-5">
      <h3 className="mb-4 text-lg font-bold text-white">Quick Actions</h3>

      <div className="flex flex-col gap-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-4 rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-5 mx-4 transition-colors hover:bg-white/2"
            >
              <HexIcon>
                <Icon />
              </HexIcon>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
