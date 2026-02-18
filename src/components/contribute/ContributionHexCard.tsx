"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const GRAY_BORDER = "#525252";
const GRAY_TEXT = "#9ca3af";

type ContributionHexCardProps = {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export function ContributionHexCard({
  icon,
  label,
  selected,
  onClick,
  className = "",
}: ContributionHexCardProps) {
  const [hovered, setHovered] = useState(false);
  const isActive = selected || hovered;

  const borderColor = isActive ? theme.accentGold : GRAY_BORDER;
  const innerBorder = isActive ? theme.accentGold : GRAY_BORDER;
  const textColor = isActive ? theme.accentGoldFocus : GRAY_TEXT;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative mx-auto flex w-full max-w-[220px] flex-col items-center justify-center gap-1 py-3 px-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent ${className}`}
      style={{
        clipPath: HEX_CLIP,
        background: borderColor,
        padding: "2px",
        minHeight: "100px",
      }}
      aria-pressed={selected}
    >
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-1.5 py-2.5 px-2"
        style={{
          clipPath: HEX_CLIP,
          background: "#1a1a1a",
          boxShadow: `inset 0 0 0 1px ${innerBorder}`,
        }}
      >
        <span
          className="flex shrink-0 items-center justify-center [&>svg]:h-5 [&>svg]:w-auto"
          style={{ color: textColor }}
        >
          {icon}
        </span>
        <span
          className="text-center text-xs font-semibold leading-tight"
          style={{ color: textColor }}
        >
          {label}
        </span>
      </div>
    </button>
  );
}
