"use client";

import { useCallback, useEffect, useState } from "react";
import { XIcon } from "@/components/ui/icons";

type ScheduleArticleModalProps = {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onConfirm: (scheduledAtIso: string) => void;
};

function localValueToIso(value: string): string | null {
  if (!value.trim()) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function ScheduleArticleModal({ open, busy, onClose, onConfirm }: ScheduleArticleModalProps) {
  const [scheduleAt, setScheduleAt] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    },
    [busy, onClose],
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
    setScheduleAt("");
    setHint(null);
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const iso = localValueToIso(scheduleAt);
    if (!iso) {
      setHint("Choose a valid date and time.");
      return;
    }
    setHint(null);
    onConfirm(iso);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={() => !busy && onClose()}
        aria-label="Close modal"
      />

      <div
        className="relative mx-4 w-full max-w-md rounded-xl border border-[#444444] bg-[#1a1a1a] p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-article-title"
      >
        <div className="mb-5 flex items-start justify-between border-b border-[#444444] pb-4">
          <div>
            <h2 id="schedule-article-title" className="text-lg font-bold text-white">
              Schedule publication
            </h2>
            <p className="mt-1 text-sm text-gray-500">Pick when this article should go live.</p>
          </div>
          <button
            type="button"
            onClick={() => !busy && onClose()}
            className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
            aria-label="Close"
            disabled={busy}
          >
            <XIcon />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm text-gray-400">
            <span>Date and time (your local timezone)</span>
            <input
              type="datetime-local"
              value={scheduleAt}
              onChange={(e) => {
                setScheduleAt(e.target.value);
                setHint(null);
              }}
              disabled={busy}
              required
              className="rounded-lg border border-[#444444] bg-[#333333] px-3 py-2.5 text-sm text-white outline-none focus:border-gray-500 disabled:opacity-50"
            />
          </label>
          {hint ? <p className="text-sm text-amber-400">{hint}</p> : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              className="rounded-lg border border-[#444444] bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#333333] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: "#C9A96E" }}
            >
              {busy ? "Scheduling…" : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
