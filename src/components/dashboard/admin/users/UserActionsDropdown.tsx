"use client";

import { useState, useRef, useEffect } from "react";
import { MoreDotsIcon } from "@/components/ui/icons";

const ACTIONS = [
  { id: "view", label: "View Profile" },
  { id: "edit", label: "Edit User" },
  { id: "role", label: "Change Role" },
  { id: "verify", label: "Verify User" },
  { id: "suspend", label: "Suspend User", destructive: true },
] as const;

type UserActionsDropdownProps = {
  userId: string;
  onAction?: (actionId: string, userId: string) => void;
};

export function UserActionsDropdown({ userId, onAction }: UserActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="rounded p-1.5 transition-colors hover:bg-white/5"
        style={{ color: "#A3A3A3" }}
        aria-label="More actions"
        aria-expanded={isOpen}
      >
        <MoreDotsIcon />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[160px] rounded-lg border border-[#444] bg-[#232323] py-1 shadow-lg">
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                onAction?.(action.id, userId);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] ${
                action.destructive ? "text-red-400 hover:bg-red-500/10" : "text-white"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
