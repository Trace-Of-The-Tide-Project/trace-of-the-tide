"use client";

import { CameraIcon, SaveIcon, CalendarIcon } from "./ArticleEditorIcons";

type ContentEditorFooterProps = {
  primaryButtonLabel?: string;
};

export function ContentEditorFooter({
  primaryButtonLabel = "Publish Now",
}: ContentEditorFooterProps) {
  return (
    <footer className="border-t border-[#444444] pt-6 mt-6">
      <div className="flex flex-col items-stretch gap-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#C9A96E" }}
        >
          <CameraIcon />
          {primaryButtonLabel}
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#333333] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3d3d3d]"
          >
            <SaveIcon />
            Save Draft
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#333333] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3d3d3d]"
          >
            <CalendarIcon />
            Schedule
          </button>
        </div>
      </div>
    </footer>
  );
}
