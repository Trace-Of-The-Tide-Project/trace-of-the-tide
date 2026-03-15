"use client";

import { useState, useRef } from "react";
import {
  EyeIcon,
  GripVerticalIcon,
  CloudUploadIcon,
  PlusIcon,
  RefreshCwIcon,
} from "@/components/ui/icons";

export type SectionId = "hero" | "featured" | "categories" | "top-creators" | "cta";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "hero", label: "Hero Section" },
  { id: "featured", label: "Featured" },
  { id: "categories", label: "Categories" },
  { id: "top-creators", label: "Top Creators" },
  { id: "cta", label: "Call to Action" },
];

export function HomePageTab() {
  const [selectedSection, setSelectedSection] = useState<SectionId>("hero");
  const [sectionVisibility, setSectionVisibility] = useState<Record<SectionId, boolean>>({
    hero: true,
    featured: true,
    categories: true,
    "top-creators": true,
    cta: true,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const toggleVisibility = (id: SectionId) => {
    setSectionVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileSelect = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setBackgroundFile(file);
    if (file && file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="grid gap-9 lg:grid-cols-[320px_1fr]">
      <div className="rounded-xl border border-[#444] p-8 px-10">
        <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
        <p className="mt-1 text-xs text-gray-500">Drag to reorder, toggle visibility.</p>
        <div className="mt-4 flex w-full flex-col gap-4">
          {SECTIONS.map((section) => {
            const isSelected = selectedSection === section.id;
            return (
              <div
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-5 transition-colors hover:bg-[#333] ${
                  isSelected ? "border-[#C9A96E]" : "border-[#444]"
                }`}
              >
                <span
                  className={`cursor-grab hover:opacity-80 ${isSelected ? "text-[#C9A96E]" : "text-gray-500"}`}
                  aria-label="Reorder"
                >
                  <GripVerticalIcon />
                </span>
                <span
                  className={`flex-1 text-sm font-medium ${isSelected ? "text-[#C9A96E]" : "text-white"}`}
                >
                  {section.label}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(section.id);
                  }}
                  className={`rounded p-1.5 transition-colors hover:bg-white/10 ${
                    isSelected ? "text-[#C9A96E]" : sectionVisibility[section.id] ? "text-gray-400" : "text-gray-600"
                  }`}
                  aria-label={sectionVisibility[section.id] ? "Hide section" : "Show section"}
                >
                  <EyeIcon className="[&>svg]:h-4 [&>svg]:w-4" />
                </button>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#333] py-2.5 text-sm text-white transition-colors hover:bg-[#3a3a3a]"
        >
          <PlusIcon className="[&>svg]:h-4 [&>svg]:w-4" />
          Add Section
        </button>
      </div>

      <div className="rounded-xl border border-[#444] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Hero Banner</h3>
            <p className="mt-1 text-xs text-gray-500">Edit section content and settings.</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-[#444] bg-[#333] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <RefreshCwIcon className="[&>svg]:h-3.5 [&>svg]:w-3.5" />
            Reset
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white">Headline</label>
            <input
              type="text"
              placeholder="Discover. Create. Inspire."
              className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white">Subheadline</label>
            <textarea
              placeholder="Join a community of creators, authors, and editors sharing their passion with the world."
              rows={3}
              className="w-full resize-none rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white">Primary CTA</label>
            <input
              type="text"
              placeholder="Contribute now."
              className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white">Secondary CTA</label>
            <input
              type="text"
              placeholder="Contribute now."
              className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white">Background Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
                isDragging ? "border-[#C9A96E] bg-[#2a2a2a]" : "border-[#444] bg-[#1a1a1a] hover:border-[#555]"
              }`}
            >
              {previewUrl ? (
                <div className="relative w-full max-h-40 overflow-hidden rounded">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto max-h-40 w-auto object-contain"
                  />
                  <p className="mt-2 text-xs text-gray-400">{backgroundFile?.name}</p>
                </div>
              ) : (
                <>
                  <span className="text-gray-500">
                    <CloudUploadIcon className="[&>svg]:h-10 [&>svg]:w-10" />
                  </span>
                  <p className="mt-2 text-sm text-white">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: JPG, PNG, WebP, GIF (Max 20MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
