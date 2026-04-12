"use client";

import { useState, useRef } from "react";
import { CloudUploadIcon } from "@/components/ui/icons";
import { theme } from "@/lib/theme";

export function BrandingTab() {
  const [primaryColor, setPrimaryColor] = useState<string>(theme.accentGoldFocus);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [logoDragging, setLogoDragging] = useState(false);
  const [faviconDragging, setFaviconDragging] = useState(false);

  const handleLogoSelect = (file: File | null) => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setLogoFile(file);
    if (file && file.type.startsWith("image/")) setLogoPreview(URL.createObjectURL(file));
  };

  const handleFaviconSelect = (file: File | null) => {
    if (faviconPreview) URL.revokeObjectURL(faviconPreview);
    setFaviconPreview(null);
    setFaviconFile(file);
    if (file && file.type.startsWith("image/")) setFaviconPreview(URL.createObjectURL(file));
  };

  return (
    <div className="rounded-xl border border-[var(--tott-card-border)] p-6">
      <h3 className="text-sm font-semibold text-foreground">Brand Settings</h3>
      <p className="mt-1 text-xs text-gray-500">Logo, colors, and typography.</p>
      <div className="mt-6 space-y-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">Logo</label>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
            className="sr-only"
            onChange={(e) => handleLogoSelect(e.target.files?.[0] ?? null)}
          />
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                logoInputRef.current?.click();
              }
            }}
            onClick={() => logoInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              setLogoDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleLogoSelect(file);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setLogoDragging(true);
            }}
            onDragLeave={() => setLogoDragging(false)}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
              logoDragging ? "border-[#C9A96E] bg-[var(--tott-dash-surface-inset)]" : "border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] hover:border-[#555]"
            }`}
          >
            {logoPreview ? (
              <div className="relative w-full overflow-hidden rounded">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="mx-auto max-h-24 w-auto object-contain"
                />
                <p className="mt-2 text-xs text-gray-400">{logoFile?.name}</p>
              </div>
            ) : (
              <>
                <span className="text-gray-500 [&_svg]:h-10 [&_svg]:w-10">
                  <CloudUploadIcon />
                </span>
                <p className="mt-2 text-sm text-foreground">
                  Drag and drop files here, or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: JPG, PNG, WebP, SVG, GIF (Max 20MB)
                </p>
              </>
            )}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">Favicon</label>
          <input
            ref={faviconInputRef}
            type="file"
            accept="image/png,image/x-icon,image/svg+xml,image/gif"
            className="sr-only"
            onChange={(e) => handleFaviconSelect(e.target.files?.[0] ?? null)}
          />
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                faviconInputRef.current?.click();
              }
            }}
            onClick={() => faviconInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              setFaviconDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFaviconSelect(file);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setFaviconDragging(true);
            }}
            onDragLeave={() => setFaviconDragging(false)}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
              faviconDragging ? "border-[#C9A96E] bg-[var(--tott-dash-surface-inset)]" : "border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] hover:border-[#555]"
            }`}
          >
            {faviconPreview ? (
              <div className="relative w-full overflow-hidden rounded">
                <img
                  src={faviconPreview}
                  alt="Favicon preview"
                  className="mx-auto max-h-16 w-auto object-contain"
                />
                <p className="mt-2 text-xs text-gray-400">{faviconFile?.name}</p>
              </div>
            ) : (
              <>
                <span className="text-gray-500 [&_svg]:h-10 [&_svg]:w-10">
                  <CloudUploadIcon />
                </span>
                <p className="mt-2 text-sm text-foreground">
                  Drag and drop files here, or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: JPG, PNG, WebP, SVG, ICO (Max 20MB)
                </p>
              </>
            )}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">Primary Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-[var(--tott-card-border)] bg-transparent p-1"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="#CBA158"
              className="flex-1 rounded-lg border border-[var(--tott-card-border)] bg-[var(--tott-dash-surface-inset)] px-4 py-2.5 text-sm text-foreground placeholder-gray-500 focus:border-[#555] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
