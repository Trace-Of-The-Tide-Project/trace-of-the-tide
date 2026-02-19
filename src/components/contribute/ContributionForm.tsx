"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CloudUploadIcon,
  ChevronDownIcon,
  FileTextIcon,
  Grid2x2Icon,
  TrashIcon,
} from "@/components/ui/icons";
import { theme } from "@/lib/theme";
import {
  CONTRIBUTION_FORM_INPUT_BASE as inputBase,
  COUNTRY_CODES,
} from "@/lib/constants";

type UploadedFile = { id: string; file: File; sizeLabel: string };

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
    <form onSubmit={handleSubmit} className="mx-auto w-[80vw] max-w-[80vw] select-none space-y-4 sm:w-full sm:max-w-xl sm:space-y-5">
      <div>
        <label className="mb-1 block select-none text-xs font-medium text-white sm:mb-1.5 sm:text-sm">
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
        <label className="mb-1 block select-none text-xs cursor-pointer font-medium text-white sm:mb-1.5 sm:text-sm">
          Choose collection <span className="text-gray-500">(Optional)</span>
        </label>
        <div className="relative select-none">
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
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-gray-500">
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      <div>
        <label className="mb-1 block select-none text-xs font-medium text-white sm:mb-1.5 sm:text-sm">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          placeholder="Enter a description for the contribution"
          className={inputBase}
          style={{ borderColor: theme.inputBorder }}
        />
      </div>

      <div>
        <label className="mb-1 block select-none text-xs font-medium text-white sm:mb-1.5 sm:text-sm">
          Upload files
        </label>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`flex select-none flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition-colors sm:px-6 sm:py-10 ${
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
            className="flex cursor-pointer select-none flex-col items-center gap-2 text-gray-400"
          >
            <span style={{ color: theme.accentGoldFocus }}>
              <CloudUploadIcon />
            </span>
            <span className="text-center text-xs sm:text-sm">
              Drag and drop files here, or click to browse
            </span>
            <span className="text-xs text-gray-500">
              Supported formats: JPG, PNG, PDF, MP3, MP4, DOC (Max 20MB)
            </span>
          </label>
        </div>

        {files.length > 0 && (
          <ul className="mt-3 select-none space-y-2">
            {files.map(({ id, file, sizeLabel }) => (
              <li
                key={id}
                className="flex select-none items-center gap-2 rounded-lg border border-gray-700 bg-[#1a1a1a] px-3 py-2 sm:gap-3 sm:px-4 sm:py-3"
              >
                <span className="text-gray-500">
                  <FileTextIcon />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-white">{file.name}</span>
                <span className="text-xs text-gray-500">{sizeLabel}</span>
                <button
                  type="button"
                  onClick={() => removeFile(id)}
                  className="select-none rounded p-1 text-gray-500 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
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
        <label className="mb-1 block select-none text-xs font-medium text-white sm:mb-1.5 sm:text-sm">Your name</label>
        <input
          name="name"
          type="text"
          placeholder="Enter your full name"
          className={inputBase}
          style={{ borderColor: theme.inputBorder }}
        />
      </div>

      <div>
        <label className="mb-1 block select-none text-xs font-medium text-white sm:mb-1.5 sm:text-sm">
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
        <label className="mb-1 block select-none text-xs font-medium text-white sm:mb-1.5 sm:text-sm">
          Your mobile number <span className="text-gray-500">(Optional)</span>
        </label>
        <div
          className="flex select-none items-stretch overflow-hidden rounded-lg border"
          style={{ borderColor: theme.inputBorder }}
        >
          <div
            className="relative flex w-[120px] shrink-0 cursor-pointer select-none items-center border-r bg-[#1a1a1a] sm:w-[140px]"
            style={{ borderColor: theme.inputBorder }}
          >
            <select
              name="countryCode"
              className="absolute inset-0 z-10 cursor-pointer select-none appearance-none border-0 bg-transparent py-2 pl-6 pr-6 text-xs text-gray-400 focus:outline-none focus:ring-0 sm:py-2.5 sm:pl-8 sm:pr-8"
              defaultValue="+20"
            >
              {COUNTRY_CODES.map(({ code, country }) => (
                <option key={code} value={code} className="bg-[#1a1a1a] text-white">
                  {code} {country}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 [&>svg]:h-4 [&>svg]:w-4">
              <Grid2x2Icon />
            </span>
            <span
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 [&>svg]:h-4 [&>svg]:w-4"
              aria-hidden
            >
              <ChevronDownIcon />
            </span>
          </div>
          <input
            name="mobile"
            type="tel"
            placeholder="01 2345 6789"
            className={`${inputBase} min-w-0 flex-1 rounded-none border-0 border-l-0`}
            style={{ borderColor: "transparent" }}
          />
        </div>
      </div>

      <p className="select-none text-xs text-gray-500">
        By submitting, you agree that your contribution may be used and attributed in accordance
        with our terms. We may contact you regarding your submission.
      </p>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full select-none cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black sm:px-6 sm:py-3.5 sm:text-base"
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
