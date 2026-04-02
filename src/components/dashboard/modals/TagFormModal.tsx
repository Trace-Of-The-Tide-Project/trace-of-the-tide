"use client";

import { useCallback, useEffect, useState } from "react";
import { XIcon } from "@/components/ui/icons";

const ACCENT = "#E8DDC0";

type TagFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  tagId?: string;
  initialLabel?: string;
  onSave: (payload: { id?: string; label: string }) => void;
};

export function TagFormModal({
  open,
  onClose,
  mode,
  tagId,
  initialLabel = "",
  onSave,
}: TagFormModalProps) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!open) return;
    setLabel(mode === "edit" ? initialLabel : "");
  }, [open, mode, initialLabel]);

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

  const title = mode === "add" ? "Add Tag" : "Edit Tag";
  const subtitle =
    mode === "add" ? "Create a new content tag" : "Update the tag details";
  const primaryLabel = mode === "add" ? "Create Tag" : "Save Changes";
  const titleId = "tag-form-modal-title";

  const submit = () => {
    const t = label.trim();
    if (!t) return;
    onSave({ id: tagId, label: t });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div
        className="relative w-full max-w-lg rounded-2xl border border-[#333] bg-black shadow-xl"
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

        <div className="px-6 py-5">
          <label htmlFor="tag-label" className="block text-sm font-medium text-white">
            Tag Name
          </label>
          <input
            id="tag-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={mode === "add" ? "e.g Featured" : undefined}
            className="mt-2 w-full rounded-lg border border-[#2f2f2f] bg-black px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
          />
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
            disabled={!label.trim()}
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
