"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/theme";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function CloudUploadIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg {...iconProps} width={18} height={18}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg {...iconProps}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg {...iconProps}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

type UploadedFile = { id: string; file: File; sizeLabel: string };

const inputBase =
  "w-full rounded-lg border bg-[#1a1a1a] px-4 py-3 text-white placeholder-gray-500 transition-colors hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-[#C9A96E] focus:border-[#C9A96E]";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ContributionForm() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList?.length) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      sizeLabel: formatFileSize(file.size),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      // Form submission can be wired to API later; on failure redirect to /contribute/error
      router.push("/contribute/success");
    } catch {
      router.push("/contribute/error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-white">
          Contribution title
        </label>
        <input
          name="title"
          type="text"
          placeholder="Enter a title for your contribution"
          className={inputBase}
          style={{
            borderColor: theme.inputBorder,
          }}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white">
          Choose collection <span className="text-gray-500">(Optional)</span>
        </label>
        <div className="relative">
          <select
            name="collection"
            className={`${inputBase} appearance-none pr-10`}
            style={{ borderColor: theme.inputBorder }}
          >
            <option value="">Enter or select collection</option>
            <option value="stories">Stories</option>
            <option value="documents">Documents</option>
            <option value="media">Media</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white">
          Description
        </label>
        <textarea
          name="description"
          rows={5}
          placeholder="Enter a description for the contribution"
          className={inputBase}
          style={{ borderColor: theme.inputBorder }}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white">
          Upload files
        </label>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
            isDragging ? "border-[#C9A96E] bg-[#C9A96E]/10" : "border-gray-600 bg-[#1a1a1a]"
          }`}
        >
          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            onChange={(e) => addFiles(e.target.files)}
          />
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center gap-2 text-gray-400"
          >
            <span style={{ color: theme.accentGoldFocus }}>
              <CloudUploadIcon />
            </span>
            <span className="text-center text-sm">
              Drag and drop files here, or click to browse
            </span>
            <span className="text-xs text-gray-500">
              Supported formats: JPG, PNG, PDF, MP3, MP4, DOC (Max 20MB)
            </span>
          </label>
        </div>

        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map(({ id, file, sizeLabel }) => (
              <li
                key={id}
                className="flex items-center gap-3 rounded-lg border border-gray-700 bg-[#1a1a1a] px-4 py-3"
              >
                <span className="text-gray-500">
                  <FileTextIcon />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-white">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500">{sizeLabel}</span>
                <button
                  type="button"
                  onClick={() => removeFile(id)}
                  className="rounded p-1 text-gray-500 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                  aria-label="Remove file"
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white">
          Your name
        </label>
        <input
          name="name"
          type="text"
          placeholder="Enter your full name"
          className={inputBase}
          style={{ borderColor: theme.inputBorder }}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white">
          Your email address
        </label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email address"
          className={inputBase}
          style={{ borderColor: theme.inputBorder }}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white">
          Your mobile number <span className="text-gray-500">(Optional)</span>
        </label>
        <div className="flex gap-2">
          <div
            className="flex w-16 items-center justify-center rounded-lg border bg-[#1a1a1a] px-3 py-3 text-gray-400"
            style={{ borderColor: theme.inputBorder }}
          >
            +20
          </div>
          <input
            name="mobile"
            type="tel"
            placeholder="01 2345 6789"
            className={`${inputBase} flex-1`}
            style={{ borderColor: theme.inputBorder }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        By submitting, you agree that your contribution may be used and attributed in
        accordance with our terms. We may contact you regarding your submission.
      </p>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full rounded-lg px-6 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
          style={{
            backgroundColor: theme.accentGold,
            boxShadow: `0 0 0 1px ${theme.accentGold}`,
          }}
        >
          Submit Contribution
        </button>
      </div>
    </form>
  );
}
