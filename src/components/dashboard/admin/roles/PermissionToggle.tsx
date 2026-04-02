"use client";

import { theme } from "@/lib/theme";

type PermissionToggleProps = {
  checked: boolean;
  onChange: (v: boolean) => void;
  checkedColor?: string;
};

export function PermissionToggle({ checked, onChange, checkedColor }: PermissionToggleProps) {
  const bgColor = checked ? (checkedColor ?? theme.accentGoldFocus) : undefined;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "" : "bg-[#333]"}`}
      style={checked ? { backgroundColor: bgColor } : undefined}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}
