"use client";

import { useCallback, useEffect, useState } from "react";
import { XIcon } from "@/components/ui/icons";

const ACCENT = "#E8DDC0";

function slugWithoutSlash(s: string) {
  return s.trim().replace(/^\//, "");
}

function toStoredSlug(input: string) {
  const core = slugWithoutSlash(input);
  return core ? `/${core}` : "";
}

type CategoryFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  /** When editing, pass id so parent can update the right row */
  categoryId?: string;
  initialName?: string;
  initialSlug?: string;
  onSave: (payload: { id?: string; name: string; slug: string }) => void;
};

export function CategoryFormModal({
  open,
  onClose,
  mode,
  categoryId,
  initialName = "",
  initialSlug = "",
  onSave,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit") {
      setName(initialName);
      setSlug(slugWithoutSlash(initialSlug));
    } else {
      setName("");
      setSlug("");
    }
  }, [open, mode, initialName, initialSlug]);

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

  const title = mode === "add" ? "Add Category" : "Edit Category";
  const subtitle =
    mode === "add" ? "Create a new content category" : "Update the category details";
  const primaryLabel = mode === "add" ? "Create Category" : "Save edit";
  const titleId = "category-form-modal-title";

  const submit = () => {
    const stored = toStoredSlug(slug);
    if (!name.trim() || !stored) return;
    onSave({ id: categoryId, name: name.trim(), slug: stored });
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

        <div className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-white">
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mode === "add" ? "e.g Documentary" : undefined}
              className="mt-2 w-full rounded-lg border border-[#2f2f2f] bg-black px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="category-slug" className="block text-sm font-medium text-white">
              Slug
            </label>
            <input
              id="category-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={mode === "add" ? "e.g documentary" : undefined}
              className="mt-2 w-full rounded-lg border border-[#2f2f2f] bg-black px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-gray-500">URL-friendly identifier: /…</p>
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
            disabled={!name.trim() || !slugWithoutSlash(slug)}
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
