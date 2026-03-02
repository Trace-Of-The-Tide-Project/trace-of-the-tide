"use client";

import { useEffect, useCallback } from "react";
import { XIcon } from "@/components/ui/icons";

type DetailModalItem = {
  id: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction?: () => void;
  actionHref?: string;
};

type Badge = {
  label: string;
  color: string;
};

type DetailModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  badge?: Badge;
  items: DetailModalItem[];
  viewAllLabel?: string;
  viewAllHref?: string;
  onViewAll?: () => void;
};

export function DetailModal({
  open,
  onClose,
  title,
  description,
  badge,
  items,
  viewAllLabel = "View All",
  viewAllHref,
  onViewAll,
}: DetailModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
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
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              {badge && (
                <span
                  className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase"
                  style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
                >
                  {badge.label}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
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

        {/* Items */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-[#333] bg-[#111] px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{item.subtitle}</p>
              </div>
              {item.actionHref ? (
                <a
                  href={item.actionHref}
                  className="shrink-0 rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
                >
                  {item.actionLabel}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={item.onAction}
                  className="shrink-0 rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
                >
                  {item.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* View All */}
        {(viewAllHref || onViewAll) && (
          <div className="mt-4">
            {viewAllHref ? (
              <a
                href={viewAllHref}
                className="block w-full rounded-lg py-3 text-center text-sm font-medium text-black transition-colors hover:opacity-90"
                style={{ backgroundColor: "#CBA158" }}
              >
                {viewAllLabel}
              </a>
            ) : (
              <button
                type="button"
                onClick={onViewAll}
                className="w-full rounded-lg py-3 text-sm font-medium text-black transition-colors hover:opacity-90"
                style={{ backgroundColor: "#CBA158" }}
              >
                {viewAllLabel}
              </button>
            )}
          </div>
        )}

        {/* Close button */}
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#333] bg-[#1a1a1a] px-6 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
