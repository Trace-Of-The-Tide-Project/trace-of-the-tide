"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, XIcon } from "@/components/ui/icons";
import { theme } from "@/lib/theme";
import type { MessageTemplate, MessageTemplateCategory } from "@/components/dashboard/modals/CreateMessageTemplateModal";

type EditMessageTemplateModalProps = {
  open: boolean;
  template: MessageTemplate | null;
  onClose: () => void;
  onSave: (template: MessageTemplate) => void;
};

const CATEGORY_OPTIONS: Array<{ value: MessageTemplateCategory; label: string }> = [
  { value: "onboarding", label: "onboarding" },
  { value: "payment", label: "payment" },
  { value: "moderation", label: "moderation" },
  { value: "broadcast", label: "broadcast" },
];

export function EditMessageTemplateModal({ open, template, onClose, onSave }: EditMessageTemplateModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MessageTemplateCategory>("onboarding");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const categoryButtonRef = useRef<HTMLButtonElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  const canSubmit = useMemo(() => name.trim().length > 0 && subject.trim().length > 0 && body.trim().length > 0, [
    name,
    subject,
    body,
  ]);

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

  useEffect(() => {
    if (!open || !template) return;
    setName(template.name);
    setCategory(template.category);
    setCategoryOpen(false);
    setSubject(template.subject);
    setBody(template.body);
  }, [open, template]);

  useEffect(() => {
    if (!open || !categoryOpen) return;
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(target) &&
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(target)
      ) {
        setCategoryOpen(false);
      }
    }
    function onDocKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setCategoryOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [open, categoryOpen]);

  if (!open || !template) return null;

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
            <h2 className="text-lg font-bold text-white">Edit Template</h2>
            <p className="mt-1 text-sm text-gray-500">Update this message template</p>
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
            onSave({
              ...template,
              name: name.trim(),
              category,
              subject: subject.trim(),
              body: body.trim(),
            });
            onClose();
          }}
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">Template Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[44px] w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-gray-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">Category</label>
            <div className="relative">
              <button
                ref={categoryButtonRef}
                type="button"
                onClick={() => setCategoryOpen((v) => !v)}
                className="flex h-[44px] w-full items-center justify-between rounded-lg border border-[#333] bg-[#1a1a1a] px-4 text-sm text-white outline-none transition-colors focus:border-gray-500"
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
              >
                <span className="capitalize text-gray-200">{category}</span>
                <span className="text-gray-500">
                  <ChevronDownIcon />
                </span>
              </button>

              {categoryOpen && (
                <div
                  ref={categoryMenuRef}
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-10 mt-2 rounded-lg border border-[#333] bg-[#2a2a2a] p-2 shadow-xl"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setCategory(opt.value);
                        setCategoryOpen(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-white hover:bg-white/5"
                    >
                      {opt.label.charAt(0).toUpperCase() + opt.label.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">Subject Line</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-[44px] w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-gray-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white">Message Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full resize-y rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-gray-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Available variables:{" "}
              <span className="text-gray-400">{"{{name}}, {{email}}, {{role}}, {{date}}"}</span>
            </p>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

