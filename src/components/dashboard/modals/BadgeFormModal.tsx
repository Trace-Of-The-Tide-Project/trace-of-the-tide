"use client";

import { useCallback, useEffect, useState } from "react";
import { XIcon } from "@/components/ui/icons";
import { BADGE_ICON_OPTIONS } from "@/components/dashboard/admin/system-settings/badge-icon-options";
import type { BadgeIconId } from "@/lib/dashboard/system-settings-constants";

const ACCENT = "#E8DDC0";

const DEFAULT_ICON: BadgeIconId = "gift";

type BadgeFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  badgeId?: string;
  initialIconId?: BadgeIconId;
  initialName?: string;
  initialMilestone?: string;
  onSave: (payload: { id?: string; iconId: BadgeIconId; name: string; milestone: string }) => void;
};

export function BadgeFormModal({
  open,
  onClose,
  mode,
  badgeId,
  initialIconId = DEFAULT_ICON,
  initialName = "",
  initialMilestone = "",
  onSave,
}: BadgeFormModalProps) {
  const [iconId, setIconId] = useState<BadgeIconId>(DEFAULT_ICON);
  const [name, setName] = useState("");
  const [milestone, setMilestone] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit") {
      setIconId(initialIconId);
      setName(initialName);
      setMilestone(initialMilestone);
    } else {
      setIconId(DEFAULT_ICON);
      setName("");
      setMilestone("");
    }
  }, [open, mode, initialIconId, initialName, initialMilestone]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
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

  const title = mode === "add" ? "Create Badge" : "Edit Badge";
  const subtitle =
    mode === "add" ? "Create a new achievement badge" : "Update the badge details";
  const primaryLabel = mode === "add" ? "Create Badge" : "Save Changes";
  const titleId = "badge-form-modal-title";

  const submit = () => {
    const n = name.trim();
    const m = milestone.trim();
    if (!n || !m) return;
    onSave({ id: badgeId, iconId, name: n, milestone: m });
    onClose();
  };

  const inputClass =
    "mt-2 w-full rounded-lg border border-[#2f2f2f] bg-black px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div
        className="relative max-h-[min(90vh,640px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#333] bg-black shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-start justify-between border-b border-[#2a2a2a] px-6 py-5">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <span className="[&_svg]:h-5 [&_svg]:w-5">
              <XIcon />
            </span>
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-white">Icon</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {BADGE_ICON_OPTIONS.map(({ id, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setIconId(id)}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg border bg-black text-[#E8DDC0] transition-colors ${
                    iconId === id ? "border-[#E8DDC0]" : "border-[#333] hover:border-[#444]"
                  }`}
                  aria-label={`Select icon ${id}`}
                  aria-pressed={iconId === id}
                >
                  <span className="[&_svg]:h-[18px] [&_svg]:w-[18px]">
                    <Icon />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="badge-name" className="block text-sm font-medium text-white">
              Badge Name
            </label>
            <input
              id="badge-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mode === "add" ? "e.g Top Contributor" : undefined}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="badge-milestone" className="block text-sm font-medium text-white">
              Milestone
            </label>
            <input
              id="badge-milestone"
              type="text"
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              placeholder={mode === "add" ? "e.g +100 Contributions" : undefined}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#2a2a2a] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#444] bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!name.trim() || !milestone.trim()}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-[#111] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: ACCENT }}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
