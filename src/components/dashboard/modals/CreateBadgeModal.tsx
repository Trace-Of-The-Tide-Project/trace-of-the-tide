"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GiftIcon,
  HeartHandshakeIcon,
  SquareCheckIcon,
  StarIcon,
  SunIcon,
  ThreadIcon,
  XIcon,
} from "@/components/ui/icons";
import { theme } from "@/lib/theme";
import type { Badge } from "@/lib/dashboard/engagements-constants";

type BadgeIconOption = Badge["icon"];

type CreateBadgeModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (badge: Omit<Badge, "id" | "recipients">) => void;
};

const ROLE_OPTIONS = ["All Users", "All Authors", "All Editors", "All Contributors"] as const;

const ICON_OPTIONS: Array<{ id: BadgeIconOption; label: string; icon: React.ReactNode }> = [
  { id: "award", label: "Award", icon: <ThreadIcon /> },
  { id: "star", label: "Star", icon: <StarIcon /> },
  { id: "heart", label: "Heart", icon: <HeartHandshakeIcon /> },
  { id: "check", label: "Check", icon: <SquareCheckIcon /> },
  { id: "spark", label: "Spark", icon: <SunIcon /> },
];

export function CreateBadgeModal({ open, onClose, onCreate }: CreateBadgeModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<BadgeIconOption>("award");
  const [name, setName] = useState("");
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number] | "">("");
  const [reason, setReason] = useState("");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleButtonRef = useRef<HTMLButtonElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  const canSubmit = useMemo(() => name.trim().length > 0 && role !== "", [name, role]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (roleMenuOpen) setRoleMenuOpen(false);
        else onClose();
      }
    },
    [onClose, roleMenuOpen],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        roleMenuOpen &&
        roleMenuRef.current &&
        !roleMenuRef.current.contains(target) &&
        roleButtonRef.current &&
        !roleButtonRef.current.contains(target)
      ) {
        setRoleMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, roleMenuOpen]);

  useEffect(() => {
    if (!open) return;
    // Reset each time it opens to match typical modal UX.
    setSelectedIcon("award");
    setName("");
    setRole("");
    setReason("");
    setRoleMenuOpen(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative mx-4 w-full max-w-lg rounded-xl border border-[#333] bg-[#0a0a0a] p-6">
        <div className="mb-5 flex items-start justify-between border-b border-[#333] pb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Create New Badge</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <XIcon />
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onCreate({
              name: name.trim(),
              description: reason.trim() || "—",
              icon: selectedIcon,
            });
            onClose();
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Icon</label>
            <div className="flex flex-wrap gap-3">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedIcon(opt.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border bg-[#1a1a1a] transition-colors"
                  style={{
                    borderColor: selectedIcon === opt.id ? theme.accentGoldFocus : "#333",
                    color: selectedIcon === opt.id ? theme.accentGoldFocus : "#d1d5db",
                  }}
                  aria-label={opt.label}
                >
                  {opt.id === "award" ? <GiftIcon /> : opt.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">Badge Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g Top Contributor"
              className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm placeholder-[#6b7280] outline-none transition-colors focus:border-gray-500"
              style={{ color: "#e5e7eb" }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">Or select a role</label>
            <div className="relative">
              <button
                ref={roleButtonRef}
                type="button"
                onClick={() => setRoleMenuOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm outline-none transition-colors focus:border-gray-500"
                style={{ color: role ? "#e5e7eb" : "#6b7280" }}
                aria-haspopup="listbox"
                aria-expanded={roleMenuOpen}
              >
                <span className="truncate">{role || "Award to role..."}</span>
                <span className="text-gray-500">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {roleMenuOpen && (
                <div
                  ref={roleMenuRef}
                  className="absolute left-0 right-0 top-full z-10 mt-2 rounded-lg border border-[#333] bg-[#2a2a2a] p-2 shadow-xl"
                  role="listbox"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setRole(opt);
                        setRoleMenuOpen(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-white hover:bg-white/5"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">
              Reason <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this badge being awarded?"
              rows={4}
              className="w-full resize-y rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm placeholder-[#6b7280] outline-none transition-colors focus:border-gray-500"
              style={{ color: "#e5e7eb" }}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#333] bg-[#333333] px-6 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg px-6 py-2 text-sm font-medium text-black transition-colors disabled:opacity-50"
              style={{ backgroundColor: theme.accentGoldFocus }}
            >
              Create Badge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

